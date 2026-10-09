import { Briefcase, GraduationCap } from 'lucide-react';
import AnimatedContent from '../components/reactbits/AnimatedContent/AnimatedContent';
import SectionHeading from '../components/SectionHeading';
import { journey } from '../data';

export default function Journey() {
  return (
    <section id="journey" className="mx-auto w-full max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <SectionHeading title="Education & Experience" />

      <div className="space-y-4">
        {journey.map((item, i) => (
          <AnimatedContent key={item.title} distance={30} duration={0.7} delay={i * 0.08} threshold={0.15}>
            <article className="group flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 shadow-[0_16px_40px_-32px_rgba(11,11,15,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,11,15,0.4)] md:flex-row md:items-center md:gap-7 md:p-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mist text-muted transition-colors duration-300 group-hover:bg-ink group-hover:text-paper md:h-16 md:w-16">
                {item.kind === 'education' ? <GraduationCap className="h-6 w-6" /> : <Briefcase className="h-6 w-6" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
                  {item.current && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> current
                    </span>
                  )}
                  <span className="ml-auto hidden font-mono text-[11px] tracking-wider text-muted sm:block">
                    {item.period}
                  </span>
                </div>

                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm font-medium text-muted">
                  {item.org}
                  {item.gpa && (
                    <span className="rounded-full border border-line bg-chip px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-muted">
                      {item.gpa}
                    </span>
                  )}
                  <span className="font-mono text-[11px] tracking-wider text-muted sm:hidden">{item.period}</span>
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </article>
          </AnimatedContent>
        ))}
      </div>
    </section>
  );
}
