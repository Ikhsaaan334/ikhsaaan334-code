import { Mail } from 'lucide-react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import AnimatedContent from '../components/reactbits/AnimatedContent/AnimatedContent';
import ClickSpark from '../components/reactbits/ClickSpark/ClickSpark';
import GradientText from '../components/reactbits/GradientText/GradientText';
import { useTheme } from '../hooks/useTheme';
import { profile } from '../data';

export default function Contact() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section id="contact" className="relative mx-auto w-full max-w-6xl px-6 py-28 md:px-10 md:py-36">
      <AnimatedContent distance={40} duration={0.9} threshold={0.2}>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="mb-8 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Let&apos;s Build Together
          </h2>
          <p className="text-balance text-base leading-relaxed text-muted md:text-lg">
            Interested in discussing, collaborating, or need more info? Whether it&apos;s an internship, a backend
            project, or just talking shop about{' '}
            <GradientText
              colors={dark ? ['#818cf8', '#c084fc', '#22d3ee', '#818cf8'] : ['#6366f1', '#a855f7', '#0ea5e9', '#6366f1']}
              animationSpeed={6}
              className="font-medium"
            >
              APIs and system design
            </GradientText>{': '}
            my inbox is always open.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <ClickSpark sparkColor={dark ? '#71717a' : '#3f3f46'} sparkSize={14} sparkCount={8} duration={500}>
              <a
                href={`mailto:${profile.email}`}
                className={`inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${
                  dark
                    ? 'bg-zinc-50 text-zinc-900 shadow-[0_10px_40px_-12px_rgba(255,255,255,0.3)]'
                    : 'bg-ink text-paper shadow-[0_10px_30px_-12px_rgba(11,11,15,0.5)]'
                }`}
              >
                <Mail className="h-4 w-4" /> {profile.email}
              </a>
            </ClickSpark>

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-6 py-3.5 text-sm font-medium text-muted transition-colors duration-300 hover:border-faint hover:text-ink"
            >
              <FiGithub className="h-4 w-4" /> GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-6 py-3.5 text-sm font-medium text-muted transition-colors duration-300 hover:border-faint hover:text-ink"
            >
              <FiLinkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
