import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The header is sticky, so a section is brought in underneath it, not behind it.
const headerHeight = () =>
  Math.round(document.getElementById('site-header')?.getBoundingClientRect().height ?? 0);

/** Initialize Lenis inertia scrolling, synced with GSAP ScrollTrigger. Does nothing when motion is reduced. */
export function initSmoothScroll(): () => void {
  if (prefersReduced()) return () => {};

  // Registered here, not at import, so a page that never animates never starts ScrollTrigger's scroll watcher.
  gsap.registerPlugin(ScrollTrigger);
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Smoothly scroll a section into view (Lenis-aware, instant when motion is reduced). */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // A link can be followed right after the menu closes, while Lenis is still stopped.
  lenis?.start();
  // A pinned hero is fixed to the viewport, so measure the spacer that holds its place in the page.
  const anchor = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
  const top = Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - headerHeight());
  if (!lenis || prefersReduced()) {
    window.scrollTo({ top, behavior: 'instant' });
    return;
  }
  lenis.scrollTo(top, { duration: 1.2 });
}

export function getLenis() {
  return lenis;
}
