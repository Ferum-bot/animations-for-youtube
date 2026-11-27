import React from 'react';
import {chapterColors as colors} from '../../shared/chapterColors';
import type {StationId} from './route';

// Each silhouette faces the viewer regardless of the direction the path is drawn; the cloud row routes right to left.
const shapes = {
  browser: <><rect x={-38} y={-29} width={76} height={57} rx={4}/><path d="M-37 -12 H37 M-26 -21 h7 M-13 -21 h2 M-8 2 l-9 8 9 8 M8 2 l9 8 -9 8"/></>,
  router: <><path d="M-30 0 l-6 -32 M30 0 l6 -32"/><rect x={-38} y={0} width={76} height={23} rx={4}/><path d="M-26 12 h4 M-13 12 h4 M13 12 h15"/></>,
  carrier: <><path d="M-19 30 L0 -15 19 30 M-12 13 H12 M-10 29 H10 M-17 -30 Q-32 -15 -17 -1 M17 -30 Q32 -15 17 -1 M-26 -38 Q-46 -15 -26 7 M26 -38 Q46 -15 26 7"/><circle cy={-15} r={5} fill={colors.text}/></>,
  cdn: <><path d="M-31 22 C-55 18 -48 -12 -28 -12 C-21 -44 24 -42 30 -13 C55 -9 54 22 29 22 Z"/><path d="M16 5 H-15 m7 -6 -7 6 7 6"/></>,
  balancer: <g transform="scale(-1 1)"><path d="M-34 0 H-8 Q0 0 8 -10 L21 -23 H36 M-8 0 Q0 0 8 10 L21 23 H36 M-8 0 H36"/><path d="m28 -30 8 7 -8 7 M28 -7 l8 7 -8 7 M28 16 l8 7 -8 7"/></g>,
  ingress: <><path d="M-23 30 V-31 H28 V30 M-39 0 H9 m-9 -9 9 9 -9 9"/></>,
  sidecar: <><path d="M-33 -22 H-4 V22 H-33 Z M4 -14 H33 V22 H4 Z M-23 -8 h10 M13 -3 h12"/></>,
  server: <><rect x={-33} y={-29} width={66} height={24} rx={3}/><rect x={-33} y={5} width={66} height={24} rx={3}/><path d="M-22 -17 h2 M-22 17 h2 M3 -17 h18 M3 17 h18"/></>,
} satisfies Record<StationId, React.ReactNode>;

export const StationIcon: React.FC<{id: StationId}> = ({id}) =>
  <g fill="none" stroke={colors.text} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">{shapes[id]}</g>;
