'use client';

import { useEffect, useRef, useState, RefObject } from 'react';
import { motion } from 'framer-motion';

export interface SectionColor {
  ref: RefObject<HTMLElement | null>;
  color: string; // rgba string from useDominantColor(s)
}

interface Props {
  sections: SectionColor[];
  /** Opaque base color the tint sits on top of. Defaults to white. */
  base?: string;
}

export default function ScrollBackground({ sections, base = '#ffffff' }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const ratios = useRef(new Map<number, number>());

  useEffect(() => {
    const elToIndex = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = elToIndex.get(entry.target);
          if (idx === undefined) return;
          ratios.current.set(idx, entry.intersectionRatio);
        });

        let best = -1;
        let bestRatio = 0;
        ratios.current.forEach((r, i) => {
          if (r > bestRatio) { bestRatio = r; best = i; }
        });

        if (best >= 0) setActiveIndex(best);
      },
      { threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8] },
    );

    sections.forEach(({ ref }, i) => {
      if (ref.current) {
        elToIndex.set(ref.current, i);
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
      ratios.current.clear();
    };
  }, [sections]);

  const tint =
    activeIndex >= 0
      ? sections[activeIndex]?.color ?? 'rgba(255,255,255,0)'
      : 'rgba(255,255,255,0)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* opaque base — owns its own white, doesn't depend on body/html */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: base }} />

      {/* animated tint layer sits on top of the base, not the page's real bg */}
      <motion.div
        animate={{ backgroundColor: tint }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  );
}