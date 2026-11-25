import { useEffect, useRef, useState, type RefObject } from 'react';
import { sections } from '../data';
import { enableScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { EXIT_EVENT } from '../three/track';

type Station = { id: string; label: string; x: number; y: number };

type Props = {
  mainRef: RefObject<HTMLElement | null>;
  wrapRef: RefObject<HTMLDivElement | null>;
};

// The route line needs a free margin beside the content, so it only exists on wide screens.
const RAIL_QUERY = '(min-width: 75rem)';
const RAIL_INSET = 56;

// The marble hands over from the 3D machine to this line and travels down the margin between sections.
export default function RouteTrack({ mainRef, wrapRef }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const basePathRef = useRef<SVGPathElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [width, setWidth] = useState(0);
  const [current, setCurrent] = useState(-1);

  useEffect(() => {
    const svg = svgRef.current;
    const basePath = basePathRef.current;
    const path = pathRef.current;
    if (!svg || !basePath || !path) return;

    let frame = 0;
    let total = 0;
    let mainTop = 0;
    let startY = 0;
    let startX = 0;
    // The stage and its canvas, on which the machine reports where and when its marble leaves the stage.
    let stage: HTMLElement | null = null;
    let machine: HTMLCanvasElement | null = null;
    let takenOver = false;
    let leftAt = -Infinity;
    let seen = 0;
    let jumped = false;
    let points: Station[] = [];

    const build = () => {
      const main = mainRef.current;
      const wrap = wrapRef.current;
      if (!main || !wrap) return;

      const viewportWidth = document.documentElement.clientWidth;
      if (!window.matchMedia(RAIL_QUERY).matches) {
        total = 0;
        points = [];
        setStations([]);
        setWidth(0);
        basePath.setAttribute('d', '');
        path.setAttribute('d', '');
        return;
      }

      const mainRect = main.getBoundingClientRect();
      const height = main.scrollHeight;
      mainTop = mainRect.top + window.scrollY;
      svg.setAttribute('viewBox', `0 0 ${viewportWidth} ${height}`);
      svg.setAttribute('width', String(viewportWidth));
      svg.setAttribute('height', String(height));

      const railX = wrap.getBoundingClientRect().right - RAIL_INSET;
      points = sections.map(section => {
        const target = document.getElementById(section.id);
        const top = target ? target.getBoundingClientRect().top + window.scrollY : 0;
        return { id: section.id, label: section.label, x: railX, y: top - mainTop + 40 };
      });

      const hero = document.getElementById('home');
      const stageElement = wrap.querySelector<HTMLElement>('[data-track-start]');
      const endPanel = wrap.querySelector<HTMLElement>('[data-track-end]');
      if (!hero || !stageElement || !endPanel) return;
      // While the hero is pinned it is fixed to the viewport, so measure it where it rests once the pin ends.
      const heroRect = hero.getBoundingClientRect();
      const spacer = hero.parentElement?.classList.contains('pin-spacer') ? hero.parentElement : hero;
      const stageRect = stageElement.getBoundingClientRect();
      // The line begins where the marble falls out of the machine, which the machine reports on its canvas.
      stage = stageElement;
      machine = stageElement.querySelector('canvas');
      const exit = machine?.dataset.exit;
      const start = {
        x: stageRect.left + stageRect.width * (exit === undefined ? 0.5 : Number(exit)),
        y:
          spacer.getBoundingClientRect().bottom +
          window.scrollY -
          heroRect.height +
          (stageRect.bottom - heroRect.top) -
          mainTop,
      };
      const endRect = endPanel.getBoundingClientRect();
      const end = { x: endRect.left + endRect.width / 2, y: endRect.top + window.scrollY - mainTop };

      const first = points[0];
      const lead = first.y - start.y;
      let d = `M ${start.x} ${start.y} C ${start.x} ${start.y + lead * 0.45}, ${first.x + 24} ${first.y - lead * 0.45}, ${first.x} ${first.y}`;
      for (let index = 1; index < points.length; index++) {
        const previous = points[index - 1];
        const next = points[index];
        const bend = index % 2 ? -24 : 24;
        const span = next.y - previous.y;
        d += ` C ${next.x + bend} ${previous.y + span * 0.45}, ${next.x + bend} ${next.y - span * 0.45}, ${next.x} ${next.y}`;
      }
      const last = points[points.length - 1];
      const tail = end.y - last.y;
      d += ` C ${last.x} ${last.y + tail * 0.45}, ${end.x} ${end.y - tail * 0.45}, ${end.x} ${end.y}`;

      basePath.setAttribute('d', d);
      path.setAttribute('d', d);
      total = path.getTotalLength();
      path.style.strokeDasharray = String(total);
      startY = start.y;
      startX = start.x;
      setStations(points);
      setWidth(viewportWidth);
      draw();
    };

    const draw = () => {
      frame = 0;
      if (!total || !stage) return;
      const scrolled = window.scrollY - mainTop;
      // Stations change as they cross 62% of the viewport.
      const scan = scrolled + window.innerHeight * 0.62;
      // Where the bottom edge of the stage is right now.
      const rest = stage.getBoundingClientRect().bottom + window.scrollY - mainTop;

      // The machine reports when its marble drops out of the stage, and the line takes over from there. With motion
      // reduced, or without a machine (WebGL unavailable), it takes over once the stage's bottom is in view.
      const reported = machine?.dataset.exited;
      const now = prefersReducedMotion() || reported === undefined ? startY - window.innerHeight <= scrolled : reported === 'true';
      // A jump, by a skip link, Page Down or the scrollbar, moves the page more than half a viewport at once.
      jumped = jumped || Math.abs(scrolled - seen) > window.innerHeight / 2;
      seen = scrolled;
      if (now !== takenOver) {
        takenOver = now;
        // From the moment the marble leaves, the head runs in from the edge of the stage. A visitor who arrives
        // at that moment by a jump gets the head where scrolling would have brought it already.
        leftAt = takenOver && !jumped ? scrolled : -Infinity;
        jumped = false;
      }
      if (headRef.current) headRef.current.style.opacity = takenOver ? '1' : '0';

      // The head sticks to the bottom edge of the stage, where the marble fell out, for as long as that edge is
      // below the scan line, and follows the scan line past it. When the stage already ends above the scan line
      // (a hero too short to pin), the head leaves it at twice the pace of the scroll instead of jumping straight
      // to the line.
      const along = takenOver ? Math.max(rest, Math.min(scan, rest + 2 * (scrolled - leftAt))) : rest;

      let low = 0;
      let high = total;
      for (let step = 0; step < 16; step++) {
        const middle = (low + high) / 2;
        if (path.getPointAtLength(middle).y < along) low = middle;
        else high = middle;
      }
      // Above the start of the line the head is not on the line yet. It waits at the stage's bottom edge.
      const head = low ? path.getPointAtLength(low) : { x: startX, y: along };
      path.style.strokeDashoffset = String(total - low);
      headRef.current?.setAttribute('transform', `translate(${head.x} ${head.y})`);

      let active = -1;
      points.forEach((station, index) => {
        if (station.y <= scan) active = index;
      });
      setCurrent(active);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const main = mainRef.current;
    // The machine announces where its marble leaves the stage once it is built and sized.
    main?.addEventListener(EXIT_EVENT, build);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    // Pinning moves everything below the hero; ScrollTrigger reports that. Without motion nothing is pinned.
    const trigger = prefersReducedMotion() ? null : enableScrollTrigger();
    trigger?.addEventListener('refresh', build);
    document.fonts?.ready.then(build);
    build();

    return () => {
      cancelAnimationFrame(frame);
      main?.removeEventListener(EXIT_EVENT, build);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', build);
      trigger?.removeEventListener('refresh', build);
    };
  }, [mainRef, wrapRef]);

  return (
    <>
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-0 hidden wide:block"
      >
        <path ref={basePathRef} fill="none" stroke="var(--color-line)" strokeWidth="2" />
        <path ref={pathRef} fill="none" stroke="var(--color-ink)" strokeWidth="2" />
        {stations.map((station, index) => (
          <circle
            key={station.id}
            cx={station.x}
            cy={station.y}
            r="5"
            strokeWidth="1.5"
            stroke="var(--color-ink)"
            fill={index <= current ? 'var(--color-ink)' : 'var(--color-canvas)'}
          />
        ))}
        <circle
          ref={headRef}
          r="7"
          strokeWidth="1.5"
          stroke="var(--color-ink)"
          fill="var(--color-tangerine)"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 z-20 hidden wide:block">
        {stations.map((station, index) => (
          <a
            key={station.id}
            href={`#${station.id}`}
            aria-current={index === current ? 'true' : undefined}
            style={{ right: width - station.x + 18, top: station.y - 22 }}
            className="pointer-events-auto absolute flex h-11 items-center rounded-full pr-1 pl-3 font-mono text-xs tracking-[0.04em] text-ink-soft uppercase transition-colors duration-200 hover:text-ink"
          >
            {station.label}
          </a>
        ))}
      </div>
    </>
  );
}
