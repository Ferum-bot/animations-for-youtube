export type PacketBudgetPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly visibleStage: 0 | 1 | 2 | 3 | 4 | 5;
  readonly focus: 'question' | 'math' | 'limit' | 'occupied' | 'name' | 'candidate' | 'overflow' | 'answer' | 'legacy';
};

export const packetBudgetPhases = [
  {
    id: 'question',
    startMs: 120,
    eyebrow: 'ROOT SYSTEM / DESIGN QUESTION',
    title: 'ПОЧЕМУ ИМЕННО 13?',
    status: '13 ROOT IDENTITIES / WHY?',
    accent: 'signal',
    visibleStage: 0,
    focus: 'question',
  },
  {
    id: 'not-magic',
    startMs: 2_340,
    eyebrow: 'NO MAGIC / PACKET ARITHMETIC',
    title: 'ОТВЕТ — В РАЗМЕРЕ ОДНОГО ПАКЕТА',
    status: 'UDP RESPONSE / HISTORICAL CONSTRAINT',
    accent: 'primary',
    visibleStage: 1,
    focus: 'math',
  },
  {
    id: 'udp-math',
    startMs: 4_960,
    eyebrow: 'CLASSIC DNS OVER UDP',
    title: 'ВСЁ ДОЛЖНО ПОМЕСТИТЬСЯ СРАЗУ',
    status: 'ONE DATAGRAM / NO EXTRA ROUND TRIP',
    accent: 'primary',
    visibleStage: 1,
    focus: 'math',
  },
  {
    id: 'limit',
    startMs: 8_320,
    eyebrow: 'HISTORICAL UDP PAYLOAD LIMIT',
    title: 'ЖЁСТКИЙ БЮДЖЕТ — 512 БАЙТ',
    status: 'PACKET CAP / 512 B',
    accent: 'signal',
    visibleStage: 1,
    focus: 'limit',
  },
  {
    id: 'occupied',
    startMs: 12_520,
    eyebrow: 'ROOT REFERRAL / BASE PAYLOAD',
    title: '435 БАЙТ УЖЕ ЗАНЯТЫ',
    status: 'BASE RESPONSE / 435 B',
    accent: 'primary',
    visibleStage: 2,
    focus: 'occupied',
  },
  {
    id: 'name',
    startMs: 14_740,
    eyebrow: 'QUERY NAME / RESERVED SPACE',
    title: 'ЕЩЁ 64 БАЙТА — ПОД ИМЯ',
    status: '435 + 64 = 499 B / 13 B LEFT',
    accent: 'primary',
    visibleStage: 3,
    focus: 'name',
  },
  {
    id: 'candidate',
    startMs: 17_940,
    eyebrow: 'FOURTEENTH IDENTITY / EXTRA COST',
    title: '14-Й СЕРВЕР ПОТРЕБУЕТ ЕЩЁ 25 БАЙТ',
    status: 'CANDIDATE / +25 B',
    accent: 'signal',
    visibleStage: 4,
    focus: 'candidate',
  },
  {
    id: 'overflow',
    startMs: 20_740,
    eyebrow: 'BYTE BUDGET / OVERFLOW',
    title: '524 БАЙТА НЕ ВЛЕЗАЮТ В 512',
    status: '435 + 64 + 25 = 524 B / +12 B',
    accent: 'signal',
    visibleStage: 5,
    focus: 'overflow',
  },
  {
    id: 'answer',
    startMs: 26_940,
    eyebrow: 'ARCHITECTURAL ANSWER',
    title: '13 — НЕ МАГИЯ. ЭТО БЮДЖЕТ ПАКЕТА.',
    status: '13 FIT / 14 OVERFLOWS',
    accent: 'success',
    visibleStage: 5,
    focus: 'answer',
  },
  {
    id: 'legacy',
    startMs: 28_120,
    eyebrow: '1997 / CONSTRAINT FROZEN IN TIME',
    title: 'СТАРОЕ ОГРАНИЧЕНИЕ СТАЛО ЧАСТЬЮ АРХИТЕКТУРЫ',
    status: '1997 → TODAY / COMPATIBILITY WINS',
    accent: 'success',
    visibleStage: 5,
    focus: 'legacy',
  },
] as const satisfies readonly PacketBudgetPhase[];

export const packetBudget = {
  limit: 512,
  occupied: 435,
  queryName: 64,
  candidate: 25,
  overflow: 12,
} as const;
