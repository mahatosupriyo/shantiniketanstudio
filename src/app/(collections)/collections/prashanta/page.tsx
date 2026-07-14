// app/prashanta/page.tsx
import fs from 'node:fs'
import path from 'node:path'
import Prashanta from './PrashantaLayout'

export const metadata = {
    title: 'Prashānta — Shantiniketan Studio',
    description: 'Every meal begins long before food is served.',
}

export default function PrashantaPage() {
    return <Prashanta />
}