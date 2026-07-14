'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import lottie from 'lottie-web'
import NavBar from '@/components/system/navbar/NavBar'
import styles from './Prashanta.module.scss'

// Register GSAP ScrollTrigger plugin for scroll-linked animations
gsap.registerPlugin(ScrollTrigger)

// Type extraction for the Lottie Animation instance
type LottieAnimation = ReturnType<typeof lottie.loadAnimation>

// Constants for text and media assets
const INTRO_LINE = 'Every meal begins long before food is served'
const QUOTE_LINE = 'all souls are equal and alike, and have the similar nature and qualities'

const MORPH_VIDEO_SRC = '/assets/prashanta/ring-to-plate.mp4'
const WORDMARK_LOTTIE_SRC = '/assets/prashanta/prashanta-reveal.lottie.json'

/**
 * Renders a string of text into individual spans for word-by-word animation.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.text - The full sentence or string to be split.
 * @param {string} props.wordClass - The CSS class applied to each word wrapper.
 */
function Words({ text, wordClass }: { text: string; wordClass: string }) {
    return (
        <>
            {text.split(' ').map((word, i) => (
                <span className={wordClass} key={`${word}-${i}`} aria-hidden="true">
                    {word}
                </span>
            ))}
        </>
    )
}

/**
 * Prashanta Cinematic Scroll Component.
 * Orchestrates a scroll-driven timeline using GSAP, Lottie, and HTML5 Video.
 * Handles graceful degradation for users with 'prefers-reduced-motion'.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Prashanta() {
    const rootRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const lottieContainerRef = useRef<HTMLDivElement>(null)
    const fallbackRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const lenisRef = useRef<Lenis | null>(null)

    /* -------------------------------------------------------------------------- */
    /*                               Smooth Scroll                                */
    /* -------------------------------------------------------------------------- */
    useLayoutEffect(() => {
        // Bypass smooth scrolling for accessibility if requested by user system
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) return

        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
        lenisRef.current = lenis

        lenis.on('scroll', ScrollTrigger.update)

        const raf = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(raf)

        // Prevent GSAP from jumping timelines if frame rates drop
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(raf)
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    /* -------------------------------------------------------------------------- */
    /*                              Master Timeline                               */
    /* -------------------------------------------------------------------------- */
    useLayoutEffect(() => {
        const root = rootRef.current
        const stage = stageRef.current
        const lottieContainer = lottieContainerRef.current
        const fallback = fallbackRef.current
        const video = videoRef.current

        if (!root || !stage || !lottieContainer || !fallback || !video) return

        const q = gsap.utils.selector(stage)
        const mm = gsap.matchMedia()

        const EASE = 'power2.inOut'

        let anim: LottieAnimation | null = null
        const lottieState = { ready: false, failed: false }

        // Set up context matching for responsiveness and accessibility
        mm.add(
            {
                desktop: '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
                mobile: '(max-width: 768px) and (prefers-reduced-motion: no-preference)',
                reduced: '(prefers-reduced-motion: reduce)',
            },
            (ctx) => {
                const { reduced, mobile } = ctx.conditions as {
                    desktop: boolean
                    mobile: boolean
                    reduced: boolean
                }

                const introWords = q(`.${styles.introWord}`)

                // Graceful fallback for reduced motion users (skip complex timelines)
                if (reduced) {
                    gsap.set(fallback, { clearProps: 'all', opacity: 1 })
                    gsap.set(
                        [introWords, q(`.${styles.videoWrap}`)],
                        { clearProps: 'all', opacity: 1 }
                    )
                    return
                }

                // Initialize Lottie Animation
                anim = lottie.loadAnimation({
                    container: lottieContainer,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: WORDMARK_LOTTIE_SRC,
                    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
                })

                anim.addEventListener('DOMLoaded', () => {
                    lottieState.ready = true
                    ScrollTrigger.refresh()
                })

                anim.addEventListener('data_failed', () => {
                    lottieState.failed = true
                })

                /* ------------------------ Initial State ----------------------- */
                gsap.set(introWords, { opacity: 0.16 })
                gsap.set([lottieContainer, fallback, q(`.${styles.videoWrap}`)], { opacity: 0 })

                /* ------------------------ Video Setup ------------------------- */
                const proxy = { t: 0 }
                let targetTime = 0

                const applyTime = () => {
                    // Mobile bypass: native playback is preferred over manual scrubbing
                    if (mobile || !video.duration) return

                    const current = video.currentTime
                    const next = current + (targetTime - current) * 0.18

                    if (Math.abs(next - current) > 0.001) {
                        video.currentTime = next
                    }
                }

                gsap.ticker.add(applyTime)
                const wordmarkProxy = { p: 0 }

                /* ------------------------ Core Timeline ----------------------- */
                const tl = gsap.timeline({
                    defaults: { ease: EASE },
                    scrollTrigger: {
                        trigger: stage,
                        start: 'top top',
                        end: mobile ? '+=2600' : '+=4000',
                        pin: true,
                        scrub: mobile ? 0.6 : 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })

                /* ACT 1 — Intro text animation */
                tl.to(introWords, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    stagger: { each: 0.32, ease: 'none' },
                })
                    .to({}, { duration: 0.6 })
                    .to(q(`.${styles.intro}`), {
                        opacity: 0,
                        y: -60,
                        scale: 0.96,
                        duration: 1,
                    })

                    /* ACT 2 — Lottie wordmark draw */
                    .to({}, { duration: 0.05 }, '-=0.25')
                    .to(
                        wordmarkProxy,
                        {
                            p: 1,
                            duration: mobile ? 1.4 : 1.8,
                            ease: 'none',
                            onUpdate: () => {
                                if (anim && lottieState.ready && !lottieState.failed) {
                                    lottieContainer.style.opacity = '1'
                                    fallback.style.opacity = '0'
                                    const lastFrame = Math.max(anim.totalFrames - 1, 0)
                                    anim.goToAndStop(wordmarkProxy.p * lastFrame, true)
                                } else {
                                    fallback.style.opacity = `${wordmarkProxy.p}`
                                }
                            },
                        },
                        '<'
                    )
                    .to({}, { duration: 0.2 }) // Hold state briefly after draw

                /* ACT 3 — Video Appearance */
                tl.to(q(`.${styles.videoWrap}`), {
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.inOut',
                    onStart: () => {
                        // Allow natural playback on mobile environments
                        if (mobile) {
                            video.currentTime = 0;
                            video.play().catch(() => {
                                // Gracefully handle low-power mode or auto-play blocks
                            });
                        }
                    }
                })

                /* ACT 4 — Split logic (Mobile vs Desktop scrub) */
                if (mobile) {
                    // Mobile: hold empty pin so user can watch the video play natively
                    tl.to({}, { duration: 3.4 })
                } else {
                    // Desktop: engage smooth scroll-scrub behavior
                    tl.to(proxy, {
                        t: 1,
                        duration: 3.4,
                        ease: 'none',
                        onUpdate: () => {
                            if (video.duration) {
                                targetTime = proxy.t * video.duration
                            }
                        },
                    })
                }

                // Cleanup scroll listener for this matchMedia context
                return () => {
                    gsap.ticker.remove(applyTime)
                    tl.scrollTrigger?.kill()
                }
            },
            root
        )

        // Metadata load refresh for accurate timeline duration limits
        video.load()
        const onMeta = () => {
            if (video) video.currentTime = 0.001;
            ScrollTrigger.refresh();
        }
        video.addEventListener('loadedmetadata', onMeta)

        // Global cleanup
        return () => {
            video.removeEventListener('loadedmetadata', onMeta)
            anim?.destroy()
            mm.revert()
        }
    }, [])

    /* -------------------------------------------------------------------------- */
    /*                                 Render                                     */
    /* -------------------------------------------------------------------------- */
    return (
        <div ref={rootRef} className={styles.root}>
            <NavBar />

            {/* ============ PINNED CINEMATIC STAGE ============ */}
            <section className={styles.stage} ref={stageRef} aria-label="Prashanta story">

                {/* ACT 1: Intro sequence */}
                <h1 className={styles.intro} aria-label={INTRO_LINE}>
                    <Words text={INTRO_LINE} wordClass={styles.introWord} />
                </h1>

                {/* ACT 2: Wordmark reveal */}
                <div className={styles.prashanta}>
                    <span className={styles.visuallyHidden}>Prashānta</span>

                    {/* Primary Lottie Container */}
                    <div ref={lottieContainerRef} className={styles.prashantaLottie} aria-hidden="true" />

                    {/* Fallback displayed if reduced motion is enabled or Lottie fails */}
                    <div
                        ref={fallbackRef}
                        className={styles.prashantaFallback}
                        aria-hidden="true"
                    >
                        <span>Prashānta</span>
                    </div>
                </div>

                {/* ACT 3: Video interaction */}
                <div className={styles.videoWrap} aria-hidden="true">
                    <video
                        ref={videoRef}
                        className={styles.video}
                        src={MORPH_VIDEO_SRC}
                        muted
                        playsInline
                        preload="auto"
                    />
                </div>
            </section>

            {/* ============ NATURAL SCROLL RESUMES ============ */}
            <section className={styles.after}>
                {/* STATIC QUOTE: Restores standard flow */}
                <div className={styles.quotesection}>
                    <p className={styles.quote} aria-label={QUOTE_LINE}>
                        {QUOTE_LINE}
                    </p>
                    <span className={styles.by}>
                        ~ Lord Mahavira
                    </span>
                </div>

                <img style={{ userSelect: 'none', pointerEvents: 'none' }} src={"/assets/prashanta/bowl.webp"} />
                <div className={styles.lineargallery}>
                    <img style={{ userSelect: 'none', pointerEvents: 'none' }} src={"/assets/prashanta/one-set.webp"} />
                    <img style={{ userSelect: 'none', pointerEvents: 'none' }} src={"/assets/prashanta/set.webp"} />
                    <img style={{ userSelect: 'none', pointerEvents: 'none' }} src={"/assets/prashanta/two-set.webp"} />
                </div>
            </section>
        </div>
    )
}

