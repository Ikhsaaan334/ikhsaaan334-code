// The routes in world units, shared by the 3D machine and by its flat sketch. Nothing here needs three.js.
//
// A route is a list of pieces: runs, drawn through their points, and turns of constant radius. A route lies in
// one plane. A run starts and ends level, so it meets a turn without a kink, and every piece only ever runs level
// or downhill, the way a marble would. A turn cannot fold the channel as long as its radius stays clear of the
// channel's half width.

export type Point = [number, number];

export type Turn = { x: number; y: number; radius: number; from: number; to: number };

type Run = { points: Point[] };

export type Track = {
  pieces: (Run | Turn)[];
  // Where the scanner, the switch and the bolt stand, given as points on the route.
  stations: Point[];
};

// The hopper's rim reaches this far above and beside the point where the marble starts.
export const HOPPER_HEIGHT = 1.73;
export const HOPPER_REACH = 1.2;

// Announced on the stage canvas once the machine knows where its marble leaves the stage.
export const EXIT_EVENT = 'marble-exit';

// The tablet and desktop routes drop out of the hopper at the top right and run back toward the exit.
const UPPER_RUN: Run = {
  points: [
    [6.6, 1.6],
    [4.6, 1.51],
    [2.8, 1.3],
    [0.6, 1.27],
    [-1.8, 1.19],
    [-4.2, 1.12],
    [-4.8, 1.12],
  ],
};

const TRACKS = {
  // Short and wide: one flat turn, so the machine can be as large as the stage is tall.
  wide: {
    pieces: [
      UPPER_RUN,
      { x: -4.8, y: 0.32, radius: 0.8, from: 90, to: 270 },
      {
        points: [
          [-4.8, -0.48],
          [-4.2, -0.48],
          [-2.4, -0.56],
          [-0.2, -0.64],
          [1.6, -0.76],
          [2.2, -0.84],
          [2.8, -0.84],
        ],
      },
      // The chute bends sixty degrees down, and the marble flies off its end.
      { x: 2.8, y: -1.64, radius: 0.8, from: 90, to: 30 },
    ],
    stations: [
      [1.4, 1.28],
      [-1.6, -0.6],
      [2.2, -0.82],
    ],
  } satisfies Track,
  // Nearly square: the same run, a taller turn and a longer chute.
  mid: {
    pieces: [
      UPPER_RUN,
      { x: -4.8, y: -0.78, radius: 1.9, from: 90, to: 270 },
      {
        points: [
          [-4.8, -2.68],
          [-4.2, -2.68],
          [-2.4, -2.76],
          [-0.2, -2.84],
          [1.6, -2.96],
          [2.2, -3.04],
          [2.8, -3.04],
        ],
      },
      { x: 2.8, y: -4.34, radius: 1.3, from: 90, to: 30 },
    ],
    stations: [
      [1.4, 1.28],
      [-1.6, -2.72],
      [2.2, -3.02],
    ],
  } satisfies Track,
  // Tall: a zigzag from the hopper at the top left, six turns, out near the bottom centre.
  tall: {
    pieces: [
      { points: [[-2.7, 7.0], [-0.9, 6.86], [0.9, 6.74], [1.9, 6.72], [2.5, 6.72]] },
      { x: 2.5, y: 5.87, radius: 0.85, from: 90, to: -90 },
      { points: [[2.5, 5.02], [1.9, 5.02], [0.7, 4.9], [-1.1, 4.76], [-1.9, 4.74], [-2.5, 4.74]] },
      { x: -2.5, y: 3.89, radius: 0.85, from: 90, to: 270 },
      { points: [[-2.5, 3.04], [-1.9, 3.04], [-0.7, 2.92], [1.1, 2.78], [1.9, 2.76], [2.5, 2.76]] },
      { x: 2.5, y: 1.91, radius: 0.85, from: 90, to: -90 },
      { points: [[2.5, 1.06], [1.9, 1.06], [0.7, 0.94], [-1.1, 0.8], [-1.9, 0.78], [-2.5, 0.78]] },
      { x: -2.5, y: -0.07, radius: 0.85, from: 90, to: 270 },
      { points: [[-2.5, -0.92], [-1.9, -0.92], [-0.7, -1.04], [1.1, -1.18], [1.9, -1.2], [2.5, -1.2]] },
      { x: 2.5, y: -2.05, radius: 0.85, from: 90, to: -90 },
      { points: [[2.5, -2.9], [1.9, -2.9], [0.7, -3.02], [-1.1, -3.16], [-1.9, -3.18], [-2.5, -3.18]] },
      { x: -2.5, y: -4.03, radius: 0.85, from: 90, to: 270 },
      { points: [[-2.5, -4.88], [-1.9, -4.88], [-0.7, -5.0], [0.1, -5.08], [0.7, -5.08]] },
      { x: 0.7, y: -5.88, radius: 0.8, from: 90, to: 30 },
    ],
    stations: [
      [1.0, 6.74],
      [0.2, 0.9],
      [-0.3, -5.03],
    ],
  } satisfies Track,
} satisfies Record<string, Track>;

