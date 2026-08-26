export type CaseRandomizationFocus = 'name' | 'equivalent' | 'encode' | 'echo' | 'defend' | 'lesson';

export type CaseRandomizationPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: CaseRandomizationFocus;
};

export const caseRandomizationPhases = [
  {
    id: 'name',
    startMs: 120,
    eyebrow: 'PATCH 02 / USE WHAT ALREADY EXISTS',
    title: 'В DNS-ИМЕНИ НАШЛИ ЕЩЁ ОДИН СКРЫТЫЙ КАНАЛ',
    status: 'QUESTION NAME / ASCII LETTERS',
    accent: 'signal',
    focus: 'name',
  },
  {
    id: 'equivalent',
    startMs: 3_860,
    eyebrow: 'DNS COMPARISON / CASE INSENSITIVE',
    title: 'ДЛЯ DNS ЭТИ НАПИСАНИЯ ОЗНАЧАЮТ ОДНО И ТО ЖЕ',
    status: 'UCHICAGO.EDU = uchicago.edu',
    accent: 'primary',
    focus: 'equivalent',
  },
  {
    id: 'encode',
    startMs: 6_900,
    eyebrow: '0x20 ENCODING / ONE LETTER — ONE BIT',
    title: 'РЕГИСТР КАЖДОЙ БУКВЫ СТАНОВИТСЯ СЛУЧАЙНЫМ БИТОМ',
    status: 'UPPER / LOWER / RANDOM PATTERN',
    accent: 'primary',
    focus: 'encode',
  },
  {
    id: 'echo',
    startMs: 10_200,
    eyebrow: 'QUESTION ECHO / EXACT CASE PATTERN',
    title: 'НАСТОЯЩИЙ ОТВЕТ ВОЗВРАЩАЕТ ТОТ ЖЕ РИСУНОК',
    status: 'QUERY CASE = RESPONSE CASE',
    accent: 'success',
    focus: 'echo',
  },
  {
    id: 'defend',
    startMs: 13_100,
    eyebrow: 'FORGED ANSWER / WRONG HIDDEN BITS',
    title: 'ПОДДЕЛКЕ НУЖНО УГАДАТЬ ЕЩЁ И РЕГИСТР',
    status: 'CASE PATTERN MISMATCH / REJECT',
    accent: 'signal',
    focus: 'defend',
  },
  {
    id: 'lesson',
    startMs: 15_000,
    eyebrow: 'DEPLOYED SOFTWARE / COMPATIBLE HARDENING',
    title: 'НЕЭЛЕГАНТНО — ЗАТО БЕЗ НОВОГО ФОРМАТА',
    status: 'EXISTING BYTES / EXTRA ENTROPY',
    accent: 'success',
    focus: 'lesson',
  },
] as const satisfies readonly [CaseRandomizationPhase, ...CaseRandomizationPhase[]];

export const caseRandomizationStage = {
  name: 0,
  equivalent: 1,
  encode: 2,
  echo: 3,
  defend: 4,
  lesson: 5,
} as const satisfies Record<CaseRandomizationFocus, number>;

export const domainGlyphs = [...'uchicago.edu'] as const;
export const caseBits = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1] as const;
export const forgedBits = [1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0] as const;
