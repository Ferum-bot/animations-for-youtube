export type PhoneBookMythFocus = 'claim' | 'limits' | 'reframe';

export type PhoneBookMythPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: PhoneBookMythFocus;
};

export const phoneBookMythPhases = [
  {
    id: 'claim',
    startMs: 80,
    eyebrow: 'МИФ 02 / УДОБНАЯ МЕТАФОРА',
    title: 'DNS — ЭТО ПРОСТО ТЕЛЕФОННАЯ КНИГА?',
    status: 'MYTH / NAME → NUMBER',
    accent: 'signal',
    focus: 'claim',
  },
  {
    id: 'limits',
    startMs: 3_760,
    eyebrow: 'ГДЕ МЕТАФОРА ЛОМАЕТСЯ',
    title: 'СПРАВОЧНИК ТОЛЬКО НАХОДИТ ЗАПИСЬ',
    status: 'LIMIT / STATIC LOOKUP ONLY',
    accent: 'primary',
    focus: 'limits',
  },
  {
    id: 'reframe',
    startMs: 5_180,
    eyebrow: 'ПРАВИЛЬНАЯ МОДЕЛЬ',
    title: 'DNS НЕ ТОЛЬКО ОТВЕЧАЕТ — ОН НАПРАВЛЯЕТ',
    status: 'REFRAME / LOOKUP → CONTROL',
    accent: 'success',
    focus: 'reframe',
  },
] as const satisfies readonly [PhoneBookMythPhase, ...PhoneBookMythPhase[]];

export const phoneBookMythStage = {
  claim: 0,
  limits: 1,
  reframe: 2,
} as const satisfies Record<PhoneBookMythFocus, number>;
