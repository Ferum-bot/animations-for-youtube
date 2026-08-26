export type RootMythFocus = 'myth' | 'model' | 'identities';

export type RootMythPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: RootMythFocus;
};

export const rootMythPhases = [
  {
    id: 'myth',
    startMs: 80,
    eyebrow: 'МИФ 01 / ОШИБОЧНАЯ МОДЕЛЬ',
    title: 'КОРНЕВЫХ СЕРВЕРОВ ВСЕГО 13?',
    status: 'MYTH / 13 PHYSICAL MACHINES',
    accent: 'signal',
    focus: 'myth',
  },
  {
    id: 'model',
    startMs: 4_300,
    eyebrow: 'ЧТО ИМЕННО МЫ СЧИТАЕМ',
    title: '13 — НЕ КОЛИЧЕСТВО ФИЗИЧЕСКИХ МАШИН',
    status: 'MODEL / PHYSICAL → LOGICAL',
    accent: 'primary',
    focus: 'model',
  },
  {
    id: 'identities',
    startMs: 9_720,
    eyebrow: 'ПРАВИЛЬНАЯ ТОЧКА ОТСЧЁТА',
    title: 'СНАЧАЛА ОТДЕЛИМ ИМЯ ОТ СЕРВЕРА',
    status: 'NEXT / ROOT IDENTITIES A–M',
    accent: 'success',
    focus: 'identities',
  },
] as const satisfies readonly [RootMythPhase, ...RootMythPhase[]];

export const rootMythStage = {
  myth: 0,
  model: 1,
  identities: 2,
} as const satisfies Record<RootMythFocus, number>;
