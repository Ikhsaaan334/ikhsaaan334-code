import { stack } from '../data';
import Headline from '../components/Headline';

export default function Stack() {
  return (
    <section id="stack" className="py-24 md:py-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Headline
            as="h2"
            className="text-[2.5rem] leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[5rem] xl:text-[5.5rem]"
            lines={[{ text: 'Tools I' }, { text: 'reach for' }]}
          />
          <p className="mt-8 max-w-sm text-lg leading-relaxed text-ink-soft">
            Go comes first. Everything else is what the project in front of me needs.
          </p>
        </div>

        <div className="space-y-10 lg:col-span-8">
          {stack.map(group => (
            <div key={group.group}>
              <h3 className="font-mono text-xs tracking-[0.04em] text-ink-soft uppercase">{group.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-3">
                {group.items.map(item => (
                  <li key={item.name}>
                    {/* Every tool gets the same tile. Nothing in this list is ranked. */}
                    <div className="flex h-14 items-center gap-3 rounded-[14px] border border-line px-4">
                      <img src={item.src} alt="" width="28" height="28" className="h-7 w-7 object-contain" />
                      <span className="text-lg">{item.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
