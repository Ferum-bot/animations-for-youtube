# Episode-local chapter infrastructure

- `chapters.ts`: chapter numbers and semantic title line breaks.
- `GeometryChapterDivider.tsx`: the selected three-plane composition shared by all chapters.
- `ChapterStage.tsx`: QHD stage, semantic theme and chapter label.
- `font.ts`: bundled Manrope loading shared by chapters and typeset source quotations.
- `chapter-motion.ts`: entrance profiles and eased millisecond timing.

Keep this system local until another episode needs the same contract. Existing
standard and Postgres dividers have different visual/timing contracts.
- `editorial-v2/`: decoded source images and bounded gestures; see its README. Explanatory drawings follow `docs/style/PLAIN_EXPLANATION.md` and retain the chapter palette.
