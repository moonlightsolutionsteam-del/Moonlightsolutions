// Renders the animated invitation (1080x1920, 30 fps) frame by frame from html/status.html, then encodes it with ffmpeg.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const FPS = 30, SECONDS = 18, dir = path.join(__dirname, 'frames');

// Runs inside the page: positions every element for time t (seconds). Deterministic, so each frame is exact.
function setup() {
  const ease = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  const prog = (t, a, d) => ease((t - a) / d);
  const c = document.querySelector('.center'), kids = [...c.children];
  const [crest, ar, together, n1, amp, n2, invite, div, date, venue, events, rsvp, entry] = kids;
  const rows = [...events.firstElementChild.children];
  const lanterns = [...document.querySelectorAll('.lantern')], clusters = [...document.querySelectorAll('.cluster')];
  const fades = [[ar, 1.8, .9], [together, 3.0, .6], [amp, 5.3, .5], [invite, 7.6, .7], [div, 8.4, .6], [date, 8.8, .7], [venue, 9.4, .6], [rsvp, 12.6, .7], [entry, 13.1, .7]];
  rows.forEach((r, i) => fades.push([r, 10.4 + i * .45, .6]));
  const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1920;
  Object.assign(cv.style, { position: 'absolute', inset: '0', zIndex: 5, pointerEvents: 'none' }); document.body.append(cv);
  const ctx = cv.getContext('2d');
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const cols = ['#ff4f93', '#ff8fb8', '#e0457b', '#ffcf4d', '#fff0f5', '#f39c12'];
  const petals = Array.from({ length: 110 }, () => ({ x: rnd() * 1080, y0: -60 - rnd() * 1400, s: 9 + rnd() * 12, v: 150 + rnd() * 170, ph: rnd() * 6.3, rot: rnd() * 6.3, vr: (rnd() - .5) * 2.4, c: cols[rnd() * cols.length | 0] }));
  window.render = t => {
    lanterns.forEach((l, i) => { const p = prog(t, .1 + i * .25, 1.3); l.style.transform = `translateY(${(p - 1) * 420}px) rotate(${Math.sin(t * 1.3 + i) * 3 * p}deg)`; l.style.transformOrigin = 'top center'; });
    const cp = prog(t, .9, 1.1); crest.style.opacity = cp; crest.style.transform = `scale(${.6 + .4 * cp}) rotate(${(1 - cp) * -40}deg)`;
    fades.forEach(([e, a, d]) => { const p = prog(t, a, d); e.style.opacity = p; e.style.transform = `translateY(${(1 - p) * 30}px)`; });
    [[n1, 3.4, 2.0], [n2, 5.8, 1.6]].forEach(([e, a, d]) => { const p = Math.min(1, Math.max(0, (t - a) / d)); e.style.clipPath = `inset(0 ${100 - p * 100}% 0 0)`; e.style.opacity = p > 0 ? 1 : 0; });
    clusters.forEach((e, i) => { const p = prog(t, 2.0, 1.2); e.style.opacity = p; e.style.transform = (i ? 'scaleX(-1) ' : '') + `translateY(${(1 - p) * 220}px)`; });
    ctx.clearRect(0, 0, 1080, 1920);
    const pt = t - 5.6;
    if (pt > 0) petals.forEach(p => {
      const y = p.y0 + pt * p.v; if (y < -40 || y > 1960) return;
      const fade = t > 15 ? Math.max(0, 1 - (t - 15) / 1.5) : 1;
      ctx.save(); ctx.globalAlpha = .9 * fade; ctx.translate(p.x + Math.sin(pt * 1.4 + p.ph) * 28, y); ctx.rotate(p.rot + pt * p.vr);
      ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.s * .55, p.s, 0, 0, 6.283); ctx.fill(); ctx.restore();
    });
  };
}

(async () => {
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'html', 'status.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.evaluate(setup);
  const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  const times = only || Array.from({ length: FPS * SECONDS }, (_, i) => i / FPS);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(t => window.render(t), times[i]);
    await p.screenshot({ path: path.join(dir, (only ? 't' + times[i] : String(i).padStart(4, '0')) + '.jpg'), type: 'jpeg', quality: 92 });
  }
  await b.close();
  if (only) return console.log('stills written');
  const out = path.join(__dirname, 'out', 'invitation-video.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, '%04d.jpg'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  console.log('video', (fs.statSync(out).size / 1e6).toFixed(1) + ' MB');
})();
