'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import lottie from 'lottie-web'
import NavBar from '@/components/system/navbar/NavBar'
import styles from './Prashanta.module.scss'

gsap.registerPlugin(ScrollTrigger)

type LottieAnimation = ReturnType<typeof lottie.loadAnimation>

const INTRO_LINE = 'Every meal begins long before food is served'
const QUOTE_LINE = 'all souls are equal and alike, and have the similar nature and qualities'

const MORPH_VIDEO_SRC = '/assets/prashanta/ring-to-plate.mp4'
const MORPH_VIDEO_POSTER = '/assets/prashanta/ring-to-plate-poster.jpg'
const WORDMARK_LOTTIE_SRC = '/assets/prashanta/prashanta-reveal.lottie.json'

function Words({
    text,
    wordClass,
}: {
    text: string
    wordClass: string
}) {
    return (
        <>
            {text.split(' ').map((word, i) =>
                <span className={wordClass} key={`${word}-${i}`} aria-hidden="true">
                    {word}
                </span>
            )}
        </>
    )
}

export default function Prashanta({ wordmarkSvg }: { wordmarkSvg: string }) {
    const rootRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const lottieContainerRef = useRef<HTMLDivElement>(null)
    const fallbackRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const lenisRef = useRef<Lenis | null>(null)

    /* ------------------------- smooth scroll ------------------------ */
    useLayoutEffect(() => {
        const prefersReduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches
        if (prefersReduced) return

        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
        lenisRef.current = lenis

        lenis.on('scroll', ScrollTrigger.update)
        const raf = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(raf)
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    /* ----------------------- master timeline ------------------------ */
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

                if (reduced) {
                    gsap.set(fallback, { clearProps: 'all', opacity: 1 })
                    gsap.set(
                        [introWords, q(`.${styles.videoWrap}`)],
                        { clearProps: 'all', opacity: 1 },
                    )
                    return
                }

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

                /* ------------------------ initial state ------------------- */
                gsap.set(introWords, { opacity: 0.16 })
                gsap.set([lottieContainer, fallback, q(`.${styles.videoWrap}`)], { opacity: 0 })

                /* ---------------- Video Setup ----------------------------- */
                const proxy = { t: 0 }
                let targetTime = 0

                const applyTime = () => {
                    if (!video.duration) return
                    const current = video.currentTime
                    const next = current + (targetTime - current) * 0.18
                    if (Math.abs(next - current) > 0.001) video.currentTime = next
                }
                gsap.ticker.add(applyTime)
                const wordmarkProxy = { p: 0 }

                /* ------------------------- timeline ----------------------- */
                const tl = gsap.timeline({
                    defaults: { ease: EASE },
                    scrollTrigger: {
                        trigger: stage,
                        start: 'top top',
                        // Distance tightened up since manual rings were removed
                        end: mobile ? '+=2500' : '+=4000',
                        pin: true,
                        scrub: mobile ? 0.6 : 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })

                /* ACT 1 — intro */
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

                    /* ACT 2 — Lottie */
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
                        '<',
                    )
                    .to({}, { duration: 0.2 }) // Slight hold after Lottie draws

                    /* ACT 3 — Video Scrub */
                    .to(q(`.${styles.videoWrap}`), {
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.inOut'
                    })
                    .to(proxy, {
                        t: 1,
                        duration: mobile ? 2.4 : 3.4,
                        ease: 'none',
                        onUpdate: () => {
                            if (video.duration) targetTime = proxy.t * video.duration
                        },
                    })

                return () => {
                    gsap.ticker.remove(applyTime)
                    tl.scrollTrigger?.kill()
                }
            },
            root,
        )

        video.load()
        const onMeta = () => ScrollTrigger.refresh()
        video.addEventListener('loadedmetadata', onMeta)

        return () => {
            video.removeEventListener('loadedmetadata', onMeta)
            anim?.destroy()
            mm.revert()
        }
    }, [])

    /* --------------------------- render ----------------------------- */
    return (
        <div ref={rootRef} className={styles.root}>
            <NavBar />

            {/* ============ PINNED CINEMATIC STAGE ============ */}
            <section className={styles.stage} ref={stageRef} aria-label="Prashanta story">

                {/* ACT 1 */}
                <h1 className={styles.intro} aria-label={INTRO_LINE}>
                    <Words text={INTRO_LINE} wordClass={styles.introWord} />
                </h1>

                {/* ACT 2 */}
                <div className={styles.prashanta}>
                    <span className={styles.visuallyHidden}>Prashānta</span>
                    <div ref={lottieContainerRef} className={styles.prashantaLottie} aria-hidden="true" />
                    <div
                        ref={fallbackRef}
                        className={styles.prashantaFallback}
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: wordmarkSvg }}
                    />
                </div>

                {/* ACT 3 */}
                <div className={styles.videoWrap} aria-hidden="true">
                    <video
                        ref={videoRef}
                        className={styles.video}
                        src={MORPH_VIDEO_SRC}
                        // poster={MORPH_VIDEO_POSTER}
                        muted
                        playsInline
                        preload="auto"
                    />
                </div>
            </section>

            {/* ============ NATURAL SCROLL RESUMES ============ */}
            <section className={styles.after}>

                {/* STATIC QUOTE: Now appears here in normal flow */}
                <div style={{ display: 'grid', placeItems: 'center', paddingBlock: '8rem' }}>
                    <p className={styles.quote} aria-label={QUOTE_LINE}>
                        {QUOTE_LINE}
                    </p>
                </div>

            </section>
        </div>
    )
}