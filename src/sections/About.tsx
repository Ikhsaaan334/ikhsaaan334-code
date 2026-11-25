import { about } from '../data';
import Headline from '../components/Headline';

export default function About() {
  return (
    <section id="about" className="mt-24 py-24 md:mt-56 md:py-40">
      <Headline
        as="h2"
        className="text-[2.5rem] leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[5.5rem] xl:text-[7rem]"
        lines={[{ text: 'I like the part' }, { text: 'users never see.', className: 'lg:pl-[14%]' }]}
      />

      {/* The writing sits in the middle of the section, so neither side reads as empty. */}
      <div className="mx-auto mt-14 max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft md:text-xl">
        {about.paragraphs.map(paragraph => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <dl className="mx-auto mt-10 max-w-2xl border-t border-line">
        {about.facts.map(fact => (
          <div key={fact.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <dt className="font-mono text-xs tracking-[0.04em] text-ink-soft uppercase">{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
