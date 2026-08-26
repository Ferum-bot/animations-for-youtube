export type ResolverOwnershipFocus = 'provider' | 'tunnel' | 'selection' | 'control' | 'tools' | 'choice' | 'default';

export type ResolverOwnershipPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: ResolverOwnershipFocus;
};

export const resolverOwnershipPhases = [
  {
    id: 'provider',
    startMs: 120,
    eyebrow: 'BEFORE DoH / ISP RESOLVER',
    title: 'РАНЬШЕ DNS-ЗАПРОСЫ ВИДЕЛ ТВОЙ ПРОВАЙДЕР',
    status: 'BROWSER → ISP RESOLVER',
    accent: 'signal',
    focus: 'provider',
  },
  {
    id: 'tunnel',
    startMs: 2_280,
    eyebrow: 'DoH / ENCRYPTED BROWSER PATH',
    title: 'DoH СКРЫВАЕТ DNS ОТ НАБЛЮДАТЕЛЯ НА ПУТИ',
    status: 'DNS CONTENT / ENCRYPTED IN TRANSIT',
    accent: 'success',
    focus: 'tunnel',
  },
  {
    id: 'selection',
    startMs: 5_860,
    eyebrow: 'BROWSER POLICY / RESOLVER SELECTION',
    title: 'БРАУЗЕР НАПРАВЛЯЕТ ЗАПРОС К ВЫБРАННОМУ РЕЗОЛВЕРУ',
    status: 'BROWSER → CHOSEN DNS',
    accent: 'primary',
    focus: 'selection',
  },
  {
    id: 'control',
    startMs: 9_520,
    eyebrow: 'SAME HISTORY / NEW OPERATOR',
    title: 'ТОЧКА НАБЛЮДЕНИЯ ПЕРЕЕЗЖАЕТ ВМЕСТЕ С РЕЗОЛВЕРОМ',
    status: 'QUERY HISTORY / CONTROL SHIFT',
    accent: 'primary',
    focus: 'control',
  },
  {
    id: 'tools',
    startMs: 13_100,
    eyebrow: 'LOCAL POLICY / LOST VISIBILITY',
    title: 'ПРОВАЙДЕР ТЕРЯЕТ ЧАСТЬ DNS-ИНСТРУМЕНТОВ',
    status: 'FILTERING / PARENTAL CONTROL',
    accent: 'signal',
    focus: 'tools',
  },
  {
    id: 'choice',
    startMs: 16_600,
    eyebrow: 'USER CHOICE / IN THEORY',
    title: 'ФОРМАЛЬНО ПОЛЬЗОВАТЕЛЬ САМ ВЫБИРАЕТ, КОМУ ДОВЕРЯТЬ',
    status: 'ISP OR CHOSEN RESOLVER',
    accent: 'success',
    focus: 'choice',
  },
  {
    id: 'default',
    startMs: 20_000,
    eyebrow: 'DEFAULTS / REAL-WORLD CONTROL',
    title: 'НА ПРАКТИКЕ ВЫБОР ЧАСТО ДЕЛАЕТ НАСТРОЙКА ПО УМОЛЧАНИЮ',
    status: 'BROWSER DEFAULT / ACTIVE',
    accent: 'signal',
    focus: 'default',
  },
] as const satisfies readonly [ResolverOwnershipPhase, ...ResolverOwnershipPhase[]];

export const resolverOwnershipStage = {
  provider: 0,
  tunnel: 1,
  selection: 2,
  control: 3,
  tools: 4,
  choice: 5,
  default: 6,
} as const satisfies Record<ResolverOwnershipFocus, number>;
