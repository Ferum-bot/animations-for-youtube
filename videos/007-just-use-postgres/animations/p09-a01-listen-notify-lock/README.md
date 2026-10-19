# LISTEN/NOTIFY: one shared lock

QHD insert, 2560×1440 at 30 fps. Place at **18:34.000–21:06.867** in the
edited montage. Eight preceding 4.5-second chapter cards add 36 seconds;
source WAV placement is **17:58.000–20:30.867**. The full-screen entrance
slides from the left. The stage reflows during **20:52.800–20:54.000** into
the episode's approved full-height left panel, then leaves before the next
chapter. The Studio presenter image is only a static framing reference.

`timing.ts` owns millisecond narration anchors. `data.ts` contains supplied SQL,
source excerpts and measured samples. `Mechanism.tsx` explains pending
notifications, commit order and the instance-wide writer lock. `Benchmark.tsx`
uses only the three supplied client-count measurements, not synthetic time
series. `Recall.tsx` displays actual article captures and native RDS artifacts.
`Documentation.tsx` provides the official documentation and PG19 clarification.
`SourceViewport.tsx` handles bounded camera movement over source pixels.
The shared `ExplainerStage` and `CodeSnippet` retain the episode framing and
code-listing conventions. The full-video timeline remains unassembled.

## Technical boundaries

- The shared queue is instance-wide; notifications are delivered only to
  listeners of the appropriate database and channel. Pending notifications
  are not delivered before commit.
- The demonstrated shared lock serializes transactions that emit NOTIFY.
  The diagrams do not claim every ordinary PostgreSQL transaction takes it.
- Queue order follows commit order, not transaction start order.
- Benchmark samples are from the user's supplied script: pgbench, 10 seconds
  per run, `wal_sync_method=fsync_writethrough`. They are not new measurements
  or a universal production capacity estimate.
- The session grid represents the supplied observation: 63 `Lock/object`,
  one `IO/WalSync`. The Recall and local log entries are separately labeled;
  their PID and wait duration are different.
- Recall's March 2025 incident is historical. The current article includes a
  May 2026 update. Its native comparison and system graphs are separate test
  windows; they are not spliced into a continuous before/after time series.
- The recorded sentence around **21:02** says PG19 makes the lock no longer
  instance-wide. The visual explicitly corrects this: PG19 reduces unrelated
  listener wake-ups, while `REL_19_STABLE` still contains the common
  `LockSharedObject(DatabaseRelationId, InvalidOid, 0, AccessExclusiveLock)`.
  Suggested replacement narration: «В PostgreSQL 19 сократили лишние
  пробуждения подписчиков. Но общая блокировка на коммите осталась».

## Source assets

Source captures under `apps/remotion/public/assets/007-just-use-postgres/notify-lock/`
were made from the public pages on 2026-10-19, at viewport width 1440 and
3× device scale. Official documentation uses a responsive 800-pixel browser
viewport at 4× scale for readable compact framing. Captures are cropped
vertically without rewriting page text.
Camera coordinates use CSS pixels and retain the original vertical offsets.
Zoom stays within available native pixels at the final QHD size. The RDS PNGs
are the article's original images, displayed at or below native resolution.

- [Recall.ai article](https://www.recall.ai/blog/postgres-listen-notify-does-not-scale)
- [NOTIFY documentation](https://www.postgresql.org/docs/17/sql-notify.html)
- [PG17 async.c](https://github.com/postgres/postgres/blob/REL_17_STABLE/src/backend/commands/async.c)
- [PG19 release notes](https://www.postgresql.org/docs/19/release-19.html)
- [PG19 async.c](https://github.com/postgres/postgres/blob/REL_19_STABLE/src/backend/commands/async.c)

## Run

Create the ignored audio preview from the original WAV:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 1078 -t 152.867 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p09-a01-listen-notify-lock.wav
```

Run `task check`, then select
`Video-007-just-use-postgres-p09-a01-listen-notify-lock` in Studio.
Render the CapCut MOV only when explicitly requested:

```sh
task render:capcut VIDEO=007-just-use-postgres ANIMATION=p09-a01-listen-notify-lock
```
