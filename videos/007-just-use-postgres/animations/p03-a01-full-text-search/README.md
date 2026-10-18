# Full-text search

One continuous insert for the Elasticsearch section. Place at **04:21.000** in
CapCut, ending **06:03.000**. Both preceding 4.5-second dividers are already
included. The source WAV starts at 04:12.000; do not add the nine seconds again.

The surface enters from the left over one second. It fills the frame until
05:29.800, then reflows into a full-height left layout by **05:31.000**. Results
move down before moving left, keeping the query readable during the transition.
The compact background is solid through x=1320 and transparent by x=1600.
The final exit runs from 06:02.200 to 06:03.000. Studio footage is a static
placement reference, not the moving host footage.

`timing.ts` owns the millisecond boundaries; `data.ts` owns the source examples;
`IndexScenes`, `SearchScenes`, and `LimitScenes` own the explanatory states.
`Composition.tsx` owns framing and preview audio. Appearance comes from the
shared episode theme. Motion uses the shared deterministic easing helper and
`FeatheredBackground`; no CSS transitions or wall-clock state are used.

SQL results were checked in isolated PostgreSQL 17.9 with en_US.UTF-8 locale:
ranks round to 0.974 / 0.579, phrase search returns article 01, the typo returns
no rows, and the trigram city queries return the expected names. The lexical
example uses the supplied script's **забирали → забира**. The audio ASR also
reports **забрали**, which would instead produce **забра**; these two input/output
pairs must not be mixed. Stop-word removal preserves original positions.
The Elasticsearch analyzer drawing is a language-analyzer example, not a claim
that the standard analyzer stems. Ranking limitations refer to the built-in
PostgreSQL functions, not all extensions or custom ranking implementations.

Generate the ignored narration preview:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 252 -t 102 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p03-a01-full-text-search.wav
```

Run `task check` and open the composition in Studio. Export only on request:

```sh
task render:capcut VIDEO=007-just-use-postgres ANIMATION=p03-a01-full-text-search
```
