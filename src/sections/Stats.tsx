import CountUp from '../components/reactbits/CountUp/CountUp';
import AnimatedContent from '../components/reactbits/AnimatedContent/AnimatedContent';
import { stats } from '../data';

export default function Stats() {
  return (
    <section aria-label="Statistics" className="border-y border-line bg-card/70">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-x divide-line md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 px-4 py-10 md:py-14">
            <AnimatedContent distance={30} duration={0.7} delay={i * 0.08} threshold={0.3}>
              <div className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                <CountUp to={stat.value} duration={2} separator="" />
                <span className="text-faint">{stat.suffix}</span>
              </div>
              <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                {stat.label}
              </p>
            </AnimatedContent>
          </div>
        ))}
      </div>
    </section>
  );
}
