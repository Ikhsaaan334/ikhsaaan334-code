import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { buildRoute } from './route';
import { EXIT_EVENT, type Point, type Track, nearestSample } from './track';

const STAGE = 0x17191e;
const CREAM = 0xf4f3ef;
const CYAN = 0x00add8;
const TANGERINE = 0xff6a2b;
const DARK = 0x2b2f37;

const HALF_WIDTH = 0.36;
const WALL = 0.17;
const MARBLE_RADIUS = 0.27;
const SAMPLES = 320;

// Share of the scroll the marble waits at the start before the run, and where the run hands over to the page.
const DROP_END = 0.08;
const RUN_END = 0.9;

// How much of the frame the machine may fill, how far the camera drifts closer over the run, and how high it
// sits above the middle of the machine.
const FRAME_FILL = 0.94;
const DOLLY_IN = 0.5;
const CAMERA_LIFT = 0.2;

// The bolt at the last station: how long it is and how far it is drawn up into its housing.
const BOLT_LENGTH = 1.15;
const BOLT_LIFT = 0.8;

// Off the end of the track the marble carries on the way the track points (drift) and drops faster and faster.
const FALL_DRIFT = 0.35;
const FALL_DROP = 2.6;
// The marble rides this far in front of the channel's centre line.
const MARBLE_LIFT = 0.17;

// (across, up) as fractions of HALF_WIDTH and WALL. The channel opens toward the camera.
const CHANNEL_PROFILE: [number, number][] = [
  [-1, 1],
  [-0.86, 0.55],
  [-0.62, 0],
  [0, -0.12],
  [0.62, 0],
  [0.86, 0.55],
  [1, 1],
];

// Eases the run so the marble slows down as it reaches each station instead of sailing past it.
function slowed(u: number, stations: number[]) {
  let value = u;
  for (const station of stations) value -= 0.045 * Math.exp(-(((u - station) / 0.06) ** 2));
  return THREE.MathUtils.clamp(value, 0, 1);
}

// Unit vector across the route, in the plane of the wall.
function sideOf(tangent: THREE.Vector3, out: THREE.Vector3) {
  return out.set(tangent.y, -tangent.x, 0).normalize();
}

