import {smoothProgress} from '@channel/motion-core';
import {sourceToEditedMs} from '../../shared/edit-timing';

export const timing = {
  sourceStartMs: 475000, editedStartMs: sourceToEditedMs(475000),
  durationMs: 106400, entranceMs: 1000,
  compactStartMs: 46000, compactEndMs: 47000, exitStartMs: 105400,
} as const;

export const shots = [
  {id: 'table', startMs: 0, endMs: 5540, title: 'Одна строка — одна задача', section: 'POSTGRES / JOBS'},
  {id: 'locks', startMs: 5540, endMs: 15860, title: 'Занято? Бери следующую.', section: 'POSTGRES / SKIP LOCKED'},
  {id: 'lease', startMs: 15860, endMs: 28040, title: 'Короткая блокировка. Долгая аренда.', section: 'POSTGRES / АРЕНДА ЗАДАЧИ'},
  {id: 'transaction', startMs: 28040, endMs: 47000, title: 'Заказ и задача — вместе', section: 'POSTGRES / ОДНА ТРАНЗАКЦИЯ'},
  {id: 'libraries', startMs: 47000, endMs: 62860, title: 'Готовые библиотеки', section: 'ОЧЕРЕДЬ / ЭКОСИСТЕМА'},
  {id: 'retry', startMs: 62860, endMs: 76460, title: 'Как минимум один раз', section: 'ОЧЕРЕДЬ / AT-LEAST-ONCE'},
  {id: 'journal', startMs: 76460, endMs: 85140, title: 'Очередь и журнал', section: 'ОЧЕРЕДЬ / ГРАНИЦЫ МОДЕЛИ'},
  {id: 'versions', startMs: 85140, endMs: 93900, title: 'Статус новый. Версия старая.', section: 'POSTGRES / МЁРТВЫЕ ВЕРСИИ'},
  {id: 'outbox', startMs: 93900, endMs: timing.durationMs, title: 'Outbox и Inbox', section: 'POSTGRES / ПРИМЕНЕНИЕ'},
] as const;
export type ShotId = typeof shots[number]['id'];
export const reveal = (timeMs: number, startMs = 0, durationMs = 450): number =>
  smoothProgress(timeMs, startMs, startMs + durationMs);
