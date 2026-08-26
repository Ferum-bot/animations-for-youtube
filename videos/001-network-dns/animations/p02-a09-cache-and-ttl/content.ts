export type CacheRoute = 'idle' | 'fill' | 'skip-root' | 'skip-tld' | 'cold' | 'warm' | 'authority' | 'ttl' | 'tradeoff';

export type CachePhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly route: CacheRoute;
  readonly cachedEntries: 0 | 1 | 2 | 3;
};

export const cachePhases = [
  {
    id: 'setup',
    startMs: 120,
    eyebrow: 'RECURSIVE RESOLVER / MEMORY',
    title: 'КЭШ СОКРАЩАЕТ DNS-МАРШРУТ',
    status: 'CACHE / EMPTY',
    accent: 'primary',
    route: 'idle',
    cachedEntries: 0,
  },
  {
    id: 'fill',
    startMs: 16_680,
    eyebrow: 'CACHE EVERYTHING / INCLUDING REFERRALS',
    title: 'СОХРАНЯЮТСЯ ДАЖЕ ЧАСТИЧНЫЕ ОТВЕТЫ',
    status: 'NS .EDU + NS CHICAGO + A RECORD',
    accent: 'primary',
    route: 'fill',
    cachedEntries: 3,
  },
  {
    id: 'skip-root',
    startMs: 20_080,
    eyebrow: 'CACHE HIT / .EDU REFERRAL',
    title: 'ЗНАЕМ .EDU — КОРЕНЬ БОЛЬШЕ НЕ НУЖЕН',
    status: 'ROOT / BYPASSED',
    accent: 'success',
    route: 'skip-root',
    cachedEntries: 1,
  },
  {
    id: 'skip-tld',
    startMs: 24_480,
    eyebrow: 'CACHE HIT / CHICAGO DELEGATION',
    title: 'ЗНАЕМ CHICAGO — ИДЁМ СРАЗУ В ЗОНУ',
    status: 'ROOT + .EDU / BYPASSED',
    accent: 'success',
    route: 'skip-tld',
    cachedEntries: 2,
  },
  {
    id: 'cold',
    startMs: 29_040,
    eyebrow: 'COLD CACHE / WORST CASE',
    title: 'ПУСТОЙ КЭШ ПРОХОДИТ ВЕСЬ ПУТЬ',
    status: 'ROOT → .EDU → CHICAGO → AUTH',
    accent: 'signal',
    route: 'cold',
    cachedEntries: 0,
  },
  {
    id: 'warm',
    startMs: 31_440,
    eyebrow: 'WARM CACHE / COMMON CASE',
    title: 'БОЛЬШИНСТВО ЗАПРОСОВ ГАСНЕТ РЯДОМ',
    status: 'ANSWER / FROM RECURSIVE CACHE',
    accent: 'success',
    route: 'warm',
    cachedEntries: 3,
  },
  {
    id: 'authority',
    startMs: 41_080,
    eyebrow: 'CACHE COPY ≠ SOURCE OF TRUTH',
    title: 'КЭШ НЕ СТАНОВИТСЯ АВТОРИТЕТНЫМ',
    status: 'COPY / NON-AUTHORITATIVE',
    accent: 'signal',
    route: 'authority',
    cachedEntries: 3,
  },
  {
    id: 'no-push',
    startMs: 44_660,
    eyebrow: 'NO GLOBAL INVALIDATION PUSH',
    title: 'ОБНОВЛЕНИЕ НЕ РАЗЛЕТАЕТСЯ ПО КЭШАМ',
    status: 'AUTH CHANGED / CACHE UNAWARE',
    accent: 'signal',
    route: 'authority',
    cachedEntries: 3,
  },
  {
    id: 'ttl',
    startMs: 48_340,
    eyebrow: 'TTL / EXPIRATION CONTRACT',
    title: 'КОПИЯ ЖИВЁТ РОВНО ДО ИСТЕЧЕНИЯ TTL',
    status: 'TTL / COUNTDOWN → EXPIRE',
    accent: 'primary',
    route: 'ttl',
    cachedEntries: 3,
  },
  {
    id: 'tradeoff',
    startMs: 52_660,
    eyebrow: 'TTL / ENGINEERING TRADE-OFF',
    title: 'СКОРОСТЬ И СВЕЖЕСТЬ НЕЛЬЗЯ МАКСИМИЗИРОВАТЬ СРАЗУ',
    status: 'LONG TTL ↔ SHORT TTL',
    accent: 'success',
    route: 'tradeoff',
    cachedEntries: 3,
  },
] as const satisfies readonly CachePhase[];

export const cacheEntries = [
  {label: '.EDU', type: 'NS', value: 'a.edu-servers.net.'},
  {label: 'CHICAGO.EDU', type: 'NS', value: 'ns1.chicago.edu.'},
  {label: 'NOISE.KS…', type: 'A', value: '192.0.2.42'},
] as const;
