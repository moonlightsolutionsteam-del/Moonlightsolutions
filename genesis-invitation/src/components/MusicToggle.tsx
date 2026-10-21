import { useEffect, useRef, useState } from 'react';

/** Floating speaker button. Hidden unless /music.mp3 exists. Never autoplays. */
export default function MusicToggle() {
  const [available, setAvailable] = useState(false);
  const [on, setOn] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/music.mp3', { method: 'HEAD' })
      .then((r) => { if (!cancelled && r.ok && (r.headers.get('content-type') || '').startsWith('audio')) setAvailable(true); })
      .catch(() => {});
    return () => { cancelled = true; audio.current?.pause(); };
  }, []);

  if (!available) return null;

  const toggle = () => {
    if (!audio.current) { audio.current = new Audio('/music.mp3'); audio.current.loop = true; audio.current.volume = 0.5; }
    if (on) audio.current.pause(); else void audio.current.play().catch(() => {});
    setOn(!on);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn background music off' : 'Turn background music on'}
      className="fixed z-40 grid place-items-center w-12 h-12 rounded-full bg-wine/80 border border-gold text-gold-hi"
      style={{ top: 'calc(0.75rem + env(safe-area-inset-top))', right: '0.75rem' }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />
        {on ? <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></> : <path d="m16 9 5 6m0-6-5 6" />}
      </svg>
    </button>
  );
}
