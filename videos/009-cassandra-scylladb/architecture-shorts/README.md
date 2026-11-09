# Вертикальные шортсы об архитектуре

В Studio: Videos → V-009-cassandra-scylladb → P-02-Architecture-Shorts.
Каждая подпапка содержит самостоятельную композицию 1080×1920 при 30 fps.
Время внутри шортса начинается с нуля.

## Почему реплика Postgres не ускоряет запись?

Для предпросмотра нужен только голосовой фрагмент на 46,6 с. Для восстановления
из исходного WAV запустить из корня репозитория:

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -filter_complex '[0:a]atrim=start=503.04:end=514.04,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=533.20:end=564.50,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=586.50:end=590.80,asetpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=0:a=1[out]' \
  -map '[out]' -ac 1 -c:a aac -b:a 160k \
  apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/postgres-write-replicas.m4a
```

## Postgres ответил OK. Что на реплике?

Для озвучки второго шортса взять 49,2 секунды с 07:33.300 исходной дорожки.
После речи композиция показывает общую пятисекундную концовку.

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts
ffmpeg -n -ss 453.30 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 49.20 -vn -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/postgres-replica-ack.m4a
```

## Как Cassandra находит последние сообщения чата?

Озвучка начинается на 10:09.980 исходного WAV и длится 50,8 секунды. Затем идёт общая концовка серии.

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts
ffmpeg -n -ss 609.98 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 50.8 -vn -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/cassandra-chat-history.m4a
```

## Что переезжает, когда в Cassandra добавляют сервер?

Озвучка соединяет два фрагмента исходного WAV. На рисунке RF = 1, чтобы показать смену владельца диапазона отдельно от выбора дополнительных реплик.

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -filter_complex '[0:a]atrim=start=619.94:end=630.34,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=678.18:end=710.98,asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1[out]' \
  -map '[out]' -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/cassandra-new-node.m4a
```

## Кто принимает запись, если в Cassandra нет главного сервера?

В первом запросе D координирует запись на A, B и C. Следующий запрос приходит на B.
Озвучка длится 48,8 секунды, затем идёт пятисекундная концовка.

```sh
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -filter_complex '[0:a]atrim=start=597.32:end=605.14,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=723.20:end=752.74,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=756.70:end=761.34,asetpts=PTS-STARTPTS[c];[0:a]atrim=start=763.50:end=770.30,asetpts=PTS-STARTPTS[d];[a][b][c][d]concat=n=4:v=0:a=1[out]' \
  -map '[out]' -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/cassandra-coordinator.m4a
```

## Сколько реплик должны подтвердить запись в Cassandra?

У чата три реплики в одном дата-центре. Озвучка начинается на 12:55.760 исходного WAV
и длится 37,4 секунды. За ней идёт пятисекундная концовка серии.

```sh
ffmpeg -n -ss 775.76 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 37.40 -vn -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/cassandra-write-acks.m4a
```

## Запись прошла. Почему Cassandra вернула старое сообщение?

Озвучка соединяет три фрагмента исходного WAV. Длительность речи — 52,6 секунды.

```sh
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -filter_complex '[0:a]atrim=start=807.06:end=812.94,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=835.70:end=847.40,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=851.90:end=886.92,asetpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=0:a=1[out]' \
  -map '[out]' -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/cassandra-stale-read.m4a
```

## В двух копиях одно значение, в третьей другое. Какое выберет Cassandra?

Восьмой шортс использует непрерывный фрагмент с 14:53.800 исходной дорожки.
После 28,8 секунды речи оставлено 1,4 секунды на последний пример, затем идёт общая концовка.

```sh
ffmpeg -n -ss 893.80 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 28.80 -vn -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/cassandra-last-write-wins.m4a
```

## Как реплика Cassandra догоняет пропущенные записи?

В девятом шортсе одна правка показана в трёх сценариях восстановления. Для звука
используется фрагмент исходного WAV с двумя укороченными паузами. Речь занимает 54,9 секунды.

```sh
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -filter_complex '[0:a]atrim=start=933.70:end=952.34,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=952.90:end=962.75,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=963.40:end=989.81,asetpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=0:a=1[out]' \
  -map '[out]' -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/cassandra-replica-recovery.m4a
```

## Что происходит с записью на одном узле Cassandra?

Десятый шортс использует 38 секунд исходной дорожки с 16:43.000, затем общую пятисекундную концовку.

```sh
ffmpeg -n -ss 1003 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 38 -vn -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/cassandra-local-write.m4a
```

## Много записей — уже пора брать Cassandra?

Четыре фрагмента исходной озвучки: доля и поток записей, история и поиск по слову,
нагрузка по ключам и эксплуатация, возврат к чтению истории. Голос длится 54,2 секунды.

```sh
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -filter_complex '[0:a]atrim=start=1137.68:end=1152.60,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=1057.94:end=1073.67,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=1099.99:end=1118.86,asetpts=PTS-STARTPTS[c];[0:a]atrim=start=1153.00:end=1157.68,asetpts=PTS-STARTPTS[d];[a][b][c][d]concat=n=4:v=0:a=1[out]' \
  -map '[out]' -ac 1 -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/architecture-shorts/cassandra-write-workload.m4a
```
