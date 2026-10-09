import LogoLoop from '../components/reactbits/LogoLoop/LogoLoop';
import SectionHeading from '../components/SectionHeading';
import { useTheme } from '../hooks/useTheme';
import { techLogos } from '../data';

export default function TechStack() {
  const { theme } = useTheme();
  // Logos sit over the ambient layer on paper — fade edges toward it
  const fadeColor = theme === 'dark' ? '#0a0a0d' : '#fafafa';

  return (
    <section id="stack" className="overflow-hidden border-y border-line bg-card/60">
      <div className="mx-auto w-full max-w-6xl px-6 pt-24 md:px-10 md:pt-32">
        <SectionHeading title="Tech Stack" align="center" />
      </div>

      <div className="space-y-2 pb-24 md:pb-32">
        <div className="tech-loop">
          <LogoLoop
            logos={techLogos}
            speed={70}
            direction="left"
            logoHeight={40}
            gap={64}
            fadeOut
            fadeOutColor={fadeColor}
            scaleOnHover
            ariaLabel="Technologies I work with"
          />
        </div>
        <div className="tech-loop">
          <LogoLoop
            logos={[...techLogos].reverse()}
            speed={55}
            direction="right"
            logoHeight={30}
            gap={56}
            fadeOut
            fadeOutColor={fadeColor}
            scaleOnHover
            ariaLabel="Technologies I work with"
          />
        </div>
        <p className="pt-8 text-center font-mono text-[10px] tracking-[0.18em] text-faint">
          hover a logo to reveal its color
        </p>
      </div>
    </section>
  );
}
