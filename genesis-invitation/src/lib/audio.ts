// Short "pop" plus a rising arpeggio: D5, F#5, A5, D6, F#6.
export function playChime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.2), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
    const pop = ctx.createBufferSource();
    const popGain = ctx.createGain();
    popGain.gain.value = 0.35;
    pop.buffer = buf;
    pop.connect(popGain).connect(ctx.destination);
    pop.start(now);

    [587.33, 739.99, 880, 1174.66, 1479.98].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const t = now + 0.15 + i * 0.11;
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.1);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 2.3);
    });
  } catch {
    /* audio is optional */
  }
}
