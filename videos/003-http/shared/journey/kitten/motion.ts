import {catRoute, catStart, type CatAction, type CatBeat, type CatPoint} from '../catTiming';
import {lerp, range} from '../timing';

export const kittenScale = 0.92;
export const jumpWindow = {launch: 0.18, land: 0.82} as const;
const strideDistance = 76;
const smooth = (t: number): number => t * t * (3 - 2 * t);
const pulse = (t: number, start: number, end: number): number =>
  Math.sin(Math.PI * range(t, start, end));
const moving = (action: CatAction): boolean => action === 'walk' || action === 'trot';

/** During stance the local paw cancels the body's travel; only the swing lifts it. */
export const pawStep = (phase: number): {x: number; lift: number} => {
  const cycle = (((phase / (2 * Math.PI)) % 1) + 1) % 1;
  const stance = 0.6;
  const reach = (strideDistance * stance) / (2 * kittenScale);
  if (cycle < stance) return {x: lerp(reach, -reach, cycle / stance), lift: 0};
  const swing = (cycle - stance) / (1 - stance);
  return {x: lerp(-reach, reach, smooth(swing)), lift: Math.sin(swing * Math.PI) * 15};
};

type Pose = {
  readonly walking: number;
  readonly lying: number;
  readonly sleeping: number;
  readonly stretch: number;
  readonly paw: number;
  readonly grooming: number;
  readonly yawn: number;
  readonly alert: number;
  readonly crouch: number;
};
const rest: Pose = {
  walking: 0,
  lying: 0,
  sleeping: 0,
  stretch: 0,
  paw: 0,
  grooming: 0,
  yawn: 0,
  alert: 0,
  crouch: 0,
};

const poseFor = (action: CatAction, local: number, duration: number): Pose => {
  const t = range(local, 0, duration);
  switch (action) {
    case 'walk':
    case 'trot':
      return {...rest, walking: Math.min(1, local / 300, (duration - local) / 350)};
    case 'jump':
      return {
        ...rest,
        crouch: pulse(t, 0, jumpWindow.launch) * 0.8 + pulse(t, jumpWindow.land, 1) * 0.7,
      };
    case 'loaf':
      return {...rest, lying: 1};
    case 'sleep':
      return {...rest, lying: 1, sleeping: smooth(range(local, 100, 1300))};
    case 'wake':
      return {
        ...rest,
        lying: 1 - smooth(range(t, 0.1, 0.8)),
        sleeping: 1 - smooth(range(t, 0, 0.35)),
        stretch: pulse(t, 0.35, 1) * 0.25,
      };
    case 'stretch':
      return {...rest, stretch: pulse(t, 0.08, 0.95)};
    case 'sniff':
      return {...rest, crouch: pulse(t, 0.08, 0.92) * 0.65};
    case 'tap':
      return {...rest, paw: Math.max(pulse(t, 0.15, 0.47), pulse(t, 0.53, 0.86))};
    case 'groom':
      return {
        ...rest,
        grooming: pulse(t, 0.05, 0.96),
        paw: pulse(t, 0.05, 0.96) * (0.73 + Math.sin(t * 6 * Math.PI) * 0.18),
      };
    case 'yawn':
      return {...rest, yawn: pulse(t, 0.12, 0.88), lying: smooth(range(t, 0.6, 1))};
    case 'alert':
      return {...rest, alert: pulse(t, 0.03, 0.85)};
    case 'track':
    case 'watch':
      return rest;
  }
};

const blendPose = (from: Pose, to: Pose, t: number): Pose => ({
  walking: lerp(from.walking, to.walking, t),
  lying: lerp(from.lying, to.lying, t),
  sleeping: lerp(from.sleeping, to.sleeping, t),
  stretch: lerp(from.stretch, to.stretch, t),
  paw: lerp(from.paw, to.paw, t),
  grooming: lerp(from.grooming, to.grooming, t),
  yawn: lerp(from.yawn, to.yawn, t),
  alert: lerp(from.alert, to.alert, t),
  crouch: lerp(from.crouch, to.crouch, t),
});

