import {sourceToEditedMs} from '../../shared/edit-timing';

export const scene = {
  sourceStartMs: 30300,
  editedStartMs: sourceToEditedMs(30300),
  sourceEndMs: 85300,
  durationMs: 55000,
} as const;

type Source = {readonly file: string; readonly width: number; readonly height: number;
  readonly description: string; readonly url: string};

export const sources = {
  essay: {file: 'essay-site.png', width: 1280, height: 720, description: 'Just Use Postgres for Everything — Stephan Schmidt', url: 'https://www.amazingcto.com/postgres-for-everything/'},
  hn2022: {file: 'hn-2022-site.png', width: 1280, height: 720, description: 'Hacker News, 10 декабря 2022, 707 points', url: 'https://news.ycombinator.com/item?id=33934139'},
  laravel: {file: 'laravel-site.png', width: 1280, height: 720, description: 'Laravel 11 — Application Defaults', url: 'https://laravel.com/docs/11.x/releases#application-defaults'},
  railsPage: {file: 'rails-site.png', width: 1280, height: 3300, description: 'Rails 8 article — database-backed adapters', url: 'https://rubyonrails.org/2024/11/7/rails-8-no-paas-required'},
  fireship: {file: 'fireship.png', width: 893, height: 155, description: 'Fireship: I replaced my entire tech stack with Postgres...', url: 'https://www.youtube.com/watch?v=3JW732GrMdg'},
  theoPostgres: {file: 'theo-postgres.png', width: 893, height: 158, description: 'Theo: I finally switched to Postgres.', url: 'https://www.youtube.com/watch?v=iIMIKgRvS1Q'},
  theoChaotic: {file: 'theo-chaotic.png', width: 893, height: 155, description: 'Theo: My chaotic journey to find the right database', url: 'https://www.youtube.com/watch?v=3gVBjTMS8FE'},
  sponsor: {file: 'sponsor.png', width: 620, height: 26, description: 'Neon sponsor link in the Fireship description', url: 'https://www.youtube.com/watch?v=3JW732GrMdg'},
  neon: {file: 'neon-site.png', width: 1280, height: 1850, description: 'Neon — Lakebase Postgres', url: 'https://neon.com/'},
  neonPricing: {file: 'neon-pricing.png', width: 1280, height: 1500, description: 'Neon pricing — paid Lakebase Postgres plans', url: 'https://neon.com/pricing'},
  book: {file: 'book.png', width: 360, height: 480, description: 'Just Use Postgres! — Denis Magda, Manning', url: 'https://www.manning.com/books/just-use-postgres'},
  tiger: {file: 'tiger-site.png', width: 1280, height: 3500, description: 'It’s 2026, Just Use Postgres — TigerData', url: 'https://www.tigerdata.com/blog/its-2026-just-use-postgres'},
  hn2026: {file: 'hn-2026-site.png', width: 1280, height: 720, description: 'TigerData on Hacker News, 532 points', url: 'https://news.ycombinator.com/item?id=46905555'},
} as const satisfies Record<string, Source>;

// Coordinates refer to unscaled screenshot pixels. All timing is narration milliseconds.
export type ScrollStop = {readonly timeMs: number; readonly y: number};
type HighlightRect = {readonly x: number; readonly y: number; readonly width: number; readonly height: number};
export type SourceHighlight = {
  readonly id: string;
  readonly startMs: number;
  readonly endMs: number;
  readonly rects: readonly HighlightRect[];
};
export type HistoryLayer = {
  readonly id: string;
  readonly source: keyof typeof sources;
  readonly startMs: number;
  readonly endMs: number;
  readonly top: number;
  readonly left?: number;
  readonly width: number;
  readonly viewportHeight?: number;
  readonly headerHeight?: number;
  readonly scroll?: readonly ScrollStop[];
  readonly highlights?: readonly SourceHighlight[];
};

const siteWidth = 1440;
const siteTop = 170;

export const layers = [
  {id: 'essay', source: 'essay', width: siteWidth, top: siteTop,
    startMs: 30300, endMs: 38040},
  {id: 'hn-first', source: 'hn2022', width: siteWidth, top: siteTop, startMs: 38040, endMs: 40840},
  {id: 'laravel', source: 'laravel', width: siteWidth, top: siteTop,
    startMs: 40840, endMs: 44600,
    highlights: [{id: 'database-defaults', startMs: 41500, endMs: 44600, rects: [
      {x: 360, y: 169, width: 536, height: 22},
      {x: 360, y: 198, width: 486, height: 22},
    ]}]},
  {id: 'rails-page', source: 'railsPage', width: siteWidth, top: 130,
    viewportHeight: 1080, headerHeight: 150, startMs: 44600, endMs: 52260,
    scroll: [{timeMs: 45600, y: 0}, {timeMs: 46700, y: 1330},
      {timeMs: 48900, y: 1330}, {timeMs: 49600, y: 1710}],
    highlights: [
      {id: 'database-adapters', startMs: 46900, endMs: 49000, rects: [
        {x: 278, y: 1617, width: 702, height: 23},
        {x: 278, y: 1643, width: 705, height: 23},
        {x: 278, y: 1669, width: 700, height: 23},
        {x: 278, y: 1695, width: 407, height: 23},
      ]},
      {id: 'redis-cable', startMs: 49700, endMs: 52260, rects: [
        {x: 278, y: 1931, width: 323, height: 24},
      ]},
      {id: 'redis-cache', startMs: 50200, endMs: 52260, rects: [
        {x: 278, y: 2220, width: 510, height: 24},
      ]},
    ]},
  {id: 'youtube-1', source: 'theoChaotic', width: siteWidth, top: 180, startMs: 52260, endMs: 55460},
  {id: 'youtube-2', source: 'theoPostgres', width: siteWidth, top: 510, startMs: 52720, endMs: 55460},
  {id: 'youtube-3', source: 'fireship', width: siteWidth, top: 840, startMs: 53180, endMs: 55460},
  {id: 'fireship-focus', source: 'fireship', width: siteWidth, top: 390, startMs: 55460, endMs: 62200},
  {id: 'sponsor-proof', source: 'sponsor', width: siteWidth, top: 720, startMs: 61000, endMs: 62200},
  {id: 'neon-site', source: 'neon', width: siteWidth, top: siteTop,
    viewportHeight: 1000, headerHeight: 100, startMs: 62200, endMs: 65400,
    scroll: [{timeMs: 62800, y: 300}, {timeMs: 64600, y: 390}]},
  {id: 'neon-pricing', source: 'neonPricing', width: siteWidth, top: siteTop,
    viewportHeight: 1000, headerHeight: 100, startMs: 65400, endMs: 68180,
    scroll: [{timeMs: 65800, y: 0}, {timeMs: 67300, y: 100}]},
  {id: 'book-cover', source: 'book', width: 840, left: 300, top: 130, startMs: 68180, endMs: 71640},
  {id: 'tiger-article', source: 'tiger', width: siteWidth, top: siteTop,
    viewportHeight: 1000, headerHeight: 80, startMs: 71640, endMs: 75300,
    scroll: [{timeMs: 73000, y: 0}, {timeMs: 74700, y: 110}]},
  {id: 'tiger-hn', source: 'hn2026', width: siteWidth, top: siteTop, startMs: 75300, endMs: 78580},
  {id: 'tiger-extensions', source: 'tiger', width: siteWidth, top: siteTop,
    viewportHeight: 1000, headerHeight: 80, startMs: 78580, endMs: 85300,
    scroll: [{timeMs: 80000, y: 2030}, {timeMs: 83500, y: 2380}]},
] as const satisfies readonly HistoryLayer[];
