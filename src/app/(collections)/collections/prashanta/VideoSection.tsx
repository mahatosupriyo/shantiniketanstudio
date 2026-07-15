'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from './prashanta.helpers'
import styles from './Prashanta.module.scss'

const MORPH_VIDEO_SRC = '/assets/prashanta/ring-to-plate.mp4'
const EDGE_FADE_DURATION = 0.25 // seconds — real-time fade, independent of scroll speed

/* Video act.
   Desktop: pinned + scroll-scrubbed — the video frame IS the scroll position.
   Mobile: NOT pinned, NOT scrubbed. Pinning + scroll-linked frame control
   fights the video's own native playback clock on lower-powered GPUs, which
   is what caused the jitter. On mobile the video just fades in on entry,
   plays natively, and the page scrolls past it like normal content. */
export default function VideoSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    useIsomorphicLayoutEffect(() => {
        const section = sectionRef.current
        const video = videoRef.current
        if (!section || !video) return

        const wrap = section.querySelector(`.${styles.videoWrap}`)
        const mm = gsap.matchMedia()

        mm.add(
            {
                desktop: '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
                mobile: '(max-width: 768px) and (prefers-reduced-motion: no-preference)',
            },
            (ctx) => {
                const { mobile } = ctx.conditions as { desktop: boolean; mobile: boolean }

                gsap.set(wrap, { opacity: 0 })

                /* --------------------------- Mobile: plain scroll --------------------------- */
                if (mobile) {
                    /* Simple, unpinned entrance — no scrub, no pin, no scroll-linked
                       frame control. Video plays on its own clock. */
                    ScrollTrigger.create({
                        trigger: section,
                        start: 'top 75%', // fade in a bit before it's fully in view
                        onEnter: () => {
                            gsap.to(wrap, { opacity: 1, duration: EDGE_FADE_DURATION, ease: 'power1.out' })
                            video.currentTime = 0
                            video.play().catch(() => {
                                /* ignore autoplay/low-power blocks */
                            })
                        },
                        onEnterBack: () => {
                            gsap.to(wrap, { opacity: 1, duration: EDGE_FADE_DURATION, ease: 'power1.out' })
                            video.play().catch(() => {})
                        },
                        onLeave: () => gsap.set(wrap, { opacity: 0 }),
                        onLeaveBack: () => gsap.set(wrap, { opacity: 0 }),
                    })

                    return
                }

                /* --------------------------- Desktop: pinned scrub --------------------------- */
                const fadeIn = () =>
                    gsap.to(wrap, { opacity: 1, duration: EDGE_FADE_DURATION, ease: 'power1.out' })
                /* Instant, not animated — leaving happens right as the pin releases,
                   so animating the fade there would fight the pin's own snap. */
                const hideInstantly = () => gsap.set(wrap, { opacity: 0 })

                /* Directly maps the video's currentTime to scroll position — no
                   separate lerp/smoothing layer, so the frame can never lag. */
                const proxy = { t: 0 }

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: '+=6000', /* tune to taste */
                        pin: true,
                        scrub: true, // zero-lag, tied directly to scroll position
                        fastScrollEnd: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        onEnter: fadeIn,
                        onEnterBack: fadeIn,
                        onLeave: hideInstantly,
                        onLeaveBack: hideInstantly,
                    },
                })

                tl.to(proxy, {
                    t: 1,
                    duration: 3.4,
                    ease: 'none',
                    onUpdate: () => {
                        if (video.duration) video.currentTime = proxy.t * video.duration
                    },
                })
            }
        )

        /* Prime the first frame once metadata is available */
        video.load()
        const onMeta = () => {
            video.currentTime = 0.001
            ScrollTrigger.refresh()
        }
        video.addEventListener('loadedmetadata', onMeta)

        return () => {
            video.removeEventListener('loadedmetadata', onMeta)
            mm.revert()
        }
    }, [])

    return (
        <section ref={sectionRef} className={styles.videoSection} aria-hidden="true">
            <div className={styles.videoWrap}>
                <video
                    ref={videoRef}
                    className={styles.video}
                    src={MORPH_VIDEO_SRC}
                    muted
                    playsInline
                    preload="auto"
                    loop
                />
            </div>
        </section>
    )
}