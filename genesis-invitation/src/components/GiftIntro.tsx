import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { playChime } from '../lib/audio';
import { fireConfetti } from '../lib/confetti';
import { useMotionOk } from '../lib/useMotionOk';

export default function GiftIntro({ onOpen }: { onOpen: () => void }) {
  const ok = useMotionOk();
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => btn.current?.focus(), []);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    playChime();
    if (ok && canvas.current) fireConfetti(canvas.current, innerWidth < 500 ? 120 : 140);
    setTimeout(() => { setGone(true); onOpen(); }, ok ? 900 : 150);
  };

  return (
    <>
      <canvas ref={canvas} className="fixed inset-0 w-full h-full pointer-events-none z-[60]" aria-hidden="true" />
      <m.div
        role="dialog"
        aria-modal="true"
        aria-label="Your invitation"
        className="fixed inset-0 z-50 grid place-items-center text-center p-8 stage-bg"
        animate={{ opacity: gone ? 0 : 1 }}
        transition={{ duration: ok ? 0.8 : 0.2 }}
        style={{ visibility: gone ? 'hidden' : 'visible', pointerEvents: gone ? 'none' : 'auto' }}
      >
        <div>
          <svg className={`mx-auto w-[min(64vw,260px)] overflow-visible ${open ? '' : 'hop'}`} viewBox="0 0 300 300" aria-hidden="true">
            <defs>
              <linearGradient id="gb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FCE7A8" /><stop offset=".5" stopColor="#D9A743" /><stop offset="1" stopColor="#9C6B1A" /></linearGradient>
              <linearGradient id="gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5A0C14" /><stop offset=".5" stopColor="#B42A33" /><stop offset="1" stopColor="#5A0C14" /></linearGradient>
            </defs>
            <m.g animate={open && ok ? { scale: 0.85, opacity: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}>
              <rect x="50" y="140" width="200" height="140" rx="6" fill="url(#gb)" />
              <rect x="135" y="140" width="30" height="140" fill="url(#gr)" />
              <rect x="50" y="140" width="200" height="14" fill="#000" opacity=".15" />
            </m.g>
            <m.g animate={open && ok ? { y: -260, rotate: -35, opacity: 0 } : {}} transition={{ duration: 0.9, ease: [0.2, 0.9, 0.3, 1] }} style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}>
              <path d="M150 104 C120 60 76 70 90 98 C98 114 130 110 150 104Z" fill="url(#gr)" />
              <path d="M150 104 C180 60 224 70 210 98 C202 114 170 110 150 104Z" fill="url(#gr)" />
              <rect x="38" y="104" width="224" height="44" rx="6" fill="url(#gb)" />
              <rect x="135" y="104" width="30" height="44" fill="url(#gr)" />
              <circle cx="150" cy="104" r="12" fill="#B42A33" />
            </m.g>
          </svg>
          <p className="label mt-2 mb-5">Genesis Internationale</p>
          <button ref={btn} type="button" className="btn-gold" onClick={handleOpen}>
            Open your invitation
          </button>
        </div>
      </m.div>
    </>
  );
}
