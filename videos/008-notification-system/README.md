# Notification System

Production compositions use 2560×1440 at 30 fps. Open with `task studio`.

## Database schema

Composition: `Video-008-notification-system-p01-a01-database-schema`.
The 102-second scene is placed in **CapCut project 1028 at 00:13:56:18**
(30 fps), ending at **00:15:38:18**. These are current edited-timeline timecodes,
not the original WAV timecodes. `anchors.json` uses the edited timeline.
`source-anchors.json` preserves the original WAV anchors (14:22–16:04).
`edit-timing.json` records the verified source-to-edit mapping and draft fingerprint.
This interval has no internal cuts or speed changes. Revalidate against the current
CapCut draft after further edits; do not apply its offset globally to other scenes.

The `users` panel is compact (1280×360), centered at x=640, y=540. The larger
`notifications` panel uses x=340, width=1880, y=380 to leave room for the existing
top-right webcam. Both use a cool light-gray surface and a 4 px slate outline
to stay distinct from the white screen recording. This episode uses a system-design layout,
explicitly approved instead of the compact talking-head layout.

The scene shows complete `CREATE TABLE users`, then `CREATE TABLE notifications`
and its indexes from the materials. Only SQL is visible, in a light DataGrip-style
editor with line numbers and syntax coloring. `schema.ts` owns the SQL; `cues.ts`
owns speech-driven line focus; `shared/CodeEditor.tsx` owns the common editor layout.
Active code lines smoothly scale to 118% over 420 ms; adjacent lines make room
vertically. The panel reserves expansion space and keeps a fixed outer size.
There are no headings, captions, relationship cards or explanatory footers.

Sources are identified in `video.json`. The source narration has priority over
page 9 of `notification-system-materials.pdf`: identifiers use UUIDv7 instead
of BIGSERIAL, the foreign key uses UUID, and optional provider metadata is shown.
The other three tables on that page are introduced after this scene's audio interval.
`transcript.json` contains the relevant raw ASR segments in original WAV time, without silent corrections.

Props:

- The SQL editor always uses the requested light theme, independently of the preview backdrop.
- `motionProfile`: `calm` (default), `technical`, or `energetic`.
- `previewBackground`: `transparent` (default), `light`, or `dark`.
- `withAudio`: `true` by default for synchronized playback from the start of the scene; set to `false` for a silent overlay.

The audio preview is an ignored generated asset. Recreate it from the original:

```bash
mkdir -p apps/remotion/public/generated/008-notification-system
ffmpeg -nostdin -ss 862 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 102 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a01-database-schema.wav
```

Run `task check` after edits. Render key stills outside the repository for visual
acceptance. Clip/full-overlay export requires an explicit request; use the
repository's CapCut ProRes 4444 pipeline for an authorized compositing master.

## Device tokens

Composition: `Video-008-notification-system-p01-a02-device-tokens`.
Insert at **00:17:01:13**, end at **00:17:31:13** (30 seconds, 900 frames).
The scene ends before the push/SMS provider diagram. Its local `edit-timing.json`
records the verified CapCut mapping; anchors use edited time and transcript segments
preserve original WAV time. The audio slice starts at 1046.833333 seconds in the WAV.

The complete table and partial index follow materials p. 9, with `user_id UUID`
matching the narrated and previously shown `users.id`. The 1480×560 editor is centered
at x=540, y=440, with the approved gray background, slate outline and syntax colors.
Speech-driven focus covers the table name, user, platform, token, active flag,
last-seen timestamp and a return to the active flag for old-token deactivation.
The shared editor and cue transition preserve the earlier database-schema scene.

Recreate the synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1046.833333 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 30 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a02-device-tokens.wav
```

## Scheduled-send query

Composition: `Video-008-notification-system-p01-a03-scheduled-query`.
Insert at **00:18:17:29**, end at **00:18:33:29** (16 seconds, 480 frames).
The full query follows materials p. 10: select notification IDs with status
`scheduled`, `send_at <= now()` and `LIMIT 1000`. The scene covers the narrated
query and the ten-second polling explanation, then exits before the next topic.

The 1040×280 editor is centered at x=760, y=580. It reuses the approved surface,
outline, syntax colors and 118% line emphasis. Focus follows SELECT, status,
due time and batch limit; the complete query then holds at normal size.
The scene's `edit-timing.json` records placement and the unchanged CapCut segment.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1123.366667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 16 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a03-scheduled-query.wav
```

