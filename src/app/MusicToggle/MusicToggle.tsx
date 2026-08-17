"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./MusicToggle.module.scss";

const POINTS = 20;
const VIEW_W = 96;
const VIEW_H = 96;
const WAVE_X0 = 22;
const WAVE_X1 = 74;
const CENTER_Y = 48;
const MAX_AMP = 11;
const FPS_DIVISOR = 2; // sample every 2nd rAF frame (~30fps is plenty for this)

function buildPath(ys: number[]) {
    const step = (WAVE_X1 - WAVE_X0) / (POINTS - 1);
    const pts = ys.map((y, i) => ({ x: WAVE_X0 + i * step, y }));

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        d += ` Q ${pts[i].x} ${pts[i].y} ${mx} ${my}`;
    }
    const last = pts[pts.length - 1];
    d += ` T ${last.x} ${last.y}`;
    return d;
}

const FLAT_PATH = buildPath(new Array(POINTS).fill(CENTER_Y));

export default function MusicToggle({ src = "/bgsound.mp3" }: { src?: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const ctxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
    const rafRef = useRef<number | null>(null);
    const frameRef = useRef(0);
    const unlockedRef = useRef(false);

    const [isPlaying, setIsPlaying] = useState(false);

    const ensureGraph = useCallback(() => {
        if (ctxRef.current || !audioRef.current) return;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(audioRef.current);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;

        source.connect(analyser);
        analyser.connect(ctx.destination);

        ctxRef.current = ctx;
        analyserRef.current = analyser;
        dataRef.current = new Uint8Array(analyser.fftSize);
    }, []);

    const tick = useCallback(() => {
        rafRef.current = requestAnimationFrame(tick);
        frameRef.current += 1;
        if (frameRef.current % FPS_DIVISOR !== 0) return;

        const analyser = analyserRef.current;
        const data = dataRef.current;
        const path = pathRef.current;
        if (!analyser || !data || !path) return;

        analyser.getByteTimeDomainData(data);

        const bucket = Math.floor(data.length / POINTS);
        const ys: number[] = [];
        for (let i = 0; i < POINTS; i++) {
            const sample = data[i * bucket] ?? 128;
            ys.push(CENTER_Y + ((sample - 128) / 128) * MAX_AMP);
        }
        ys[0] = CENTER_Y;
        ys[POINTS - 1] = CENTER_Y; // pin the ends so it reads as one closed gesture

        path.setAttribute("d", buildPath(ys));
    }, []);

    const stopTick = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    }, []);

    /* First real user gesture on the page. Browsers won't run an
       AudioContext, or reliably allow unmuted audio, before this — no
       way around it, it's a platform restriction, not a bug. */
    const unlock = useCallback(async () => {
        if (unlockedRef.current) return;
        unlockedRef.current = true;

        ensureGraph();
        if (ctxRef.current?.state === "suspended") {
            await ctxRef.current.resume();
        }

        const audio = audioRef.current;
        if (audio) {
            audio.muted = false;
            if (audio.paused) {
                try {
                    await audio.play();
                } catch {
                    // ignore — the toggle button is still a valid retry
                }
            }
        }

        setIsPlaying(!!audio && !audio.paused);
    }, [ensureGraph]);

    /* Muted autoplay on mount — the one part browsers reliably allow.
       Real audible playback + the analyser both wait for `unlock`. */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = true;
        audio.play().catch(() => {
            // some browsers block even this; `unlock` covers it on first gesture
        });

        const opts: AddEventListenerOptions = { once: true, passive: true };
        window.addEventListener("pointerdown", unlock, opts);
        window.addEventListener("keydown", unlock, opts);
        window.addEventListener("touchstart", unlock, opts);

        return () => {
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("keydown", unlock);
            window.removeEventListener("touchstart", unlock);
        };
    }, [unlock]);

    /* Sync isPlaying to the real element — but only once unlocked, so the
       muted bootstrap play() on mount doesn't flip it early. */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onPlay = () => { if (unlockedRef.current) setIsPlaying(true); };
        const onPause = () => { if (unlockedRef.current) setIsPlaying(false); };

        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);
        audio.addEventListener("ended", onPause);

        return () => {
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
            audio.removeEventListener("ended", onPause);
        };
    }, []);

    /* Drive the wave off isPlaying, whatever triggered it. */
    useEffect(() => {
        if (isPlaying) {
            frameRef.current = 0;
            rafRef.current = requestAnimationFrame(tick);
        } else {
            stopTick();
            if (pathRef.current) {
                gsap.to(pathRef.current, { attr: { d: FLAT_PATH }, duration: 0.5, ease: "power3.out" });
            }
        }
        return stopTick;
    }, [isPlaying, tick, stopTick]);

    const toggle = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return;

        await unlock(); // no-op after the first call

        if (isPlaying) {
            audio.pause();
        } else if (audio.paused) {
            await audio.play();
        }
        // else: unlock() just started it — nothing left to do
    }, [unlock, isPlaying]);

    return (
        <button
            type="button"
            className={styles.toggle}
            onClick={toggle}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Pause music" : "Play music"}
        >
            <audio ref={audioRef} src={src} loop preload="auto" />
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={styles.svg} aria-hidden>
                <circle cx={VIEW_W / 2} cy={VIEW_H / 2} r={VIEW_W / 2 - 2} className={styles.disc} />
                <path
                    ref={pathRef}
                    d={FLAT_PATH}
                    className={styles.wave}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}