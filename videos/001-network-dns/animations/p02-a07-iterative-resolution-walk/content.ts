export type TraversalDirection = 'idle' | 'query' | 'referral' | 'answer';
export type TraversalLevel = 0 | 1 | 2 | 3;

export type TraversalPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly direction: TraversalDirection;
  readonly level: TraversalLevel | null;
};

export const traversalPhases = [
  {
    id: 'setup',
    startMs: 120,
    eyebrow: 'CONCRETE QUERY / COLD CACHE',
    title: 'ОДИН ЗАПРОС. ЧЕТЫРЕ УРОВНЯ.',
    status: 'ГОТОВИМ МАРШРУТ',
    accent: 'primary',
    direction: 'idle',
    level: null,
  },
  {
    id: 'lookup',
    startMs: 3_380,
    eyebrow: 'SOURCE → TARGET',
    title: 'НУЖЕН АДРЕС NOISE.KS.CHICAGO.EDU',
    status: 'LOOKUP / A RECORD',
    accent: 'primary',
    direction: 'idle',
    level: null,
  },
  {
    id: 'stub',
    startMs: 13_400,
    eyebrow: 'STUB → LOCAL RESOLVER',
    title: 'STUB ПЕРЕДАЁТ РЕКУРСИВНЫЙ ЗАПРОС',
    status: 'CLIENT QUERY / FORWARDED',
    accent: 'primary',
    direction: 'idle',
    level: null,
  },
  {
    id: 'resolver',
    startMs: 16_280,
    eyebrow: 'CACHE MISS / ITERATIVE MODE',
    title: 'РЕЗОЛВЕР НАЧИНАЕТ ОБХОД',
    status: 'CACHE MISS / START',
    accent: 'signal',
    direction: 'idle',
    level: null,
  },
  {
    id: 'root-query',
    startMs: 20_040,
    eyebrow: 'STEP 01 / QUERY ROOT',
    title: 'СНАЧАЛА — КОРНЕВОЙ СЕРВЕР',
    status: 'QUERY → ROOT',
    accent: 'primary',
    direction: 'query',
    level: 0,
  },
  {
    id: 'root-referral',
    startMs: 22_520,
    eyebrow: 'STEP 02 / REFERRAL',
    title: 'КОРЕНЬ УКАЗЫВАЕТ НА .EDU',
    status: 'REFERRAL ← NS .EDU',
    accent: 'signal',
    direction: 'referral',
    level: 0,
  },
  {
    id: 'edu-query',
    startMs: 25_900,
    eyebrow: 'STEP 03 / QUERY TLD',
    title: 'РЕЗОЛВЕР ИДЁТ К .EDU',
    status: 'QUERY → .EDU',
    accent: 'primary',
    direction: 'query',
    level: 1,
  },
  {
    id: 'edu-referral',
    startMs: 28_300,
    eyebrow: 'STEP 04 / REFERRAL',
    title: '.EDU УКАЗЫВАЕТ НА CHICAGO',
    status: 'REFERRAL ← CHICAGO.EDU',
    accent: 'signal',
    direction: 'referral',
    level: 1,
  },
  {
    id: 'chicago-query',
    startMs: 30_660,
    eyebrow: 'STEP 05 / QUERY ZONE',
    title: 'ТЕПЕРЬ — СЕРВЕР CHICAGO',
    status: 'QUERY → CHICAGO.EDU',
    accent: 'primary',
    direction: 'query',
    level: 2,
  },
  {
    id: 'chicago-referral',
    startMs: 34_200,
    eyebrow: 'STEP 06 / DELEGATION',
    title: 'CHICAGO ДЕЛЕГИРУЕТ ЗОНУ KS',
    status: 'REFERRAL ← KS.CHICAGO.EDU',
    accent: 'signal',
    direction: 'referral',
    level: 2,
  },
  {
    id: 'authority-query',
    startMs: 39_740,
    eyebrow: 'STEP 07 / AUTHORITATIVE',
    title: 'ПОСЛЕДНИЙ СЕРВЕР ЗНАЕТ ОТВЕТ',
    status: 'QUERY → KS.CHICAGO.EDU',
    accent: 'success',
    direction: 'query',
    level: 3,
  },
  {
    id: 'answer',
    startMs: 46_700,
    eyebrow: 'STEP 08–10 / RETURN',
    title: 'A-ЗАПИСЬ ЕДЕТ ОБРАТНО И КЭШИРУЕТСЯ',
    status: 'ANSWER ← 192.0.2.42',
    accent: 'success',
    direction: 'answer',
    level: 3,
  },
  {
    id: 'complete',
    startMs: 50_700,
    eyebrow: 'ITERATIVE WALK / COMPLETE',
    title: '10 ШАГОВ. 4 УРОВНЯ ДЕРЕВА.',
    status: 'A 192.0.2.42 / CACHED',
    accent: 'success',
    direction: 'idle',
    level: 3,
  },
] as const satisfies readonly TraversalPhase[];

export const authorityLevels = [
  {label: 'ROOT .', role: 'REFERRAL → .EDU'},
  {label: '.EDU', role: 'REFERRAL → CHICAGO.EDU'},
  {label: 'CHICAGO.EDU', role: 'REFERRAL → KS.CHICAGO.EDU'},
  {label: 'KS.CHICAGO.EDU', role: 'A → 192.0.2.42'},
] as const;
