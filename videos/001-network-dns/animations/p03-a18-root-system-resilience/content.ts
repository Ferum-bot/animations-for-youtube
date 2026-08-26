export type RootResilienceFocus = 'fact' | 'continuity' | 'attack' | 'degrade' | 'verdict';

export type RootResiliencePhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: RootResilienceFocus;
};

export const rootResiliencePhases = [
  {
    id: 'fact',
    startMs: 80,
    eyebrow: 'SYSTEM FACT / ROOT SERVICE',
    title: 'КОРНЕВАЯ СИСТЕМА НЕ ПАДАЛА ЦЕЛИКОМ',
    status: 'ROOT / SYSTEM-WIDE AVAILABILITY',
    accent: 'success',
    focus: 'fact',
  },
  {
    id: 'continuity',
    startMs: 1_980,
    eyebrow: 'DISTRIBUTED BY DESIGN',
    title: 'ОТКАЗ ОДНОГО УЗЛА — НЕ ОТКАЗ СИСТЕМЫ',
    status: 'ROOT / PARTIAL FAILURE TOLERATED',
    accent: 'primary',
    focus: 'continuity',
  },
  {
    id: 'attack',
    startMs: 6_340,
    eyebrow: '2015 / HIGH-QUERY EVENT',
    title: 'ДО 5 МЛН ЗАПРОСОВ В СЕКУНДУ НА ЗАТРОНУТУЮ БУКВУ',
    status: 'ATTACK / UP TO 5M QPS PER AFFECTED LETTER',
    accent: 'signal',
    focus: 'attack',
  },
  {
    id: 'degrade',
    startMs: 9_960,
    eyebrow: 'SOME LINKS SATURATED / OTHERS REACHABLE',
    title: 'ЧАСТЬ ПУТЕЙ ДЕГРАДИРОВАЛА — СЕРВИС ПРОДОЛЖИЛ РАБОТУ',
    status: 'ROOT / DEGRADED, STILL SERVING',
    accent: 'primary',
    focus: 'degrade',
  },
  {
    id: 'verdict',
    startMs: 11_300,
    eyebrow: 'RESILIENCE / THE ACTUAL CLAIM',
    title: 'ЧАСТИЧНЫЙ ОТКАЗ ≠ ОТКАЗ СИСТЕМЫ',
    status: 'ROOT / SERVICE CONTINUES',
    accent: 'success',
    focus: 'verdict',
  },
] as const satisfies readonly [RootResiliencePhase, ...RootResiliencePhase[]];

export const rootResilienceStage = {
  fact: 0,
  continuity: 1,
  attack: 2,
  degrade: 3,
  verdict: 4,
} as const satisfies Record<RootResilienceFocus, number>;
