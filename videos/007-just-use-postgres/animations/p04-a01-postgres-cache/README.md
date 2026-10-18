# Postgres cache

Continuous Redis-section insert, **2560×1440, 30 fps, 91 seconds**.
Place at **06:19.000–07:50.000** in the edited video. This includes three
preceding 4.5-second dividers (+13.5 seconds); do not add that offset again.
The source WAV starts at **06:05.500**.

The surface enters from the left during the first second. At **06:52–06:53**
it reflows into a full-height left panel, solid through x=1320 and transparent
by x=1600. Exit: **07:49–07:50**. Studio footage is a static placement reference.
Preview audio is never part of the transparent export.

`timing.ts` contains millisecond boundaries; `data.ts` contains the supplied
SQL, Redis commands, and source URLs. `CacheScenes.tsx` handles the worked
example; `LimitScenes.tsx` handles limitations. `Scenes.tsx` exhaustively maps
shot IDs. The episode's `CodeSnippet` supplies every code surface and
`ExplainerStage` owns framing, audio, and the preview background.

The example uses the supplied key and JSON value. Times 12:00 and 12:05 are
explicit illustrative clock times. PostgreSQL 17.9 validation confirmed
upsert uniqueness, live reads, expired-row filtering, and background deletion.
Expiry does not itself remove a row. DELETE does not immediately reclaim its
physical space; VACUUM can reclaim versions no transaction still needs.

The reading benchmark reports Redis **p50** and Postgres **mean**, so both are
labeled and no universal sevenfold speedup is asserted. The writing figures
are pgbench average transaction latencies, not timings of a single INSERT.
UNLOGGED loses table contents after an unclean shutdown; this is not a claim
about an orderly restart or all PostgreSQL data.

Generate the ignored Studio audio:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 365.5 -t 91 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p04-a01-postgres-cache.wav
```

Run `task check`, then open `Video-007-just-use-postgres-p04-a01-postgres-cache`
in Studio. Inspect entrance, shot changes, compact transition, and exit over
light and dark backgrounds. Export only when requested:

```sh
task render:capcut VIDEO=007-just-use-postgres ANIMATION=p04-a01-postgres-cache
```
