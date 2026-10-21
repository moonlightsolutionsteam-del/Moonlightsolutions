import { m } from 'framer-motion';
import { useMotionOk } from '../lib/useMotionOk';

const Feathers = () => (
  <g fill="url(#em-gold)">
    <path d="M0 0 C40 -14 110 -40 175 -62 C120 -30 60 -6 0 10Z" />
    <path d="M0 14 C45 4 110 -14 170 -30 C115 -4 55 14 0 26Z" />
    <path d="M0 30 C42 26 100 16 155 4 C105 26 50 38 0 42Z" />
    <path d="M0 46 C38 46 85 42 132 36 C90 52 45 58 0 58Z" />
  </g>
);

/** GI emblem: ruby disc, gold ring, four-feather wings that spread open when `play` is true. */
export default function Emblem({ play }: { play: boolean }) {
  const ok = useMotionOk();
  const wing = {
    initial: ok ? { scaleX: 0.05, rotate: 18, opacity: 0 } : false,
    animate: play || !ok ? { scaleX: 1, rotate: 0, opacity: 1 } : undefined,
    transition: { duration: 1.6, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] as const },
    style: { transformBox: 'fill-box' as const, transformOrigin: 'left center' },
  };
  return (
    <svg
      className="mx-auto block w-[min(78vw,340px)] h-auto drop-shadow-[0_6px_24px_rgba(0,0,0,.45)]"
      viewBox="0 0 400 220"
      role="img"
      aria-label="Genesis Internationale emblem: the letters GI within a ruby and gold circle, flanked by golden wings"
    >
      <defs>
        <linearGradient id="em-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FCE7A8" /><stop offset=".45" stopColor="#E2B44F" /><stop offset="1" stopColor="#A9761E" />
        </linearGradient>
        <radialGradient id="em-ruby" cx=".45" cy=".4" r=".7">
          <stop offset="0" stopColor="#B42A33" /><stop offset=".7" stopColor="#6B0F18" /><stop offset="1" stopColor="#3D070D" />
        </radialGradient>
      </defs>
      <g transform="translate(150 118) scale(-1 1)"><m.g {...wing}><Feathers /></m.g></g>
      <g transform="translate(250 118)"><m.g {...wing}><Feathers /></m.g></g>
      <circle cx="200" cy="110" r="62" fill="url(#em-gold)" />
      <circle cx="200" cy="110" r="54" fill="url(#em-ruby)" />
      <circle cx="200" cy="110" r="50" fill="none" stroke="#E2B44F" strokeWidth="1.2" opacity=".6" />
      <text x="200" y="129" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="700" fontSize="54" fill="url(#em-gold)">GI</text>
    </svg>
  );
}
