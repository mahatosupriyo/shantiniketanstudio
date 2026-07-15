'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { RING_PATH, DOT_PATH, MARK_VIEWBOX, MARK_FILL } from './brandmark';
import styles from './home.module.scss';

type Phase = 'drawing' | 'flying' | 'done';

const EASE: [number, number, number, number] = [1, 0, 0, 1]; // matches the nav underline easing

interface PreloaderProps {
    /** Ref to the <g> wrapping the real ring+dot paths inside the hero logo. */
    targetRef: RefObject<SVGGElement | null>;
    /** Called the instant the mark lands on its target — swap the real paths in here. */
    onLanded: () => void;
    /** Optional image to preload so the backdrop doesn't fade out before the hero bg is ready. */
    backgroundSrc?: string;
    /** Minimum time the preloader stays up, so the draw-on animation always gets to finish. */
    minDuration?: number;
}

export default function Preloader({
    targetRef,
    onLanded,
    backgroundSrc,
    minDuration = 1800,
}: PreloaderProps) {
    const reduceMotion = useReducedMotion();
    const [phase, setPhase] = useState<Phase>('drawing');
    const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        if (reduceMotion) {
            onLanded();
            setPhase('done');
            return;
        }

        let assetsReady = false;
        let timeReady = false;
        const advance = () => {
            if (assetsReady && timeReady) startFlight();
        };

        timers.current.push(
            setTimeout(() => {
                timeReady = true;
                advance();
            }, minDuration),
        );

        if (backgroundSrc) {
            const img = new window.Image();
            img.onload = () => {
                assetsReady = true;
                advance();
            };
            img.onerror = () => {
                assetsReady = true;
                advance();
            };
            img.src = backgroundSrc;
        } else {
            assetsReady = true;
        }

        function startFlight() {
            const target = targetRef.current?.getBoundingClientRect();
            if (target) {
                setRect({ top: target.top, left: target.left, width: target.width, height: target.height });
            }
            setPhase('flying');
        }

        return () => {
            timers.current.forEach(clearTimeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reduceMotion]);

    const centered = {
        top: '50%',
        left: '50%',
        width: 'clamp(96px, 14vw, 180px)',
        height: 'clamp(96px, 14vw, 180px)',
        x: '-50%',
        y: '-50%',
    };

    const landed = rect
        ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height, x: 0, y: 0 }
        : centered;

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    style={{ zIndex: 99999999 }}
                    className={styles.backdrop}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: phase === 'flying' ? 0 : 1 }}
                    transition={{ duration: 1.1, ease: EASE, delay: phase === 'flying' ? 0.25 : 0 }}
                    onAnimationComplete={() => {
                        if (phase === 'flying') setPhase('done');
                    }}
                >
                    <motion.div
                        className={styles.markWrap}
                        initial={false}
                        animate={phase === 'flying' ? landed : centered}
                        style={{ position: 'fixed' }}
                        transition={{ duration: 1.05, ease: EASE }}
                        onAnimationComplete={() => {
                            if (phase === 'flying') onLanded();
                        }}
                    >
                        <svg viewBox={MARK_VIEWBOX} className={styles.markSvg}>
                            <motion.path
                                d={RING_PATH}
                                stroke="#fff"
                                strokeWidth={6}
                                initial={{ pathLength: 0, fill: 'rgba(255,255,255,0)' }}
                                animate={{
                                    pathLength: 1,
                                    fill: phase === 'flying' ? MARK_FILL : '#fff',
                                    strokeOpacity: phase === 'flying' ? 0 : 1,
                                }}
                                transition={{
                                    pathLength: { duration: 1.1, ease: 'easeInOut' },
                                    fill: { duration: 0.8, delay: phase === 'flying' ? 0 : 1.0 },
                                    strokeOpacity: { duration: 0.4, delay: phase === 'flying' ? 0 : 1.0 },
                                }}
                            />
                            <motion.path
                                d={DOT_PATH}
                                stroke="#fff"
                                strokeWidth={6}
                                initial={{ pathLength: 0, fill: 'rgba(255,255,255,0)' }}
                                animate={{
                                    pathLength: 1,
                                    fill: phase === 'flying' ? MARK_FILL : '#fff',
                                    strokeOpacity: phase === 'flying' ? 0 : 1,
                                }}
                                transition={{
                                    pathLength: { duration: 0.7, ease: 'easeInOut', delay: 0.45 },
                                    fill: { duration: 0.8, delay: phase === 'flying' ? 0 : 1.2 },
                                    strokeOpacity: { duration: 0.4, delay: phase === 'flying' ? 0 : 1.2 },
                                }}
                            />
                        </svg>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}