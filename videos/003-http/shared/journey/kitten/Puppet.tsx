import React from 'react';
import {kittenInk as ink} from './design';
import {kittenScale, pawStep, type KittenState} from './motion';
import {lerp} from '../timing';
import {Eye} from './Eye';

const clamp = (value: number, max: number): number => Math.max(-max, Math.min(max, value));
const stroke = {
  stroke: ink.outline,
  strokeWidth: 4.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const Face: React.FC<{state: KittenState; x: number; y: number}> = ({state: s, x, y}) => {
  const dx = s.gaze[0] - s.x - x * kittenScale;
  const dy = s.gaze[1] - s.y - y * kittenScale;
  const distance = Math.hypot(dx, dy, 150);
  const gazeX = (dx / distance) * 8;
  const gazeY = (dy / distance) * 7;
  const dilation = 0.25 * Math.sin(s.time / 1700) + s.alert * 1.15 + s.flight * 0.7;
  const blinkPhase = (s.time + 700) % 4700;
  const blink = Math.max(0, 1 - Math.abs(blinkPhase - 2380) / 110);
  const open = (1 - blink) * (1 - s.sleeping) * (1 - s.yawn * 0.94) * (1 - s.grooming * 0.5);
  const tilt = gazeX * 0.8 + s.sleeping * 13 * s.facing + s.grooming * Math.sin(s.time / 180) * 7;
  const twitch =
    Math.max(0, Math.sin(s.time / 310)) *
    Math.max(0, 1 - Math.abs((s.time % 7300) - 6300) / 500) *
    5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <path
        d={`M-64 -18 Q-74 -45 -63 ${-70 - twitch} Q-61 -78 -31 -48 Q-3 -59 27 -49 Q55 ${-80 - twitch} 63 -68 Q73 -42 66 -17 Q79 9 63 32 Q42 53 1 54 Q-40 55 -62 32 Q-80 12 -64 -18Z`}
        fill={ink.fur}
        {...stroke}
      />
      <path
        d="M-59 -59 Q-57 -64 -40 -45 L-60 -33Z M42 -44 Q56 -62 58 -59 L61 -34Z"
        fill={ink.pink}
      />
      <path d="M-59 -17 Q-50 -43 -31 -45 Q-47 -23 -59 -17" fill={ink.shade} opacity={0.7} />
      <path
        d="M-10 -51 Q-7 -40 -4 -35 M3 -51 Q5 -44 6 -41"
        fill="none"
        stroke={ink.patch}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path d="M-68 0 l-7 4 7 2 M69 1 l7 4 -8 2" fill={ink.fur} {...stroke} strokeWidth={2.5} />
      <ellipse cx={-47} cy={25} rx={13} ry={7} fill={ink.blush} opacity={0.65} />
      <ellipse cx={47} cy={25} rx={13} ry={7} fill={ink.blush} opacity={0.65} />
      <Eye x={-27} gazeX={gazeX} gazeY={gazeY} open={open} dilation={dilation} />
      <Eye x={27} gazeX={gazeX} gazeY={gazeY} open={open} dilation={dilation} />
      <path d="M-5 27 Q0 23 5 27 L0 32Z" fill={ink.nose} stroke={ink.outline} strokeWidth={1.7} />
      {s.yawn > 0.15 ? (
        <g>
          <ellipse cy={38} rx={5 + 6 * s.yawn} ry={3 + 13 * s.yawn} fill={ink.eye} />
          <ellipse cy={44} rx={5 * s.yawn} ry={5 * s.yawn} fill={ink.tongue} />
        </g>
      ) : (
        <path d="M0 32 v4 q-6 9 -12 1 M0 36 q6 9 12 1" fill="none" {...stroke} strokeWidth={2.3} />
      )}
      {s.grooming > 0.1 ? (
        <path d="M-3 40 Q0 52 6 43" fill={ink.tongue} opacity={s.grooming} />
      ) : null}
      <g stroke={ink.outline} strokeWidth={1.8} strokeLinecap="round" opacity={0.75}>
        <path d="M-49 30 l-23 -2 M-48 36 l-20 4 M49 30 l23 -2 M48 36 l20 4" />
      </g>
    </g>
  );
};

const Foot: React.FC<{x: number; y: number; hipX: number; hipY: number; rear?: boolean}> = ({
  x,
  y,
  hipX,
  hipY,
  rear = false,
}) => (
  <g>
    <path
      d={`M${hipX} ${hipY} Q${x - 4} ${y - 16} ${x} ${y - 3}`}
      fill="none"
      stroke={ink.outline}
      strokeWidth={21}
      strokeLinecap="round"
    />
    <path
      d={`M${hipX} ${hipY} Q${x - 4} ${y - 16} ${x} ${y - 3}`}
      fill="none"
      stroke={rear ? ink.shade : ink.fur}
      strokeWidth={14}
      strokeLinecap="round"
    />
    <ellipse
      cx={x + 3}
      cy={y - 6}
      rx={15}
      ry={9}
      fill={rear ? ink.shade : ink.fur}
      {...stroke}
      strokeWidth={3}
    />
    <path
      d={`M${x + 4} ${y - 7} v4 m5 -4 v4`}
      stroke={ink.patch}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </g>
);

