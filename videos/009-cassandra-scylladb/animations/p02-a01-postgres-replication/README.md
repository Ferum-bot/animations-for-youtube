# Архитектура PostgreSQL — чтение, запись и репликация

В Studio открыть `P-02-Architecture` → `p02-a01-postgres-replication`.
Композиция занимает 3699 кадров при 30 fps. В проекте CapCut 1106
диапазон — от 06:28:21 включительно до 08:32:00 исключительно. Все кадры
непрозрачны, первый и последний предназначены для прямой склейки.

Для предпросмотра нужен фрагмент исходной речи. Создать его из корня проекта:

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb
ffmpeg -n -ss 379.700 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 123.300 -vn -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/postgres-replication-excerpt.m4a
```

Studio включает `withAudio`, а таймлайн использует звук основного монтажа.
`scene.ts` задаёт моменты действий в миллисекундах относительно первого кадра.
В примере синхронной записи настроена одна синхронная standby, а
`synchronous_commit = on` ожидает подтверждение flush WAL. Последующий replay
делает правку видимой на этой реплике. При асинхронном отказе показывается
потеря ещё не доставленной правки, прежняя история сохраняется на standby.

[Streaming replication и hot standby](https://www.postgresql.org/docs/current/warm-standby.html)
· [Условия подтверждения commit](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT).
