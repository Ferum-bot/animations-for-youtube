# Cassandra: episode data and adapters

The current visual implementation is [@channel/motion-v2](../../../packages/motion-v2/README.md).

- `chapters.ts`: episode-owned numbers and semantic title line breaks.
- `GeometryChapterDivider.tsx`: small adapter from chapter IDs to the v2 divider.
- `PresenterPreview.tsx`: adapter from an episode media prefix to explicit v2 preview paths.
- `font.ts`, `chapter-motion.ts`, `editorial-v2/*`: deprecated compatibility re-exports;
  new code imports the package directly. There is no second copy of the implementation.
- `source-documents/`: legacy clipping behavior retained for already approved intro/origins.
  New full-screen sources use v2 `SourcePage`; source coordinates and citations stay local.

Do not restore local copies of the shared library. Keep scripts, sources, narration
anchors and scene-specific layouts inside this episode.
