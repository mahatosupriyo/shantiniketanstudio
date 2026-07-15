'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsomorphicLayoutEffect } from './prashanta.helpers'
import styles from './Prashanta.module.scss'

const MORPH_VIDEO_SRC = '/assets/prashanta/ring-to-plate.mp4'
const EDGE_FADE_DURATION = 0.25 // seconds — real-time fade, independent of scroll speed

/* Video act — a circular video that scrubs frame-by-frame with scroll on desktop,
   and plays natively on mobile where manual scrubbing is unreliable.
   Visibility is handled in real time (onEnter/onLeave) so the video appears
   immediately when the section is reached, instead of fading in across scroll. */
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

                /* Real-time fade in/out — not tied to scroll scrub, so it never
                   stretches across scroll distance and never lags behind entry */
                const fadeIn = () => {
                    gsap.to(wrap, { opacity: 1, duration: EDGE_FADE_DURATION, ease: 'power1.out' })
                    if (mobile) {
                        video.currentTime = 0
                        video.play().catch(() => {
                            /* ignore autoplay/low-power blocks */
                        })
                    }
                }
                /* Instant, not animated. Leaving the section (either direction)
                   happens right as the pin releases/re-engages — animating the
                   fade at that exact moment fights the pin's own snap and reads
                   as an extra "slide." Snapping opacity immediately avoids that. */
                const hideInstantly = () => gsap.set(wrap, { opacity: 0 })

                /* Desktop scrub: directly maps the video's currentTime to scroll
                   position — no separate lerp/smoothing layer. This is the
                   industry-standard approach for scroll-scrubbed video: the frame
                   IS the scroll position, so it can never visibly lag or catch up. */
                const proxy = { t: 0 }

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top top',
                        end: mobile ? '+=4000' : '+=6000', /* tune to taste */
                        pin: true,
                        /* scrub: true = zero-lag, directly tied to scroll position.
                           A numeric scrub adds smoothing/inertia, which is what
                           caused content to visibly "slide in" after fast scrolls. */
                        scrub: true,
                        fastScrollEnd: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        onEnter: fadeIn,
                        onEnterBack: fadeIn,
                        onLeave: hideInstantly,
                        onLeaveBack: hideInstantly,
                    },
                })

                if (mobile) {
                    /* Native playback drives itself — no scrubbed tween needed here */
                    tl.to({}, { duration: 1 })
                } else {
                    /* Map scroll progress directly onto the video's currentTime */
                    tl.to(proxy, {
                        t: 1,
                        duration: 3.4,
                        ease: 'none',
                        onUpdate: () => {
                            if (video.duration) video.currentTime = proxy.t * video.duration
                        },
                    })
                }
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
                />
            </div>
        </section>
    )
}