import { useMemo } from 'react';
import { HOPPER_HEIGHT, HOPPER_REACH, nearestSample, sampleTrack, type Point, type Track } from '../three/track';

const CREAM = '#f4f3ef';
const CYAN = '#00add8';
const DARK = '#2b2f37';
const TANGERINE = '#ff6a2b';

// The same sizes the 3D machine is built with.
const CHANNEL_WIDTH = 0.72;
const MARBLE_RADIUS = 0.27;
const LEVER_TILT = -0.7;
const MARGIN = 0.4;

const pair = ([x, y]: Point) => `${x.toFixed(3)},${y.toFixed(3)}`;

function drawTrack(track: Track) {
  const samples = sampleTrack(track);
  const start = samples[0];
  let left = start[0] - HOPPER_REACH;
  let right = start[0] + HOPPER_REACH;
  let bottom = start[1];
  for (const [x, y] of samples) {
    left = Math.min(left, x - CHANNEL_WIDTH);
    right = Math.max(right, x + CHANNEL_WIDTH);
    bottom = Math.min(bottom, y - CHANNEL_WIDTH);
  }
  const top = start[1] + HOPPER_HEIGHT;

  return {
    viewBox: `${left - MARGIN} ${-(top + MARGIN)} ${right - left + 2 * MARGIN} ${top - bottom + 2 * MARGIN}`,
    route: samples.map(pair).join(' '),
    start,
    // The stations stand on the route, at the sample nearest to where the track places them.
    stations: track.stations.map(([x, y]) => samples[nearestSample(samples, x, y)]),
    hopper: (
      [
        [start[0] - 1.15, start[1] + 1.675],
        [start[0] + 1.15, start[1] + 1.675],
        [start[0] + 0.3, start[1] + 0.41],
        [start[0] + 0.3, start[1] - 0.01],
        [start[0] - 0.3, start[1] - 0.01],
        [start[0] - 0.3, start[1] + 0.41],
      ] as Point[]
    )
      .map(pair)
      .join(' '),
  };
}

type Props = { track: Track; className?: string };

// The machine's route drawn flat. It shows while the 3D engine loads and stays if WebGL is unavailable.
export default function TrackSketch({ track, className }: Props) {
  const sketch = useMemo(() => drawTrack(track), [track]);
  const [scanner, lever, bolt] = sketch.stations;
  const knob: Point = [lever[0] + 0.9 * Math.cos(LEVER_TILT), lever[1] - 0.37 + 0.9 * Math.sin(LEVER_TILT)];

  return (
    <svg viewBox={sketch.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true" className={className}>
      {/* The route is drawn the right way up, so this group alone flips it for the screen. */}
      <g transform="scale(1 -1)">
        <polyline
          points={sketch.route}
          fill="none"
          stroke={CYAN}
          strokeWidth={CHANNEL_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points={sketch.hopper} fill={CREAM} />
        <circle cx={scanner[0]} cy={scanner[1]} r={0.66} fill="none" stroke={CREAM} strokeWidth={0.12} />
        <rect x={lever[0] - 0.475} y={lever[1] - 0.87} width={0.95} height={0.5} rx={0.1} fill={DARK} />
        <line
          x1={lever[0]}
          y1={lever[1] - 0.37}
          x2={knob[0]}
          y2={knob[1]}
          stroke={CREAM}
          strokeWidth={0.08}
          strokeLinecap="round"
        />
        <circle cx={knob[0]} cy={knob[1]} r={0.13} fill={CYAN} />
        {/* Outlined, because the bolt crosses the channel and is the same colour as it. */}
        <rect x={bolt[0] - 0.25} y={bolt[1] - 0.45} width={0.5} height={1.15} rx={0.08} fill={CYAN} stroke={DARK} strokeWidth={0.07} />
        <rect x={bolt[0] - 0.4} y={bolt[1] + 0.4} width={0.8} height={0.4} rx={0.08} fill={DARK} />
        <circle cx={sketch.start[0]} cy={sketch.start[1]} r={MARBLE_RADIUS} fill={TANGERINE} />
      </g>
    </svg>
  );
}
