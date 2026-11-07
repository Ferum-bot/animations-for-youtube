Композиция Studio `P-04-Choice / p04-a02-choice-in-production` занимает
27:11:03–28:56:08 при 30 fps (3155 кадров, выход исключающий).
Для индивидуального просмотра включён фрагмент WAV со смещением 1613.100 с.
Чтобы восстановить локальную дорожку предпросмотра, из корня проекта выполнить:

```sh
ffmpeg -n -ss 1613.100 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 105.166667 -ac 1 -c:a aac -b:a 144k -movflags +faststart apps/remotion/public/generated/009-cassandra-scylladb/choice-in-production-excerpt.m4a
```

Снимки страниц и изображения хранятся в `apps/remotion/public/assets/009-cassandra-scylladb/p04-choice/`.
В `documents.json` сохранены координаты слов в области захвата страницы. При замене снимка их нужно перемерить.
Время начала кадра в `score.ts` отсчитывается от начала вставки, время выделения — от начала кадра.

- Портрет и цитата из [статьи Бо Ингрэма](https://www.scylladb.com/2024/10/15/scylladb-versus-other-databases/), обложка из [каталога Manning](https://www.manning.com/books/scylladb-in-action).
- [Uber, 2023](https://www.uber.com/au/en/blog/how-uber-optimized-cassandra-operations-at-scale/): Workloads и Unreliable Node Replacement.
- [Uber, 2021](https://www.uber.com/au/en/blog/schemaless-sql-database/): Motivation и оригинальная Figure 2, Docstore layered architecture.
- [Netflix TechBlog, 2024](https://netflixtechblog.com/introducing-netflixs-key-value-data-abstraction-layer-1ea8a0a11b30): заголовок, Introduction и Conclusion сняты с [архивной копии HTML оригинала](https://web.archive.org/web/20250516025317/https://netflixtechblog.com/introducing-netflixs-key-value-data-abstraction-layer-1ea8a0a11b30).
- [Vidhya Arvind и Rajasekhar Ummadisetty, FMS 2024](https://files.futurememorystorage.com/proceedings/2024/20240806_DCTR-103-1_Arvind.pdf): слайды 9 и 24, получены из [архива доклада](https://web.archive.org/web/20250419034902/https://files.futurememorystorage.com/proceedings/2024/20240806_DCTR-103-1_Arvind.pdf).
