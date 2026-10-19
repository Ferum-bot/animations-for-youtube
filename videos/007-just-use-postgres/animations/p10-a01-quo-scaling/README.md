# Quo: the single-writer ceiling

Full-screen QHD insert, **2560×1440, 30 fps, 82 seconds**. Place at
**22:32.000–23:54.000** in the current edit. Nine preceding chapter cards add
40.5 seconds; the original WAV range is **21:51.500–23:13.500**.
The entrance slides in from the left. The insert stays full screen through
this chapter and exits over its final 0.5 seconds. The Studio talking-head
image is a static framing reference, not the edited footage.

The end follows the user's current 23:54 boundary. The older final-divider
anchor in `shared/edit-timing.ts` has not been moved. No complete-video
sequence is assembled by this animation.

## Implementation

- `timing.ts`: millisecond speech cues and source/edit placement.
- `Composition.tsx`: held shots with short overlapping dissolves.
- `Sources.tsx`: original page captures, bounded pan/zoom in CSS-pixel space.
- `Evidence.tsx`: original Temporal UI/history and Aurora/Cassandra diagrams.
- `History.tsx`: saved history, worker failure, replay and write-heavy traffic.
- `Scaling.tsx`: the reported Aurora topology, tuning and writer ceiling.
- `ui.tsx`: local primitives using the established episode theme.

`ExplainerStage` supplies the existing full-screen framing, preview background
and synchronized preview audio. Source assets remain separate from authored
explanatory diagrams. No measurements or throughput figures are invented.

## Technical boundaries

Temporal persists workflow **events** and uses history replay to reconstruct
workflow state. The sample event names illustrate the history mechanism; they
are not a captured production call. The waiting-write tiles represent demand,
not a measured queue length or a benchmark.

The Aurora single-writer limit describes the configuration in Quo's report,
before Aurora Limitless. Read replicas do not add writers to that topology.
The separate realtime path includes its own Temporal cluster and Aurora
instances. Cassandra scales this workload across nodes; the scene does not
claim it is a general replacement for SQL or an unlimited linear speedup.
The original report described a migration still in progress.

The source's illustrative throughput curve is deliberately not presented as
measured monitoring data. The actual architecture SVG is used instead.

## Assets and provenance

Public pages captured on 2026-10-19 at **1200 CSS px, 4× device scale**.
Text and layout are unchanged. Captures of distant sections retain their
original vertical coordinates. Native header illustrations are loaded at
full resolution rather than the site's reduced responsive thumbnails.

- [Quo website](https://www.quo.com/)
- [OpenPhone is now Quo](https://www.quo.com/blog/next-chapter/)
- [Outgrowing Postgres and moving to Cassandra](https://www.quo.com/blog/postgres-to-cassandra/)
- [Real-time AI voice agent with Temporal](https://www.quo.com/blog/how-we-built-a-real-time-ai-voice-agent-with-temporal/)

`temporal-ui.png` is frame 25 of the source's original `temporal_timeline.gif`
(1465×314), displayed no larger than its native pixels. The original SVGs
`temporal_event_history_to_storage_writes.svg` and
`aurora_single_writer_vs_cassandra_ring.svg` retain their content and remain
sharp at QHD. Page cameras never exceed the 4× text capture resolution.
Assets are under `apps/remotion/public/assets/007-just-use-postgres/quo/`.

## Run

Create the ignored preview audio:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 1311.5 -t 82 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p10-a01-quo-scaling.wav
```

Run `task check` and select
`Video-007-just-use-postgres-p10-a01-quo-scaling` in Remotion Studio.
Render a CapCut master only on explicit request:

```sh
task render:capcut VIDEO=007-just-use-postgres ANIMATION=p10-a01-quo-scaling
```
