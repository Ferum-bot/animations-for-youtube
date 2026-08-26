export type RootFleetRevealFocus = 'identities' | 'fleet' | 'operators';

export type RootFleetRevealPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: RootFleetRevealFocus;
};

export const rootFleetRevealPhases = [
  {
    id: 'identities',
    startMs: 80,
    eyebrow: 'LOGICAL LAYER / ROOT IDENTITIES',
    title: '13 — ЭТО АДРЕСА A–M',
    status: 'ROOT / 13 LOGICAL IDENTITIES',
    accent: 'primary',
    focus: 'identities',
  },
  {
    id: 'fleet',
    startMs: 6_880,
    eyebrow: 'PHYSICAL LAYER / GLOBAL FLEET',
    title: 'ЗА НИМИ — ТЫСЯЧИ ФИЗИЧЕСКИХ СЕРВЕРОВ',
    status: 'ROOT / THOUSANDS OF INSTANCES',
    accent: 'success',
    focus: 'fleet',
  },
  {
    id: 'operators',
    startMs: 10_420,
    eyebrow: 'OPERATING MODEL / INDEPENDENT',
    title: 'ФЛОТОМ УПРАВЛЯЮТ 12 НЕЗАВИСИМЫХ ОПЕРАТОРОВ',
    status: 'ROOT / 12 OPERATORS / GLOBAL',
    accent: 'signal',
    focus: 'operators',
  },
] as const satisfies readonly [RootFleetRevealPhase, ...RootFleetRevealPhase[]];

export const rootFleetRevealStage = {
  identities: 0,
  fleet: 1,
  operators: 2,
} as const satisfies Record<RootFleetRevealFocus, number>;
