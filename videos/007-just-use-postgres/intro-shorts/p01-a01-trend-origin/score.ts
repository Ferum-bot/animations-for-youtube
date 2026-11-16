import type {PageSpec} from '../ArchivePage';

export const score = {
  sourceVideo: 'https://www.youtube.com/watch?v=vEHA2xgAxEM',
  sourceStartMs: 30800,
  sourceEndMs: 85600,
  bodyMs: 54800,
  outroMs: 5000,
  durationMs: 59800,
} as const;

const light = {sourceWidth: 1280, paper: '#FFFFFF', color: '#171717'} as const;
export const pages = {
  essay: {...light, file: 'essay-site.png', sourceHeight: 720, paper: '#F0ECE0', initialY: 500,
    sourceLabel: 'Stephan Schmidt · Amazing CTO', title: 'Откуда взялось «Just Use Postgres»', passages: [
      {atMs: 600, rect: {x: 172, y: 270, width: 720, height: 125},
        lines: ['Just Use Postgres', 'for Everything'], fontSize: 72,
        note: 'Обсуждение — декабрь 2022. Страница обновлена позже.'},
    ]},
  hn2022: {...light, file: 'hn-2022-site.png', sourceHeight: 720, paper: '#F6F6EF', initialY: 430,
    sourceLabel: 'Hacker News · 10 декабря 2022', passages: [
      {atMs: 0, rect: {x: 127, y: 66, width: 212, height: 15},
        lines: ['707 points', 'Dec 10, 2022'], fontSize: 80, note: 'Обсуждение эссе. Счётчик на сохранённом снимке страницы.'},
    ]},
  laravel: {...light, file: 'laravel-site.png', sourceHeight: 720, paper: '#171717', color: '#E5E5E0', initialY: 410,
    sourceLabel: 'Laravel 11 · Application Defaults', passages: [
      {atMs: 0, rect: {x: 444, y: 196, width: 402, height: 24},
        lines: ['database driver', 'for Laravel’s session,', 'cache, and queue.'], fontSize: 61,
        note: 'Очередь, кэш и сессии — в обычной БД. В этом документе база по умолчанию — SQLite.'},
    ]},
  rails: {...light, file: 'rails-site.png', sourceHeight: 3300, initialY: 300,
    sourceLabel: 'Rails 8 · No PaaS Required', passages: [
      {atMs: 0, rect: {x: 278, y: 1695, width: 410, height: 25},
        lines: ['Solid Cable,', 'Solid Cache,', 'and Solid Queue.'], fontSize: 70},
      {atMs: 4000, rect: {x: 278, y: 1931, width: 324, height: 24},
        lines: ['Solid Cable', 'replaces the need', 'for Redis'], fontSize: 68,
        note: 'Речь об адаптерах Rails, а не об отказе от Redis во всех задачах.'},
    ]},
  neon: {...light, file: 'neon-site.png', sourceHeight: 1850, paper: '#000000', color: '#F6F6F3', initialY: 220,
    sourceLabel: 'Neon · neon.com', passages: [
      {atMs: 0, rect: {x: 427, y: 586, width: 475, height: 63},
        lines: ['Lakebase Postgres.'], fontSize: 73, note: 'Облачный Postgres — продукт спонсора ролика.'},
    ]},
  tiger: {...light, file: 'tiger-site.png', sourceHeight: 3500, initialY: 340,
    sourceLabel: 'Tiger Data · 2 февраля 2026', passages: [
      {atMs: 0, rect: {x: 48, y: 123, width: 1000, height: 64},
        lines: ['It’s 2026,', 'Just Use Postgres'], fontSize: 75},
    ]},
  hn2026: {...light, file: 'hn-2026-site.png', sourceHeight: 720, paper: '#F6F6EF', initialY: 430,
    sourceLabel: 'Hacker News · статья Tiger Data', passages: [
      {atMs: 0, rect: {x: 127, y: 66, width: 440, height: 15},
        lines: ['532 points'], fontSize: 92, note: 'Счётчик на сохранённом снимке обсуждения.'},
    ]},
  extensions: {...light, file: 'tiger-site.png', sourceHeight: 3500, initialY: -1150,
    sourceLabel: 'Tiger Data · The Algorithm Reality', passages: [
      {atMs: 1200, rect: {x: 590, y: 2348, width: 145, height: 193},
        lines: ['pg_textsearch', 'pgvectorscale', 'TimescaleDB'], fontSize: 70,
        note: 'Из рекомендаций статьи — расширения, которые развивает сама Tiger Data.'},
    ]},
} as const satisfies Record<string, PageSpec>;

type PageShot = {readonly kind: 'page'; readonly atMs: number; readonly page: keyof typeof pages};
type MediaShot = {readonly kind: 'youtube' | 'book'; readonly atMs: number};
export const shots: readonly (PageShot | MediaShot)[] = [
  {kind: 'page', atMs: 0, page: 'essay'},
  {kind: 'page', atMs: 7240, page: 'hn2022'},
  {kind: 'page', atMs: 10040, page: 'laravel'},
  {kind: 'page', atMs: 13800, page: 'rails'},
  {kind: 'youtube', atMs: 21460},
  {kind: 'page', atMs: 33420, page: 'neon'},
  {kind: 'book', atMs: 37380},
  {kind: 'page', atMs: 40840, page: 'tiger'},
  {kind: 'page', atMs: 44500, page: 'hn2026'},
  {kind: 'page', atMs: 47780, page: 'extensions'},
];
