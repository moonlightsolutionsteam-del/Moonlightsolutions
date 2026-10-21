import { chief, peopleGroups } from '../data/invitation';
import Glass from './Glass';
import Reveal from './Reveal';

const initials = (name: string) =>
  name.replace(/^(Mr|Mrs|Hon|Dr)\.?\s+/i, '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function People() {
  return (
    <section className="stage-bg px-5 py-16" aria-labelledby="people-h">
      <Reveal className="max-w-3xl mx-auto text-center">
        <h2 id="people-h" className="label">In distinguished presence</h2>
        <div className="rule my-5" />
      </Reveal>

      {/* Chief: the largest card on the page */}
      <Glass className="max-w-lg mx-auto mt-4 px-6 py-10 text-center">
        <div className="mx-auto mb-4 w-28 h-28 rounded-full grid place-items-center overflow-hidden border-2 border-gold bg-ruby">
          {chief.photo
            ? <img src={chief.photo} alt={`Portrait of ${chief.name}`} className="w-full h-full object-cover" />
            : <span className="font-cinzel text-4xl font-bold gold-text" aria-hidden="true">{initials(chief.name)}</span>}
        </div>
        <h3 className="label">{chief.role}</h3>
        <p className="mt-3 font-cinzel font-bold text-[2.1rem] leading-tight gold-text">{chief.name}</p>
        <p className="italic text-[1.35rem] text-champagne">{chief.place}</p>
      </Glass>

      <div className="max-w-4xl mx-auto mt-10 grid gap-6 md:grid-cols-3">
        {peopleGroups.map((g, gi) => (
          <Glass key={g.label} delay={gi * 0.15} className="px-5 py-6">
            <h3 className="label pb-3 mb-3 border-b border-gold/60">{g.label}</h3>
            <ul className="list-none m-0 p-0">
              {g.people.map((p) => (
                <li key={p.name} className="py-2 flex flex-col">
                  <span className="text-xl font-bold text-champagne">{p.name}</span>
                  {p.role && <span className="italic text-[1.15rem] text-gold-hi leading-snug">{p.role}</span>}
                </li>
              ))}
            </ul>
          </Glass>
        ))}
      </div>
    </section>
  );
}
