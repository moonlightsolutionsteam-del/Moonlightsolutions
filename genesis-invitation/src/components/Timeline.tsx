import { timeline } from '../data/invitation';
import Reveal from './Reveal';

export default function Timeline() {
  return (
    <section className="stage-bg px-5 py-16" aria-labelledby="next-h">
      <Reveal className="max-w-xl mx-auto text-center">
        <h2 id="next-h" className="label">What happens next</h2>
        <div className="rule my-5" />
      </Reveal>
      <ol className="relative max-w-xl mx-auto list-none p-0 mt-4">
        <span className="absolute top-2 bottom-2 left-[5.6rem] w-px bg-gold/60" aria-hidden="true" />
        {timeline.map((t, i) => (
          <li key={t.date}>
            <Reveal delay={i * 0.05} className="relative grid grid-cols-[4.6rem_1fr] gap-x-9 py-4">
              <span className="font-cinzel font-bold text-gold-hi text-lg text-right pt-0.5">{t.date}</span>
              <span className="absolute left-[5.6rem] top-[1.55rem] -translate-x-1/2 w-3 h-3 rounded-full bg-gold ring-4 ring-wine" aria-hidden="true" />
              <div>
                <p className="font-bold text-xl text-champagne leading-snug">{t.title}</p>
                {t.note && <p className="italic text-champagne/90">{t.note}</p>}
                {t.quote && <p className="italic text-champagne/90 mt-1">“{t.quote}”</p>}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