function buildChannel(curve: THREE.Curve<THREE.Vector3>, depthOffset = 0) {
  const count = CHANNEL_PROFILE.length;
  const positions = new Float32Array(SAMPLES * count * 3);
  const uvs = new Float32Array(SAMPLES * count * 2);
  const index: number[] = [];
  const point = new THREE.Vector3();
  const side = new THREE.Vector3();

  for (let i = 0; i < SAMPLES; i++) {
    const u = i / (SAMPLES - 1);
    curve.getPointAt(u, point);
    sideOf(curve.getTangentAt(u), side);
    for (let j = 0; j < count; j++) {
      const [across, up] = CHANNEL_PROFILE[j];
      const k = i * count + j;
      positions[k * 3] = point.x + side.x * across * HALF_WIDTH;
      positions[k * 3 + 1] = point.y + side.y * across * HALF_WIDTH;
      positions[k * 3 + 2] = point.z + up * WALL + depthOffset;
      uvs[k * 2] = u;
      uvs[k * 2 + 1] = j / (count - 1);
    }
  }
  for (let i = 0; i < SAMPLES - 1; i++) {
    for (let j = 0; j < count - 1; j++) {
      const a = i * count + j;
      const b = a + count;
      index.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// Every vertex of an object's meshes, in world units. There are a few thousand, few enough for the camera to be
// placed against all of them instead of against a bounding box, whose corners are mostly empty space.
function verticesOf(object: THREE.Object3D, into: number[]) {
  object.updateMatrixWorld(true);
  const vertex = new THREE.Vector3();
  object.traverse(child => {
    const position = (child as THREE.Mesh).geometry?.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!position) return;
    for (let index = 0; index < position.count; index++) {
      vertex.fromBufferAttribute(position, index).applyMatrix4(child.matrixWorld);
      into.push(vertex.x, vertex.y, vertex.z);
    }
  });
}

export class MarbleMachine {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  private readonly route: THREE.CurvePath<THREE.Vector3>;
  private readonly length: number;
  private readonly environment: THREE.WebGLRenderTarget;
  private readonly marble: THREE.Mesh;
  private readonly scanner: THREE.Mesh;
  private readonly lever: THREE.Group;
  private readonly bolt: THREE.Mesh;
  private readonly boltY: number;
  private readonly stations: number[];
  private readonly startPoint: THREE.Vector3;
  private readonly reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly pointer = new THREE.Vector2();
  private readonly parallax = new THREE.Vector2();
  private readonly marblePosition = new THREE.Vector3();
  private readonly tangent = new THREE.Vector3();
  private readonly side = new THREE.Vector3();
  private readonly look = new THREE.Vector3();
  private readonly exit = new THREE.Vector3();
  private readonly ndc = new THREE.Vector3();
  private below = false;
  // Every vertex of the machine, x y z, with the lever thrown both ways and the bolt both shot and drawn.
  private readonly frame: Float32Array;
  private progress = 0;
  private travelled = 0;
  private raf = 0;
  private visible = true;
  private distance = 12;

  constructor(canvas: HTMLCanvasElement, host: HTMLElement, track: Track) {
    this.canvas = canvas;
    // Reported from the start, so the page can tell a machine at rest from no machine at all.
    this.canvas.dataset.exited = 'false';
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setClearColor(STAGE, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    // Shadows stay on the renderer's default setting; this release of three.js has only that one soft mode.
    this.renderer.shadowMap.enabled = true;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    this.scene.environment = this.environment.texture;
    this.scene.environmentIntensity = 0.45;

    this.scene.add(new THREE.HemisphereLight(CREAM, STAGE, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-4.5, 6, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { near: 1, far: 40 });
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    this.scene.add(key);

    const cream = new THREE.MeshPhysicalMaterial({ color: CREAM, roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.2 });
    const cyan = new THREE.MeshPhysicalMaterial({
      color: CYAN,
      roughness: 0.36,
      clearcoat: 0.8,
      clearcoatRoughness: 0.22,
      side: THREE.DoubleSide,
    });
    const dark = new THREE.MeshStandardMaterial({ color: DARK, roughness: 0.62 });
    const orange = new THREE.MeshPhysicalMaterial({ color: TANGERINE, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 });

    const wall = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), new THREE.MeshStandardMaterial({ color: STAGE, roughness: 1 }));
    wall.position.z = -1.1;
    wall.receiveShadow = true;
    this.scene.add(wall);

    this.route = buildRoute(track);
    this.length = this.route.getLength();
    this.startPoint = this.route.getPointAt(0);

    // Stations are given as places on the route. Find how far along it each one is.
    const samples: Point[] = [];
    for (let index = 0; index <= 400; index++) {
      const point = this.route.getPointAt(index / 400);
      samples.push([point.x, point.y]);
    }
    this.stations = track.stations.map(([x, y]) => nearestSample(samples, x, y) / 400);

    const parts = new THREE.Group();
    this.scene.add(parts);

    const channel = new THREE.Mesh(buildChannel(this.route), cyan);
    channel.castShadow = true;
    channel.receiveShadow = true;
    parts.add(channel);
    parts.add(new THREE.Mesh(buildChannel(this.route, -0.1), dark));

    // One rail on each lip of the channel.
    const point = new THREE.Vector3();
    const side = new THREE.Vector3();
    for (const sign of [-1, 1]) {
      const railPoints: THREE.Vector3[] = [];
      for (let i = 0; i < 110; i++) {
        const u = i / 109;
        this.route.getPointAt(u, point);
        sideOf(this.route.getTangentAt(u), side);
        railPoints.push(new THREE.Vector3(point.x + side.x * sign * HALF_WIDTH, point.y + side.y * sign * HALF_WIDTH, WALL));
      }
      const rail = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPoints, false, 'centripetal'), 300, 0.035, 10),
        cream,
      );
      rail.castShadow = true;
      parts.add(rail);
    }

    // Struts hold the run off the back wall.
    for (const u of [0.1, 0.33, 0.62, 0.78, 0.95]) {
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1, 14), dark);
      strut.rotation.x = Math.PI / 2;
      const at = this.route.getPointAt(u);
      strut.position.set(at.x, at.y, -0.6);
      this.scene.add(strut);
    }

    // Hopper the marble drops out of.
    const hopper = new THREE.Group();
    const shell = cream.clone();
    shell.side = THREE.DoubleSide;
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 0.3, 1.25, 56, 1, true), shell);
    cone.position.y = 1.05;
    cone.castShadow = true;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.055, 16, 72), cyan);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.675;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.42, 32, 1, true), shell);
    neck.position.y = 0.2;
    hopper.add(cone, rim, neck);
    hopper.position.set(this.startPoint.x, this.startPoint.y, -0.05);
    parts.add(hopper);

    // Station 1: a scanner ring the marble passes through.
    const scannerAt = this.frameAt(this.stations[0]);
    this.scanner = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.065, 20, 64), cream);
    this.scanner.position.copy(scannerAt.point);
    this.scanner.lookAt(scannerAt.point.clone().add(scannerAt.tangent));
    this.scanner.castShadow = true;
    parts.add(this.scanner);

    // Station 2: a switch whose lever flips as the marble goes by.
    const switchAt = this.frameAt(this.stations[1]);
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.5, 0.55, 4, 0.1), dark);
    base.position.copy(switchAt.point).add(new THREE.Vector3(0, -0.62, -0.08));
    base.castShadow = true;
    parts.add(base);
    this.lever = new THREE.Group();
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.9, 16), cream);
    arm.rotation.z = Math.PI / 2;
    arm.position.x = 0.45;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.13, 32, 20), cyan);
    knob.position.x = 0.9;
    this.lever.add(arm, knob);
    this.lever.position.copy(switchAt.point).add(new THREE.Vector3(0, -0.37, 0.22));
    this.lever.rotation.z = -0.7;

    // Station 3: a bolt that is drawn up into its housing before the marble reaches it.
    const boltAt = this.frameAt(this.stations[2]);
    this.bolt = new THREE.Mesh(new RoundedBoxGeometry(0.5, BOLT_LENGTH, 0.2, 4, 0.08), cyan);
    this.boltY = boltAt.point.y + 0.125;
    this.bolt.position.set(boltAt.point.x, this.boltY, 0.3);
    this.bolt.castShadow = true;
    const housing = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.4, 0.46, 4, 0.08), dark);
    housing.position.set(boltAt.point.x, boltAt.point.y + 0.6, 0.25);
    housing.castShadow = true;
    parts.add(housing);

    this.marble = new THREE.Mesh(new THREE.SphereGeometry(MARBLE_RADIUS, 48, 32), orange);
    this.marble.castShadow = true;
    this.scene.add(this.marble);

    const frame: number[] = [];
    verticesOf(parts, frame);
    // The bolt sits in front of the marble's path, so when drawn its lower end has to clear the marble's crown.
    for (const [tilt, lift] of [
      [-0.7, 0],
      [0.7, BOLT_LIFT],
    ]) {
      this.lever.rotation.z = tilt;
      this.bolt.position.y = this.boltY + lift;
      verticesOf(this.lever, frame);
      verticesOf(this.bolt, frame);
    }
    this.lever.rotation.z = -0.7;
    this.bolt.position.y = this.boltY;
    parts.add(this.lever, this.bolt);
    this.frame = new Float32Array(frame);

    // The key light's shadow has to cover the whole machine, whichever route is on stage.
    const reach = new THREE.Box3().setFromObject(parts).getSize(new THREE.Vector3()).length() / 2;
    Object.assign(key.shadow.camera, { left: -reach, right: reach, top: reach, bottom: -reach });
    key.shadow.camera.updateProjectionMatrix();

    this.resize(host.clientWidth, host.clientHeight);
    this.update();
  }

  private frameAt(u: number) {
    const point = this.route.getPointAt(u);
    const tangent = this.route.getTangentAt(u).normalize();
    return { point, tangent };
  }

  setProgress(progress: number) {
    this.progress = THREE.MathUtils.clamp(progress, 0, 1);
    this.invalidate();
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
    this.invalidate();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) this.invalidate();
    else {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  resize(width: number, height: number) {
    if (!width || !height) return;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.distance = this.fit(width / height);

    // Tell the page where the marble leaves the stage, as a share of the stage's width: the point of its fall at
    // which its underside passes the bottom edge, which is the moment the page's route line takes over.
    this.placeCamera(1);
    for (let step = 0; step <= 40; step++) {
      this.fallen(step / 40, this.exit);
      this.ndc.copy(this.exit).setY(this.exit.y - MARBLE_RADIUS).project(this.camera);
      if (this.ndc.y < -1) break;
    }
    this.canvas.dataset.exit = ((this.exit.project(this.camera).x + 1) / 2).toFixed(4);
    this.canvas.dispatchEvent(new Event(EXIT_EVENT, { bubbles: true }));
    this.invalidate();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.scene.traverse(object => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach(entry => entry.dispose());
      else material?.dispose();
    });
    this.environment.dispose();
    this.renderer.dispose();
  }

  private invalidate() {
    if (!this.raf && this.visible) this.raf = requestAnimationFrame(this.loop);
  }

  private readonly loop = () => {
    this.raf = 0;
    if (!this.visible) return;
    // The camera drifts toward the pointer; keep drawing until it has settled.
    const settling = !this.reduced && this.parallax.distanceToSquared(this.pointer) > 1e-6;
    if (settling) this.parallax.lerp(this.pointer, 0.08);
    this.update();
    if (settling) this.raf = requestAnimationFrame(this.loop);
  };

  // The closest camera that keeps every vertex of the machine in frame to the end of the run, and the point it
  // has to aim at to do so. A vertex at depth z, this far along an axis from the aim, is in frame when its
  // distance to the aim is within spread × (reach − z). Halving the reach and intersecting what every vertex
  // then allows for the aim says whether a camera can work there.
  private fit(aspect: number) {
    const slope = Math.tan((this.camera.fov * Math.PI) / 360);
    const aim = (axis: number, spread: number, reach: number) => {
      let low = -Infinity;
      let high = Infinity;
      for (let index = axis; index < this.frame.length; index += 3) {
        // Each vertex is stored as x, y, z, so depth sits two places after x and one after y.
        const depth = this.frame[index + 2 - axis];
        const value = this.frame[index];
        const room = spread * (reach - depth);
        low = Math.max(low, value - room);
        high = Math.min(high, value + room);
        if (low > high) return null;
      }
      return (low + high) / 2;
    };
    const fits = (reach: number) => {
      const x = aim(0, FRAME_FILL * slope * aspect, reach);
      const y = aim(1, FRAME_FILL * slope, reach);
      if (x === null || y === null) return false;
      this.look.set(x, y, 0);
      return true;
    };

    let tooClose = 1;
    let farEnough = 80;
    for (let step = 0; step < 30; step++) {
      const middle = (tooClose + farEnough) / 2;
      if (fits(middle)) farEnough = middle;
      else tooClose = middle;
    }
    fits(farEnough);
    // The camera ends the run closer than it starts, so it sets off that much further back.
    return farEnough + DOLLY_IN;
  }

  private placeCamera(progress: number) {
    this.camera.position.set(
      this.look.x + this.parallax.x * 0.55,
      this.look.y + CAMERA_LIFT + this.parallax.y * 0.4,
      this.distance - progress * DOLLY_IN,
    );
    this.camera.lookAt(this.look);
    this.camera.updateMatrixWorld();
  }

  // Where the marble is once it has left the end of the track, this far into its fall.
  private fallen(k: number, target: THREE.Vector3) {
    this.route.getPointAt(1, target);
    this.route.getTangentAt(1, this.tangent);
    target.addScaledVector(this.tangent, FALL_DRIFT * k);
    target.y -= FALL_DROP * k * k;
    target.z += MARBLE_LIFT;
    return target;
  }

  private update() {
    const p = this.progress;
    const position = this.marblePosition;
    let stationU = 0;

    if (p < DROP_END) {
      // The marble waits just below the hopper, in plain sight from the first frame.
      position.copy(this.startPoint);
      position.z += MARBLE_LIFT;
      this.travelled = 0;
    } else if (p < RUN_END) {
      stationU = (p - DROP_END) / (RUN_END - DROP_END);
      const u = slowed(stationU, this.stations);
      this.route.getPointAt(u, position);
      this.route.getTangentAt(u, this.tangent);
      position.z += MARBLE_LIFT;
      // Rolling without slipping: angle is distance over radius, around the axis across the track.
      const travelled = u * this.length;
      sideOf(this.tangent, this.side);
      this.marble.rotateOnWorldAxis(this.side, -(travelled - this.travelled) / MARBLE_RADIUS);
      this.travelled = travelled;
    } else {
      this.fallen((p - RUN_END) / (1 - RUN_END), position);
      stationU = 1;
    }
    this.marble.position.copy(position);
    this.marble.visible = p < 0.99;

    const passing = (station: number) => THREE.MathUtils.smoothstep(stationU, station - 0.045, station + 0.045);
    const [scanner, switchStation, bolt] = this.stations;
    const scan = passing(scanner);
    this.scanner.scale.setScalar(1 + 0.12 * Math.sin(Math.PI * scan));
    this.lever.rotation.z = -0.7 + 1.4 * passing(switchStation);
    this.bolt.position.y = this.boltY + BOLT_LIFT * passing(bolt);

    this.placeCamera(p);

    // Tell the page's route line when the marble has dropped out of the stage, so that it can take over there.
    const below = p >= RUN_END && this.ndc.copy(position).setY(position.y - MARBLE_RADIUS).project(this.camera).y < -1;
    if (below !== this.below) {
      this.below = below;
      this.canvas.dataset.exited = String(below);
      this.canvas.dispatchEvent(new Event(EXIT_EVENT, { bubbles: true }));
    }

    this.renderer.render(this.scene, this.camera);
  }
}
