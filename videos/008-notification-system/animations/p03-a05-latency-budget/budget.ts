/** Voice takes precedence over materials p. 25: relay is 50–300 ms. */
export const stages = [
  {id: 'ingest', label: 'Приём + транзакция с outbox', value: '≈100 мс', upperMs: 100,
    notes: ['p95; обычно 20–30 мс', 'idempotency_key; короткая транзакция']},
  {id: 'relay', label: 'Релей outbox → Kafka', value: '50–300 мс', upperMs: 300,
    notes: ['CDC / Debezium', 'или polling-worker']},
  {id: 'mainLag', label: 'Лаг notifications.p0', value: '≤500 мс', upperMs: 500,
    notes: ['Consumer lag P0', 'метрики и алерты']},
  {id: 'orchestrator', label: 'Orchestrator', value: '≤50 мс', upperMs: 50,
    notes: ['Пользовательские настройки', 'из Redis-кэша']},
  {id: 'channelLag', label: 'Лаг push.p0 / sms.p0', value: '≤500 мс', upperMs: 500,
    notes: ['Очередь непосредственной отправки']},
  {id: 'provider', label: 'Вызов провайдера', value: '≤500 мс', upperMs: 500,
    notes: ['Обычно 200–250 мс']},
] as const;

export type StageId = typeof stages[number]['id'];
export type BudgetFocus = StageId | 'goal' | 'ingestNote' | 'normal' | 'reserve' | 'retry' | 'fallback';

// A typical path is distinct from adding all the upper stage estimates.
export const budget = {limitMs: 5000, typicalMs: 1500} as const;
export const upperTotalMs = stages.reduce((sum, stage) => sum + stage.upperMs, 0);
export const secondsLabel = (ms: number) => String(ms / 1000).replace('.', ',');
export const providerObservation = ['В проектах автора:', 'p95 — 100–110 мс'] as const;
