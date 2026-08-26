export type PortEntropyFocus = 'patch' | 'fixed' | 'randomize' | 'combine' | 'reject';

export type PortEntropyPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: PortEntropyFocus;
};

export const portEntropyPhases = [
  {
    id: 'patch',
    startMs: 120,
    eyebrow: 'COMPATIBLE MITIGATION / NO WIRE CHANGE',
    title: 'ФОРМАТ НЕ ТРОГАЮТ — ДОБАВЛЯЮТ ВТОРОЙ СЕКРЕТ',
    status: 'SIDE PATCH / SAME DNS MESSAGE',
    accent: 'signal',
    focus: 'patch',
  },
  {
    id: 'fixed',
    startMs: 1_650,
    eyebrow: 'BEFORE / PREDICTABLE SOURCE PORT',
    title: 'РАНЬШЕ НУЖНО БЫЛО УГАДАТЬ ТОЛЬКО TXID',
    status: 'KNOWN PORT + 16 BIT TXID',
    accent: 'signal',
    focus: 'fixed',
  },
  {
    id: 'randomize',
    startMs: 3_050,
    eyebrow: 'UDP SOURCE PORT / PER QUERY',
    title: 'ТЕПЕРЬ ПОРТ ВЫБИРАЕТСЯ НЕПРЕДСКАЗУЕМО',
    status: 'SOURCE PORT / RANDOMIZED',
    accent: 'primary',
    focus: 'randomize',
  },
  {
    id: 'combine',
    startMs: 5_050,
    eyebrow: 'RESPONSE MATCH / TWO FIELDS',
    title: 'ОТВЕТ ДОЛЖЕН СОВПАСТЬ СРАЗУ ПО ДВУМ КЛЮЧАМ',
    status: 'TXID + UDP SOURCE PORT',
    accent: 'primary',
    focus: 'combine',
  },
  {
    id: 'reject',
    startMs: 6_750,
    eyebrow: 'BLIND SPOOFING / SEARCH SPACE EXPANDS',
    title: 'СЛУЧАЙНЫЕ ПОДДЕЛКИ БОЛЬШЕ НЕ ПОПАДАЮТ В ЗАМОК',
    status: 'WRONG PORT / REJECTED BEFORE CACHE',
    accent: 'success',
    focus: 'reject',
  },
] as const satisfies readonly [PortEntropyPhase, ...PortEntropyPhase[]];

export const portEntropyStage = {
  patch: 0,
  fixed: 1,
  randomize: 2,
  combine: 3,
  reject: 4,
} as const satisfies Record<PortEntropyFocus, number>;

export const portCandidates = [53000, 49152, 32768, 60433] as const;
