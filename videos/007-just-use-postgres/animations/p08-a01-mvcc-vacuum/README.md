# MVCC and VACUUM

One deterministic 2560×1440 / 30 fps insert. Place at **12:59.000–18:14.600**
in the edited montage (seven preceding 4.5-second chapter dividers).
Source WAV begins at 747.5 seconds. Left half through 13:38.6; expansion
finishes at **13:40.000**, followed by full-screen scenes through chapter end.
The preview footage is a static reference, not a synchronized camera recording.

`timing.ts` holds narration cues in milliseconds. `Versions`, `Query`, `Btree`,
`Blockers`, `Benchmark` and `Spiral` each own one explanatory responsibility.
The scene remains local to part 08. `CodeSnippet` is the shared episode code
surface. The local camera stage supports the reverse of earlier inserts:
compact first, then full screen. Earlier compositions are unchanged.

`SourceCamera` pans/zooms original raster captures. Opening source shots have no outer
background panel: the native page, report, or thumbnail overlays the footage.
The opening sources are enlarged by 10%. The final Trigger.dev case continues
the full-screen dark stage, with a compact company header and a 1552×804 design
pixel article viewport (2483×1286 output pixels). Its background stays opaque
through the transition from the preceding diagram. Distant sections dissolve;
only nearby framing changes pan or zoom. Trigger.dev uses six native browser
captures at 3× device pixel ratio, with at least 900 CSS pixels in each text
viewport; enlarged floating excerpts are disabled for this full-screen case. `TriggerSource` owns this case locally. Source shots have no colored text
highlights or rewritten article text. `Sources` contains camera and quotation coordinates in
source-image pixels. Company names stay above the source. Important native
quotations zoom out of their original positions into a larger excerpt while
the surrounding article remains visible; their text is never retyped. Required assets are under the public `mvcc` directory:

- `solid-queue.png`: https://dev.37signals.com/solid-queue-v1-0/
- `redpanda-page-12.png`: printed page 12 (PDF page 14) of
  https://cdn.prod.website-files.com/6659da8aecd70e0898c0d7ed/672fb52dc29ab4cdf8a59525_The-State-of-Streaming-Data_Report-by-Redpanda.pdf
- `sharding.jpg`: original thumbnail of https://youtu.be/mrDihjhYSTg
- `trigger-*-3x.png`: six sections of https://trigger.dev/blog/stopping-xmin-horizon-blocking-postgres-vacuuming

Article captures use a 1440 CSS-pixel viewport. The six Trigger.dev sections
are 4320 pixels wide; their stored Y origins keep camera coordinates in CSS
pixels. Report page is 2319×3000.
The supplied video link and thumbnail are real; its title is typeset below it.
External page chrome/content may have changed since capture on 2026-10-19.

Benchmark values are transcribed from the user's supplied material, not new
measurements. The charts use Grafana-like dark panel styling, not a fabricated
Grafana screenshot. X is completed jobs, not time. Connected points are the
six recorded samples; recovery switches to a separate before/after comparison of latency and buffer
accesses, not a seventh workload sample. Both recovery plots first show the
drop on the original overview scale, then magnify the Y axis; the previous
value is explicitly marked above the visible range. The index-size stat stays
unchanged because this VACUUM did not shrink the file. After VACUUM the index file remains 2208 kB.
Sources for chart appearance: https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/time-series/

The B-tree is a schematic of a full `run_at` index, matching this experiment,
not the earlier chapter's partial queue index. Old index references are shown
for the supplied non-HOT workload; HOT can avoid additional index entries.
A snapshot, not every idle connection or bare BEGIN, retains the cleanup
horizon. The Trigger.dev case uses sequential scanning, as stated in its real
article; its CPU graph and VACUUM output are shown without recreating metrics.

Generate narration preview (ignored):

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -ss 747.5 -t 315.6 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p08-a01-mvcc-vacuum.wav
```

Run `task check`; open `Video-007-just-use-postgres-p08-a01-mvcc-vacuum`
in Studio. Export only on request:

```sh
task render:capcut VIDEO=007-just-use-postgres ANIMATION=p08-a01-mvcc-vacuum
```
