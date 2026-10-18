/** Source examples verified in PostgreSQL 17.9 with en_US.UTF-8 locale. */
export const articles = [
  {id: '01', title: 'Очередь задач на Postgres', body: 'Воркеры забирают задачи через SKIP LOCKED, мёртвые строки убирает vacuum', rank: '0.974'},
  {id: '02', title: 'Кэш в Postgres', body: 'Таблица без журнала и очередь на удаление', rank: '0.579'},
  {id: '03', title: 'Почему мы ушли на Kafka', body: 'Очередь в Postgres не выдержала, Kafka держит лог', rank: null},
] as const;

// Use the supplied SQL sentence, not an unverified correction of the narration.
export const words = [
  {word: 'Воркеры', stem: 'воркер', ending: 'ы', position: 1},
  {word: 'забирали', stem: 'забира', ending: 'ли', position: 2},
  {word: 'задачи', stem: 'задач', ending: 'и', position: 3},
  {word: 'из', stem: '', ending: '', position: 4},
  {word: 'очереди', stem: 'очеред', ending: 'и', position: 5},
] as const;

export const sql = {
  vector: "SELECT to_tsvector('russian',\n  'Воркеры забирали задачи из очереди');",
  table: 'CREATE TABLE articles (\n  id     bigserial PRIMARY KEY,\n  title  text NOT NULL,\n  body   text NOT NULL',
  generated: "search tsvector GENERATED ALWAYS AS (\n  setweight(to_tsvector('russian', title), 'A') ||\n  setweight(to_tsvector('russian', body),  'B')\n) STORED",
  gin: 'CREATE INDEX articles_search_idx\nON articles USING gin (search);',
  query: "SELECT title, ts_rank(search, q) AS rank\nFROM articles,\n  websearch_to_tsquery('russian',\n    'очередь postgres -kafka') AS q\nWHERE search @@ q\nORDER BY rank DESC;",
  phrase: "websearch_to_tsquery('russian',\n  '\"мёртвые строки\"')",
  trigram: "SELECT name FROM cities\nWHERE name % 'Екатеренбург';",
} as const;
