# Agent context: CS Motion System

Read this file before changing motion code.

## Non-negotiable operating rules

These rules apply to every task in this repository unless the user explicitly overrides one in the current request.

1. Never create a Git commit and never push. A commit or push is allowed only when the user explicitly asks for that exact action.
2. Write human-readable code using SOLID, DRY, and KISS. Decompose by responsibility, prefer clear names, keep public APIs small, and remove incidental complexity.
3. Every new video or animation ends with a refactoring pass. Review both the changed area and the whole codebase for duplication, misplaced responsibilities, and reusable components. Keep a component local first; promote it to a global package only when its contract is genuinely cross-video.
4. Use modern TypeScript: strict types, `unknown` plus narrowing instead of unsafe assertions, discriminated unions for variants, `satisfies` for configuration, readonly data where appropriate, exhaustive checks, and type inference where it improves clarity. Avoid `any`, enums without a strong reason, non-null assertions, and type casts that hide design problems.
5. Every animation requires visual acceptance. Inspect all important frames: empty/entrance, first readable state, semantic transitions, peak state, resolved hold, and exit. Check clipping, overlaps, safe areas, line intersections, accidental artifacts, typography, and alpha over light and dark backgrounds.
6. Do not automatically assemble or render a full video. Implement and acceptance-check animations. Render key stills for QA; render clips or a full overlay only when the user explicitly asks.
7. Production animations are YouTube 2K QHD: `2560x1440`, `30fps`. The eight frozen legacy references remain `1920x1080` historical examples and are not production output.
8. Deliver transparent CapCut overlays as QuickTime `ProRes 4444` with an alpha-capable pixel format. H.264/MP4 is preview-only and must not be used as the compositing master.

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
- `docs/style/motion-design-youtube-research-ru.pdf` is the canonical research document for the user's visual direction.

## Architecture rules

1. Keep episode code vertical: video -> animations -> code for each animation.
2. Start a component in the video's `shared/` folder. Promote it to `packages/ui` only after it has a stable cross-video use case.
3. Keep timing, theme, UI, audio synchronization, and rendering as separate concerns.
4. Animation components receive serializable props. Do not read environment state or wall-clock time during rendering.
5. All motion must be reconstructible from `useCurrentFrame()` and props. Never use unseeded randomness or R3F `useFrame()` for timeline state.
6. Use milliseconds as the persisted timing unit. Convert to frames only at the Remotion boundary.
7. A composition ID may contain only letters, numbers, and hyphens.
8. Pin `remotion` and every `@remotion/*` package to the same exact version.
9. Episode animation IDs follow `pNN-aNN-slug`: `pNN` is the part number and `aNN` is the order inside that part. Use part `00` for episode-wide inserts and order `00` for chapter dividers. Directory name, `animation.json` ID, timeline reference, and Remotion composition ID must stay identical.

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
11. Talking-head overlays must preserve a deliberate presenter-safe zone. The default compact left-side footprint on a `2560x1440` canvas is: panel up to `1080 px`, rails up to `860 px`, title zone up to `780 px`. Keep the right side free unless the user explicitly approves another layout.

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
task animation:new VIDEO=001-topic PART=02 ORDER=03 ANIMATION=request-flow TITLE="Request flow"
task render:preview COMPOSITION=Examples-EditorialPulse
task render:animation VIDEO=001-topic ANIMATION=request-flow
task render:overlay VIDEO=001-topic
```

## Definition of done

1. `task check` succeeds.
2. A repository-wide refactoring and duplication pass is complete.
3. Scrubbing is deterministic at every frame.
4. The technical state sequence is correct.
5. Key stills are rendered and visually inspected, including beginning, transitions, resolved state, and fade-out.
6. Titles, Russian glyphs, safe areas, connections, clipping, and occlusion are checked.
7. Alpha output is checked over both light and dark footage when an alpha render is requested.
8. Production metadata is `2560x1440`, `30fps`.
9. Do not mark a scene complete merely because TypeScript passes or one frame renders.