/** A hand-drawn SVG rig: facial shapes remain round while the body turns in screen space. */
export const KittenPuppet: React.FC<{state: KittenState}> = ({state: s}) => {
  const f = s.facing,
    walk = s.walking,
    lie = s.lying,
    flight = s.flight;
  const breath = Math.sin(s.time / (s.sleeping > 0.5 ? 750 : 470)) * 0.65;
  const bob = Math.abs(Math.sin(s.phase)) * 2.5 * walk;
  const bodyX = -18 * f;
  const bodyY = -43 + lie * 18 + s.crouch * 8 - s.stretch * 3 - bob;
  const bodyRx = 43 + walk * 16 + lie * 17 + s.stretch * 16 + flight * 9;
  const bodyRy = 43 - lie * 20 - walk * 9 - flight * 6 - s.crouch * 8 + s.stretch * 5 + breath;
  const headX = (14 + walk * 35 + lie * 29 + s.stretch * 35 + flight * 24) * f;
  const headY =
    -99 + walk * 17 + flight * 15 + lie * 46 + s.crouch * 25 + s.stretch * 48 - s.alert * 6 - bob;
  const tailWave = Math.sin(s.time / 760) * 9 * (1 - s.sleeping) + s.alert * 7;
  const leg = (index: number, rear: boolean) => {
    const phase = s.phase + index * Math.PI;
    const hip = (rear ? -42 : 24) * f;
    const step = pawStep(phase);
    const stride = step.x * walk * f;
    const lift = step.lift * walk;
    const groupedX =
      (rear ? -17 + s.landingReach * 6 : 47 + s.landingReach * 14) * f + (index ? 4 : -4);
    const groupedY = rear ? -25 : -34 + s.landingReach * 24;
    return (
      <Foot
        key={`${index}-${rear}`}
        hipX={hip}
        hipY={-35 + lie * 14}
        x={lerp(hip + stride + (index ? 9 : -9), groupedX, flight)}
        y={lerp(-lift, groupedY, flight)}
        rear={rear}
      />
    );
  };
  const reachX = clamp((s.gaze[0] - s.x) / kittenScale, 76);
  const reachY = clamp((s.gaze[1] - s.y) / kittenScale, 75);
  const pawX = lerp(29 * f, s.grooming > 0.1 ? headX - 18 * f : reachX, s.paw);
  const pawY = lerp(-10, s.grooming > 0.1 ? headY + 27 : reachY, s.paw);
  return (
    <g transform={`rotate(${s.jumpPitch} 0 -45)`}>
      <path
        d={`M${-48 * f} -24 C${-92 * f} -9 ${(-105 - tailWave) * f} -44 ${(-101 - tailWave) * f} ${-86 + lie * 47} Q${(-102 - tailWave) * f} ${-109 + lie * 63} ${(-82 - tailWave) * f} ${-95 + lie * 55}`}
        fill="none"
        stroke={ink.outline}
        strokeWidth={23}
        strokeLinecap="round"
      />
      <path
        d={`M${-48 * f} -24 C${-92 * f} -9 ${(-105 - tailWave) * f} -44 ${(-101 - tailWave) * f} ${-86 + lie * 47} Q${(-102 - tailWave) * f} ${-109 + lie * 63} ${(-82 - tailWave) * f} ${-95 + lie * 55}`}
        fill="none"
        stroke={ink.patch}
        strokeWidth={15}
        strokeLinecap="round"
      />
      <g opacity={1 - lie * 0.8}>
        {leg(1, true)}
        {leg(0, false)}
      </g>
      <ellipse cx={bodyX} cy={bodyY} rx={bodyRx} ry={bodyRy} fill={ink.fur} {...stroke} />
      <ellipse
        cx={bodyX - 19 * f}
        cy={bodyY - 4}
        rx={21 + lie * 6}
        ry={bodyRy * 0.7}
        fill={ink.shade}
      />
      <path
        d={`M${bodyX - 32 * f} ${bodyY - 24} q${10 * f} 3 ${12 * f} 13 M${bodyX - 38 * f} ${bodyY - 13} q${9 * f} 2 ${11 * f} 10`}
        fill="none"
        stroke={ink.patch}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <g opacity={1 - lie * 0.65}>{leg(0, true)}</g>
      {s.paw < 0.015 ? leg(1, false) : null}
      {lie > 0 ? (
        <g opacity={lie}>
          <ellipse cx={28 * f} cy={-7} rx={20} ry={9} fill={ink.fur} {...stroke} strokeWidth={3} />
          <ellipse cx={49 * f} cy={-6} rx={17} ry={8} fill={ink.fur} {...stroke} strokeWidth={3} />
        </g>
      ) : null}
      <Face state={s} x={headX} y={headY} />
      {s.paw >= 0.015 ? (
        <g>
          <path
            d={`M${22 * f} -46 Q${pawX - 15 * f} ${pawY - 18} ${pawX} ${pawY}`}
            fill="none"
            stroke={ink.outline}
            strokeWidth={23}
            strokeLinecap="round"
          />
          <path
            d={`M${22 * f} -46 Q${pawX - 15 * f} ${pawY - 18} ${pawX} ${pawY}`}
            fill="none"
            stroke={ink.fur}
            strokeWidth={16}
            strokeLinecap="round"
          />
          <ellipse cx={pawX} cy={pawY} rx={14} ry={12} fill={ink.fur} {...stroke} strokeWidth={3} />
          <ellipse cx={pawX + 2} cy={pawY + 2} rx={5} ry={4} fill={ink.pink} />
        </g>
      ) : null}
      {s.sleeping > 0 ? (
        <path
          d={`M${-54 * f} -11 Q${-90 * f} -35 ${-49 * f} -41 Q${-17 * f} -47 ${13 * f} -24`}
          fill="none"
          stroke={ink.patch}
          strokeWidth={14}
          strokeLinecap="round"
          opacity={s.sleeping * Math.abs(f)}
        />
      ) : null}
    </g>
  );
};
