# Just Use Postgres — clips 02–25

Vertical adaptations of the published episode, using its real narration, examples,
archive captures and measured benchmark values. The presenter is absent from the
body. Both outlets reuse the accepted `intro-shorts/EndCard`.

## Studio

Run `task studio` from the repository root. Select
`V-007-just-use-postgres / P-02-Postgres-Shorts` or `P-01-TikTok`.
All entries are 1440×2560 at 30 fps, with narration enabled by default.

- Shorts ID: `Video-007-just-use-postgres-pNN-a01-SLUG`
- TikTok ID: `Video-007-just-use-postgres-pNN-a02-SLUG-tiktok`
- Direct URL: `http://localhost:3000/` followed by the composition ID.

The complete number/slug catalog is `clips.json`. Clip 01 remains in
`intro-shorts`. Each short has a five-second platform-specific outlet. The Quo
adaptation is slightly longer than one minute; do not accelerate the voice to
force it below an obsolete one-minute limit. Render a video only on the user's explicit request.

## Audio

Use the downloaded original audio from https://www.youtube.com/watch?v=vEHA2xgAxEM:

```sh
python3 videos/007-just-use-postgres/postgres-shorts/prepare-audio.py '/absolute/path/to/original.opus'
```

The script decodes the source once, cuts PCM samples using published-video
milliseconds from `clips.json`, applies 8 ms edge fades and a fixed +4 dB gain
with a -1.5 dBFS sample-peak ceiling. It checks first/last-second signal, clipping
and three-second silence gaps. Output is ignored Studio media under
`apps/remotion/public/generated/007-just-use-postgres/postgres-shorts/`.
Never commit these files or duplicate them into TikTok's directory.

There are no synthetic voice inserts or speed changes. The outlet is silent.
`sourceSeconds()` maps the edited position back to published source time, so a
removed sentence cannot shift subsequent semantic cues. After changing cuts,
update both entries' `durationMs` to body + 5000 ms rounded up to a 30 fps frame,
regenerate the registry, reload Studio and verify actual speech through the final
sentence. A plausible WAV container duration alone does not validate its audio.

## Implementation

`ShortComposition` owns platform selection, audio and body/outlet timing.
`DataScenes`, `QueueScenes`, `MvccScenes`, `SystemScenes` and `EvidenceScenes`
own the topic-specific explanations. The small `ui.tsx` primitives are local to
this episode; they are not a second cross-video design system.

The logical canvas is 1080×1920, scaled to 2K. Important content stays inside
x=72–900, y=240–1630, matching the previously accepted TikTok framing.
Native source pages remain borderless. `ArchivePage` scrolls to source-coordinate
rectangles, marks the original passage, then enlarges sharp text. `SourceFocus`
animates the camera onto an original chart. Match coordinates to the saved asset;
do not fabricate a webpage or replace its graph with invented data.

`../benchmark-measurements.ts` holds the original experiment samples shared with
the long-form scenes. It contains data only and imports no visual implementation.
Legacy visual modules remain deprecated; do not import them into these scenes.

## Source provenance and editorial scope

- Narration and SQL examples: the published episode linked above.
- HEY/Solid Queue: https://dev.37signals.com/solid-queue-v1-0/ . The quoted
  deployment uses MySQL; 20 million/day is an average, not a peak-throughput test.
- Redpanda, *The State of Streaming Data 2023–24*, page 12:
  https://cdn.prod.website-files.com/6659da8aecd70e0898c0d7ed/672fb52dc29ab4cdf8a59525_The-State-of-Streaming-Data_Report-by-Redpanda.pdf
  The chart describes respondents' data volumes, not a PostgreSQL capacity limit.
- Trigger.dev, August 2024:
  https://trigger.dev/blog/stopping-xmin-horizon-blocking-postgres-vacuuming .
  Preserve the distinction between the internal Graphile queue and the main v3
  queue. The postmortem did not identify the cause of the stuck xmin horizon.
- Recall.ai, March 2025 incident:
  https://www.recall.ai/blog/postgres-listen-notify-does-not-scale . This is a
  historical incident; the page was subsequently updated about PostgreSQL work.
- Quo, July 2026:
  https://www.quo.com/blog/postgres-to-cassandra/ . The one-writer limitation
  refers to the configuration used in that publication. Temporal persists history
  events, not a full snapshot after every step. Migration was still in progress.

The original screenshots are reused from public assets `mvcc/`, `notify-lock/`
and `quo/` in episode 007. Code is typeset for phone readability. Experiment
numbers are the author's specific measurements, not universal database limits.
NOTIFY is distinct from a durable job queue; its lock is not acquired by every
ordinary write. LISTEN requires session affinity (including PgBouncer session
pooling), and UNLOGGED crash recovery differs from a clean restart.

## Acceptance

Run `task check`. In Studio inspect the first frame, each state transition,
original highlighted passage, enlarged hold, final spoken sentence and outlet.
Check both platform entry points, typography and control-safe margins. Inspect
source graphs at phone scale. Audio QA must include content through the tail,
not only metadata. Remove temporary screenshots, OCR files, transcription
checks and scratch directories after inspection; keep production source assets.

## Upload exports

After explicit export approval, run from the repository root:

```sh
node videos/007-just-use-postgres/postgres-shorts/export-upload.mjs
```

This includes clip 01 and creates `output/shorts/NN-slug/` and
`output/tictok/NN-slug/` inside this video. Each directory contains only
`NN-slug.mp4` and `preview.jpg`. Titles and descriptions are provided in chat.
The MP4 is opaque H.264, 1440×2560, 30 fps, BT.709, with 48 kHz AAC narration
and fast-start metadata. The final five seconds use the platform's own end card.
Bodies are rendered once and shared without re-encoding; no full episode is
assembled. FFmpeg must be on PATH. Temporary renders are removed in `finally`.

To regenerate only the JPEG covers without touching existing video files:

```sh
node videos/007-just-use-postgres/postgres-shorts/export-upload.mjs --covers-only
```

`Cover.tsx` owns local cover copy and layout; composition props expose `cover`
for inspection. The exporter merges overrides into resolved composition props,
so cover mode and disabled audio take effect in the renderer API. Verify final
encoded audio, frame counts, transitions into both endings and all cover images.
