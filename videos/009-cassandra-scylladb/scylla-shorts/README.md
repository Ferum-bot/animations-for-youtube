# От Cassandra к ScyllaDB — Shorts

В Studio: Videos → V-009-cassandra-scylladb → P-03-ScyllaDB-Shorts.
Формат 1440×2560, 30 fps. Во вступительной реплике и на первом вопросе оригинальная камера из проекта CapCut 1106,
далее полноэкранный разбор. Пример доступа к двум узлам показывает независимые запросы.
Размеры областей памяти условны.

## GC-пауза

Локальные фрагменты первого шортса можно подготовить из корня проекта:

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/scylla-shorts/01
mkdir -p "$out"
ffmpeg -n -ss 111.000 -i /Users/mdpopov/Desktop/cassandra/IMG_4184.MOV -t 7.566667 -map 0:v:0 -an -c copy -tag:v hvc1 -map_metadata -1 -movflags +faststart "$out/presenter-intro.mp4"
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -filter_complex '[0:a]atrim=start=1157.9:end=1165.466667,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=1193.45:end=1205.25,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=1212.55:end=1224.15,asetpts=PTS-STARTPTS[c];[0:a]atrim=start=1362.50:end=1382.50,asetpts=PTS-STARTPTS[d];[a][b][c][d]concat=n=4:v=0:a=1[out]' -map '[out]' -ac 1 -c:a aac -b:a 192k "$out/voice-intro.m4a"
```

Финальный пример использует описание [внутреннего кеша ScyllaDB](https://www.scylladb.com/2024/01/08/inside-scylladbs-internal-cache/).

## Общие данные и shard-per-core

В начале — синхронная камера, затем пример двух ядер и [исходная схема ScyllaDB](https://www.scylladb.com/product/technology/shard-per-core-architecture/).
Чаты и их счётчики служат примером владения данными. Графика кластера находится в материалах главы.

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/scylla-shorts/02
mkdir -p "$out"
ffmpeg -n -ss 211.733334 -i /Users/mdpopov/Desktop/cassandra/IMG_4184.MOV -t 4.866667 -map 0:v:0 -an -c copy -tag:v hvc1 -map_metadata -1 -movflags +faststart "$out/presenter.mp4"
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -filter_complex '[0:a]atrim=start=1253.266666:end=1258.133333,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=1235.8:end=1252.9,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=1390.333333:end=1401.3,asetpts=PTS-STARTPTS[c];[0:a]atrim=start=1406.5:end=1414.85,asetpts=PTS-STARTPTS[d];[0:a]atrim=start=1418.65:end=1426.95,asetpts=PTS-STARTPTS[e];[a][b][c][d][e]concat=n=5:v=0:a=1[out]' -map '[out]' -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```

## OSv, Redis и Cassandra

Архивные материалы используются из основной главы: [фото Дора и Ави](https://www.scylladb.com/company/the-scylla-story/), [статья OSv, USENIX ATC 2014](https://www.usenix.org/conference/atc14/technical-sessions/presentation/kivity), [интервью Дора Лаора](https://www.scylladb.com/2023/10/17/lee-atchison-dor-laor-on-scylladb-solving-problems-at-scale/). Координаты выделения интервью измерены на снимке dor-redis.jpg. Фрагменты исходной фонограммы для Studio:

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/scylla-shorts/03
mkdir -p "$out"
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -filter_complex '[0:a]atrim=start=1258.55:end=1267.75,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=1276.65:end=1312.95,asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1[out]' -map '[out]' -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```

## Зачем ScyllaDB сохранила CQL

Исходные страницы — [интервью Надава Харэля](https://www.scylladb.com/2019/10/16/qa-with-nadav-harel/), [Дор Лаор в CodeStory](https://www.scylladb.com/2023/12/13/codestory/) и [история компании](https://www.scylladb.com/company/the-scylla-story/). В примере CQL таблица messages имеет ключ партиции chat_id. Один и тот же запрос иллюстрирует привычный интерфейс.

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/scylla-shorts/04
mkdir -p "$out"
ffmpeg -n -ss 1321.27 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 41.133333 -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```

## Планировщик диска и compaction

Исходная схема — рисунок 5 из [7 Design Principles Behind ScyllaDB](https://www.scylladb.com/wp-content/uploads/wp-seven-design-principles.pdf), в материалах главы это `scheduler.webp`. В примере чтение чата и фоновые операции обращаются к одному диску. Порядок операций иллюстративный. Политика распределения описана в [Performance Isolation](https://github.com/scylladb/scylladb/blob/master/docs/dev/isolation.md).

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/scylla-shorts/05
mkdir -p "$out"
ffmpeg -n -ss 1429.433333 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 18.966667 -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```

## Сравнение OCTO, декабрь 2015

Фотокопии статьи и координаты исходных строк общие с композицией главы `p03-a03-scylla-benchmarks`. [OCTO](https://blog.octo.com/scylladb-vs-cassandra-towards-a-new-myth) сравнивали раннюю ScyllaDB 0.10 и Cassandra. Длины полос пропорциональны опубликованным округлённым скоростям записи в первом тесте.

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/scylla-shorts/06
mkdir -p "$out"
ffmpeg -n -ss 465.133333 -i /Users/mdpopov/Desktop/cassandra/IMG_4184.MOV -t 8.866667 -map 0:v:0 -an -c copy -tag:v hvc1 -map_metadata -1 -movflags +faststart "$out/presenter.mp4"
ffmpeg -n -ss 1448.633333 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 34.233333 -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```

## Хранилище сообщений Discord

Снимки и схема объединения запросов взяты из [разбора Discord Engineering](https://discord.com/blog/how-discord-stores-trillions-of-messages). Координаты строк общие с основной главой. В отчёте указаны 177 узлов Cassandra и p99 чтения 40–125 мс. Две округлённые цифры из речи опущены. Дорожка для Studio:

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/scylla-shorts/07
mkdir -p "$out"
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -filter_complex '[0:a]atrim=start=1483.22:end=1498.77,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=1501.16:end=1506.78,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=1510.55:end=1538.80,asetpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=0:a=1[out]' -map '[out]' -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```

## Уходить ли с Cassandra из-за Java

Строка xlarge в [тесте benchANT](https://benchant.com/blog/cassandra-5-benchant-ranking) относится к девяти узлам и нагрузке YCSB с равной долей чтения и вставки. Процент сравнивает Cassandra 5.0.6 после настройки с Cassandra 4.0.0. Снимки и координаты выделения взяты из основной главы. Заключительные реплики синхронизированы с камерой из проекта CapCut 1106.

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/scylla-shorts/08
mkdir -p "$out"
ffmpeg -n -ss 609.2 -i /Users/mdpopov/Desktop/cassandra/IMG_4184.MOV -t 14.8 -map 0:v:0 -an -c copy -tag:v hvc1 -map_metadata -1 -movflags +faststart "$out/presenter.mp4"
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -filter_complex '[0:a]atrim=start=1539.30:end=1564.70,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=1574.933333:end=1589.733333,asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1[out]' -map '[out]' -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```
