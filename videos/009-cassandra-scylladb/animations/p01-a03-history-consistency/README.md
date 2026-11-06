# Восстановимый индекс и выбор хранилища

Полноэкранная вставка `p01-a03-history-consistency`, папка Studio `P-01-History`.
2560×1440, 30 fps, 1676 кадров. CapCut: **00:05:02:04–00:05:58:00**.
Начало исходного аудио: 297633.333333 ms. Сдвиг заставки 4500 ms уже учтён.
Накладывать поверх существующего видео, не раздвигая монтаж.

Просмотр: `task studio`, затем
`http://localhost:3000/Video-009-cassandra-scylladb-p01-a03-history-consistency`.
По умолчанию включены фотография и только нужный отрезок аудио. Для экспорта
передать `previewBackground: "transparent", withAudio: false`; экспортировать
только по запросу пользователя, через `task render:capcut`.

`scene.ts` хранит монтажные границы и смысловые моменты в миллисекундах.
`IndexScene` разделяет задержку обновления реплик и восстановление отсутствующей
записи индекса. Исходное сообщение остаётся сохранено в обоих примерах.
`ShardingScene` показывает условное распределение пользователей, а не историческую
топологию Facebook. PostgreSQL не представлен как рассмотренный Facebook кандидат.
`PapersScene` использует статьи о внутренних Bigtable и Dynamo, не DynamoDB.
HBase: 2007 — включение в Hadoop, не дата основания проекта или выхода в TLP.

## Ассеты и источники

Файлы `apps/remotion/public/assets/009-cassandra-scylladb/p01-consistency/`:

- `heavybit-scroll.jpg`: настоящий браузерный снимок 1280×8000 страницы
  [EnterpriseReady #35](https://www.heavybit.com/library/podcasts/enterpriseready/ep-35-database-software-with-karthik-ranganathan-of-yugabyte),
  13.04.2021, получен 07.11.2026. Абзацы `5c5182329732` и `033159e093d9`.
  Цитаты перепечатаны точно, типографский апостроф заменяет прямой.
- `bigtable-2006.jpg`: первая страница [оригинального PDF Google](https://storage.googleapis.com/gweb-research2023-media/pubtools/4443.pdf), 3000 px по ширине.
- `dynamo-2007.jpg`: первая страница [оригинального PDF Amazon](https://cdn.amazon.science/ac/1d/eb50c4064c538c8ac440ce6a1d91/dynamo-amazons-highly-available-key-value-store.pdf), 3000 px по ширине.
- Дата HBase сверена с [Apache Foundation](https://blogsarchive.apache.org/foundation/entry/the-apache-software-foundation-announces61).

Публичные снимки — материалы цитируемых источников; не рисунки, выданные за сайты.
Оригинальные PDF и материалы исследования остаются вне репозитория.
Фото и AAC лежат в игнорируемом `public/generated/009-cassandra-scylladb/`.
Полное видео для предпросмотра не копируется.
