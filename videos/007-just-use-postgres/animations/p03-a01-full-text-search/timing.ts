import {smoothProgress} from '@channel/motion-core';
import {sourceToEditedMs} from '../../shared/edit-timing';

export const timing = {
  sourceStartMs: 252000,
  editedStartMs: sourceToEditedMs(252000),
  durationMs: 102000,
  entranceMs: 1000,
  compactStartMs: 68800,
  compactEndMs: 70000,
  exitStartMs: 101200,
} as const;

export const shots = [
  {id: 'index', startMs: 0, endMs: 7020, title: 'Слово → документы', section: 'ELASTICSEARCH / ОБРАТНЫЙ ИНДЕКС'},
  {id: 'analyzer', startMs: 7020, endMs: 13020, title: 'До попадания в индекс', section: 'ELASTICSEARCH / АНАЛИЗАТОР'},
  {id: 'elk', startMs: 13020, endMs: 26420, title: 'Индекс — часть системы', section: 'ELASTICSEARCH / ЭКОСИСТЕМА'},
  {id: 'vector', startMs: 26420, endMs: 47500, title: 'Текст становится tsvector', section: 'POSTGRES / ПОЛНОТЕКСТОВЫЙ ПОИСК'},
  {id: 'table', startMs: 47500, endMs: 61460, title: 'Таблица статей и поисковый индекс', section: 'POSTGRES / ARTICLES'},
  {id: 'query', startMs: 61460, endMs: 71780, title: 'Найти. Исключить. Отсортировать.', section: 'POSTGRES / ПОИСК'},
  {id: 'limits', startMs: 71780, endMs: 90740, title: 'Где начинаются ограничения', section: 'POSTGRES / ГРАНИЦЫ FTS'},
  {id: 'dictionary', startMs: 90740, endMs: timing.durationMs, title: 'Небольшой справочник', section: 'POSTGRES / ПРАКТИЧЕСКИЙ СЦЕНАРИЙ'},
] as const;
export type ShotId = typeof shots[number]['id'];

/** The easing helper accepts arbitrary units; all persisted boundaries stay in ms. */
export const reveal = (timeMs: number, startMs = 0, durationMs = 500): number =>
  smoothProgress(timeMs, startMs, startMs + durationMs);
