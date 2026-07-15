'use client'

import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* Register once here; every section imports from this file so the plugin
   is guaranteed to be registered before any ScrollTrigger is created. */
gsap.registerPlugin(ScrollTrigger)

/* Industry-standard fix for scroll jank on fast wheel/trackpad/touch gestures.
   Normalizes how the browser delivers scroll events so ScrollTrigger receives
   consistent position updates instead of bursty ones — this is what actually
   prevents scrubbed animations from "catching up" after a fast scroll. */
if (typeof window !== 'undefined') {
    ScrollTrigger.normalizeScroll(true)
}

/* useLayoutEffect on the client, useEffect on the server.
   Avoids the Next.js "useLayoutEffect does nothing on the server" warning. */
export const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect