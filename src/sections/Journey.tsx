import { journey } from '../data';
import Headline from '../components/Headline';

export default function Journey() {
  return (
    <section id="journey" className="py-24 md:py-40">
      <Headline
        as="h2"
        className="text-[2.5rem] leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[5.5rem] xl:text-[7rem]"
        lines={[{ text: 'Education and' }, { text: 'experience', className: 'lg:pl-[18%]' }]}
      />

      <ol className="mt-14 border-t border-line">
        {journey.map(item => {
          const degree = item.kind === 'education';
          return (
            <li
              key={item.title}
              className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8 md:py-10"
            >
              <p className="font-mono text-xs tracking-[0.04em] text-ink-soft uppercase md:col-span-3">
                {item.period}
              </p>
              <div className={degree ? 'md:col-span-9' : 'md:col-span-6'}>
                <h3 className={degree ? 'text-3xl tracking-[-0.02em] md:text-5xl' : 'text-2xl tracking-[-0.02em] md:text-3xl'}>
                  {item.title}
                </h3>
                <p className="mt-2 text-ink-soft">{item.org}</p>
                <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
