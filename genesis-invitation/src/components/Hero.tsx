import { m } from 'framer-motion';
import { event, welcomeLine } from '../data/invitation';
import Emblem from './Emblem';
import GoldDust from './GoldDust';
import { useMotionOk } from '../lib/useMotionOk';

export default function Hero({ play }: { play: boolean }) {
  const ok = useMotionOk();
  const rise = (delay: number) => ({
    initial: ok ? { opacity: 0, y: 14 } : false,
    animate: play || !ok ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay, ease: 'easeOut' as const },
  });
  return (
    <header className="relative min-h-[100svh] grid place-items-center text-center overflow-hidden stage-bg px-5 pt-14 pb-20">
      {ok && play && <div className="rays" aria-hidden="true" />}
      {ok && play && <GoldDust />}
      <div className="relative max-w-2xl">
        <Emblem play={play} />
        <h1 className="mt-2 text-[clamp(2.2rem,8vw,3.4rem)] font-bold tracking-[0.28em] -mr-[0.28em] gold-text">GENESIS</h1>
        <p className="font-cinzel text-[0.95rem] tracking-[0.5em] -mr-[0.5em] mt-1 text-champagne">INTERNATIONALE</p>
        <m.div
          className="rule mx-auto my-6 w-[min(60vw,320px)]"
          initial={ok ? { scaleX: 0 } : false}
          animate={play || !ok ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.2, delay: 1.4 }}
        />
        <m.p className="italic font-semibold text-[clamp(1.6rem,5.2vw,2.3rem)] leading-snug text-champagne" {...rise(1.6)}>
          {welcomeLine}
        </m.p>
        <m.div className="mt-6 font-cinzel" {...rise(2)}>
          <div className="text-[clamp(3.4rem,13vw,5rem)] leading-none font-bold gold-text">{event.day}</div>
          <div className="text-[1.05rem] tracking-[0.3em] -mr-[0.3em] mt-1 text-gold-hi uppercase">{event.monthYear}</div>
          <p className="font-garamond font-semibold text-[1.35rem] mt-3 text-champagne">
            {event.weekday} · {event.timeLabel}
            <br />
            {event.venue}, {event.city}
          </p>
        </m.div>
      </div>
      <m.a
        href="#notice"
        className="absolute left-1/2 -translate-x-1/2 text-champagne text-lg px-4 py-2"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        {...rise(2.4)}
      >
        Read the invitation ↓
      </m.a>
    </header>
  );
}
