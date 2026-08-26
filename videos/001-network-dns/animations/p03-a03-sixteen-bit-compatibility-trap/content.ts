export type CompatibilityFocus = 'impossible' | 'field' | 'expand' | 'shift' | 'break';

export type CompatibilityPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: CompatibilityFocus;
};

export const compatibilityPhases = [
  {
    id: 'impossible',
    startMs: 120,
    eyebrow: 'PROTOCOL AT INTERNET SCALE / LOCKED CONTRACT',
    title: 'ПОЧИНИТЬ ФОРМАТ НАПРЯМУЮ НЕЛЬЗЯ',
    status: 'DEPLOYED EVERYWHERE / CHANGE COST IS GLOBAL',
    accent: 'signal',
    focus: 'impossible',
  },
  {
    id: 'field',
    startMs: 2_300,
    eyebrow: 'DNS HEADER / ROOT CAUSE',
    title: 'В ЦЕНТРЕ ПРОБЛЕМЫ — 16 БИТ',
    status: 'TXID / BYTE 0…1 / FIXED WIDTH',
    accent: 'signal',
    focus: 'field',
  },
  {
    id: 'expand',
    startMs: 4_600,
    eyebrow: 'OBVIOUS FIX / EXPAND THE FIELD',
    title: 'ДОБАВИМ ЕЩЁ 16 БИТ?',
    status: 'PROPOSED TXID / 32 BIT',
    accent: 'primary',
    focus: 'expand',
  },
  {
    id: 'shift',
    startMs: 6_100,
    eyebrow: 'WIRE FORMAT / EVERY OFFSET MOVES',
    title: 'НО ОСТАЛЬНЫЕ ПОЛЯ СДВИГАЮТСЯ',
    status: 'FLAGS + COUNTS / WRONG BYTE OFFSETS',
    accent: 'signal',
    focus: 'shift',
  },
  {
    id: 'break',
    startMs: 7_400,
    eyebrow: 'OLD DECODERS / NEW MESSAGE',
    title: 'СТАРЫЙ ИНТЕРНЕТ ПЕРЕСТАЁТ ПОНИМАТЬ DNS',
    status: 'CORRECT FIX / INCOMPATIBLE WIRE FORMAT',
    accent: 'signal',
    focus: 'break',
  },
] as const satisfies readonly [CompatibilityPhase, ...CompatibilityPhase[]];

export const compatibilityStage = {
  impossible: 0,
  field: 1,
  expand: 2,
  shift: 3,
  break: 4,
} as const satisfies Record<CompatibilityFocus, number>;

export const dnsHeaderRows = [
  ['ID / 16 BIT', 'FLAGS / 16 BIT'],
  ['QDCOUNT / 16 BIT', 'ANCOUNT / 16 BIT'],
  ['NSCOUNT / 16 BIT', 'ARCOUNT / 16 BIT'],
] as const;