/** Which route fits a stage of this shape. */
export function trackFor(width: number, height: number): Track {
  const shape = width / height;
  if (shape < 1) return TRACKS.tall;
  return shape < 1.9 ? TRACKS.mid : TRACKS.wide;
}

const isTurn = (piece: Run | Turn): piece is Turn => 'radius' in piece;

const DEG = Math.PI / 180;
const STEPS = 24;

// One segment of a centripetal Catmull-Rom spline, the curve three.js draws through the run's points.
function splinePoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const knot = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]) ** 0.5;
  const t1 = knot(p0, p1);
  const t2 = t1 + knot(p1, p2);
  const t3 = t2 + knot(p2, p3);
  const time = t1 + (t2 - t1) * t;
  const mix = (a: Point, b: Point, ta: number, tb: number): Point => [
    ((tb - time) * a[0] + (time - ta) * b[0]) / (tb - ta),
    ((tb - time) * a[1] + (time - ta) * b[1]) / (tb - ta),
  ];
  const a1 = mix(p0, p1, 0, t1);
  const a2 = mix(p1, p2, t1, t2);
  const a3 = mix(p2, p3, t2, t3);
  return mix(mix(a1, a2, 0, t2), mix(a2, a3, t1, t3), t1, t2);
}

/** Points along the route at even parameter steps: enough to draw it flat and to place the stations. */
export function sampleTrack(track: Track): Point[] {
  const first = track.pieces[0];
  if (isTurn(first)) return [];
  const samples: Point[] = [[...first.points[0]]];

  for (const piece of track.pieces) {
    if (isTurn(piece)) {
      const from = piece.from * DEG;
      const sweep = (piece.to - piece.from) * DEG;
      for (let step = 1; step <= STEPS; step++) {
        const angle = from + (sweep * step) / STEPS;
        samples.push([piece.x + Math.cos(angle) * piece.radius, piece.y + Math.sin(angle) * piece.radius]);
      }
    } else {
      const { points } = piece;
      for (let index = 1; index < points.length; index++) {
        const p1 = points[index - 1];
        const p2 = points[index];
        // Beyond either end the spline mirrors the last two points.
        const p0 = points[index - 2] ?? ([2 * p1[0] - p2[0], 2 * p1[1] - p2[1]] as Point);
        const p3 = points[index + 1] ?? ([2 * p2[0] - p1[0], 2 * p2[1] - p1[1]] as Point);
        for (let step = 1; step <= STEPS; step++) samples.push(splinePoint(p0, p1, p2, p3, step / STEPS));
      }
    }
  }
  return samples;
}

/** Index of the sample closest to a point. */
export function nearestSample(samples: Point[], x: number, y: number): number {
  let best = 0;
  let bestDistance = Infinity;
  for (let index = 0; index < samples.length; index++) {
    const distance = Math.hypot(samples[index][0] - x, samples[index][1] - y);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  }
  return best;
}
