'use client';

import { JSX, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** Trigger threshold — how much of the element must be visible (0–1) */
  amount?: number;
  /** Delay in seconds before the animation starts */
  delay?: number;
  /** Y-offset in pixels for the slide-up */
  offset?: number;
  /** HTML tag to render */
  as?: keyof JSX.IntrinsicElements;
}

export default function RevealOnScroll({
  children,
  className,
  amount = 0.12,
  delay = 0,
  offset = 20,
  as = 'div',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount,
    margin: '0px 0px -8% 0px',
  });

  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: offset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: offset }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </Component>
  );
}
