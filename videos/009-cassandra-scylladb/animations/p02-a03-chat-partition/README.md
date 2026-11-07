# От сообщения до узла Cassandra

Studio → P-02-Architecture → p02-a03-chat-partition. Полноэкранная часть с прямыми склейками.
На таймлайне CapCut 1106 занимает 10:14:00–12:09:00, 3450 кадров при 30 fps.
Для восстановления озвучки Studio выполните из корня репозитория:

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb
ffmpeg -n -ss 605 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 115 -vn -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/chat-partition-excerpt.m4a
```

В учебной таблице chat_id имеет тип int. Время и числовой message_id задают убывающий порядок внутри партиции.
На кольце показано владение первичными диапазонами. Полный набор реплик определяется стратегией репликации в следующей части.
Значение токена относится к четырём байтам CQL int 42 в big-endian. Точки серверов выбраны для рисунка.

Модель данных сверена с [CQL DDL](https://cassandra.apache.org/doc/stable/cassandra/developing/cql/ddl.html), распределение диапазонов — с [Dynamo architecture](https://cassandra.apache.org/doc/stable/cassandra/architecture/dynamo.html).
Функция в финале взята из [Go-проекта автора](https://github.com/Ferum-bot/consistent-hashing-like-in-production/blob/HEAD/services/libs/sharding/ring.go).
Обложка и название выпуска в финале взяты из скриншота автора. Исходник хранится в public/assets/009-cassandra-scylladb/related-videos/consistent-hashing-go.png.
