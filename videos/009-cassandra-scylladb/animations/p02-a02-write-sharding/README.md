# От репликации к шардингу

Studio → P-02-Architecture → p02-a02-write-sharding. Таймлайн CapCut 1106
от 08:32:00 включительно до 10:14:00 исключительно. 3060 кадров при 30 fps.
Полноэкранная сцена использует прямые склейки. Для Studio включена озвучка.
Короткий AAC в игнорируемом public/generated можно восстановить из корня проекта:

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb
ffmpeg -n -ss 503.000 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 102.000 -vn -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/write-sharding-excerpt.m4a
```

В scene.ts заданы моменты реплик и учебная последовательность сообщений.
Страница блокнота показывает последнее сообщение каждого размещённого чата.
Добавление standby показано после её подготовки. При переносе видимой записи
маршрут переключается после копирования на C. Рисунок иллюстрирует задачу
маршрутизации, детали протокола миграции зависят от реализации.

Обложка выпуска о шардинге взята из предоставленного автором снимка
в public/assets/008-notification-system/related-videos/sharding.png.
Координаты кадрирования относятся к исходному изображению.
Технические источники — [PostgreSQL](https://www.postgresql.org/docs/current/different-replication-solutions.html)
и [распределение данных в Cassandra](https://cassandra.apache.org/doc/stable/cassandra/architecture/dynamo.html).
