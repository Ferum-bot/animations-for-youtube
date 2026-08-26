export type DnssecFocus = 'answer' | 'signature' | 'root' | 'parent' | 'zone' | 'validate' | 'reality' | 'lesson';

export type DnssecPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: DnssecFocus;
};

export const dnssecPhases = [
  {
    id: 'answer',
    startMs: 120,
    eyebrow: 'CRYPTOGRAPHIC ANSWER / NOT ANOTHER GUESSING TRICK',
    title: 'НАСТОЯЩЕЕ РЕШЕНИЕ — ПРОВЕРЯТЬ ПОДЛИННОСТЬ ОТВЕТА',
    status: 'DNSSEC / DATA ORIGIN AUTHENTICATION',
    accent: 'signal',
    focus: 'answer',
  },
  {
    id: 'signature',
    startMs: 2_200,
    eyebrow: 'SIGNED RRSET / RRSIG',
    title: 'ДАННЫЕ ПРИХОДЯТ ВМЕСТЕ С ЦИФРОВОЙ ПОДПИСЬЮ',
    status: 'RRSET + RRSIG / VERIFY',
    accent: 'primary',
    focus: 'signature',
  },
  {
    id: 'root',
    startMs: 5_300,
    eyebrow: 'TRUST ANCHOR / ROOT',
    title: 'ПРОВЕРКА НАЧИНАЕТСЯ С ДОВЕРЕННОГО КЛЮЧА КОРНЯ',
    status: 'ROOT KSK / LOCAL TRUST ANCHOR',
    accent: 'success',
    focus: 'root',
  },
  {
    id: 'parent',
    startMs: 8_100,
    eyebrow: 'PARENT DELEGATION / DS',
    title: 'РОДИТЕЛЬ ЗАВЕРЯЕТ КЛЮЧ ДОЧЕРНЕЙ ЗОНЫ',
    status: 'ROOT → COM / DS MATCH',
    accent: 'success',
    focus: 'parent',
  },
  {
    id: 'zone',
    startMs: 11_300,
    eyebrow: 'CHAIN OF TRUST / CHILD KEY',
    title: 'ЦЕПОЧКА ДОХОДИТ ДО КЛЮЧА НУЖНОГО ДОМЕНА',
    status: 'COM → EXAMPLE.COM / DNSKEY',
    accent: 'success',
    focus: 'zone',
  },
  {
    id: 'validate',
    startMs: 14_100,
    eyebrow: 'VALIDATING RESOLVER / COMPLETE PATH',
    title: 'ПОДДЕЛЬНЫЙ ОТВЕТ НЕ ПРОХОДИТ КРИПТОГРАФИЮ',
    status: 'SIGNATURE INVALID / SERVFAIL',
    accent: 'success',
    focus: 'validate',
  },
  {
    id: 'reality',
    startMs: 17_700,
    eyebrow: 'DEPLOYMENT REALITY / TWO INDEPENDENT SIDES',
    title: 'НО ЦЕПОЧКА РАБОТАЕТ, ТОЛЬКО ЕСЛИ ЕЁ СОБРАЛИ И ПРОВЕРИЛИ',
    status: 'ZONE MUST SIGN / RESOLVER MUST VALIDATE',
    accent: 'signal',
    focus: 'reality',
  },
  {
    id: 'lesson',
    startMs: 23_700,
    eyebrow: 'PROTOCOL DESIGN / ADOPTION GAP',
    title: 'ПРАВИЛЬНОЕ РЕШЕНИЕ НЕ РАВНО ВНЕДРЁННОМУ',
    status: 'SPECIFICATION ≠ END-TO-END DEPLOYMENT',
    accent: 'signal',
    focus: 'lesson',
  },
] as const satisfies readonly [DnssecPhase, ...DnssecPhase[]];

export const dnssecStage = {
  answer: 0,
  signature: 1,
  root: 2,
  parent: 3,
  zone: 4,
  validate: 5,
  reality: 6,
  lesson: 7,
} as const satisfies Record<DnssecFocus, number>;

export const trustNodes = [
  {label: 'ROOT', detail: 'TRUST ANCHOR', record: 'KSK'},
  {label: '.COM', detail: 'PARENT ZONE', record: 'DS'},
  {label: 'EXAMPLE.COM', detail: 'SIGNED ZONE', record: 'DNSKEY'},
  {label: 'RRSET', detail: 'ANSWER DATA', record: 'RRSIG'},
] as const;
