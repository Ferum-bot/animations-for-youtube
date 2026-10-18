# PostgreSQL job queue

One continuous insert: **2560×1440, 30 fps, 106.4 seconds** (3192 frames).
Place at **08:13.000–09:59.400** in the edited video. Four preceding chapter
dividers already contribute 18 seconds. Source WAV start: **07:55.000**.

Entrance takes one second. The full-screen surface reflows to the full-height
left panel at **08:59–09:00**, leaving the presenter visible on the right.
The left background is solid through x=1320 and transparent by x=1600.
Exit: **09:58.400–09:59.400**, before the next divider at 09:59.600.
Studio footage is a still placement reference, not the moving video.

`timing.ts` owns millisecond boundaries. `data.ts` contains the supplied SQL
and complete library list. `QueueScenes.tsx` handles schema, competing workers,
lease, and transaction examples; `LimitScenes.tsx` handles libraries, retries,
queue/journal differences, row versions, and Outbox/Inbox. `Scenes.tsx` maps all
shot IDs exhaustively. Existing episode `CodeSnippet` and `ExplainerStage`
components provide code framing and full-screen-to-left framing respectively.

The lock demonstration intentionally takes two tasks per worker; the complete
lease query retains the source batch limit of ten. Worker colors identify
ownership, not extra columns in the supplied schema. The lease time scale is
explicitly illustrative. Row locks end with the short transaction; a persisted
lease is separate application state. The examples are explanatory SQL, not a
production queue implementation with ownership tokens and heartbeat handling.

SQL was checked in an isolated PostgreSQL 17.9 instance: while A held rows 1/2
in an open transaction, B immediately selected 3/4; active leases were skipped,
an expired lease was reclaimed; COMMIT plus ROLLBACK left one order and one job;
the parameterized completion DELETE removed the selected job. Transaction
examples assume fresh demo tables, as in the supplied materials.

COMMIT persists the job, not the external email effect. Idempotency is a
handler requirement. Inbox deduplication and its database business change
must be atomic. Kafka comparison concerns the displayed destructive job queue,
not everything that can be built with PostgreSQL. Old versions are reclaimable
only after no transaction needs them. The Yandex article is omitted because
its mention is absent from this recorded narration.

Generate the ignored narration preview:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 475 -t 106.4 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p05-a01-postgres-queue.wav
```

Run `task check`, then open `Video-007-just-use-postgres-p05-a01-postgres-queue`
in Studio. Inspect all state transitions and the panel over light and dark
backgrounds. Export only when explicitly requested:

```sh
task render:capcut VIDEO=007-just-use-postgres ANIMATION=p05-a01-postgres-queue
```
