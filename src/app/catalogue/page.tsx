// "use client"

import { Metadata } from 'next'
import Hero from './Hero'
import NavBar from '@/components/system/navbar/NavBar'
import CourseCataloguePage from './Catalogue'

/* Meta Data Page name */
export const metadata: Metadata = {
    title: 'Course Catalogue | Shantiniketan Studio',
    description: '10 Courses from Clay to Firing.',
}

function TestPage() {
    return (
        <div>
            <NavBar />
            <Hero />
            <CourseCataloguePage />
        </div>
    )
}

export default TestPage