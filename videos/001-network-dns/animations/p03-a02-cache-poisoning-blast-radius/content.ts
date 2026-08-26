export type PoisoningFocus = 'record' | 'delegation' | 'cached' | 'blast' | 'lesson';

export type PoisoningPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: PoisoningFocus;
};

export const poisoningPhases = [
  {
    id: 'record',
    startMs: 120,
    eyebrow: 'CACHE POISONING / FORGED DATA',
    title: 'ЛОЖНАЯ ЗАПИСЬ ПОПАДАЕТ В КЭШ',
    status: 'FORGED ANSWER / LOCAL COPY',
    accent: 'signal',
    focus: 'record',
  },
  {
    id: 'delegation',
    startMs: 4_300,
    eyebrow: 'KAMINSKY-CLASS IMPACT / DELEGATION',
    title: 'ПОДМЕНЯЕТСЯ НЕ САЙТ — ЦЕЛАЯ ЗОНА',
    status: 'FORGED NS + GLUE / ZONE CONTROL',
    accent: 'signal',
    focus: 'delegation',
  },
  {
    id: 'cached',
    startMs: 8_700,
    eyebrow: 'RECURSIVE CACHE / TRUSTED REUSE',
    title: 'ОШИБКА СТАНОВИТСЯ ЛОКАЛЬНОЙ ИСТИНОЙ',
    status: 'POISONED DELEGATION / REUSED',
    accent: 'signal',
    focus: 'cached',
  },
  {
    id: 'blast',
    startMs: 12_000,
    eyebrow: 'ONE DELEGATION / MANY NAMES',
    title: 'КАЖДЫЙ ПОДДОМЕН ИДЁТ НЕ ТУДА',
    status: 'WWW + API + MAIL + AUTH / REDIRECTED',
    accent: 'signal',
    focus: 'blast',
  },
  {
    id: 'lesson',
    startMs: 15_140,
    eyebrow: 'INDUSTRY LESSON / CACHE AMPLIFIES TRUST',
    title: 'ОДНА ПОДДЕЛКА МЕНЯЕТ МНОГО ОТВЕТОВ',
    status: 'SMALL INJECTION / ZONE-WIDE CONSEQUENCE',
    accent: 'primary',
    focus: 'lesson',
  },
] as const satisfies readonly [PoisoningPhase, ...PoisoningPhase[]];

export const poisoningStage = {
  record: 0,
  delegation: 1,
  cached: 2,
  blast: 3,
  lesson: 4,
} as const satisfies Record<PoisoningFocus, number>;

export const affectedNames = ['www', 'api', 'mail', 'auth', 'cdn'] as const;