## Campaign tables

Composition: `Video-008-notification-system-p01-a04-campaign-tables`.
Insert at **00:18:58:20**, end at **00:19:23:20** (25 seconds, 750 frames).
This covers the table walkthrough and ends before the cron-worker explanation.
The centered 1480 px editor shows `campaigns`, then `segments`, with the approved
gray surface, slate outline and speech-driven enlargement. Channel and template
share a cue because they are spoken together, avoiding an interrupted scale transition.

Narration overrides materials p. 9: `campaigns.segment_id` replaces `segment_sql`,
and `segments` stores `(segment_id, user_id)` membership pairs. UUID types match
the preceding schema. The pair is the primary key; `segment_id` alone is not unique,
so there is deliberately no invalid foreign key from campaigns to that column.
`user_id` references `users(id)`. The remaining campaign fields follow the document.
The local `edit-timing.json` records the verified montage placement.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1164.066667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 25 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a04-campaign-tables.wav
```

## Preferences

Composition: `Video-008-notification-system-p01-a05-preferences`.
Insert at **00:20:24:29**, end at **00:20:49:29** (25 seconds, 750 frames),
before the explanation of when to apply quiet-hour policies.

The complete `CREATE TABLE preferences` follows the narration and the matching
handwritten schema: `user_id UUID`, `options JSONB` and `quiet_opt JSONB`.
These names replace the PDF's `opt_out`, `quiet_from` and `quiet_to` representation.
The user key and empty-object JSONB defaults retain the document's approach.
The 1480×280 editor is centered at x=540, y=580 and reuses all approved visual
and motion settings. Focus follows the table name, user ID, options and quiet hours.
`edit-timing.json` records the verified montage placement; the raw narration remains
in the episode transcript without ASR corrections.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1250.366667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 25 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a05-preferences.wav
```

## Producer settings

Composition: `Video-008-notification-system-p02-a01-producer-settings`.
Part 02 covers delivery reliability. Insert at **00:24:50:05**, end at
**00:25:35:20** (45.5 seconds, 1365 frames), before the database-first alternative.

The configuration follows materials p. 16 and narration: producer settings
`acks=all`, `enable.idempotence=true`; topic settings `replication.factor=3`,
`min.insync.replicas=2`. Comments identify each scope. The default minimum ISR of 1
is explained in a separate comment; the recommended configuration remains at 2.
Speech-driven focus ends by emphasizing ACK, replication and minimum ISR together.

The centered 1280×400 editor reuses the approved gray surface, outline and 118%
line emphasis. `shared/CodeEditor.tsx` handles layout, `code-syntax.ts` handles SQL
and flat properties highlighting, and `code-theme.ts` holds episode color tokens.
SQL remains the default language for the earlier scenes. The local timing manifest
records the current CapCut segment, which differs from the part-01 segment.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1515.566667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 45.5 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p02-a01-producer-settings.wav
```

## Transactional outbox

Composition: `Video-008-notification-system-p02-a02-outbox`.
Insert at **00:26:36:16**, end at **00:27:23:16** (47 seconds, 1410 frames).
This block ends immediately before «У этого есть цена»; the discussion of
latency, the additional component and delivery semantics is outside the animation.

Three centered code panels follow the voice: complete outbox DDL and partial
index; two inserts inside one ingestion transaction; the relay loop.
The source is materials p. 17. `notification_id` is UUID to match the previously
narrated notifications schema; the outbox's own ID stays BIGSERIAL. The ingestion
example expands the document's ellipses into the required notification columns.
The application creates and binds `:id` (UUIDv7) before the transaction. HTTP 202
follows commit.

The relay holds its row locks until commit. Kafka publication and acknowledgement
are application operations shown as comments. `:published_ids` is an array of IDs
whose publication has been acknowledged; only those rows are marked published.

Schema is 1480×560, ingestion is 1480×680 and relay is 1480×520, below the webcam. The panels
use the existing sequential fade and speech focus helpers. Times and the current
CapCut draft fingerprint are recorded in the animation's `edit-timing.json`.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1621.933333 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 47 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p02-a02-outbox.wav
```

## PostgreSQL as a queue

Composition: `Video-008-notification-system-p02-a03-postgres-queue`.
Insert at **00:28:32:16**, end at **00:28:49:07** (16.7 seconds, 501 frames).
The query stays visible through the explanation of SKIP LOCKED, one system and
database transactions, then exits before the discussion of this approach's costs.

