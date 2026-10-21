import { useEffect, useRef } from 'react';

/** Drifting gold dust. Particle count adapts to width; pauses off-screen and when the tab is hidden. */
export default function GoldDust() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const x = c?.getContext('2d');
    if (!c || !x) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, visible = true;
    const ps: { x: number; y: number; r: number; v: number; p: number }[] = [];

    const size = () => {
      const r = c.getBoundingClientRect();
      w = c.width = r.width * dpr;
      h = c.height = r.height * dpr;
      const n = Math.max(24, Math.min(80, Math.floor(r.width / 14)));
      ps.length = 0;
      for (let i = 0; i < n; i++) ps.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + 0.5, v: Math.random() * 0.0006 + 0.0002, p: Math.random() * 6.28 });
    };
    const loop = (t: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      x.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.v;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        x.fillStyle = `rgba(246,222,156,${0.35 + 0.35 * Math.sin(t / 900 + p.p)})`;
        x.beginPath();
        x.arc((p.x + Math.sin(t / 4000 + p.p) * 0.01) * w, p.y * h, p.r * dpr, 0, 6.29);
        x.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };

    size();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
    io.observe(c);
    addEventListener('resize', size);
    document.addEventListener('visibilitychange', kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener('resize', size);
      document.removeEventListener('visibilitychange', kick);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
