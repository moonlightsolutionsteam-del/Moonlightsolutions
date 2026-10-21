import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMotionOk } from '../lib/useMotionOk';

/** Glass panel; a light sheen sweeps across once when it scrolls into view. */
export default function Glass({ children, cream = false, className = '', delay = 0 }: { children: ReactNode; cream?: boolean; className?: string; delay?: number }) {
  const ok = useMotionOk();
  return (
    <m.div
      className={`${cream ? 'glass-cream' : 'glass'} ${className}`}
      initial={{ opacity: 0, y: ok ? 22 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: ok ? 1 : 0.3, delay: ok ? delay : 0, ease: 'easeOut' }}
    >
      {children}
      {ok && (
        <m.span
          className="sheen"
          aria-hidden="true"
          initial={{ x: '-120%' }}
          whileInView={{ x: '120%' }}
          viewport={{ once: true, margin: '-6% 0px' }}
          transition={{ duration: 1.6, delay: delay + 0.4, ease: 'easeInOut' }}
        />
      )}
    </m.div>
  );
}
