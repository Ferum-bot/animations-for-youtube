# Cassandra history: origins

Open `Videos → V-009-cassandra-scylladb → P-01-History` in Studio on port 3000.
Composition: `Video-009-cassandra-scylladb-p01-a01-history-origins`.

2560×1440, 30 fps, 1496 frames (49.866667 s). In the current CapCut edit,
place at **01:49:25**, immediately after the history divider, ending **02:39:21**.
The original narration excerpt is 105333.333–155200 ms; the preceding inserted
divider adds 4500 ms. `scene.ts` keeps speech cues in original narration time.
The timeline cue therefore uses `chapter-history` plus a 4500 ms offset.
Recheck this mapping if the edit or narration changes.

`DocumentScene` displays native source crops and a first-page PDF image.
`AuthorsScene` owns the portrait pair. `InboxScene` separates the authentic
June 2008 screenshot (query `stanford`) from explicitly labelled fictional
Russian search examples. Do not alter the original screenshot to pretend it
contained the Russian query. The portraits are later photographs, not photos
from the 2007 development period. Source URLs and photo attribution live in
`sources.ts` and the asset README.

The left footprint matches the approved intro: x=100…1266.4. One surface has
one entrance/exit and one shadow. `shared/source-documents/QuoteHighlight.tsx`
typesets exact quoted text at production size using the episode's bundled font;
the source image softens behind it. The same implementation serves the intro.
Keep timings, source metadata, scene layout and preview media separate.

## Preview

`previewBackground`: `photo` (default in Studio), `transparent`, `light`, `dark`.
`withAudio`: true by default in Studio. Exports and timeline placement use
`transparent` and false. `shared/PresenterPreview.tsx` loads one JPEG and one
trimmed mono AAC excerpt. Never add full presenter footage or the full WAV.
Preview media is ignored under `apps/remotion/public/generated`.

Regenerate the local preview inputs with:

```sh
ffmpeg -y -ss 30 -i /Users/mdpopov/Desktop/cassandra/IMG_4183.MOV \
  -frames:v 1 -vf scale=1280:720 -q:v 3 \
  apps/remotion/public/generated/009-cassandra-scylladb/history-presenter.jpg
ffmpeg -y -ss 105.333333 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV \
  -t 49.866667 -ac 1 -ar 48000 -c:a aac -b:a 128k \
  apps/remotion/public/generated/009-cassandra-scylladb/history-excerpt.m4a
```

Run `task check`. In Studio inspect each entrance, quotation transition, both
portrait labels, archive-to-example transition, typed query, results, and exit.
Check light and dark backgrounds and preserve a clean right-hand presenter zone.
Do not render a clip or MOV without an explicit request. Future transparent
CapCut masters must use `task render:capcut` and `task qa:capcut-alpha`.
