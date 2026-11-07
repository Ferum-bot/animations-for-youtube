# История и устройство ScyllaDB

В Studio — P-03-ScyllaDB → p03-a02-scylla-origins-engine. Второй фрагмент главы после вступительного отрезка с ведущим. Монтаж CapCut 1106: 21:12:01–24:22:04 при 30 fps, 5703 кадра. Границы совпадают со склейками в исходном видео. Кадр заполнен первоисточником, голос в отдельной композиции включён. Историю и техническую часть можно просмотреть подряд.

Исходные материалы лежат в `apps/remotion/public/assets/009-cassandra-scylladb/p03-origins-engine/`. Сайты сняты в области 1440 CSS-пикселей при DPR 1,5. В passages.json координаты соответствуют уже снятой области; они измерены по выделению фразы непосредственно в браузере. Перед монтажом снимкам не нужен доступ в интернет. Из PDF взяты отдельные страницы, для схем — оригиналы изображений. Изменения размера, перемещение камеры и подписи заданы в score.ts. При замене снимка необходимо заново измерить его координаты.

| Файлы | Первичный материал |
| --- | --- |
| story-*, founders | [The ScyllaDB Story](https://www.scylladb.com/company/the-scylla-story/) и [совместное фото](https://www.scylladb.com/wp-content/uploads/story-image_1.jpg). Слева Дор, справа Ави. Источник датирует основание Cloudius Systems 2012 годом; в спорной реплике не дублируем год титром. |
| osv-cover, paper | [Сайт OSv](https://osv.io/) и [публикация Cloudius Systems на USENIX ATC 2014](https://www.usenix.org/conference/atc14/technical-sessions/presentation/kivity), печатная с. 61. На рис. 1 показан стек традиционной VM. |
| dor-* | [Software Engineering Daily: Dor Laor & Lee Atchison](https://www.scylladb.com/2023/10/17/lee-atchison-dor-laor-on-scylladb-solving-problems-at-scale/). Redis и Cassandra — эксперименты команды того времени. |
| nadav-* | [Интервью Надава Харэля](https://www.scylladb.com/2019/10/16/qa-with-nadav-harel/) о коммерческом результате OSv. |
| code-*, compat-cql | [CodeStory](https://www.scylladb.com/2023/12/13/codestory/) и [пределы совместимости](https://docs.scylladb.com/manual/branch-2026.3/using-scylla/cassandra-compatibility.html). |
| cpp, scheduler | [7 Design Principles Behind ScyllaDB](https://www.scylladb.com/wp-content/uploads/wp-seven-design-principles.pdf), с. 5 и 11 (рис. 5). |
| cache-* | [Inside ScyllaDB’s Internal Cache](https://www.scylladb.com/2024/01/08/inside-scylladbs-internal-cache/). |
| shards-*, cluster-map, resource-map, nothing | [Shard-per-Core Architecture](https://www.scylladb.com/product/technology/shard-per-core-architecture/): схемы кластера, ресурсов ядра и сравнения стеков. Сохранены подписи оригинала. |
| shared-* | [Seastar: Shared-nothing Design](https://seastar.io/shared-nothing/), раздел о межъядерных сообщениях. |
| io-cover, dev-* | [The New I/O Scheduler](https://www.scylladb.com/2021/04/06/scyllas-new-io-scheduler/) и [документация разработчиков об изоляции](https://github.com/scylladb/scylladb/blob/master/docs/dev/isolation.md). |

Для восстановления дорожки предпросмотра из корня репозитория:

```sh
ffmpeg -n -ss 1258.533333 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 190.1 -vn -ac 1 -c:a aac -b:a 144k apps/remotion/public/generated/009-cassandra-scylladb/scylla-origins-engine-excerpt.m4a
```
