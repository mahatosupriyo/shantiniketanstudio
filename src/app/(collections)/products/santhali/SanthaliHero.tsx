"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./SanthaliHero.module.scss";

gsap.registerPlugin(ScrollTrigger);

export default function SanthaliHero() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  /* Pointer displacement — each layer drifts by its own depth. */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (reduce || !fine) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el).map((node) => ({
        depth: Number(node.dataset.depth ?? 1),
        x: gsap.quickTo(node, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(node, "y", { duration: 1.1, ease: "power3.out" }),
      }));

      const AMP_X = 30;
      const AMP_Y = 18;

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1;

        layers.forEach((l) => {
          l.x(-nx * AMP_X * l.depth);
          l.y(-ny * AMP_Y * l.depth);
        });
      };

      const onLeave = () => layers.forEach((l) => (l.x(0), l.y(0)));

      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root }
  );

  /* Scroll-out — the hero insets itself and rounds off as it leaves. */
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.to(root.current, {
        "--inset": "2rem",
        "--radius": "6rem",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "30% top",   // nothing happens for the first third
          end: "bottom top",  // fully inset by the time it clears the viewport
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.hero}>
      <div ref={frame} className={styles.frame}>
        {/* z 0 — wall */}
        <div className={styles.layer} data-depth="0.5" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/santhali/bg.webp"
            alt=""
            className={styles.image}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* z 1 — headline, behind the cups */}
        <h1 className={styles.title} data-depth="0.85">
          Santhali tattoo <br /> inspired ceramics
        </h1>

        {/* z 2 — table + cups, transparent PNG/WebP, painted over the headline */}
        <div className={`${styles.layer} ${styles.fgLayer}`} data-depth="1.5" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/santhali/fg.webp"
            alt=""
            className={styles.image}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* z 3 — the line at the bottom */}
        <div className={styles.desc} data-depth="0.3">
          <h3 className={styles.subheading}>
            The tattoo is permanent
            <br />
            The ceramic is fired
            <br />
            Both become marks that remain
          </h3>
        </div>
      </div>
    </section>
  );
}