import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';
import type { MarbleMachine } from '../three/marbleMachine';
import { trackFor, type Track } from '../three/track';
import TrackSketch from './TrackSketch';

type Props = {
  machineRef: RefObject<MarbleMachine | null>;
  progressRef: RefObject<number>;
};

type MachineFactory = new (canvas: HTMLCanvasElement, host: HTMLElement, track: Track) => MarbleMachine;

export default function MachineStage({ machineRef, progressRef }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);

  // The route depends on the shape of the stage, which is only known once the page is laid out.
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (host) setTrack(trackFor(host.clientWidth, host.clientHeight));
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    let disposed = false;
    let machine: MarbleMachine | null = null;
    let current = trackFor(host.clientWidth, host.clientHeight);
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;

    const build = (Machine: MachineFactory) => {
      machine?.dispose();
      machine = new Machine(canvas, host, current);
      machineRef.current = machine;
      machine.setProgress(progressRef.current);
    };

    // Loaded on demand so the text hero paints before the 3D engine arrives.
    import('../three/marbleMachine')
      .then(({ MarbleMachine: Machine }) => {
        if (disposed) return;
        try {
          build(Machine);
        } catch {
          // Without WebGL the flat sketch stays where it is.
          setFailed(true);
        }
        resizeObserver = new ResizeObserver(() => {
          const next = trackFor(host.clientWidth, host.clientHeight);
          // The route is laid out per stage shape, so a change of shape means a different machine.
          const turned = next !== current;
          if (turned) {
            current = next;
            setTrack(next);
          }
          if (turned && machine) build(Machine);
          else machine?.resize(host.clientWidth, host.clientHeight);
        });
        resizeObserver.observe(host);
        intersectionObserver = new IntersectionObserver(([entry]) => machine?.setVisible(entry.isIntersecting));
        intersectionObserver.observe(host);
      })
      .catch(() => setFailed(true));

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      machine?.dispose();
      machineRef.current = null;
    };
  }, [machineRef, progressRef]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    machineRef.current?.setPointer(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
  };

  return (
    <div
      ref={hostRef}
      className="absolute inset-0"
      onPointerMove={onPointerMove}
      onPointerLeave={() => machineRef.current?.setPointer(0, 0)}
    >
      {track && <TrackSketch track={track} className="absolute inset-0 h-full w-full" />}
      {!failed && <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />}
    </div>
  );
}
