import { Fragment } from 'react';
import { agenda, event } from '../data/invitation';
import Reveal from './Reveal';

// **phrase** -> gold highlight
const withHighlights = (text: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? <strong key={i} className="font-bold text-gold-hi">{part}</strong> : <Fragment key={i}>{part}</Fragment>,
  );

export default function Notice() {
  return (
    <section id="notice" className="stage-bg px-5 py-16" aria-labelledby="notice-h">
      <Reveal className="max-w-xl mx-auto text-center">
        <h2 id="notice-h" className="label">Notice of meeting and agenda</h2>
        <div className="rule my-5" />
        <p className="font-cinzel text-gold-hi text-xl tracking-wider mb-6">{event.noticeDate}</p>
        <div className="text-left sm:text-center text-[1.3rem] leading-relaxed text-champagne space-y-5">
          {agenda.map((p, i) => <p key={i}>{withHighlights(p)}</p>)}
        </div>
      </Reveal>
    </section>
  );
}
