import { ArrowDown, Download } from 'lucide-react';
import Aurora from '../components/reactbits/Aurora/Aurora';
import ClickSpark from '../components/reactbits/ClickSpark/ClickSpark';
import Magnet from '../components/reactbits/Magnet/Magnet';
import ShinyText from '../components/reactbits/ShinyText/ShinyText';
import SplitText from '../components/reactbits/SplitText/SplitText';
import StarBorder from '../components/reactbits/StarBorder/StarBorder';
import { scrollToSection } from '../lib/scroll';
import { useTheme } from '../hooks/useTheme';
import { profile } from '../data';

export default function Hero() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section id="home" className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6">
      {/* Local aurora boost on top of the page-wide ambient layer */}
      <div className="absolute inset-0">
        <Aurora
          colorStops={dark ? ['#6366f1', '#a855f7', '#22d3ee'] : ['#BFDBFE', '#DDD6FE', '#99F6E4']}
          amplitude={dark ? 1.7 : 1.5}
          blend={0.55}
          speed={0.5}
          lightMode={!dark}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="mb-3 flex items-center overflow-hidden font-mono text-[12px] text-faint animate-type-in whitespace-nowrap">
          <span>$ whoami</span>
          <span className="ml-0.5 inline-block w-[7px] animate-caret-blink bg-faint text-transparent">.</span>
        </p>
        <p className="mb-8 animate-fade-up font-mono text-[12px] tracking-wide text-muted [animation-delay:900ms]">
          ikhsan <span className="text-faint">::</span> {profile.role.toLowerCase()}
        </p>

        <h1 className="font-display font-bold leading-[1.04] tracking-tight text-ink">
          <span className="block text-[clamp(2.6rem,8vw,5.5rem)]">
            <SplitText text="Muhammad Ikhsan" delay={35} duration={1.1} threshold={0.1} />
          </span>
          <span className="block text-[clamp(2.6rem,8vw,5.5rem)]">
            <ShinyText
              text="Nur Rafid"
              speed={3.5}
              color={dark ? '#e4e4e7' : '#0b0b0f'}
              shineColor={dark ? '#ffffff' : '#a1a1aa'}
              className="font-display"
            />
          </span>
        </h1>

        <p className="mt-8 max-w-xl animate-fade-up text-balance text-base leading-relaxed text-muted [animation-delay:600ms] md:text-lg">
          {profile.heroSub}
        </p>

        <p className="mt-6 flex animate-fade-up items-center gap-2 font-mono text-[11px] tracking-wide text-muted [animation-delay:800ms]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          open to internship · bandung, id
        </p>

        <div className="mt-10 flex animate-fade-up flex-col items-center gap-4 [animation-delay:1000ms] sm:flex-row">
          <ClickSpark sparkColor={dark ? '#a1a1aa' : '#3f3f46'} sparkSize={12} sparkCount={7} duration={500}>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className={`group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${
                dark
                  ? 'bg-zinc-50 text-zinc-900 shadow-[0_10px_40px_-12px_rgba(255,255,255,0.35)]'
                  : 'bg-ink text-paper shadow-[0_10px_30px_-12px_rgba(11,11,15,0.5)]'
              }`}
            >
              Explore My Work
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </ClickSpark>

          <Magnet padding={40} magnetStrength={4}>
            <StarBorder
              as="a"
              href={profile.cv}
              target="_blank"
              rel="noreferrer noopener"
              color={dark ? '#71717a' : '#d4d4d8'}
              speed="5s"
              thickness={1}
              backgroundColor={dark ? '#121216' : '#ffffff'}
              textColor={dark ? '#fafafa' : '#0b0b0f'}
              borderColor={dark ? '#2a2a31' : '#d4d4d8'}
              className="!rounded-full shadow-[0_8px_24px_-14px_rgba(0,0,0,0.35)]"
            >
              <span className="inline-flex items-center gap-2 font-medium">
                <Download className="h-4 w-4" /> Download CV
              </span>
            </StarBorder>
          </Magnet>
        </div>
      </div>

      <div className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-faint p-1.5">
          <div className="h-2 w-0.5 animate-bounce rounded-full bg-faint" />
        </div>
      </div>
    </section>
  );
}
