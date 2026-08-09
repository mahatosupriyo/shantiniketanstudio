// "use client"

import { Metadata } from 'next'
import Hero from './Hero'
import NavBar from '@/components/system/navbar/NavBar'
import CourseCataloguePage from './Catalogue'
import styles from './page.module.scss'

/* Meta Data Page name */
export const metadata: Metadata = {
    title: 'Course Catalogue | Shantiniketan Studio',
    description: '10 Courses from Clay to Firing.',
}

function TestPage() {
    return (
        <div className={styles.catalogue}>
            <NavBar />
            <Hero />
            <CourseCataloguePage />
        </div>
    )
}

export default TestPage