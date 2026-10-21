import { event, shareText, signature } from '../data/invitation';
import { downloadIcs, googleCalendarUrl } from '../lib/calendar';
import Reveal from './Reveal';

export default function Actions() {
  const share = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${location.href}`)}`;
    window.open(url, '_blank', 'noopener');
  };
  return (
    <section className="stage-bg px-5 pt-14 pb-20 text-center" aria-labelledby="sign-h">
      <Reveal className="max-w-xl mx-auto">
        <h2 id="sign-h" className="sr-only">Signature and actions</h2>
        <p className="italic text-[1.5rem] text-champagne">{signature.with}</p>
        <p className="font-cinzel font-bold text-[2rem] tracking-[0.12em] gold-text my-1">{signature.name.toUpperCase()}</p>
        <p className="text-xl text-champagne">{signature.company}</p>
        <div className="rule my-8" />
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
          <button type="button" className="btn-gold" onClick={downloadIcs}>Add to calendar</button>
          <a className="btn-ghost" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">Google Calendar</a>
          <button type="button" className="btn-ghost" onClick={share}>Share on WhatsApp</button>
          {event.venueMapUrl && <a className="btn-ghost" href={event.venueMapUrl} target="_blank" rel="noopener noreferrer">Get directions</a>}
        </div>
      </Reveal>
    </section>
  );
}
