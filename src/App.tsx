import { useEffect, useState } from 'react';
import { Download, Mail } from 'lucide-react';
import { FiGithub, FiLinkedin, FiMoon, FiSun } from 'react-icons/fi';
import AmbientBackground from './components/AmbientBackground';
import DockNav from './components/DockNav';
import { navSections, profile } from './data';
import { useTheme, ThemeProvider } from './hooks/useTheme';
import { initSmoothScroll, scrollToSection } from './lib/scroll';
import About from './sections/About';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import Hero from './sections/Hero';
import Journey from './sections/Journey';
import Projects from './sections/Projects';
import Stats from './sections/Stats';
import TechStack from './sections/TechStack';

function useScrollSpy() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return activeId;
}

function MobileNav({ theme, onToggleTheme }: { theme: string; onToggleTheme: () => void }) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between gap-1 rounded-full border border-line bg-card/80 p-1.5 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden">
      {navSections
        .filter(s => ['home', 'about', 'projects', 'contact'].includes(s.id))
        .map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            className="flex-1 rounded-full px-2 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:bg-mist hover:text-ink"
          >
            {s.label}
          </button>
        ))}
      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="GitHub"
        className="rounded-full p-2 text-muted transition-colors hover:bg-mist hover:text-ink"
      >
        <FiGithub className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label="Toggle dark mode"
        className="rounded-full p-2 text-muted transition-colors hover:bg-mist hover:text-ink"
      >
        {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
      </button>
    </nav>
  );
}

/** Thin scroll-progress bar pinned to the top of the viewport. */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const el = document.scrollingElement;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-ink transition-transform duration-150 ease-out"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  );
}

function Footer() {
  return (
    <footer className="border-t border-line pb-28 pt-12 md:pb-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <p className="font-display text-lg font-semibold tracking-tight text-ink">{profile.name}</p>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="rounded-full border border-line bg-card p-2.5 text-faint transition-colors hover:border-faint hover:text-ink"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="rounded-full border border-line bg-card p-2.5 text-faint transition-colors hover:border-faint hover:text-ink"
          >
            <FiGithub className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="rounded-full border border-line bg-card p-2.5 text-faint transition-colors hover:border-faint hover:text-ink"
          >
            <FiLinkedin className="h-4 w-4" />
          </a>
          <a
            href={profile.cv}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Download CV"
            className="rounded-full border border-line bg-card p-2.5 text-faint transition-colors hover:border-faint hover:text-ink"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
        <p className="font-mono text-[10px] tracking-[0.18em] text-faint">
          v2.0 · react + vite + reactbits · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  const activeId = useScrollSpy();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const destroy = initSmoothScroll();
    return destroy;
  }, []);

  return (
    <div className="relative min-h-svh bg-paper text-ink">
      <AmbientBackground theme={theme} />
      <ScrollProgress />
      <DockNav activeId={activeId} theme={theme} onToggleTheme={toggle} />
      <MobileNav theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero />
        <Stats />
        <About />
        <Journey />
        <TechStack />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
