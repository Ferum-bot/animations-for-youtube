export const zoneDelegationTiming = {
  treeMs: 120,
  zoneCutMs: 5_380,
  handoffMs: 11_520,
  childAuthorityMs: 21_220,
  localScopeMs: 28_740,
  noCenterMs: 38_740,
  distributedMs: 46_580,
} as const;

export type HierarchyLabel = {
  readonly id: 'root' | 'edu' | 'chicago' | 'ks' | 'security';
  readonly label: string;
  readonly x: number;
  readonly y: number;
};

export const hierarchyLabels = [
  {id: 'root', label: 'ROOT', x: 176, y: 176},
  {id: 'edu', label: '.EDU', x: 326, y: 268},
  {id: 'chicago', label: 'CHICAGO.EDU', x: 462, y: 360},
  {id: 'ks', label: 'KS.CHICAGO.EDU', x: 604, y: 456},
  {id: 'security', label: 'SECURITY.KS…', x: 774, y: 570},
] as const satisfies readonly HierarchyLabel[];

export const phaseCopy = {
  tree: {
    eyebrow: 'DOMAIN TREE / ONE BRANCH',
    title: 'СНАЧАЛА — ОДНА ВЕТКА DNS',
    status: 'HIERARCHY / ONE CONTINUOUS PATH',
  },
  cut: {
    eyebrow: 'ZONE CUT / ONE BOUNDARY',
    title: 'ДЕРЕВО РЕЖЕТСЯ В ОДНОЙ ТОЧКЕ',
    status: 'ZONE BOUNDARY / OPEN',
  },
  handoff: {
    eyebrow: 'PARENT ZONE / NS REFERRAL',
    title: 'РОДИТЕЛЬ ПУБЛИКУЕТ, КУДА ИДТИ ДАЛЬШЕ',
    status: 'NS REFERRAL / IN PARENT',
  },
  authority: {
    eyebrow: 'CHILD ZONE / AUTHORITATIVE',
    title: 'РЕБЁНОК ОТВЕЧАЕТ ЗА СВОЙ КУСОК',
    status: 'CHILD AUTHORITY / ACTIVE',
  },
  noCenter: {
    eyebrow: 'LOCAL AUTHORITY / LOCAL DATA',
    title: 'НИКТО НЕ ВЛАДЕЕТ ВСЕМ ДЕРЕВОМ',
    status: 'NO GLOBAL OWNER',
  },
  bottleneck: {
    eyebrow: 'DISTRIBUTED CONTROL / NO BOTTLENECK',
    title: 'НЕТ ЦЕНТРА. НЕТ УЗКОГО МЕСТА.',
    status: 'NO CENTRAL QUEUE',
  },
  distributed: {
    eyebrow: 'DNS / DISTRIBUTED GEO DATABASE',
    title: 'КАЖДАЯ ЗОНА — САМОСТОЯТЕЛЬНАЯ БАЗА',
    status: 'DISTRIBUTED BY DELEGATION',
  },
} as const;
