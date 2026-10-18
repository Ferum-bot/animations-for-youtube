# Just use Postgres

Ten preliminary chapter inserts for the existing transitions into parts 02–11.
Each composition lasts 4500 ms (135 frames), at 2560×1440 and 30 fps.

Run `task studio`, then open `Videos → V-007-just-use-postgres → P-00-Chapters`.
The default uses `themeId: graphite` and `motionProfile: calm`: a soft charcoal
background with warm, restrained headline luminance and quieter supporting text.
`themeId: paper` retains the light variant. Local color overrides live in
`shared/theme.ts`. Problem chapters use its muted terracotta signal token
for the lead text; the conclusion deliberately has no description.

Copy lives in `shared/chapters.ts`, frame-independent timing in
`shared/chapter-motion.ts`, and layout in `shared/PostgresChapterDivider.tsx`.
All ten animations belong to part 00 (`p00-a01` through `p00-a10`).
The composition wrappers fix the displayed divider number (01–10). Each manifest defines its
standalone duration and Studio defaults.

These are full-frame inserts, opaque from the first frame through the last.
The text and optional technology mark reveal together; the final state holds until the hard cut. There is no
background fade or exit animation.
`timeline.json` is intentionally empty: inserting extra time into the CapCut edit
and placing these cards over existing footage are different editing operations.
The current edit is not retimed or automatically assembled by this implementation.

Run `task check` after changes. Review entrance, first readable state, hold and
last frame, including the longest title (divider 09) and both themes.
Render QA stills outside the repository. Clip rendering requires an explicit request;
subsequent CapCut masters use `task render:capcut` and encoded alpha QA.

Technology marks are local monochrome SVG paths from [Simple Icons](https://github.com/simple-icons/simple-icons) (CC0):
[MongoDB](https://github.com/simple-icons/simple-icons/blob/develop/icons/mongodb.svg),
[Elasticsearch](https://github.com/simple-icons/simple-icons/blob/develop/icons/elasticsearch.svg),
[Redis](https://github.com/simple-icons/simple-icons/blob/develop/icons/redis.svg), and
[RabbitMQ](https://github.com/simple-icons/simple-icons/blob/develop/icons/rabbitmq.svg).
`shared/TechnologyIcon.tsx` contains the authored fan-out symbol for the generic Pub/Sub pattern.
No network requests are made during preview or rendering.

Intro animations live under `P-01-Intro` with `p01-aNN` IDs. The edited duration
includes all ten 4500 ms dividers. `shared/edit-timing.ts` maps narration positions
to the current CapCut edit; refresh its boundaries after moving inserts.
