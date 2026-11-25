import { profile } from '../data';
import CornerCrosses from '../components/CornerCrosses';
import Headline from '../components/Headline';
import { PillLink } from '../components/Pill';

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:pt-40 md:pb-20">
      <div className="relative">
        <CornerCrosses />
        <div
          data-track-end
          className="rounded-[20px] bg-stage px-6 py-16 text-canvas md:rounded-[28px] md:px-16 md:py-24"
        >
          <p className="font-mono text-xs tracking-[0.04em] text-cyan uppercase">Request delivered</p>
          <Headline
            as="h2"
            className="mt-6 text-[2.75rem] leading-[0.92] tracking-[-0.035em] sm:text-7xl lg:text-[8.5rem]"
            lines={[{ text: 'Closed to' }, { text: 'offers.', className: 'lg:pl-[12%]' }]}
          />
          <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-10">
            <p className="text-lg leading-relaxed text-stage-soft md:col-span-6 md:text-xl">
              I'm closed to offers at the moment. If you want to talk about Go, Laravel or Node.js, tell me what
              you're building.
            </p>
            <ul className="flex flex-wrap content-start gap-3 md:col-span-6 md:justify-end">
              <li>
                <PillLink href={`mailto:${profile.email}`} tone="stage">
                  Email me
                </PillLink>
              </li>
              <li>
                <PillLink href={profile.github} tone="outline">
                  GitHub
                </PillLink>
              </li>
              <li>
                <PillLink href={profile.linkedin} tone="outline">
                  LinkedIn
                </PillLink>
              </li>
              <li>
                <PillLink href={profile.cv} target="_blank" tone="outline">
                  Download CV
                </PillLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="pt-10">
        <p className="text-xl">{profile.name}</p>
        <p className="text-ink-soft">{profile.location}</p>
      </footer>
    </section>
  );
}
