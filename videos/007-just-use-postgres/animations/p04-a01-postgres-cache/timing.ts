import {smoothProgress} from '@channel/motion-core';
import {sourceToEditedMs} from '../../shared/edit-timing';

export const timing = {
  sourceStartMs: 365500,
  editedStartMs: sourceToEditedMs(365500),
  durationMs: 91000,
  entranceMs: 1000,
  compactStartMs: 33000,
  compactEndMs: 34000,
  exitStartMs: 90000,
} as const;

export const shots = [
  {id: 'unlogged', startMs: 0, endMs: 17800, title: 'Кэш в обычной таблице', section: 'POSTGRES / UNLOGGED'},
  {id: 'table', startMs: 17800, endMs: 23280, title: 'Один ключ — одна запись', section: 'POSTGRES / CACHE'},
  {id: 'write', startMs: 23280, endMs: 26560, title: 'Записать или обновить', section: 'POSTGRES / ЗАПИСЬ'},
  {id: 'read', startMs: 26560, endMs: 29820, title: 'Прочитать живую запись', section: 'POSTGRES / ЧТЕНИЕ'},
  {id: 'cleanup', startMs: 29820, endMs: 34000, title: 'Срок истёк. Запись ещё здесь.', section: 'POSTGRES / ОЧИСТКА'},
  {id: 'storage', startMs: 34000, endMs: 42680, title: 'UNLOGGED — не память', section: 'ОГРАНИЧЕНИЕ 01 / ЗАДЕРЖКА'},
  {id: 'benchmark', startMs: 42680, endMs: 47500, title: 'Что показал эксперимент', section: 'ОГРАНИЧЕНИЕ 01 / ЗАДЕРЖКА'},
  {id: 'request', startMs: 47500, endMs: 63460, title: 'Горячие данные — тоже в RAM', section: 'ОГРАНИЧЕНИЕ 01 / ПУТЬ ЗАПРОСА'},
  {id: 'crash', startMs: 63460, endMs: 72460, title: 'Кэш не переживает аварию', section: 'ОГРАНИЧЕНИЕ 02 / НАДЁЖНОСТЬ'},
  {id: 'ttl', startMs: 72460, endMs: 79780, title: 'TTL и вытеснение — свой код', section: 'ОГРАНИЧЕНИЕ 03 / ОБСЛУЖИВАНИЕ'},
  {id: 'vacuum', startMs: 79780, endMs: timing.durationMs, title: 'DELETE — ещё не очистка места', section: 'POSTGRES / МЁРТВЫЕ ВЕРСИИ'},
] as const;
export type ShotId = typeof shots[number]['id'];
export const reveal = (timeMs: number, startMs = 0, durationMs = 450): number =>
  smoothProgress(timeMs, startMs, startMs + durationMs);
