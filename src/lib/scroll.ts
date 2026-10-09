import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** Initialize Lenis inertia scrolling, synced with GSAP ScrollTrigger. */
export function initSmoothScroll(): () => void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return () => {};

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

/** Smoothly scroll a section into view (Lenis-aware, with graceful fallback). */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.3 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function getLenis() {
  return lenis;
}
