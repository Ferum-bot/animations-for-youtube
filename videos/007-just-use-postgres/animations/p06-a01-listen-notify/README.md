# PostgreSQL LISTEN / NOTIFY

Continuous insert: **2560×1440, 30 fps, 79.8 seconds** (2394 frames).
Place at **10:30.000–11:49.800** in the edited video. Five preceding dividers
contribute 22.5 seconds; source WAV start is **10:07.500**.

Entrance takes one second. The surface reflows from full screen to the
full-height left panel at **11:20–11:21**, then exits at **11:48.8–11:49.8**.
The left background is solid through x=1320 and transparent by x=1600.
Studio footage is a still placement reference, not the moving video.

`timing.ts` owns millisecond boundaries. `sources.ts` contains the supplied
Go examples, reformatted without changing behavior. `data.ts` contains SQL
and listener log fragments without timestamps. `SourceScenes.tsx` presents
channel registration, scrolling Go sources, and the jobs trigger;
`DeliveryScenes.tsx` explains transaction delivery; `LimitScenes.tsx` covers
disconnection, payload size, and connection pooling. `PoolDiagram.tsx` shows
server-session assignment, release after COMMIT, and reassignment; its timing
lives in `poolTiming`. No successful LISTEN registration is implied in
transaction pooling. `Scenes.tsx` maps shot
IDs exhaustively. Shared `ExplainerStage` handles framing; shared `CodeSnippet`
provides the code surface and optional deterministic source scrolling.

The producer demonstration uses product 1, matching the supplied literal
payload. It is not a generic cache invalidation implementation. Jobs refer to
the table introduced in the previous part; the notification carries its queue
name, while job data stays in the table. A notification is a wake-up signal,
not a durable job or an acknowledgement. After reconnecting, register LISTEN
and check the table; registration must commit before checking initial state.
The listeners shown are outside long-running transactions.

Duplicate folding concerns identical channel/payload pairs within one
transaction, delivered once to each listening session. Offline subscribers
have no notification history. PostgreSQL's internal notification queue is not
shown as a persistent replay log. PgBouncer's LISTEN restriction applies to
transaction pooling; direct connections and session pooling are suitable.
NOTIFY itself also works with transaction pooling.

The displayed Go sources compile with pgx v5.7.4. The SQL and Go producer were
checked against an isolated local PostgreSQL: delivery after commit to three
listeners, no event after rollback, duplicate folding, trigger fan-out, missing
history after reconnection, retained job data, and the 7999/8000-byte boundary.

Generate the ignored narration preview:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 607.5 -t 79.8 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p06-a01-listen-notify.wav
```

Run `task check`, then open `Video-007-just-use-postgres-p06-a01-listen-notify`
in Studio. Inspect semantic transitions, source scrolling, entrance, reflow,
and exit over light and dark backgrounds. Export only when requested:

```sh
task render:capcut VIDEO=007-just-use-postgres ANIMATION=p06-a01-listen-notify
```
