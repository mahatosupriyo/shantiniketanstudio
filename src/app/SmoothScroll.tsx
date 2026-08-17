"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SmoothScroll({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        if (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
            window.matchMedia("(max-width: 767px)").matches
        ) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.1,
            smoothWheel: true,
            easing: (t) => 1 - Math.pow(1 - t, 3),
        });

        lenis.on("scroll", ScrollTrigger.update);

        const tick = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}