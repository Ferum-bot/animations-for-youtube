import {smoothProgress} from '@channel/motion-core';
import {sourceToEditedMs} from '../../shared/edit-timing';
export const timing = {
  sourceStartMs: 607500, editedStartMs: sourceToEditedMs(607500),
  durationMs: 79800, entranceMs: 1000,
  compactStartMs: 50000, compactEndMs: 51000, exitStartMs: 78800,
} as const;
export const shots = [
  {id: 'channel', startMs: 0, endMs: 13120, title: 'Один канал. Все подписчики.', section: 'POSTGRES / LISTEN + NOTIFY'},
  {id: 'listener', startMs: 13120, endMs: 23640, title: 'Подписка живёт в соединении', section: 'GO / ПОДПИСЧИК'},
  {id: 'producer', startMs: 23640, endMs: 31600, title: 'Изменение и сигнал — вместе', section: 'GO / PRODUCER'},
  {id: 'commit', startMs: 31600, endMs: 36600, title: 'Сначала COMMIT', section: 'POSTGRES / ДОСТАВКА'},
  {id: 'rollback', startMs: 36600, endMs: 39660, title: 'ROLLBACK — без уведомления', section: 'POSTGRES / ОТКАТ'},
  {id: 'dedup', startMs: 39660, endMs: 43280, title: 'Два вызова. Один сигнал.', section: 'POSTGRES / ОДНА ТРАНЗАКЦИЯ'},
  {id: 'trigger', startMs: 43280, endMs: 51000, title: 'Задача появилась — воркеры проснулись', section: 'POSTGRES / ТРИГГЕР'},
  {id: 'offline', startMs: 51000, endMs: 64520, title: 'Отключился — пропустил', section: 'ОГРАНИЧЕНИЕ 01 / БЕЗ ИСТОРИИ'},
  {id: 'payload', startMs: 64520, endMs: 69520, title: 'Меньше 8000 байт', section: 'ОГРАНИЧЕНИЕ 02 / PAYLOAD'},
  {id: 'pool', startMs: 69520, endMs: timing.durationMs, title: 'LISTEN привязан к сессии', section: 'ОГРАНИЧЕНИЕ 03 / PGBOUNCER'},
] as const;
export type ShotId = typeof shots[number]['id'];
export const reveal = (timeMs: number, startMs = 0, durationMs = 450): number =>
  smoothProgress(timeMs, startMs, startMs + durationMs);

export const poolTiming = {
  releaseMs: 2500,
  reassignMs: 3800,
  explanationMs: 4700,
  fixedSessionMs: 6200,
} as const;
