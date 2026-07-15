'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useIsomorphicLayoutEffect } from './prashanta.helpers'

/* Sets up Lenis smooth scrolling and keeps it in sync with ScrollTrigger.
   Automatically skipped when the user prefers reduced motion. */
export function useSmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null)

    useIsomorphicLayoutEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) return

        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
        lenisRef.current = lenis

        /* Update ScrollTrigger on every Lenis scroll frame */
        lenis.on('scroll', ScrollTrigger.update)

        /* Drive Lenis from GSAP's ticker so they share one loop */
        const raf = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(raf)
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    return lenisRef
}
