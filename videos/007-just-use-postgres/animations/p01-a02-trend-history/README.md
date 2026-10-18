# Trend history, 2022–2026

Studio: `Videos / V-007-just-use-postgres / P-01-Intro`.
Place this composition at **00:30.300** in the current CapCut edit. It ends at
**01:25.300**, immediately before “Со стороны это всё может выглядеть…”.
The ASR boundary is 00:30.280; placement rounds to the next 30 fps frame and
joins the preceding 30.300-second intro master. Duration: 55000 ms, 1650 frames.
No chapter insert precedes this segment. Later placements use `shared/edit-timing.ts`.

`scene.ts` contains absolute narration timings, typed layer placement, asset
dimensions and original URLs. Motion uses only the composition frame: short
opacity/vertical reveals followed by still holds. The right side remains clear.
There are no authored captions, dates, labels or technology names. Only native
page pixels, YouTube cards and the original book cover are visible. Website
windows retain the full captured page width, including navigation and margins.
Native header pixels remain visible above the scrolling document. Screenshot
coordinates drive synchronized highlights on the Laravel database defaults and
Rails database adapters / Redis replacement sentences. No article text is recreated.
The approved wider left footprint is 1440 px, starting at x=100.
Scroll coordinates use source-image pixels and are clamped to the image bounds.

All webpage crops were captured on 2026-10-18. YouTube thumbnails, titles and
counts come from the Fireship and Theo channel search pages; the Neon sponsor
line comes from the Fireship video description. Counts are a captured snapshot.
The essay capture is the **current website**, including its update date, not an archived 2022 page. The
separate Hacker News capture establishes the original December 10, 2022 date.
The Laravel excerpt specifies SQLite and database-backed drivers; it is not a
claim that Laravel or Rails defaults to PostgreSQL. The book cover is the
publisher's original image. Neon scrolls past the hero artwork to the Postgres
product and then shows its current pricing page with paid plans. Captured prices
are source material for the animation, not a current purchasing recommendation.

Studio's footage background is a placement reference, not synchronized footage.
Export with `previewBackground: transparent` and `withAudio: false`.
Regenerate the ignored audio preview with:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 30.3 -t 55 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p01-a02-history.wav
```

Run `task check`. QA stills belong outside the repository. Render a MOV only
after an explicit request, with `task render:capcut VIDEO=007-just-use-postgres ANIMATION=p01-a02-trend-history`.
