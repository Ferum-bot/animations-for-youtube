# One transaction

Full-screen insert: **2560×1440, 30 fps, 18 seconds** (540 frames).
Place at **12:16.000–12:34.000** in the edited montage, including six 4.5-second
chapter dividers. Source WAV start: **11:49.000**. The next divider starts at
12:34.067. Entrance is 0.9 seconds; exit occupies the final 0.6 seconds.
No compact/presenter layout is used. Studio footage is a static reference.

`timing.ts` keeps all narration cues in milliseconds. `Transaction.tsx` links
the supplied SQL to changes in orders, jobs, and cache; `Outcomes.tsx` shows
two alternative outcomes, not a COMMIT followed by a ROLLBACK;
`SeparateSystems.tsx` shows the application's independent database write and
broker publish. `data.ts` contains the source SQL and row descriptions.
Shared `CodeSnippet` provides code framing. `ExplainerStage` uses its explicit
full-screen mode; its default adaptive layout is unchanged.

The source assumes a fresh demo orders table: order id 1 matches the literal
job payload. A production implementation must pass the actual inserted id.
The displayed order/job/cache changes were checked in isolated PostgreSQL for
both COMMIT and ROLLBACK. Sequence allocation is not visualized as reversible.
A stored job is not an email delivery guarantee.

The document defines generated search and GIN on articles, but the transaction
example changes orders. The search diagram therefore explicitly states the
condition that search is configured for the affected data. It does not claim
that this SQL changes articles_search_idx or supplies missing orders DDL.
The broker failure scene demonstrates an uncoordinated dual write, not an
assertion that reliable delivery patterns are impossible.

Generate the ignored narration preview:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 709 -t 18 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p07-a01-one-transaction.wav
```

Run `task check`, then open `Video-007-just-use-postgres-p07-a01-one-transaction`
in Studio. Export only when requested:

```sh
task render:capcut VIDEO=007-just-use-postgres ANIMATION=p07-a01-one-transaction
```
