"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Hero.module.scss";

const HEADLINE = (
  <>
    Start wet
    <br />
    Finish fired
  </>
);

const COPY =
  "Ten courses on the bench, the wheel and the kiln. Each one runs over " +
  "consecutive weekends and covers a set of lessons, and one fee buys the " +
  "whole course, not a lesson at a time. Clay, tools, glazes and firing are " +
  "included.";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  /* Pointer displacement — background and foreground drift by their own
     depth as the cursor moves. That's the whole effect. */
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

      const AMP_X = 26;
      const AMP_Y = 16;

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1;

        layers.forEach((layer) => {
          layer.x(-nx * AMP_X * layer.depth);
          layer.y(-ny * AMP_Y * layer.depth);
        });
      };

      const onLeave = () => {
        layers.forEach((layer) => {
          layer.x(0);
          layer.y(0);
        });
      };

      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.hero}>
      {/* z 0 — wall */}
      <div className={styles.layer} data-depth="0.5" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Background.png"
          alt=""
          className={styles.bgImage}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* z 1 — headline, behind the vessels. The paragraph here is an
          invisible spacer: it reserves the same space as the real
          paragraph in the layer below, so the headline lands in the same
          spot it would if the two were still one stacked block. */}
      <div className={`${styles.content} ${styles.contentBehind}`}>
        <h1 className={styles.headline}data-depth="0.8">{HEADLINE}</h1>
        <p className={styles.copy} aria-hidden style={{ visibility: "hidden" }}>
          {COPY}
        </p>
      </div>

      {/* z 2 — vessels, painted over the headline */}
      <div className={`${styles.layer} ${styles.fgLayer}`} data-depth="1.4" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Foreground.png"
          alt=""
          className={styles.fgImage}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  );
}