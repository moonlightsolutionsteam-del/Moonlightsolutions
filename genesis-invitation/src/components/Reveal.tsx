import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMotionOk } from '../lib/useMotionOk';

/** Fade-and-rise on scroll, once. Falls back to a plain fade when reduced motion is set. */
export default function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ok = useMotionOk();
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: ok ? 18 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: ok ? 0.9 : 0.3, delay: ok ? delay : 0, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  );
}
