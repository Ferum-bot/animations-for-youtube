export type ResponseRaceFocus =
  | 'assumption'
  | 'unprotected'
  | 'txid'
  | 'forge'
  | 'race'
  | 'poisoned';

export type ResponseRacePhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: ResponseRaceFocus;
};

export const responseRacePhases = [
  {
    id: 'assumption',
    startMs: 120,
    eyebrow: 'ORIGINAL TRUST MODEL / FRIENDLY NETWORK',
    title: 'DNS НЕ ЖДАЛ АТАКУЮЩЕГО',
    status: 'DESIGNED FOR COOPERATION / NOT HOSTILITY',
    accent: 'primary',
    focus: 'assumption',
  },
  {
    id: 'unprotected',
    startMs: 3_380,
    eyebrow: 'PLAIN UDP / NO AUTHENTICATION',
    title: 'ОТВЕТ НИЧЕМ НЕ ПОДПИСАН',
    status: 'SOURCE IDENTITY / NOT PROVEN',
    accent: 'signal',
    focus: 'unprotected',
  },
  {
    id: 'txid',
    startMs: 5_280,
    eyebrow: 'DNS HEADER / 16-BIT TRANSACTION ID',
    title: 'ВОПРОС И ОТВЕТ СВЯЗЫВАЕТ ID',
    status: 'TXID / CORRELATION, NOT AUTHENTICATION',
    accent: 'primary',
    focus: 'txid',
  },
  {
    id: 'forge',
    startMs: 12_840,
    eyebrow: 'FORGED RESPONSE / MATCH ATTEMPT',
    title: 'ПОДДЕЛКА МОЖЕТ ВЫГЛЯДЕТЬ ПРАВИЛЬНО',
    status: 'QNAME + QTYPE + TXID / APPEAR TO MATCH',
    accent: 'signal',
    focus: 'forge',
  },
  {
    id: 'race',
    startMs: 14_240,
    eyebrow: 'TWO RESPONSES / ONE ACCEPTANCE WINDOW',
    title: 'КТО ПРИШЁЛ ПЕРВЫМ — ТОТ И ПОБЕДИЛ',
    status: 'FORGED ↔ AUTHENTIC / RESPONSE RACE',
    accent: 'signal',
    focus: 'race',
  },
  {
    id: 'poisoned',
    startMs: 19_460,
    eyebrow: 'FIRST VALID-LOOKING MATCH / ACCEPTED',
    title: 'ЛОЖНЫЙ ОТВЕТ ПОПАЛ В КЭШ',
    status: 'FORGED / ACCEPTED · AUTHENTIC / LATE',
    accent: 'signal',
    focus: 'poisoned',
  },
] as const satisfies readonly [ResponseRacePhase, ...ResponseRacePhase[]];

export const responseRaceStage = {
  assumption: 0,
  unprotected: 1,
  txid: 2,
  forge: 3,
  race: 4,
  poisoned: 5,
} as const satisfies Record<ResponseRaceFocus, number>;
