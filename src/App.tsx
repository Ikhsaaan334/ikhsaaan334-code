import { useEffect, useRef } from 'react';
import Header from './components/Header';
import Menu, { type MenuHandle } from './components/Menu';
import RouteTrack from './components/RouteTrack';
import { initSmoothScroll, scrollToSection } from './lib/scroll';
import { enableScrollTrigger, prefersReducedMotion } from './lib/motion';
import type { MarbleMachine } from './three/marbleMachine';
import About from './sections/About';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import Hero from './sections/Hero';
import Journey from './sections/Journey';
import Projects from './sections/Projects';
import Stack from './sections/Stack';

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<MenuHandle>(null);
  const machineRef = useRef<MarbleMachine | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const destroy = initSmoothScroll();
    // Font loading shifts every section, so pinned and reveal positions are measured again once it is done.
    document.fonts?.ready.then(() => {
      if (!prefersReducedMotion()) enableScrollTrigger().refresh();
    });
    return destroy;
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const origin = event.target as Element | null;
      const link = origin?.closest?.('a[href^="#"]');
      // The skip link keeps its native behaviour so that focus follows the jump.
      if (!link || link.classList.contains('skip-link')) return;
      const id = link.getAttribute('href')?.slice(1);
      if (!id || !document.getElementById(id)) return;
      event.preventDefault();
      scrollToSection(id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Menu menuRef={menuRef} />
      <Header onMenu={trigger => menuRef.current?.open(trigger)} />

      <main ref={mainRef} className="relative">
        <div ref={wrapRef} className="relative z-10 px-6 md:px-12 wide:pr-[200px]">
          <Hero
            machineRef={machineRef}
            progressRef={progressRef}
          />
          <About />
          <Journey />
          <Stack />
          <Projects />
          <Certifications />
          <Contact />
        </div>
        <RouteTrack mainRef={mainRef} wrapRef={wrapRef} />
      </main>
    </>
  );
}
