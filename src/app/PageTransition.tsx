"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import styles from "./PageTransition.module.scss";

// Same expo-out curve used for the hero's other motion — keeps the whole
// site feeling like one easing language instead of two animation systems.
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // The browser otherwise keeps whatever scrollY the previous page had, so
  // the incoming page would start its slide already scrolled part-way down.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.wrap}>
      {/* Both the entering and exiting page are ALWAYS position: absolute
          (see .page in the stylesheet) — not left to Framer's automatic
          "popLayout" detection, which can fail to pull the exiting page
          out of document flow in time. If that happens, both pages briefly
          coexist in normal flow, the container doubles in height, and you
          get exactly the stacked-duplicate/jitter bug this fixes. Making
          both absolute unconditionally removes that failure mode entirely:
          neither page can ever affect layout, so there's nothing for them
          to fight over. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={pathname}
          className={styles.page}
          initial={reduce ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={reduce ? undefined : { y: "-100%" }}
          transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}