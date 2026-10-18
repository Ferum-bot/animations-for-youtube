import {smoothProgress} from '@channel/motion-core';
import {sourceToEditedMs} from '../../shared/edit-timing';

export const scene = {
  sourceStartMs: 0,
  editedStartMs: sourceToEditedMs(0),
  durationMs: 30300,
  titleStartMs: 2800,
  titleExitMs: 17140,
  articlesStartMs: 18960,
  videoStartMs: 26180,
} as const;

export const visibility = (timeMs: number, startMs: number, endMs: number): number =>
  smoothProgress(timeMs, startMs, startMs + 320) *
  (1 - smoothProgress(timeMs, endMs - 360, endMs));

export const replacements = [
  {label: 'Redis', fontSize: 256, startMs: 9840, endMs: 11180},
  {label: 'RabbitMQ', fontSize: 232, startMs: 11180, endMs: 12100},
  {label: 'MongoDB', fontSize: 232, startMs: 12100, endMs: 13600},
  {label: 'Elasticsearch', fontSize: 190, startMs: 13600, endMs: 15060},
] as const satisfies readonly {readonly label: string;
  readonly fontSize: number; readonly startMs: number; readonly endMs: number}[];

export const articles = [
  {id: 'cache', file: 'habr-cache.png', width: 778, height: 305, top: 0,
    enterMs: 18960, focusMs: 23000, focusEndMs: 24300,
    url: 'https://habr.com/ru/articles/951164/',
    title: 'Redis работает быстро — я буду кэшировать данные в Postgres'},
  {id: 'queue', file: 'habr-queue.png', width: 778, height: 180, top: 412,
    enterMs: 19600, focusMs: 24300, focusEndMs: 25400,
    url: 'https://habr.com/ru/articles/1082062/',
    title: 'Очередь на Postgres: почему Kafka не нужна'},
  {id: 'search', file: 'habr-search.png', width: 681, height: 290, top: 664,
    enterMs: 20240, focusMs: 25400, focusEndMs: 26180,
    url: 'https://habr.com/ru/companies/otus/articles/970854/',
    title: 'Отправляем Elasticsearch в отпуск: полнотекстовый поиск на одном PostgreSQL'},
] as const;

export const videoReference = {
  file: 'youtube-postgres.png',
  width: 726,
  height: 586,
  author: 'Олег Козырев',
  title: 'Postgres вместо Redis, Kafka и Elasticsearch: где предел',
  url: 'https://www.youtube.com/watch?v=ytCoB20a4BQ',
} as const;
