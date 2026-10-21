import { useEffect, useMemo, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { memberCount, memberPanels, thankYou } from '../data/invitation';
import { matches } from '../lib/search';
import { useMotionOk } from '../lib/useMotionOk';
import Glass from './Glass';
import Reveal from './Reveal';

export default function Members() {
  const ok = useMotionOk();
  const [query, setQuery] = useState('');
  const refs = useRef(new Map<string, HTMLLIElement>());

  const hits = useMemo(() => {
    const set = new Set<string>();
    if (!query.trim()) return set;
    memberPanels.forEach((p) => p.members.forEach((mem) => { if (matches(mem.name, query)) set.add(`${p.title}|${mem.name}`); }));
    return set;
  }, [query]);
  const searching = query.trim().length > 0;

  useEffect(() => {
    if (!hits.size) return;
    const t = setTimeout(() => {
      const first = memberPanels.flatMap((p) => p.members.map((mem) => `${p.title}|${mem.name}`)).find((k) => hits.has(k));
      refs.current.get(first!)?.scrollIntoView({ behavior: ok ? 'smooth' : 'auto', block: 'center' });
    }, 250);
    return () => clearTimeout(t);
  }, [hits, ok]);

  return (
    <section className="stage-bg px-5 py-16" aria-labelledby="members-h">
      <Reveal className="max-w-xl mx-auto text-center">
        <h2 id="members-h" className="label">The pillars of our company</h2>
        <div className="rule my-5" />
        <p className="italic font-semibold text-[1.5rem] leading-snug text-champagne">“{thankYou}”</p>
        <p className="font-cinzel text-gold-hi text-lg mt-5" aria-live="polite">{memberCount} members</p>

        <div className="mt-5 text-left">
          <label htmlFor="find" className="sr-only">Find your name</label>
          <input
            id="find" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your name" autoComplete="off" enterKeyHint="search"
            className="w-full rounded-full px-5 py-3 text-xl bg-ivory text-ink placeholder:text-ink/60 border-2 border-gold"
          />
          <p className="mt-2 min-h-[1.75rem] text-center text-champagne" role="status">
            {searching && !hits.size && 'No match found. Please try another spelling.'}
            {searching && hits.size > 0 && `${hits.size} ${hits.size === 1 ? 'match' : 'matches'} highlighted`}
          </p>
        </div>
      </Reveal>

      <div className="max-w-5xl mx-auto mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {memberPanels.map((p) => (
          <Glass key={p.title} cream className={`px-5 py-6 ${p.final ? 'sm:col-span-2 lg:col-span-3 lg:max-w-xl lg:mx-auto lg:w-full' : ''}`}>
            <h3 className="font-cinzel text-[0.95rem] font-bold tracking-[0.2em] uppercase text-ruby text-center pb-3 mb-2 border-b border-gold">{p.title}</h3>
            <ol className="list-none m-0 p-0">
              {p.members.map((mem, i) => {
                const key = `${p.title}|${mem.name}`;
                const hit = hits.has(key);
                return (
                  <m.li
                    key={key}
                    ref={(el) => { if (el) refs.current.set(key, el); }}
                    className={`py-2 px-3 -mx-1 rounded-lg border-b border-dotted border-gold/80 last:border-b-0 text-xl font-bold leading-snug transition-colors ${hit ? 'bg-ruby text-champagne' : ''}`}
                    style={{ opacity: searching && !hit && hits.size ? 0.4 : undefined }}
                    initial={{ opacity: 0, x: ok ? -10 : 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-4% 0px' }}
                    transition={{ duration: ok ? 0.8 : 0.2, delay: ok ? 0.5 + i * 0.28 : 0, ease: 'easeOut' }}
                  >
                    {mem.name}
                    {mem.role && <span className="block italic font-semibold text-[1.1rem] text-ruby/90">{mem.role}</span>}
                  </m.li>
                );
              })}
            </ol>
          </Glass>
        ))}
      </div>
    </section>
  );
}
