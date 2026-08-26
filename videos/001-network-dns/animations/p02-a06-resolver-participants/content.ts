export const resolverParticipantsTiming = {
  openingMs: 120,
  stubMs: 5_960,
  libraryMs: 11_080,
  callMs: 16_140,
  recursiveMs: 23_860,
  publicResolversMs: 26_620,
  authorityMs: 34_180,
  completeMs: 37_420,
} as const;

export type ResolverRole = {
  readonly id: 'stub' | 'recursive' | 'authority';
  readonly index: '01' | '02' | '03';
  readonly location: string;
  readonly locationMeta: string;
  readonly title: string;
  readonly subtitle: string;
  readonly accent: 'primary' | 'signal' | 'success';
};

export const resolverRoles = [
  {
    id: 'stub',
    index: '01',
    location: 'ТВОЙ ПРОЦЕСС',
    locationMeta: 'БРАУЗЕР / CLI / ПРИЛОЖЕНИЕ',
    title: 'STUB RESOLVER',
    subtitle: 'БИБЛИОТЕКА В ПРОЦЕССЕ',
    accent: 'primary',
  },
  {
    id: 'recursive',
    index: '02',
    location: 'СЕТЬ / DNS-ПРОВАЙДЕР',
    locationMeta: 'РОУТЕР / ISP / PUBLIC DNS',
    title: 'RECURSIVE',
    subtitle: 'ДЕЛАЕТ РАБОТУ ЗА КЛИЕНТА',
    accent: 'signal',
  },
  {
    id: 'authority',
    index: '03',
    location: 'ВНЕШНЯЯ DNS-СЕТЬ',
    locationMeta: 'ROOT / TLD / DNS-ПРОВАЙДЕР ЗОНЫ',
    title: 'AUTHORITATIVE',
    subtitle: 'ХРАНИТ ИСТИНУ О ЗОНЕ',
    accent: 'success',
  },
] as const satisfies readonly ResolverRole[];

export const participantPhaseCopy = {
  opening: {
    eyebrow: 'ONE QUERY / THREE ROLES',
    title: 'У ЗАПРОСА — ТРИ УЧАСТНИКА',
  },
  stub: {
    eyebrow: 'CLIENT PROCESS / LOCAL LIBRARY',
    title: 'STUB RESOLVER ЖИВЁТ ВНУТРИ ПРОЦЕССА',
  },
  recursive: {
    eyebrow: 'LOCAL OR PUBLIC RESOLVER',
    title: 'РЕКУРСИВНЫЙ РЕЗОЛВЕР ДЕЛАЕТ РАБОТУ',
  },
  authority: {
    eyebrow: 'ROOT → TLD → ZONE',
    title: 'АВТОРИТЕТНЫЕ СЕРВЕРЫ ХРАНЯТ ОТВЕТ',
  },
  complete: {
    eyebrow: 'DNS REQUEST PATH / READY',
    title: 'ТРИ РОЛИ. ОДИН МАРШРУТ.',
  },
} as const;
