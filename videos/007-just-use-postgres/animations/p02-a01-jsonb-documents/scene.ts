import {sourceToEditedMs} from '../../shared/edit-timing';

export const scene = {
  sourceStartMs: 143500,
  editedStartMs: sourceToEditedMs(143500),
  durationMs: 91200,
  entranceMs: 1000,
  compactStartMs: 43800,
  compactEndMs: 45000,
  exitStartMs: 90500,
} as const;

export const chapters = [
  {id: 'binary', startMs: 0, endMs: 14060, title: 'JSON → JSONB'},
  {id: 'products', startMs: 14060, endMs: 34620, title: 'Строгие колонки. Гибкие атрибуты.'},
  {id: 'search', startMs: 34620, endMs: 47020, title: 'Найти все чёрные товары'},
  {id: 'update', startMs: 47020, endMs: 60780, title: 'Одно поле. Всё значение.'},
  {id: 'planner', startMs: 60780, endMs: 74740, title: 'Что знает планировщик'},
  {id: 'gin', startMs: 74740, endMs: 81240, title: 'Быстрый поиск имеет цену'},
  {id: 'resolved', startMs: 81240, endMs: scene.durationMs, title: 'Гибкие данные внутри Postgres'},
] as const;
export type ChapterId = typeof chapters[number]['id'];

export const products = [
  {id: 1, name: 'Футболка', price: '1990', attrs: '{"size": "M", "color": "black"}'},
  {id: 2, name: 'Йогурт', price: '89', attrs: '{"best_before": "2026-11-01",\n "ingredients": ["молоко", "закваска"]}'},
  {id: 3, name: 'Кружка', price: '790', attrs: '{"color": "black", "volume_ml": 350}'},
] as const;

export const sql = {
  create: 'CREATE TABLE products (\n  id     bigint PRIMARY KEY,\n  name   text NOT NULL,\n  price  numeric(10,2) NOT NULL,\n  attrs  jsonb NOT NULL DEFAULT \'{}\'\n);',
  gin: 'CREATE INDEX products_attrs_idx\nON products USING gin (attrs jsonb_path_ops);',
  query: 'SELECT name, attrs->>\'size\' AS size\nFROM products\nWHERE attrs @> \'{"color": "black"}\';',
  statistics: 'CREATE STATISTICS products_color_stats\nON (attrs->>\'color\') FROM products;\nANALYZE products;',
  expressionIndex: 'CREATE INDEX ON products\n((attrs->>\'color\'));',
} as const;

export const progress = (timeMs: number, startMs: number, durationMs = 500): number => {
  const value = Math.max(0, Math.min(1, (timeMs - startMs) / durationMs));
  return value * value * (3 - 2 * value);
};
