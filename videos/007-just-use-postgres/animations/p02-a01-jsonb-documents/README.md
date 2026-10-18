# JSONB documents

One continuous insert for the MongoDB section. Place at **02:28.000** in the
edited video, ending **03:59.200**. The first 4500 ms chapter divider is already
included: source WAV starts at 02:23.500. Do not add the divider offset again.

The surface slides in from the left over 1000 ms. It fills QHD until 03:11.800,
then smoothly reflows into a full-height left layout, reaching it at
**03:13.000**. The background touches the top, left and bottom edges; it remains
solid through x=1320 and feathers to transparency by x=1600 using the shared
`FeatheredBackground`. Content uses the vertical area, with 100 px left padding.
The right presenter zone is then transparent. Exit ends before
the next divider at 03:59.467. Studio footage is a still placement reference.

`scene.ts` owns timing and source SQL; `Scenes.tsx` owns explanatory states;
`ui.tsx` owns local typography; `Composition.tsx` owns framing and preview audio.
All motion is frame-derived. Products and SQL follow the supplied script.
The binary object is a conceptual diagram, not a physical B-tree. GIN uses
`jsonb_path_ops` (path/value index elements). Expression statistics refer to
`attrs->>'color'`, not a claim about automatically fixing `@>` estimates.
TOAST uses a separate large-document example; no forced EXPLAIN or invented
performance values are presented.

Generate the ignored narration preview:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 143.5 -t 91.2 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p02-a01-jsonb.wav
```

Check with `task check`. Export only on request using:

```sh
task render:capcut VIDEO=007-just-use-postgres ANIMATION=p02-a01-jsonb-documents
```
