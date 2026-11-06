# History: search index

Studio on port 3000: `Videos → V-009-cassandra-scylladb → P-01-History`.
Composition ID: `Video-009-cassandra-scylladb-p01-a02-history-index`.
Run `task check` and `task studio` from the repository root.

QHD 2560×1440, 30 fps, 3519 frames / 117.3 seconds. This is a full-screen
explanation, opaque between its transparent entrance and exit. No render is
authorized by implementing or reviewing this composition.

Current CapCut placement is **02:39:21–04:37:00**, with no ripple insertion.
The reading take ends at **04:36:21**; the last nine frames span the return to
camera. The native narration excerpt starts at 155200 ms; the already-inserted
chapter adds 4500 ms. `scene.ts` contains relative millisecond speech cues.
Recheck these mappings when the edit changes.

Visual rules: `docs/style/PLAIN_EXPLANATION.md`. Simple original SVG message bubbles,
pockets and index slips; Common Craft / Maggie Appleton / Julia Evans direction.
Palette matches chapter dividers exactly through `getTheme('graphite')`: dark
background, cream outlines and text, cobalt accents. No light paper background.

The first consumer of the local `shared/editorial-v2` primitives. The message
record persists while copies of its words become index entries. The four-word
spoken example and the later generic ten-word example are distinct states.
Two per-user indices are logical records, not physical I/O or storage size claims.
The illustrated update stream is finite and qualitative, not measured RPS.
The portrait is later photography; the interviews were published in 2021.

Source provenance is in `sources` in `scene.ts` and the asset README. Enlarged
quotations and all explanatory text are live Manrope, never enlarged screenshot
lettering. The original native source screenshots retain their original content. The podcast
page fills QHD edge-to-edge from excerpt 43.000 s, scrolls to the cost paragraph
and highlights its exact lines before the enlarged quote; exact per-user-index quotation at 85.200 s;
cost/operations quotation at 108.560 s with an explicitly labelled translation.
The quote text is in `PodcastPage.tsx`, the primary URL is in `scene.ts`.

Preview props: `previewBackground` is `transparent`, `photo`, `light` or `dark`;
`withAudio` toggles the trimmed excerpt. Ignored preview media:
`public/generated/009-cassandra-scylladb/history-index-{presenter.jpg,excerpt.m4a}`.
Only one still and the required 117.3 s audio excerpt are loaded, never a video.
Regenerate from the original WAV at 155.2 s using mono AAC at 128 kbps; use a
still from IMG_4183.MOV at source 266.133333 s for the background.

Check entrance, source reveal, storage growth, decision, each word transfer,
four-to-ten transition, per-user expansion, workload hold, quote and final fade.
Review alpha against both light and dark backgrounds in Studio. Export only
when requested, with the existing CapCut ProRes 4444 pipeline and encoded QA.
