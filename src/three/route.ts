import * as THREE from 'three';
import type { Track, Turn } from './track';

const DEG = Math.PI / 180;

// A turn of constant radius in the plane of the wall. The channel can never fold on one of these.
// Angles are in degrees and counted as on a unit circle: 90 is the top of the turn, 270 the bottom.
class TurnCurve extends THREE.Curve<THREE.Vector3> {
  private readonly x: number;
  private readonly y: number;
  private readonly radius: number;
  private readonly from: number;
  private readonly sweep: number;

  constructor(turn: Turn) {
    super();
    this.x = turn.x;
    this.y = turn.y;
    this.radius = turn.radius;
    this.from = turn.from * DEG;
    this.sweep = (turn.to - turn.from) * DEG;
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    const angle = this.from + this.sweep * t;
    return target.set(this.x + Math.cos(angle) * this.radius, this.y + Math.sin(angle) * this.radius, 0);
  }
}

/** The route as one curve, measured along its length from the hopper to the exit. */
export function buildRoute(track: Track): THREE.CurvePath<THREE.Vector3> {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (const piece of track.pieces) {
    if ('points' in piece) {
      path.add(new THREE.CatmullRomCurve3(piece.points.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal'));
    } else {
      path.add(new TurnCurve(piece));
    }
  }
  return path;
}
