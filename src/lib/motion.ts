import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export { gsap };

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Registering ScrollTrigger starts a scroll watcher that requests a frame forever and never sleeps,
// so it only happens for features that are allowed to animate.
let registered = false;

export function enableScrollTrigger() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return ScrollTrigger;
}
