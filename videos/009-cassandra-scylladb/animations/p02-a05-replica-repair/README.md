# Как реплики догоняют друг друга

В Studio: P-02-Architecture → p02-a05-replica-repair. Монтажный диапазон 15:02:00–16:49:20, 3230 кадров при 30 fps. Первый кадр совпадает с концом сцены про кворумы. Восстановление фрагмента озвучки для Studio из корня проекта:

```sh
ffmpeg -n -ss 893 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 107.666667 -vn -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/replica-repair-excerpt.m4a
```

В первом чтении B присылает данные, C — digest. Обозначения h₁ и h₂ условны. Времена в примере относятся к меткам записи поля text; отдельный пример с быстрыми часами показывает, как более ранняя правка может получить большую метку.

Hinted handoff возвращается к моменту записи №107. Независимое чтение №108 показывает область действия read repair при BLOCKING. Схема Merkle делит общий диапазон на четыре условных участка и показывает передачу данных различающегося участка в примере, где отстала C. Тайминги относительно фрагмента озвучки заданы в scene.ts.

Источники — [data versioning](https://cassandra.apache.org/doc/stable/cassandra/architecture/dynamo.html#data-versioning), [hints](https://cassandra.apache.org/doc/stable/cassandra/managing/operating/hints.html), [read repair](https://cassandra.apache.org/doc/stable/cassandra/managing/operating/read_repair.html), [repair](https://cassandra.apache.org/doc/stable/cassandra/managing/operating/repair.html).
