import AnimatedContent from '../components/reactbits/AnimatedContent/AnimatedContent';
import Lanyard from '../components/reactbits/Lanyard/Lanyard';
import SectionHeading from '../components/SectionHeading';
import { aboutBio, profile } from '../data';

export default function About() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <SectionHeading title="About Me" />

      <div className="grid items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <AnimatedContent distance={60} duration={0.9} threshold={0.2}>
          <div className="mx-auto w-full max-w-[340px] md:max-w-[380px]">
            <div className="h-[440px] md:h-[500px]">
              <Lanyard
                frontImage={profile.photo}
                backImage="/assets/id-back.svg"
                imageFit="cover"
                cardColor="#ffffff"
                orientation="portrait"
                finish="glossy"
                cornerRadius={0.32}
                size={0.62}
                anchor="center"
                strapLength={0.52}
                strapColor="#1a1a1f"
                strapWidth={0.7}
                metal="silver"
                gravity={1.05}
                damping={0.55}
                elasticity={0.55}
                breeze={0.35}
                interactive
                intro
              />
            </div>
            <p className="mt-2 text-center font-mono text-[10px] tracking-[0.18em] text-faint">
              drag the card · click to flip
            </p>
          </div>
        </AnimatedContent>

        <div className="space-y-5">
          {aboutBio.map((paragraph, i) => (
            <AnimatedContent key={i} distance={40} duration={0.8} delay={i * 0.12} threshold={0.2}>
              <p className="text-base leading-relaxed text-muted md:text-lg">
                {i === 0 ? (
                  <>
                    Hi! I&apos;m <strong className="font-semibold text-ink">Muhammad Ikhsan Nur Rafid</strong>, an
                    undergraduate Computer Science student at BINUS University with a strong interest in backend
                    engineering: designing REST APIs, managing databases, and building services that can be relied
                    on.
                  </>
                ) : (
                  paragraph
                )}
              </p>
            </AnimatedContent>
          ))}

          <AnimatedContent distance={40} duration={0.8} delay={0.24} threshold={0.2}>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Go', 'Laravel', 'Node.js', 'PostgreSQL', 'Docker', 'Cloud (GCP & AWS)'].map(chip => (
                <span
                  key={chip}
                  className="rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-[11px] text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
