# Just Use Postgres — vertical adaptations

The first short preserves the episode's archive-led sequence and muted graphite
palette, implemented with `@channel/motion-v2`. No presenter footage is used.
The original episode thumbnail and channel avatar appear only in the outlet.

## Studio and exports

Run `task studio`; select `V-007-just-use-postgres / P-01-Intro-Shorts` or
`P-01-TikTok`. Both compositions are 1440×2560, 30 fps, 1794 frames (59.8 s).
The body lasts 54.8 s and the platform-specific outlet lasts 5 s.

- Shorts: `Video-007-just-use-postgres-p01-a01-trend-origin`
- TikTok: `Video-007-just-use-postgres-p01-a02-trend-origin-tiktok`

`withAudio` defaults to true. `cover: true` selects the maintained cover layout
for a still export, never for the normal video. `platform` selects only the outlet.
The TikTok entry point reuses the same implementation and sets its platform in
metadata. The long-form timeline is unchanged.

Exports live in this episode's ignored `output/shorts/` and `output/tictok/`
directories, not inside the auto-discovered animation collections. Use MP4
H.264, yuv420p, AAC 48 kHz, BT.709, 30 fps. The alpha-MOV pipeline does not apply
to these opaque, ready-to-upload vertical videos.

Example, from the repository root (render only when requested):

```sh
pnpm --filter @channel/remotion exec remotion render src/index.tsx \
  Video-007-just-use-postgres-p01-a01-trend-origin \
  ../../videos/007-just-use-postgres/output/shorts/01-trend-origin.mp4 \
  --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --color-space=bt709
```

## Audio and timing

Source: https://www.youtube.com/watch?v=vEHA2xgAxEM . The score uses the **published
video's** timebase. Cut 00:30.800–01:25.600; do not add chapter offsets again.
No speed changes, voice generation, or internal speech cuts are applied.
The corrected full cut measures -17.4 LUFS / -0.7 dBTP with fixed +5.5 dB gain.
The outlet is silent. Trim first and reset audio timestamps before applying
fades: output-side `-ss` with `afade` previously silenced the last 30.8 seconds.
Verify speech through the last sentence, not only container duration. The v2
filename also invalidates Studio's cached media and waveform.

```sh
mkdir -p apps/remotion/public/generated/007-just-use-postgres/intro-shorts
ffmpeg -i '/Users/mdpopov/Downloads/Не используй Postgres для всего, пока не посмотришь это [vEHA2xgAxEM].opus' \
  -af 'atrim=start=30.8:end=85.6,asetpts=PTS-STARTPTS,volume=5.5dB,afade=t=in:d=0.012,afade=t=out:st=54.77:d=0.03' \
  -ar 48000 -c:a pcm_s16le \
  apps/remotion/public/generated/007-just-use-postgres/intro-shorts/trend-origin-v2.wav
```

## Extension contract

The collection uses a 1080×1920 coordinate system rendered at 4/3 scale. Main
content stays inside x=72–900, y=240–1630. These conservative margins come from
the channel's previous TikTok preview checks, not a universal platform spec.
Recheck top navigation, right actions and bottom captions for each new shot.

`ArchivePage` owns only source-coordinate scrolling, highlighting and sharp
quote enlargement. Shot order, narration offsets, exact quotations and source
rectangles remain in each animation's `score.ts`. Source pages extend to the
canvas edges using their native paper color; there is no browser-card border.
New sequences must match their quote rectangles to the actual saved image.

QA: inspect the immediate opening, original highlighted text, enlarged holds,
both Rails passages, the sponsor transition, every shot boundary, the final
audio tail, and both outlets. Check at phone size and against UI overlays.
Remove temporary screenshots, bundles, scripts and logs after verification.

## Editorial boundaries

- The essay screenshot is an updated site; the HN discussion establishes the
  2022 date. HN points and YouTube views are saved historical observations.
- Laravel's database-backed drivers do not mean PostgreSQL is its default.
  Its quoted document specifies SQLite.
- The Rails Redis excerpt concerns its adapters. It is not a blanket claim
  about every Redis workload.
- The original description supplies the Neon sponsor wording. Commercial
  involvement is shown as a fact, not as proof that advice is dishonest.
- Tiger Data's highlighted names are selected extensions from its own table,
  not a claim that it develops every extension mentioned in the article.

Source URLs and asset provenance: `p01-a01-trend-origin/sources.json`.
Publishing text: `p01-a01-trend-origin/publishing.json`. For Shorts, manually set
the related video to `vEHA2xgAxEM`; the artwork does not configure that link.
