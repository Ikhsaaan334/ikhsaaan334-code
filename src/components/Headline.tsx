import { createElement, useLayoutEffect, useRef, type ReactNode } from 'react';
import { enableScrollTrigger, gsap, prefersReducedMotion } from '../lib/motion';

type Line = { text: string; className?: string };
type Tag = 'h1' | 'h2' | 'h3';

type Props = {
  as: Tag;
  lines: Line[];
  className?: string;
  // Play on load instead of when the heading scrolls into view.
  immediate?: boolean;
};

function renderLine(line: Line): ReactNode {
  return (
    <span className={`block ${line.className ?? ''}`}>
      {line.text.split(' ').map((word, index) => (
        <span key={index}>
          {index > 0 && ' '}
          <span className="reveal-word">
            <span>{word}</span>
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Headline({ as, lines, className = '', immediate = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  // A space between lines keeps the plain text readable as one sentence.
  const content = lines.map(renderLine).flatMap((node, index) => (index ? [' ', node] : [node]));
  // Parents pass a fresh array each render; the animation should only depend on what the heading says.
  const signature = lines.map(line => `${line.className ?? ''}:${line.text}`).join('|');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll<HTMLElement>('.reveal-word > span');
    if (!words.length) return;

    const to = { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.045 };
    let tween: gsap.core.Tween;
    if (immediate) {
      tween = gsap.fromTo(words, { yPercent: 115 }, { ...to, delay: 0.1 });
    } else {
      enableScrollTrigger();
      tween = gsap.fromTo(words, { yPercent: 115 }, {
        ...to,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    }
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(words, { yPercent: 0 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, signature]);

  return createElement(as, { ref, className }, content);
}
