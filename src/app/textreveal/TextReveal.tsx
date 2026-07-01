'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './textreveal.module.scss'

interface TextHighlightScrollProps {
    title?: string
    lines: string[]
}

export default function TextHighlightScroll({
    title = 'OUR STORY',
    lines,
}: TextHighlightScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start center', 'center center'],
    })

    // Total number of words across all lines
    const totalWords = lines.reduce(
        (count, line) => count + line.trim().split(/\s+/).length,
        0
    )

    let wordIndex = 0

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.content}>
                <p
                    className={styles.subhead}
                    style={{
                        fontSize: '1.4rem',
                        color: '#a7a7a7',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2rem',
                    }}
                >
                    {title}
                </p>

                <motion.p
                    initial={{ opacity: 0, y: '2%', filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: false }}
                    className={styles.mission}
                >
                    {lines.map((line, lineIndex) => (
                        <span key={lineIndex}>
                            {line.split(/\s+/).map((word) => {
                                const index = wordIndex++

                                return (
                                    <motion.span
                                        key={index}
                                        className={styles.word}
                                        style={{
                                            color: useTransform(
                                                scrollYProgress,
                                                [index / totalWords, (index + 1) / totalWords],
                                                ['rgba(67,67,67,0.4)', 'rgb(0,0,0)']
                                            ),
                                        }}
                                    >
                                        {word}{' '}
                                    </motion.span>
                                )
                            })}

                            {lineIndex !== lines.length - 1 && <br />}
                        </span>
                    ))}
                </motion.p>
            </div>
        </div>
    )
}