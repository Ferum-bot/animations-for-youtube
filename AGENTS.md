# Agent context: CS Motion System

Read this file before changing motion code.

## Product

This repository contains explanatory motion graphics for a Russian-language YouTube channel about computer science and distributed systems. The host footage is usually a talking head. Graphics clarify a relationship, state change, boundary, or failure mode; they are not decorative filler.

The intended tone is authored, calm, editorial, technically literate, and occasionally cinematic. Avoid generic AI aesthetics.

## Source of truth

- `apps/remotion/` is the single Remotion entry point.
- `videos/<video>/animations/<animation>/Composition.tsx` is the source for episode-specific animation code.
- `videos/<video>/shared/` is local to one episode.
- `packages/` contains reusable cross-episode libraries.
- `packages/standard-animations/` contains reusable channel inserts.
- `examples/animations/` contains eight canonical visual references. Preserve all eight unless the user explicitly requests removal.
- `apps/remotion/src/generated/video-registry.tsx` is generated. Never edit it by hand; run `task generate`.
- Generated renders and ingested audio are not source and must not be committed.

## Architecture rules

1. Keep episode code vertical: video -> animations -> code for each animation.
2. Start a component in the video's `shared/` folder. Promote it to `packages/ui` only after it has a stable cross-video use case.
3. Keep timing, theme, UI, audio synchronization, and rendering as separate concerns.
4. Animation components receive serializable props. Do not read environment state or wall-clock time during rendering.
5. All motion must be reconstructible from `useCurrentFrame()` and props. Never use unseeded randomness or R3F `useFrame()` for timeline state.
6. Use milliseconds as the persisted timing unit. Convert to frames only at the Remotion boundary.
7. A composition ID may contain only letters, numbers, and hyphens.
8. Pin `remotion` and every `@remotion/*` package to the same exact version.

## Design principles

1. One communication job per shot.
2. Meaning drives motion. A transition should be caused by routing, hierarchy, material behavior, camera movement, or a state change.
3. Use at most four motion verbs in one scene: for example `reveal`, `route`, `commit`, `return`.
4. Prefer deliberate holds and short bursts to constant motion.
5. Color is semantic, not decorative.
6. Keep architecture technically plausible. No fake dashboards, random metrics, or meaningless arrows.
7. Do not add glow, grain, particles, glass cards, rounded rectangles, or chromatic aberration without a specific communication job.
8. Typography and negative space are primary design elements.
9. Keep at least 74 px of safe margin at 1920x1080.
10. The frame must remain understandable without sound and as a thumbnail.

## Visual system

2D editorial palette:

- paper `#F2EEE4`
- ink `#111111`
- cobalt `#1845D8`
- vermilion `#F04A24`
- green `#2F7D45`
- wine `#2B1015`

3D palette:

- background `#090B0F`
- cream `#F3EEE4`
- cobalt `#2451E6`
- orange `#FF4A25`
- green `#35A05A`
- wine `#4B1824`
- steel `#313741`
- gold `#D28A35`

Use bold sans for the thesis and monospace for routes, IDs, timings, and infrastructure state. Russian headings may contain exact English protocol and architecture terms. Do not use more than two typographic roles per frame.

Themes use semantic tokens from `@channel/theme`. Do not hardcode global palette values in new product components. Keep `themeId` (visual appearance) separate from `motionProfile` (speed and easing). A video may override a global theme in its local `shared/` library.

## Technical vocabulary

Canonical synchronous path:

`Client -> API Gateway -> Auth/Domain Service -> PostgreSQL -> response`

Optional asynchronous continuation:

`PostgreSQL transaction -> outbox -> relay -> broker -> idempotent consumers`

- A database commit is not event delivery.
- At-least-once delivery requires idempotency or deduplication.
- WAL is a durability and replication mechanism, not a broker.
- A trace span represents timed work, not a decorative bar.
- A compensation is a new semantic action, not a distributed rollback.

## Timing and audio anchors

- `video.json` declares fps, size, duration, and optional ingested audio.
- `transcript.json` stores normalized segments with `startMs`, `endMs`, and `text`.
- `anchors.json` maps semantic names to milliseconds.
- `timeline.json` places an animation at an anchor with `offsetMs`, `durationMs`, and props.
- The generated full overlay converts milliseconds to frames and places each animation in a `<Sequence>`.
- If the final audio changes, ingest it again and revalidate anchors before rendering.

Recommended overlay entrance: 6-12 frames. Recommended exit: 8-15 frames. Prefer changing opacity plus one restrained spatial property.

## Reference compositions

1. `EditorialPulse`: low-detail chapter opener.
2. `TraceLanes`: tracing and latency lanes.
3. `PacketAutopsy`: high-detail request transformation.
4. `MaterialTopology`: abstract kinetic topology.
5. `CorrectnessDarkroom`: transaction, WAL, outbox, broker, idempotency.
6. `TransitReactor3D`: physical client-to-database hero pipeline.
7. `ReplicationChamber3D`: WAL replication, failure, quorum, recovery.
8. `EventMesh3D`: synchronous commit, async fan-out, compensation.

Use 2D for most of an episode. Reserve complex 3D for roughly 10-15% of motion runtime so it remains special.

## Commands

```bash
task setup
task studio
task check
task compositions
task video:new VIDEO=001-topic TITLE="Title"
task animation:new VIDEO=001-topic ANIMATION=request-flow TITLE="Request flow"
task render:preview COMPOSITION=Examples-EditorialPulse
task render:animation VIDEO=001-topic ANIMATION=request-flow
task render:overlay VIDEO=001-topic
```

## Definition of done

1. `task check` succeeds.
2. Scrubbing is deterministic at every frame.
3. The technical state sequence is correct.
4. Titles, Russian glyphs, safe areas, connections, and occlusion are visually checked.
5. Inspect beginning, midpoint, resolved state, and fade-out frames.
6. Alpha output is checked over both light and dark footage.
7. Do not mark a scene complete merely because it renders.

