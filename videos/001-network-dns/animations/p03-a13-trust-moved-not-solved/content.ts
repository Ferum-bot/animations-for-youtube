export type TrustMovedFocus = 'claim' | 'channel' | 'endpoint' | 'verdict';

export type TrustMovedPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: TrustMovedFocus;
};

export const trustMovedPhases = [
  {
    id: 'claim',
    startMs: 100,
    eyebrow: 'DoH / PRIVACY CLAIM',
    title: 'DoH НЕ УБИРАЕТ НЕОБХОДИМОСТЬ ДОВЕРЯТЬ',
    status: 'PRIVACY / NOT SOLVED',
    accent: 'signal',
    focus: 'claim',
  },
  {
    id: 'channel',
    startMs: 1_200,
    eyebrow: 'WHAT CHANGED / THE CHANNEL',
    title: 'НАБЛЮДАТЕЛЬ НА ПУТИ БОЛЬШЕ НЕ ЧИТАЕТ DNS',
    status: 'PATH VISIBILITY / REMOVED',
    accent: 'success',
    focus: 'channel',
  },
  {
    id: 'endpoint',
    startMs: 2_500,
    eyebrow: 'WHAT REMAINS / THE ENDPOINT',
    title: 'НО ВЫБРАННЫЙ РЕЗОЛВЕР ПО-ПРЕЖНЕМУ ВИДИТ ЗАПРОС',
    status: 'RESOLVER VISIBILITY / REMAINS',
    accent: 'primary',
    focus: 'endpoint',
  },
  {
    id: 'verdict',
    startMs: 3_900,
    eyebrow: 'THE RESULT / TRUST SHIFT',
    title: 'ДОВЕРИЕ НЕ ИСЧЕЗЛО — ОНО ПЕРЕМЕСТИЛОСЬ',
    status: 'TRUST / MOVED, NOT REMOVED',
    accent: 'signal',
    focus: 'verdict',
  },
] as const satisfies readonly [TrustMovedPhase, ...TrustMovedPhase[]];

export const trustMovedStage = {
  claim: 0,
  channel: 1,
  endpoint: 2,
  verdict: 3,
} as const satisfies Record<TrustMovedFocus, number>;
