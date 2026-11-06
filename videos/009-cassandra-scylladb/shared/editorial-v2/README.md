# Editorial v2

Episode-local foundation for the calmer explanatory animations requested on
2026-11-07. First production consumer: `p01-a02-history-index`. Existing chapter
dividers, intro overlays, legacy packages and eight examples are unchanged.

Use the binding `docs/style/ANIMATION_GUIDE.md` and episode rules first.
The source of motion is the explanation: copy a word into an index, add a logical
record, separate ownership, reveal evidence. Decorative infrastructure is not
part of this vocabulary. An event finishes and leaves a static, readable state.

- `motion.ts`: bounded arrivals, presence envelopes and scalar interpolation in ms.
  Reuses the episode's easing instead of introducing another animation engine.
- `primitives.tsx`: decoded source images in SVG coordinates.
- `illustration.tsx`: fixed authored contours and the graphite theme, shared by
  `p01-a02-history-index` and `p01-a03-history-consistency`. Message bubbles accept
  optional content; their default two-line icon remains unchanged. The former
  `p01-a02-history-index/Illustration.tsx` path re-exports the same components.
  Follow `docs/style/PLAIN_EXPLANATION.md`; do not restore generic slide components.
- Sequence, domain data and narration cues belong to the consuming animation.

Keep this API small. Start new visual behaviours locally, validate them in Studio,
and promote to a shared package only after another episode actually needs them.
Do not make a second catalogue of animated demos merely to showcase the toolkit.

Readability holds do not contain scale breathing, looping counters, camera drift,
noise or pulsing decoration. A finite flow is appropriate only while explaining
a continuing workload. Numbers in examples are explicitly illustrative.
