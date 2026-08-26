export type RootServerPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly visibleCount: number;
  readonly focus: 'summit' | 'count' | 'sample' | 'set' | 'config';
};

export const rootServerPhases = [
  {
    id: 'summit',
    startMs: 120,
    eyebrow: 'DNS TREE / STARTING POINT',
    title: 'НА ВЕРШИНЕ ДЕРЕВА — КОРЕНЬ',
    status: 'ROOT ZONE / LABEL "."',
    accent: 'primary',
    visibleCount: 0,
    focus: 'summit',
  },
  {
    id: 'count',
    startMs: 6_540,
    eyebrow: 'ROOT SERVER SYSTEM',
    title: 'У КОРНЯ — 13 ЛОГИЧЕСКИХ ИМЁН',
    status: '13 IDENTITIES / NOT 13 PHYSICAL MACHINES',
    accent: 'signal',
    visibleCount: 13,
    focus: 'count',
  },
  {
    id: 'sample',
    startMs: 10_800,
    eyebrow: 'CANONICAL NAME / FIRST IDENTITY',
    title: 'ПЕРВЫЙ — A.ROOT-SERVERS.NET.',
    status: 'A / ROOT-SERVERS.NET.',
    accent: 'signal',
    visibleCount: 1,
    focus: 'sample',
  },
  {
    id: 'set',
    startMs: 12_980,
    eyebrow: 'ORDERED SET / A THROUGH M',
    title: 'И ТАК ДО БУКВЫ M',
    status: '[A … M].ROOT-SERVERS.NET.',
    accent: 'primary',
    visibleCount: 13,
    focus: 'set',
  },
  {
    id: 'config',
    startMs: 16_520,
    eyebrow: 'RESOLVER / BUILT-IN STARTING ADDRESSES',
    title: 'РЕЗОЛВЕР ЗНАЕТ, С ЧЕГО НАЧАТЬ',
    status: '13 ROOT IDENTITIES → RESOLVER CONFIG',
    accent: 'success',
    visibleCount: 13,
    focus: 'config',
  },
] as const satisfies readonly RootServerPhase[];
