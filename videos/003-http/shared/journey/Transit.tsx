import React from 'react';
import {Label, Plate} from './Diagram';
import {palette as p} from './theme';
import {range, shots, type ShotId} from './timing';
import {reveal} from '../timing';

type Point = readonly [number, number];
type Route = {readonly from: Point; readonly to: Point};
const routes = {
  invitation: {from: [704, 659], to: [800, 650]},
  assembly: {from: [704, 659], to: [800, 650]},
  socket: {from: [750, 650], to: [510, 687]},
  segments: {from: [1940, 687], to: [1280, 575]},
  receiver: {from: [1280, 940], to: [1280, 543]},
  wire: {from: [1280, 940], to: [1280, 720]},
  frames: {from: [2140, 870], to: [610, 715]},
  framing: {from: [1780, 570], to: [1280, 830]},
  multiplex: {from: [2060, 780], to: [1020, 747]},
  blocking: {from: [2200, 620], to: [900, 904]},
  quic: {from: [1280, 904], to: [1280, 750]},
  comparison: {from: [1300, 912], to: [1278, 675]},
  readability: {from: [1278, 695], to: [705, 710]},
} as const satisfies Record<ShotId, Route>;

/** The mint identity passes between representations while dense annotations change. */
export const RequestTransit: React.FC<{time: number}> = ({time}) => {
  const shot = shots.find((s, i) => i > 0 && time >= s.start && time < s.start + 850);
  if (!shot) return null;
  const t = reveal(time, shot.start, 850);
  const {from, to} = routes[shot.id];
  const control: Point = [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - 150];
  const coordinate = (axis: 0 | 1) =>
    (1 - t) ** 2 * from[axis] + 2 * t * (1 - t) * control[axis] + t * t * to[axis];
  const alpha = Math.sin(Math.PI * range(time, shot.start, shot.start + 850));
  const x = coordinate(0) - 88;
  const y = coordinate(1) - 40;
  return (
    <g opacity={alpha}>
      <path
        d={`M${from[0]} ${from[1]} Q${control[0]} ${control[1]} ${to[0]} ${to[1]}`}
        stroke={p.primary}
        strokeWidth={1.5}
        opacity={0.25}
        fill="none"
      />
      <ellipse cx={x + 95} cy={y + 111} rx={88} ry={12} fill={p.deep} opacity={0.6} />
      <Plate x={x} y={y} w={176} h={78} depth={12} accent={p.primary} fill={p.deep}>
        <Label x={x + 88} y={y + 49} anchor="middle" mono size={28} color={p.primary}>
          POST
        </Label>
      </Plate>
    </g>
  );
};
