# Intro sources

One composition, `Video-009-cassandra-scylladb-p00-a01-intro-sources`.
Open `Videos → V-009-cassandra-scylladb → P-00-Intro` in Studio on port 3000.

Duration: 41700 ms / 1251 frames, 2560×1440, 30 fps. Place at 00:41:15
in the original edit (ends at 01:23:06). No chapter insertion precedes it.
Studio starts at the first source entrance, without the empty opening or tail.
Clipping cues retain original narration milliseconds; Composition adds the
41500 ms source offset to its local time. The trimmed audio starts at local zero.
Six successive source scenes share the left footprint x=100…1266.4.
The user explicitly requested an 8% enlargement from the original 1080 px width.

`sources.ts` owns source URLs, native canvas colours and crop dimensions.
`scene.ts` owns narration cues, exact quotation strings, source locations and document placement.
`SourceDocument.tsx` groups a publication into one surface with one entrance/exit
and cast shadow. `SourceClipping.tsx` scales native pixels and softly defocuses the
page during a selection. `SourceHighlight.tsx` typesets the exact quotations as
live text in local Manrope at production resolution (54–80 px). Font size and
position animate directly; no screenshot pixels or pre-rasterized text are scaled.
The source rectangles are only origin anchors for the entrance and return.
`shared/font.ts` owns the same bundled font used by the chapter dividers.
Long quotations have authored line breaks. Verify wording, punctuation, fit and
Cyrillic glyphs for every quotation. The first Uber paragraph highlights Cassandra
and then the article's statement about trips/orders depending on database
interactions; it does not prove that all Uber data or trip history lives there.
`Preview.tsx` is the
separate optional still/audio layer. Existing Postgres source windows have
different scrolling and framing requirements; this smaller contract stays local.

All 15 PNGs are crops of actual pages captured on 2026-11-06. Article titles,
dates, paragraphs and original site backgrounds are unchanged. Page chrome,
unrelated illustrations and unrelated surrounding paragraphs were cropped away.
Header and excerpt crops meet on one document surface. This is an editorial
assembly of real crops. At the user’s request, foreground quotations are retyped
for clarity, keeping the source wording. The underlying screenshots remain intact.
Discord, Ozon and OK excerpts use the sites’ native narrow responsive layout
for larger type within the left-side footprint.
Do not rewrite original article titles or turn historical metrics into current
statistics. Discord 2026 supports the broad user-data statement; the 2023
headline identifies its earlier message-storage migration. Uber supports critical
workloads and scale, not a claim that every Uber dataset resides in Cassandra.
MTS explicitly names Cassandra in MTS ID; its critical title is retained.
The historical Tinkoff name remains as published in the DevOops 2023 source.

Timing uses reviewed local transcript segments and word-level Whisper offsets.
Company headers lead the named word slightly to allow reading. The MTS/Tinkoff
pair intentionally remains until 83.2 s, after the short spoken list ends.

## Preview media

Studio uses one presenter JPEG and only the 41.5–83.2 s narration excerpt
(mono AAC, 128 kbps). No video is loaded or decoded. Both files are ignored,
ingested media under public/generated, not deliverables. Do not add a full
video or full narration track for preview. The still is from source time 95.2 s
(CapCut start 33.9 s + timeline 61.3 s). Regenerate with:

```sh
mkdir -p apps/remotion/public/generated/009-cassandra-scylladb
ffmpeg -y -ss 95.2 -i /Users/mdpopov/Desktop/cassandra/IMG_4182.MOV \
  -frames:v 1 -vf scale=1280:720 -q:v 3 \
  apps/remotion/public/generated/009-cassandra-scylladb/intro-presenter.jpg
ffmpeg -y -ss 41.5 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -t 41.7 -ac 1 -ar 48000 -c:a aac -b:a 128k \
  apps/remotion/public/generated/009-cassandra-scylladb/intro-excerpt.m4a
```

For overlay review choose `previewBackground: transparent`, `light` or `dark`.
For export set `previewBackground: transparent` and `withAudio: false`.
Export only on a new explicit request, using `task render:capcut` and encoded
alpha QA. The chapter MOV export request does not authorize this overlay export.

Run `task check`. In Studio inspect the empty states, each source entrance,
highlight, Uber excerpt replacement, Discord second source, the paired Russian
sources and final exit. Check native text, crop edges, maximum bounds and footage
occlusion. Keep QA screenshots outside the repository.