The SQL follows materials p. 17: select up to 100 accepted, due notifications,
skip locked rows, set `status = 'sending'` and `claimed_at`, and return claimed
rows in the same statement. This alternative assumes a nullable `claimed_at
TIMESTAMPTZ` column on notifications; it is an extension to the earlier baseline
schema. Explicit CASE ordering preserves p0 → p1 → bulk for the narrated TEXT
priority column (plain lexical ordering would put bulk first).

The centered 1480×640 panel uses the episode's CodeEditor and speech cue helpers.
Focus follows the narration: SKIP LOCKED, the same notifications table for reading
and writing, then the atomic status/time update and RETURNING. Source ASR remains
unchanged. The local timing manifest records the verified CapCut audio segment.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1737.933333 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 16.7 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p02-a03-postgres-queue.wav
```

## Consumer settings

Composition: `Video-008-notification-system-p02-a04-consumer-settings`.
Insert at **00:31:02:06**, end at **00:31:17:06** (15 seconds, 450 frames).
The fragment covers the two consumer parameters and the explanation of smaller
batches, ending after «при крэше», before the transition to durable storage.

Materials p. 18 and narration agree on `enable.auto.commit=false` and
`max.poll.records=50`. The two short comments explain manual commit after processing
and smaller replay batches. Focus follows each parameter and then the replay
explanation. The centered 1280×280 panel reuses CodeEditor properties syntax,
the gray surface, outline and 118% focus without changes to shared rendering.
The local timing manifest records the verified CapCut audio segment.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1887.6 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 15 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p02-a04-consumer-settings.wav
```

## Consumer liveness settings

Composition: `Video-008-notification-system-p02-a05-consumer-liveness`.
Insert at **00:32:30:22**, end at **00:32:43:10** (12.6 seconds, 378 frames),
before the transition to provider errors.

