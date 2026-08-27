export type ConclusionFocus =
  | 'foundation'
  | 'two-ideas'
  | 'delegation'
  | 'cache'
  | 'longevity'
  | 'success'
  | 'constraint'
  | 'patching'
  | 'patch-history'
  | 'patch-modules'
  | 'patch-verdict'
  | 'engineer'
  | 'lookup'
  | 'control-plane'
  | 'balance'
  | 'ttl'
  | 'cname'
  | 'next-system'
  | 'master-lever';

export type ConclusionPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: ConclusionFocus;
};

export const conclusionPhases = [
  {id: 'foundation', startMs: 0, eyebrow: 'FINAL RECAP / ONE SYSTEM', title: 'DNS ДЕРЖИТ СОВРЕМЕННЫЙ ИНТЕРНЕТ', status: 'RECAP / FOUNDATION', accent: 'signal', focus: 'foundation'},
  {id: 'two-ideas', startMs: 5_120, eyebrow: 'TWO IDEAS / SINCE 1983', title: 'ВСЮ СИСТЕМУ ДЕРЖАТ ДВЕ ИДЕИ', status: 'FOUNDATION / TWO PILLARS', accent: 'primary', focus: 'two-ideas'},
  {id: 'delegation', startMs: 9_020, eyebrow: 'HIERARCHY / DELEGATION', title: 'КАЖДЫЙ ОТВЕЧАЕТ ТОЛЬКО ЗА СВОЮ ЗОНУ', status: 'PILLAR 01 / OWNERSHIP', accent: 'signal', focus: 'delegation'},
  {id: 'cache', startMs: 14_120, eyebrow: 'DISTRIBUTED DATA / CACHE', title: 'ДАННЫЕ РАСПРЕДЕЛЕНЫ И КЭШИРУЮТСЯ', status: 'PILLAR 02 / LOCAL ANSWERS', accent: 'success', focus: 'cache'},
  {id: 'longevity', startMs: 17_280, eyebrow: 'FORTY YEARS / SAME MODEL', title: '40 ЛЕТ — АРХИТЕКТУРА ВСЁ ЕЩЁ РАБОТАЕТ', status: '1983 → TODAY / MODEL INTACT', accent: 'primary', focus: 'longevity'},
  {id: 'success', startMs: 20_760, eyebrow: 'GLOBAL SCALE / QUIET SUCCESS', title: 'ОДНА ИЗ САМЫХ УСПЕШНЫХ РАСПРЕДЕЛЁННЫХ СИСТЕМ', status: 'GLOBAL / DISTRIBUTED / PROVEN', accent: 'success', focus: 'success'},
  {id: 'constraint', startMs: 25_520, eyebrow: 'LEGACY / HARD CONSTRAINT', title: 'ПЕРЕПРОЕКТИРОВАТЬ DNS УЖЕ НЕВОЗМОЖНО', status: 'LEGACY / NO CLEAN REWRITE', accent: 'signal', focus: 'constraint'},
  {id: 'patching', startMs: 29_320, eyebrow: 'BACKWARD COMPATIBILITY', title: 'МОЖНО ТОЛЬКО ДОБАВЛЯТЬ ЗАЩИТНЫЕ СЛОИ', status: 'COMPATIBILITY / ADD, DO NOT BREAK', accent: 'primary', focus: 'patching'},
  {id: 'patch-history', startMs: 33_320, eyebrow: 'PATCH HISTORY / LAYER BY LAYER', title: 'ИСТОРИЯ DNS — ЭТО ИСТОРИЯ ЗАПЛАТОК', status: 'CORE / PATCH SURFACE', accent: 'signal', focus: 'patch-history'},
  {id: 'patch-modules', startMs: 35_700, eyebrow: 'PORT / 0x20 / DNSSEC / DoH', title: 'НОВЫЕ МЕХАНИЗМЫ ПРИСТРАИВАЮТСЯ СБОКУ', status: 'PATCH MODULES / DOCKING', accent: 'primary', focus: 'patch-modules'},
  {id: 'patch-verdict', startMs: 42_780, eyebrow: 'IMPERFECT / STILL RUNNING', title: 'КОСТЫЛЬ НА КОСТЫЛЕ — НО СИСТЕМА ЖИВЁТ', status: 'LEGACY / RESILIENT', accent: 'success', focus: 'patch-verdict'},
  {id: 'engineer', startMs: 46_680, eyebrow: 'ENGINEERING / THE USEFUL MODEL', title: 'ИНЖЕНЕРУ ВАЖНО УВИДЕТЬ ГЛАВНОЕ', status: 'REFRAME / LOOKUP → CONTROL', accent: 'signal', focus: 'engineer'},
  {id: 'lookup', startMs: 50_280, eyebrow: 'NAME RESOLUTION / TOO NARROW', title: 'DNS — НЕ ПРОСТО NAME → IP', status: 'LOOKUP / EXPANDING MODEL', accent: 'primary', focus: 'lookup'},
  {id: 'control-plane', startMs: 52_200, eyebrow: 'TRAFFIC CONTROL / SYSTEM EFFECT', title: 'DNS — ЭТО ТОЧКА УПРАВЛЕНИЯ ТРАФИКОМ', status: 'CONTROL PLANE / ACTIVE', accent: 'success', focus: 'control-plane'},
  {id: 'balance', startMs: 54_380, eyebrow: 'LEVER 01 / MULTIPLE ANSWERS', title: 'НЕСКОЛЬКО АДРЕСОВ — УЖЕ БАЛАНСИРОВКА', status: 'A / AAAA / BALANCE', accent: 'primary', focus: 'balance'},
  {id: 'ttl', startMs: 58_620, eyebrow: 'LEVER 02 / CHANGE SPEED', title: 'TTL ЗАДАЁТ СКОРОСТЬ ПЕРЕКЛЮЧЕНИЯ', status: 'TTL / FAILOVER WINDOW', accent: 'signal', focus: 'ttl'},
  {id: 'cname', startMs: 61_400, eyebrow: 'LEVER 03 / INDIRECTION', title: 'CNAME ДОБАВЛЯЕТ СЛОЙ КОСВЕННОСТИ', status: 'CNAME / CHANGE WITHOUT CLIENTS', accent: 'primary', focus: 'cname'},
  {id: 'next-system', startMs: 63_840, eyebrow: 'SYSTEM DESIGN / REMEMBER THIS', title: 'СОБЕРИ ЭТИ РЫЧАГИ В СЛЕДУЮЩЕЙ СИСТЕМЕ', status: 'ENGINEERING / THREE LEVERS', accent: 'signal', focus: 'next-system'},
  {id: 'master-lever', startMs: 67_120, eyebrow: 'FINAL MODEL / CONTROL PLANE', title: 'DNS — ОДИН ИЗ САМЫХ МОЩНЫХ РЫЧАГОВ', status: 'DNS / TRAFFIC CONTROL / MASTER', accent: 'success', focus: 'master-lever'},
] as const satisfies readonly [ConclusionPhase, ...ConclusionPhase[]];

export const conclusionSceneWindows = {
  pillars: {startMs: 0, endMs: 17_850},
  longevity: {startMs: 16_780, endMs: 25_950},
  patchwork: {startMs: 25_020, endMs: 47_150},
  controlPlane: {startMs: 46_180, endMs: 54_850},
  levers: {startMs: 53_880, endMs: 70_860},
} as const;

export const patchModules = [
  {label: 'SOURCE PORT', detail: 'MORE ENTROPY', tone: 'primary'},
  {label: '0x20 CASE', detail: 'EXTRA BITS', tone: 'signal'},
  {label: 'DNSSEC', detail: 'AUTHENTICITY', tone: 'success'},
  {label: 'DoH', detail: 'ENCRYPTED TRANSPORT', tone: 'primary'},
] as const;
