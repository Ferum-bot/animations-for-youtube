export type PrivacyQuestionFocus = 'problem' | 'encrypt' | 'owner' | 'matrix' | 'lesson';

export type PrivacyQuestionPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: PrivacyQuestionFocus;
};

export const privacyQuestionPhases = [
  {
    id: 'problem',
    startMs: 120,
    eyebrow: 'PRIVACY MODEL / TWO INDEPENDENT AXES',
    title: 'В ПРИВАТНОСТИ DNS СМЕШАЛИ ДВА РАЗНЫХ ВОПРОСА',
    status: 'SEPARATE THE QUESTIONS',
    accent: 'signal',
    focus: 'problem',
  },
  {
    id: 'encrypt',
    startMs: 2_600,
    eyebrow: 'QUESTION 01 / TRANSPORT',
    title: 'ПЕРВЫЙ ВОПРОС: ЗАШИФРОВАН ЛИ КАНАЛ?',
    status: 'CLEAR TEXT ↔ ENCRYPTED',
    accent: 'success',
    focus: 'encrypt',
  },
  {
    id: 'owner',
    startMs: 6_000,
    eyebrow: 'QUESTION 02 / CONTROL',
    title: 'ВТОРОЙ ВОПРОС: КТО УПРАВЛЯЕТ РЕЗОЛВЕРОМ?',
    status: 'ISP ↔ CHOSEN RESOLVER',
    accent: 'primary',
    focus: 'owner',
  },
  {
    id: 'matrix',
    startMs: 9_400,
    eyebrow: 'FOUR STATES / NOT ONE SWITCH',
    title: 'ШИФРОВАНИЕ И ВЫБОР РЕЗОЛВЕРА НЕ ЗАВИСЯТ ДРУГ ОТ ДРУГА',
    status: 'TRANSPORT × OPERATOR',
    accent: 'primary',
    focus: 'matrix',
  },
  {
    id: 'lesson',
    startMs: 12_500,
    eyebrow: 'THE PRACTICAL TEST',
    title: 'СНАЧАЛА ПРОВЕРЬ КАНАЛ — ПОТОМ СПРОСИ, КОМУ ДОВЕРЯЕШЬ',
    status: 'ENCRYPTION + TRUST',
    accent: 'success',
    focus: 'lesson',
  },
] as const satisfies readonly [PrivacyQuestionPhase, ...PrivacyQuestionPhase[]];

export const privacyQuestionStage = {
  problem: 0,
  encrypt: 1,
  owner: 2,
  matrix: 3,
  lesson: 4,
} as const satisfies Record<PrivacyQuestionFocus, number>;
