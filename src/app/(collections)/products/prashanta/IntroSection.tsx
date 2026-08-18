'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useIsomorphicLayoutEffect } from './prashanta.helpers'
import styles from './Prashanta.module.scss'

const INTRO_LINE = 'Every meal begins long before food is served'

/* Splits a sentence into per-word spans so each word can animate on its own */
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

/* Act 1 — the opening line brightens word by word, then lifts away on scroll */
export default function IntroSection() {
    const sectionRef = useRef<HTMLElement>(null)

    useIsomorphicLayoutEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const mm = gsap.matchMedia()

        /* Only animate when motion is allowed; reduced-motion is handled in CSS */
        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const words = section.querySelectorAll(`.${styles.introWord}`)

            /* Dim start state so words visibly brighten as the timeline plays */
            gsap.set(words, { opacity: 0.16 })

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=1000', /* scroll distance for this act — tune to taste */
                    pin: true,
                    /* scrub: true = tied directly to scroll position, zero lag.
                       This is the standard choice whenever content must never
                       visibly trail behind the user's actual scroll — a numeric
                       scrub value adds smoothing/inertia, which is what caused
                       the "sliding in after a fast scroll" bug. */
                    scrub: true,
                    /* Extra safety net for very fast wheel/trackpad flicks */
                    fastScrollEnd: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            })

            /* Brighten each word in sequence */
            tl.to(words, {
                opacity: 1,
                ease: 'none',
                stagger: { each: 0.3, ease: 'none' },
            })
                /* Lift the whole line out of view */
                .to(section.querySelector(`.${styles.intro}`), {
                    opacity: 0,
                    y: -60,
                    scale: 0.96,
                    duration: 1,
                    ease: 'power2.inOut',
                })
        })

        return () => mm.revert()
    }, [])

    return (
        <section ref={sectionRef} className={styles.introSection} aria-label={INTRO_LINE}>
            <h1 className={styles.intro} aria-label={INTRO_LINE}>
                <Words text={INTRO_LINE} wordClass={styles.introWord} />
            </h1>
        </section>
    )
}