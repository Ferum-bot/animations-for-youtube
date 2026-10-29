export type RetryFocus = 'retries' | 'dlq' | 'manual';

type Topic = {
  readonly name: string;
  readonly suffix: string;
  readonly delay: string;
  readonly focus: Exclude<RetryFocus, 'manual'> | null;
};

/** Topic names and example delays from the materials, pp. 19–20. */
export const topics = [
  {name: 'push.p0', suffix: '', delay: 'Основной поток', focus: null},
  {name: 'push.p0', suffix: '.retry-1m', delay: '≥ 1 мин', focus: 'retries'},
  {name: 'push.p0', suffix: '.retry-10m', delay: '≥ 10 мин', focus: 'retries'},
  {name: 'push.p0', suffix: '.retry-1h', delay: '≥ 1 час', focus: 'retries'},
  {name: 'push.dlq', suffix: '', delay: 'Ручной разбор', focus: 'dlq'},
] as const satisfies readonly Topic[];
