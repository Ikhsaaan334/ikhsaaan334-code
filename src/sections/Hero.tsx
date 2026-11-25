import { useEffect, useRef, type RefObject } from 'react';
import type { MarbleMachine } from '../three/marbleMachine';
import { profile } from '../data';
import { enableScrollTrigger, prefersReducedMotion } from '../lib/motion';
import CornerCrosses from '../components/CornerCrosses';
import Headline from '../components/Headline';
import MachineStage from '../components/MachineStage';

type Props = {
  machineRef: RefObject<MarbleMachine | null>;
  progressRef: RefObject<number>;
};

// Pinning needs room for the whole machine. Below this the hero scrolls away and the run plays as it leaves.
const PIN_QUERY = '(min-width: 1024px) and (min-height: 760px)';
// Where the marble rests when motion is reduced.
const REST_PROGRESS = 0.34;

export default function Hero({ machineRef, progressRef }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const apply = (value: number) => {
      progressRef.current = value;
      machineRef.current?.setProgress(value);
    };

    if (prefersReducedMotion()) {
      apply(REST_PROGRESS);
      return;
    }

    // The sticky header stays on top, so the hero pins right underneath it instead of at the viewport edge.
    const header = document.getElementById('site-header');
    const belowHeader = `${Math.round(header?.getBoundingClientRect().height ?? 0)}px`;
    const canPin = window.matchMedia(PIN_QUERY).matches;

    const ScrollTrigger = enableScrollTrigger();
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: `top ${belowHeader}`,
      end: canPin ? '+=110%' : 'bottom 25%',
      pin: canPin,
      anticipatePin: 1,
      onUpdate: self => apply(self.progress),
      onRefresh: self => apply(self.progress),
    });
    apply(trigger.progress);
    return () => trigger.kill();
  }, [machineRef, progressRef]);

  return (
    // Horizontal padding comes from the page, so the name and the stage sit on the same left edge as every section.
    <section
      id="home"
      ref={sectionRef}
      className="hero relative flex min-h-[calc(100svh-var(--header-h))] flex-col pt-5 pb-4 [--hero-size:clamp(2.1rem,9.6vw,10rem)]"
    >
      <div className="mt-8 md:mt-6 lg:grid lg:grid-cols-12 lg:gap-x-10">
        {/* Both start in the same row and column 1 is named, because automatic placement never stacks two items.
            The intro is pushed one line of the name down, beside its short second line. If it is taller than that
            line, the row grows under it, so the two can never overlap. */}
        <Headline
          as="h1"
          immediate
          className="text-(length:--hero-size) leading-[0.92] tracking-[-0.035em] lg:col-start-1 lg:col-span-12 lg:row-start-1"
          lines={[{ text: 'Muhammad Ikhsan' }, { text: 'Nur Rafid', className: 'lg:pl-[12%]' }]}
        />
        <div className="mt-6 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-[calc(var(--hero-size)_*_0.92)]">
          <p className="text-lg leading-relaxed text-ink-soft">{profile.intro}</p>
          <p className="mt-4 font-mono text-xs tracking-[0.04em] text-ink-soft uppercase">
            {profile.status} · {profile.location}
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-6 pt-8 font-mono text-xs tracking-[0.04em] text-ink-soft uppercase md:pt-6">
        <span>Scroll to route a request</span>
        <span className="hidden sm:inline">Go · Laravel · Node.js</span>
      </div>

      <div className="hero-stage relative mt-4 aspect-[3/5] min-h-[320px] sm:aspect-[16/11] lg:aspect-[16/8.5]">
        <CornerCrosses />
        <div
          data-track-start
          className="absolute inset-0 overflow-hidden rounded-[20px] bg-stage md:rounded-[28px]"
        >
          <MachineStage machineRef={machineRef} progressRef={progressRef} />
        </div>
      </div>
    </section>
  );
}