The four values follow materials p. 19: session timeout 45000 ms, heartbeat
interval 15000 ms, maximum poll interval 300000 ms, and the sample static member
ID `push-p0-worker-7`. Comments explain each setting for the classic group protocol.
The member ID must remain unique within the group and stable across restarts;
static membership reduces rebalances during short unavailability, rather than
preventing every rebalance. The heartbeat and session timeout settings shown here
are client controls for the classic protocol, not the newer consumer protocol.
Semantics were checked against the [Apache Kafka consumer configuration reference](https://kafka.apache.org/41/configuration/consumer-configs/).

The voice does not enumerate these parameters individually. The complete list is
visible from entrance; focus first enlarges the settings on «список настроек»,
then the comments on «описание». The centered 1280×560 editor uses existing
properties syntax and focus helpers without changing shared components.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1976.133333 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 12.6 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p02-a05-consumer-liveness.wav
```


## Ошибки провайдеров — 33:01

Composition: `Video-008-notification-system-p02-a06-provider-errors`.

- Вставка в CapCut `1028`: **00:33:01:29 → 00:33:19:26** (30 fps), 17,9 с.
- Исходный WAV: `2007.366667 → 2025.266667` с. Проверенный сдвиг к монтажу: −25,4 с;
  аудиосегмент проекта совпадает с ранее выровненным снимком, скорость 1×.
- Две колонки на общей светло-серой панели: примеры повторяемых и терминальных ошибок
  из страницы 19 материалов. Панель 1880×820, x340/y380, обводка 4 px;
  зона камеры сверху справа свободна. Внешнего заголовка нет.
- На фразах про два класса плавно увеличиваются соответствующие примеры до 118%.
  На словах «Backoff и Jitter» выделяется правило повторов. Отдельные коды
  голосом не перечисляются, поэтому их индивидуального появления нет.
- Фрагмент заканчивается после «могут нас за это банить», до объяснения второго шторма.
- Это иллюстративные примеры, не универсальный классификатор. Twilio `30005` из PDF
  не показан как безусловно терминальный: документация перечисляет и временные причины.
  `30003` иллюстрирует временную недоступность телефона. `INVALID_ARGUMENT` требует
  разбора причины/исправления запроса; токен деактивируется только при его невалидности.
  Задержки и `Retry-After` нужно учитывать по правилам конкретного провайдера.
- Справочники: [FCM](https://firebase.google.com/docs/cloud-messaging/error-codes),
  [APNs](https://developer.apple.com/documentation/usernotifications/handling-notification-responses-from-apns),
  [Twilio 30003](https://www.twilio.com/docs/api/errors/30003),
  [Twilio 30005](https://www.twilio.com/docs/api/errors/30005),
  [Twilio 30007](https://www.twilio.com/docs/api/errors/30007),
  [SES](https://docs.aws.amazon.com/ses/latest/dg/notification-contents.html).

Звук в Studio — локальный фрагмент исходного WAV (`withAudio: true`):

```bash
ffmpeg -ss 2007.366667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 17.9 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p02-a06-provider-errors.wav
```

Экспорт клипа — только по отдельному запросу, через `task render:capcut`.


## Retry-топики и DLQ — 34:08

Composition: `Video-008-notification-system-p02-a07-retry-topics`.

- CapCut `1028`: **00:34:08:22 → 00:34:32:02** (30 fps), 700 кадров / 23⅓ с.
- Исходный WAV: `2074.133333 → 2097.466667` с. Сдвиг к монтажу −25,4 с;
  аудиосегмент совпадает с выровненным снимком. Целые миллисекунды округлены.
- Материалы, страницы 19–20: `push.p0 → push.p0.retry-1m → push.p0.retry-10m →
  push.p0.retry-1h → push.dlq`. Стрелки показывают только повторную ошибку.
  Задержки — нижняя граница ожидания consumers, не встроенная задержка Kafka.
- Серая панель 1880×680, x340/y380; 4 px обводка, зона камеры свободна.
  Суффиксы retry, DLQ и ручной разбор увеличиваются до 118% по голосу.
  Конкретные интервалы голосом не перечисляются: отдельной синхронизации для них нет.
- Commit offset показан после подтверждённой публикации в retry. DLQ предполагает
  разбор и исправление причины перед контролируемым повтором.
- Окончание до фразы «Ну и в конце» про sweeper.
- Схема сверена с [Uber Engineering](https://www.uber.com/iq/en/blog/reliable-reprocessing/).

Звук для Studio (`withAudio: true`):

```bash
ffmpeg -ss 2074.133333 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 23.333333 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p02-a07-retry-topics.wav
```

Экспорт клипа — по отдельному запросу, через `task render:capcut`.


## Sweeper — 34:45

Composition: `Video-008-notification-system-p02-a08-sweeper`.

- CapCut `1028`: **00:34:45:16 → 00:35:09:20**, 724 кадра / 24,133 с при 30 fps.
- Исходный WAV: `2110.933333 → 2135.066667` с; монтажный сдвиг −25,4 с.
  Аудиотрек текущего проекта совпадает с выровненным снимком, скорость 1×.
- Основа — SQL sweeper на странице 20 материалов: `sending → accepted`,
  `attempts + 1`, порог `claimed_at` в пять минут и `RETURNING id`.
  Возвращённые IDs предназначены для повторной постановки; UPDATE сам не пишет в outbox.
- Существующий светлый CodeEditor: стандартная панель 1480×480 по центру,
  серая заливка, обводка 4 px, без внешнего заголовка.
- По голосу увеличиваются до 118%: период запуска, таблица, новый статус,
  попытки, старый статус, таймаут, затем комментарии о возможном дубле.
  Комментарии поясняют произнесённый компромисс из материалов; сырой ASR сохранён.
- Конец после «чем вообще не отправить», до итогов deep dive.

Аудио Studio (`withAudio: true`):

```bash
ffmpeg -ss 2110.933333 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 24.133333 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p02-a08-sweeper.wav
```

MOV экспортируется по отдельному запросу через `task render:capcut`.


## Матрица канал × приоритет — 39:19

Composition: `Video-008-notification-system-p03-a02-channel-priority-matrix`.
Порядок `a01` в части 03 оставлен для предшествующей архитектуры с 39:04.

- CapCut `1028`: **00:39:19:27 → 00:39:57:06**, 37,3 с / 1119 кадров.
- WAV: `2385.3 → 2422.6` с, сдвиг к монтажу −25,4 с. Текущий аудиотрек
  совпадает с выровненным снимком. Сегмент камеры здесь другой: source 2091,466666 с,
  target 2125,366666 с, duration 554,766667 с, скорость 1×.
- Матрица из страницы 22: push / sms / email × p0 / p1 / bulk; девять топиков
  с независимыми пулами. Размеры пулов и sender A/B/C — иллюстративные значения
  из материалов, не расчёт параллелизма следующей вставки.
- Светлая серая панель 1880×780, x340/y380, обводка 4 px, без внешнего заголовка.
  Топики и пулы увеличиваются до 118% по голосу. Акценты: push.p0 → его воркеры →
  медленный email и независимый push → SMS OTP и bulk → sender → девять топиков.
  Задержка/кампания выделены тёплой заливкой, независимые ресурсы — синей.
- Окончание до перехода к расчёту партиций. Сырой ASR не исправлен.

Аудио Studio:

```bash
ffmpeg -ss 2385.3 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 37.3 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p03-a02-channel-priority-matrix.wav
```

Экспорт MOV — по отдельному запросу через `task render:capcut`.


## Таблица нагрузки — 40:04

Composition: `Video-008-notification-system-p03-a03-capacity-table`.

- CapCut `1028`: **00:40:04:26 → 00:40:22:08**, 17,4 с / 522 кадра.
- WAV: `2430.266667 → 2447.666667` с. Сдвиг к монтажу −25,4 с;
  аудиотрек текущего проекта совпадает с выровненным снимком.
- Четыре сценария со страницы 23 материалов, без изменения значений:
  `push.p0`, `push.bulk`, `sms.p0`, `email.bulk`. Условие «весь пик — P0»
  сохранено сноской. Строки не суммируются как одновременная нагрузка.
- Формула внизу поясняет оценку in-flight: поток × время вызова.
  Проверка арифметики: 5000×0,2=1000; 500×0,3=150; 3000×0,3=900.
- Серая панель 1880×700, x340/y380, обводка 4 px, без внешнего заголовка.
  По голосу до 118% увеличиваются значения столбцов: поток, время вызова,
  in-flight, партиции × конкурентность. Затем остаётся общая таблица.
- Конец после «минимальная нагрузка», до следующего блока о провайдерах.

Аудио Studio:

```bash
ffmpeg -ss 2430.266667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 17.4 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p03-a03-capacity-table.wav
```

Экспорт MOV — по отдельному запросу через `task render:capcut`.


## Бюджет пяти секунд — 42:48

Composition: `Video-008-notification-system-p03-a05-latency-budget`.
Порядок `a04` оставлен для Token Bucket с 41:38.

- CapCut `1028`: **00:42:48:14 → 00:44:39:29**, 111,5 с / 3345 кадров.
- WAV: `2593.866667 → 2705.366667` с, монтажный сдвиг −25,4 с.
  Весь фрагмент в одном неизменённом аудиосегменте со скоростью 1×.
- Основа — страница 25 материалов; голос приоритетен: релей **50–300 мс**
  вместо 50–200 мс. Остальные оценки: приём ≈100 мс, основной lag ≤500 мс,
  orchestrator ≤50 мс, lag канала ≤500 мс, провайдер ≤500 мс.
- Для провайдера среднее 200–250 мс отделено от более позднего личного
  наблюдения автора p95 100–110 мс: пояснение меняется по голосу.
- Верхние значения суммируются в 1950 мс. Произнесённый типовой итог до 1500 мс
  не показан как их сумма. Отдельная пропорциональная шкала 5000 мс содержит
  типовые 1500 мс и запас 3500 мс; различие подписано явно.
- По голосу выделяются шесть этапов, индекс/короткая транзакция, типовой итог,
  запас, один ретрай с backoff около двух секунд и другой канал.
- Панель 1880×880, x340/y380, светлая серая заливка и 4 px обводка.
  Шрифт растёт до 118%; внешнего заголовка нет, камера свободна.
- Конец после «в случае приоритетных задач», до разбора дедупликации.

Аудио Studio:

```bash
ffmpeg -ss 2593.866667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 111.5 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p03-a05-latency-budget.wav
```

Экспорт MOV — по отдельному запросу через `task render:capcut`.


## Суточные партиции outbox — 46:15

Composition: `Video-008-notification-system-p04-a01-outbox-partitions`.
Часть 04 соответствует deep dive о дедупликации.

- CapCut `1028`: **00:46:15:01 → 00:47:11:00**, 1679 кадров / 55,966667 с.
- WAV: `2800.433333 → 2856.4` с; сдвиг −25,4 с. Текущий аудиотрек
  совпадает с выровненным снимком; весь фрагмент находится в одном сегменте 1×.
- Основа — ранее показанная outbox со страницы 17 материалов; готового DDL
  для этой вставки в PDF нет. `schema.ts` расширяет её по голосу:
  `PARTITION BY RANGE (created_at)`, сутки UTC, индекс и `TRUNCATE` конкретной партиции.
- `PRIMARY KEY (id, created_at)` включает ключ партиционирования. Он не обещает
  глобальную уникальность произвольного `id` без даты. `notification_id UUID`
  сохраняет ссылку на ранее показанную notifications. Это пример создания новой
  таблицы, не миграция уже существующей outbox.
- Очистка показана как более поздняя операция после срока хранения и публикации
  всех записей. TRUNCATE сохраняет саму таблицу; очистка одной партиции не затрагивает
  соседние. Автоматизация обозначена SQL-комментарием, а не вымышленной командой.
- Родительская таблица → суточная партиция/обслуживание → возврат к родителю.
  Акценты до 118% по голосу; существующий светлый CodeEditor, ширина 1880,
  y380, 4 px обводка, без внешних подписей. Общие компоненты отвечают за
  синтаксис, переходы, масштаб строк, звук и жизненный цикл; локальны только SQL и cues.
- Конец после «и им всегда пользовались», до следующего уровня дедупликации.
- DDL сверяется с [PostgreSQL partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
  и [TRUNCATE](https://www.postgresql.org/docs/current/sql-truncate.html).
  Проверен в изолированной временной базе: граница суток, дочерние индексы,
  очистка одной партиции с сохранением соседней.

Восстановить аудио для Studio (`withAudio: true`):

```bash
ffmpeg -ss 2800.433333 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 55.966667 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p04-a01-outbox-partitions.wav
```

Проверка: `task check`. MOV — по отдельному запросу через `task render:capcut`.


## Таймеры и SQL захвата — 49:57

Composition: `Video-008-notification-system-p05-a01-timers-claim`.
Часть 05 — отложенная доставка. Таблица и захват объединены в одну вставку.

- CapCut `1028`: **00:49:57:13 → 00:51:09:24**, 2171 кадр / 72,366667 с.
- WAV: `3022.833333 → 3095.2` с; сдвиг −25,4 с. Неизменённый аудиотрек,
  один сегмент со скоростью 1×; параметры сохранены в локальном edit-timing.json.
- Основа — страницы 36–37 материалов. `notification_id UUID` согласован
  с голосом и ранее показанной notifications. Минутный бакет и стабильный шард
  0..255 вычисляются приложением. По последнему уточнению пользователя физическая
  партиция тоже минутная: `timers_20261029_0900`, UTC-границы 09:00–09:01.
- SQL захвата берёт диапазон поллера 3 (96..127), только наступившие due_at,
  без нижней границы due_minute. TTL две минуты соответствует голосу и странице 37.
  UPDATE не обращается к отсутствующему в схеме claimed_by. Возвращаются полный
  ключ, topic, due_at для drift и claimed_at для последующей проверки владения.
- BEGIN/COMMIT явно ограничивают короткую транзакцию; публикация идёт после неё.
  SKIP LOCKED защищает конкурентный захват до COMMIT, claimed_at — на время lease.
  Истёкший lease допускает повтор, а не гарантирует exactly-once. Последующая
  публикация/подтверждение/удаление не входят в эту вставку.
- Код полностью виден в существующем CodeEditor (ширина 1880, y380), фон серый,
  обводка 4 px; акценты 118% по голосу. Таблица сменяется запросом с 00:50:46:06.
  SQL, cues и композиция разделены; общие редактор и переходы переиспользуются.
- Окончание после «просто завис», перед «Следующее — это публикация».
- Синтаксис: [PostgreSQL SELECT](https://www.postgresql.org/docs/current/sql-select.html)
  и [partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html).
  В изолированной базе проверены полный DDL, два конкурирующих соединения,
  SKIP LOCKED, истёкший и действующий lease, таймер двухдневной давности,
  исключение будущих таймеров и чужих шардов.

Восстановление аудио Studio (`withAudio: true`):

```bash
ffmpeg -ss 3022.833333 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 72.366667 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p05-a01-timers-claim.wav
```

Проверка: `task check`. Экспорт MOV — по отдельному запросу через `task render:capcut`.
