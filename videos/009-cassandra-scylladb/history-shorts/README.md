# История Cassandra — Shorts

В Studio на порту 3000: Videos → V-009-cassandra-scylladb → P-01-History-Shorts.
Формат 1440×2560, 30 fps. Верхние 55% занимает архив, нижние 45% — камера.
Последние пять секунд — общая концовка выпуска.

## Зачем Facebook создал Cassandra?

Исходники камеры и звука — `/Users/mdpopov/Desktop/cassandra/IMG_4183.MOV` и
`/Users/mdpopov/Movies/CapCut/cassandra_audio.WAV`. Проект CapCut 1106 связывает
участки WAV с разными дублями исходной камеры. Для повторной подготовки локальных
ассетов запустить из корня проекта в пустую папку назначения:

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/history-shorts/01
camera=/Users/mdpopov/Desktop/cassandra/IMG_4183.MOV
mkdir -p "$out"
cut_camera() {
  ffmpeg -v error -n -ss "$2" -i "$camera" -t "$3" -map 0:v:0 -an -c copy -tag:v hvc1 -map_metadata -1 -movflags +faststart "$out/$1.mp4"
}
cut_camera question 120 2.7
cut_camera inbox 240.3 15.533334
cut_camera origins 29.133334 10.766666
cut_camera authors 99.133333 12.8
ffmpeg -v error -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -filter_complex '[0:a]atrim=start=136.866667:end=144.6,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=105.333333:end=128.7,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=144.6:end=154.9,asetpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=0:a=1[out]' \
  -map '[out]' -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```

Кадры камеры остаются в исходном HEVC. Для Studio нужен браузер с декодированием
HEVC. В папке `public/generated` хранятся только локальные отрезки. Кадрирование
в `Presenter.tsx` использует область 1680×1344 исходника для панели 1440×1152.
Участок inbox используется в двух местах, порядок задаётся монтажом.

## У Facebook уже был MySQL. Зачем понадобилась Cassandra?

Второй шортс полноэкранный. После схемы шардов страница EnterpriseReady #35
прокручивается к объяснению стоимости, исходные строки вырастают в набранную цитату.
Озвучка — три фрагмента исходного WAV, всего 43,2 секунды.

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb/history-shorts/02
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -filter_complex '[0:a]atrim=start=155.20:end=182.48,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=193.45:end=205.65,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=268.32:end=272.04,asetpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=0:a=1[out]' \
  -map '[out]' -ac 1 -c:a aac -b:a 192k apps/remotion/public/generated/009-cassandra-scylladb/history-shorts/02/voice.m4a
```

## Почему поиск по сообщениям создаёт столько записей?

Третий шортс — вертикальная анимация с примером обратного индекса Inbox Search.
Четыре слова в сообщении № 42 и десять разных слов в № 43 — отдельные примеры.
Частота записей и чтений в финале иллюстративная.

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb/history-shorts/03
ffmpeg -n -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -filter_complex '[0:a]atrim=start=207.86:end=224.26,asetpts=PTS-STARTPTS[a];[0:a]atrim=start=229.50:end=242.60,asetpts=PTS-STARTPTS[b];[0:a]atrim=start=245.76:end=260.66,asetpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=0:a=1[out]' \
  -map '[out]' -ac 1 -c:a aac -b:a 192k apps/remotion/public/generated/009-cassandra-scylladb/history-shorts/03/voice.m4a
```

## Сообщение есть. Почему поиск его не находит?

Камера снизу до кадра 762 включительно, затем схема на весь экран. Две разные
ситуации: отстающая копия индекса догоняет соседнюю; отсутствующую запись можно
построить из сохранённого сообщения. В финале — строка оригинальной расшифровки
[EnterpriseReady #35](https://www.heavybit.com/library/podcasts/enterpriseready/ep-35-database-software-with-karthik-ranganathan-of-yugabyte).
Камера из CapCut 1106, без перекодирования; дорожка WAV непрерывная.

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/history-shorts/04
mkdir -p "$out"
ffmpeg -n -ss 501.3 -i /Users/mdpopov/Desktop/cassandra/IMG_4183.MOV -t 25.433333 -map 0:v:0 -an -c copy -tag:v hvc1 -map_metadata -1 -movflags +faststart "$out/presenter.mp4"
ffmpeg -n -ss 272.2 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 49.4 -map 0:a:0 -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```

## Почему Facebook не взял готовую базу Google или Amazon?

Пятый шортс, полностью вертикальная анимация. Вставки с названиями Bigtable
и Dynamo используют первые страницы [статьи Google 2006 года](https://storage.googleapis.com/gweb-research2023-media/pubtools/4443.pdf)
и [статьи Amazon 2007 года](https://www.amazon.science/publications/dynamo-amazons-highly-available-key-value-store)
из `public/assets/009-cassandra-scylladb/p01-consistency`. Два чата на схеме
шардинга — условный пример. Dynamo здесь — внутренняя база Amazon того времени.
Год у HBase относится к вхождению в Hadoop.

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/history-shorts/05
mkdir -p "$out"
ffmpeg -n -ss 322.3 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 31.1 -map 0:a:0 -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```

## 50 ТБ на 150 узлах. Как быстро работал поиск Facebook?

Исходный фрагмент CapCut 05:58:00–06:24:06. Камера снизу до склейки в
06:13:22, таблица разворачивается перед ней. Медианы относятся к двум
поисковым операциям в § 6.1 [статьи LADIS 2009](https://research.cs.cornell.edu/ladis2009/papers/lakshman-ladis2009.pdf).
Цитата про SLA взята из [анонса Facebook от августа 2008](https://engineering.fb.com/2008/08/25/core-infra/cassandra-a-structured-storage-system-on-a-p2p-network/).

```sh
out=apps/remotion/public/generated/009-cassandra-scylladb/history-shorts/06
mkdir -p "$out"
ffmpeg -n -ss 644.466666 -i /Users/mdpopov/Desktop/cassandra/IMG_4183.MOV -t 15.733333 -map 0:v:0 -an -c copy -tag:v hvc1 -map_metadata -1 -movflags +faststart "$out/presenter.mp4"
ffmpeg -n -ss 353.5 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 26.2 -map 0:a:0 -ac 1 -c:a aac -b:a 192k "$out/voice.m4a"
```