export type KittenState = Pose & {
  readonly x: number;
  readonly y: number;
  readonly groundY: number;
  readonly facing: number;
  readonly phase: number;
  readonly gaze: CatPoint;
  readonly time: number;
  readonly airborne: number;
  readonly action: CatAction;
  readonly beatIndex: number;
  readonly flight: number;
  readonly landingReach: number;
  readonly jumpPitch: number;
};

const heading = (beat: CatBeat, from: CatPoint): number => {
  const dx =
    moving(beat.action) || beat.action === 'jump'
      ? beat.at[0] - from[0]
      : beat.look[0] - beat.at[0];
  return dx < 0 ? -1 : 1;
};

/** Pure timeline sampling: walking phase comes from distance, so paws stop with the body. */
export const sampleKitten = (time: number): KittenState => {
  const found = catRoute.findIndex((beat) => time < beat.end);
  const index = found < 0 ? catRoute.length - 1 : found;
  const beat: CatBeat = catRoute[index] ?? catRoute[0];
  const previous: CatBeat | undefined = catRoute[index - 1];
  const beforePrevious = catRoute[index - 2];
  const start = previous?.end ?? 0;
  const from = previous?.at ?? catStart;
  const duration = beat.end - start,
    local = Math.max(0, time - start);
  const t = range(local, 0, duration);
  const jumping = beat.action === 'jump';
  const air = jumping ? range(t, jumpWindow.launch, jumpWindow.land) : 0;
  const flight = jumping
    ? smooth(range(t, jumpWindow.launch, 0.27)) * (1 - smooth(range(t, 0.72, jumpWindow.land)))
    : 0;
  const travel = beat.action === 'jump' ? smooth(air) : smooth(t);
  // On an upward jump, clear the face of the panel before moving onto its top edge.
  const horizontalTravel =
    beat.action === 'jump' && beat.at[1] < from[1] - 100 ? travel ** 3 : travel;
  const groundY = lerp(from[1], beat.at[1], travel);
  const length = Math.hypot(beat.at[0] - from[0], beat.at[1] - from[1]);
  const arc = 4 * air * (1 - air) * Math.min(150, 65 + length * 0.065);
  const targetPose = poseFor(beat.action, local, duration);
  const previousPose = previous
    ? poseFor(
        previous.action,
        previous.end - (beforePrevious?.end ?? 0),
        previous.end - (beforePrevious?.end ?? 0),
      )
    : rest;
  const pose = blendPose(previousPose, targetPose, smooth(range(local, 0, 350)));
  const facing = lerp(
    previous ? heading(previous, beforePrevious?.at ?? catStart) : 1,
    heading(beat, from),
    smooth(range(local, 0, 650)),
  );
  const priorLength = catRoute.slice(0, index).reduce((sum, b, i) => {
    const p = catRoute[i - 1]?.at ?? catStart;
    return sum + Math.hypot(b.at[0] - p[0], b.at[1] - p[1]);
  }, 0);
  const gazeT = smooth(range(local, 0, 900));
  const targetLook = jumping ? beat.at : beat.look;
  const oldLook = previous
    ? previous.action === 'jump'
      ? previous.at
      : previous.look
    : targetLook;
  const follow = beat.action === 'track' ? Math.sin(t * Math.PI) : 0;
  const gaze: CatPoint = [
    lerp(oldLook[0], targetLook[0], gazeT) + Math.sin(local / 1100) * 110 * follow,
    lerp(oldLook[1], targetLook[1], gazeT) + Math.sin(local / 1800) * 18 * follow,
  ];
  return {
    ...pose,
    x: lerp(from[0], beat.at[0], horizontalTravel),
    y: groundY - arc,
    groundY,
    facing,
    phase: ((priorLength + length * travel) / strideDistance) * Math.PI * 2,
    gaze,
    time,
    airborne: Math.sin(air * Math.PI),
    action: beat.action,
    beatIndex: index,
    flight,
    landingReach: jumping ? smooth(range(air, 0.55, 0.9)) : 0,
    jumpPitch: lerp(-10, 9, air) * facing * flight,
  };
};
