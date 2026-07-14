// app/prashanta/page.tsx
import fs from 'node:fs'
import path from 'node:path'
import Prashanta from './PrashantaLayout'

export const metadata = {
    title: 'Prashānta — Shantiniketan Studio',
    description: 'Every meal begins long before food is served.',
}

/**
 * Strips the bits that don't belong inside an HTML element's
 * innerHTML (XML prolog, DOCTYPE, editor-generated comments) so the
 * markup is safe to inline via dangerouslySetInnerHTML on the client.
 * The <svg>...</svg> itself is left completely untouched.
 */
function sanitizeSvg(raw: string): string {
    return raw
        .replace(/<\?xml[^>]*\?>/gi, '')
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim()
}

function readWordmarkSvg(): string {
    const filePath = path.join(
        process.cwd(),
        'public/assets/prashanta/prashanta-wordmark.svg',
    )
    const raw = fs.readFileSync(filePath, 'utf-8')
    return sanitizeSvg(raw)
}

export default function PrashantaPage() {
    const wordmarkSvg = readWordmarkSvg()
    return <Prashanta wordmarkSvg={wordmarkSvg} />
}