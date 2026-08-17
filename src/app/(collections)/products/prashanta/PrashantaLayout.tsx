'use client'

import NavBar from '@/components/system/navbar/NavBar'
import IntroSection from './IntroSection'
import VideoSection from './VideoSection'
import GallerySection from './GallerySection'
import styles from './Prashanta.module.scss'

const QUOTE_LINE =
    'all souls are equal and alike, and have the similar nature and qualities'

/* Prashanta — cinematic scroll page.
   Each act lives in its own pinned section so they can be tuned independently. */
export default function Prashanta() {
    /* Smooth scrolling for the whole page (auto-skips under reduced motion) */

    return (
        <div className={styles.root}>
            <NavBar />

            {/* Pinned acts */}
            <IntroSection />
            <VideoSection />

            {/* Static quote + hero bowl */}
            <section className={styles.after}>
                <div className={styles.quotesection}>
                    <p className={styles.quote} aria-label={QUOTE_LINE}>
                        {QUOTE_LINE}
                    </p>
                    <span className={styles.by}>~ Lord Mahavira</span>
                </div>

                <img
                    className={styles.bowl}
                    src="/assets/prashanta/bowl.webp"
                    alt=""
                    draggable={false}
                />
            </section>

            {/* Horizontal (desktop) / vertical (mobile) image gallery */}
            <GallerySection />

        </div>
    )
}