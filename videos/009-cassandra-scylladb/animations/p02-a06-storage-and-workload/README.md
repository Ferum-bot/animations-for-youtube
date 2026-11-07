# От записи на диск до выбора базы

Studio → P-02-Architecture → p02-a06-storage-and-workload. Одна композиция для последних двух блоков главы, CapCut 16:49:20–19:26:27 (4717 кадров, 30 fps). В Studio включена только озвучка этого отрывка. Восстановить её можно из корня проекта:

```sh
ffmpeg -n -ss 1000.666667 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 157.233333 -vn -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/storage-and-workload-excerpt.m4a
```

Внутри реплики показаны запись и последующая правка одного сообщения. Содержимое SSTable при правке остаётся прежним. На схеме кластера отмечен первый владелец каждого из трёх примерных ключей, остальные реплики опущены. Два примера с 90% записей иллюстрируют пересчёт в абсолютный поток. Сравнение WAL предполагает обычный синхронный локальный commit. Сцена о двух партициях ставит вопрос повторной доставки в приложении.

Технические материалы: [движок Cassandra](https://cassandra.apache.org/doc/stable/cassandra/architecture/storage-engine.html), [WAL PostgreSQL](https://www.postgresql.org/docs/current/wal-intro.html), [моделирование под запросы](https://cassandra.apache.org/doc/stable/cassandra/developing/data-modeling/intro.html), [гарантии операций](https://cassandra.apache.org/doc/stable/cassandra/architecture/guarantees.html).
