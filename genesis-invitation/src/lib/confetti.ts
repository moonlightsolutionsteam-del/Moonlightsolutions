const COLORS = ['#F6DE9C', '#D9A743', '#FFF6E0', '#B42A33', '#E2B44F'];

// Gold, ivory and ruby burst with gravity. Runs ~2.5s then clears itself.
export function fireConfetti(canvas: HTMLCanvasElement, count = 140) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = (canvas.width = innerWidth * dpr);
  const H = (canvas.height = innerHeight * dpr);
  const ps = Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2;
    const s = (Math.random() * 9 + 4) * dpr;
    return {
      x: W / 2, y: H * 0.45, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 8 * dpr,
      w: (Math.random() * 8 + 5) * dpr, h: (Math.random() * 5 + 3) * dpr,
      r: Math.random() * 6, c: COLORS[(Math.random() * COLORS.length) | 0],
    };
  });
  let f = 0;
  const step = () => {
    ctx.clearRect(0, 0, W, H);
    f++;
    for (const p of ps) {
      p.vy += 0.28 * dpr; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += 0.15;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - f / 150);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.scale(1, Math.cos(p.r * 1.3));
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (f < 150) requestAnimationFrame(step);
    else ctx.clearRect(0, 0, W, H);
  };
  requestAnimationFrame(step);
}
