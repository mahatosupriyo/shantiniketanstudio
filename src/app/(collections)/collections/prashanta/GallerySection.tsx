'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useIsomorphicLayoutEffect } from './prashanta.helpers'
import styles from './Prashanta.module.scss'

const IMAGES = [
    '/assets/prashanta/one-set.webp',
    '/assets/prashanta/set.webp',
    '/assets/prashanta/two-set.webp',
]

/* Closing gallery — scrolls horizontally on desktop, stacks vertically on mobile.
   The mobile / reduced-motion layout is plain CSS; only desktop pins + translates. */
export default function GallerySection() {
    const sectionRef = useRef<HTMLElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)

    useIsomorphicLayoutEffect(() => {
        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        const mm = gsap.matchMedia()

        /* Horizontal scroll only on wider screens with motion allowed */
        mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
            /* How far the track must travel to reveal its overflow */
            const getDistance = () => track.scrollWidth - window.innerWidth

            gsap.to(track, {
                x: () => -getDistance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${getDistance()}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true, /* recompute distance on resize */
                },
            })
        })

        return () => mm.revert()
    }, [])

    return (
        <section ref={sectionRef} className={styles.gallerySection} aria-label="Gallery">
            <div ref={trackRef} className={styles.galleryTrack}>
                {IMAGES.map((src) => (
                    <figure className={styles.galleryItem} key={src}>
                        <img src={src} alt="" draggable={false} />
                    </figure>
                ))}
            </div>
        </section>
    )
}
