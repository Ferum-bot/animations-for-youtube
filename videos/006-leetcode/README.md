# LeetCode: system design

Production: 2560×1440, 30 fps. Episode-local editor colors are in `shared/theme.ts`;
the default is the light `paper` theme. `graphite` provides a dark editor variant.

## Docker command

Two independent compositions, each with its own entrance, exit and audio excerpt:

| Composition | Source placement | Duration |
| --- | --- | --- |
| `Video-006-leetcode-p01-a01-docker-run` | 14:35.740–14:54.080 | 18.340 s |
| `Video-006-leetcode-p01-a02-docker-flags` | 15:29.340–16:02.240 | 32.900 s |

The first shows the full command and driver call. The second highlights each
spoken flag. Place each at its source timestamp in the current
`leet_code_audio.WAV` edit, at 100% speed. Neither contains an internal blank gap.

The exact source command and common scene are in `shared/docker/`. The command
is displayed, never executed. Spoken anchors are in `anchors.json`; each animation
owns its own `cues.ts`, converting those anchors to its local milliseconds.

The first and last frames of each composition are transparent.
The panel occupies x=330..2230, y=422..1222 on the QHD canvas,
leaving the upper-right webcam clear. The position is based on the supplied
system-design recording reference, not the channel's compact talking-head layout.

Run `task studio` and select the composition under `V-006-leetcode / P-01`.
For audio scrubbing, override `withAudio` to `true` in Studio. The ignored preview
assets can be regenerated from the original recording:

```sh
mkdir -p apps/remotion/public/generated/006-leetcode
ffmpeg -i /Users/mdpopov/Movies/CapCut/leet_code_audio.WAV \
  -ss 875.740 -t 18.340 -ac 1 -ar 16000 -c:a pcm_s16le \
  apps/remotion/public/generated/006-leetcode/p01-a01-docker-run.wav
ffmpeg -i /Users/mdpopov/Movies/CapCut/leet_code_audio.WAV \
  -ss 929.340 -t 32.900 -ac 1 -ar 16000 -c:a pcm_s16le \
  apps/remotion/public/generated/006-leetcode/p01-a02-docker-flags.wav
```

`previewBackground` can be `transparent`, `light`, or `dark`. It is for inspection;
keep `transparent` and `withAudio: false` for an overlay export.
`motionProfile` controls entrance/exit speed independently of `themeId`.

After changing the audio edit, revalidate the spoken anchors. The episode
transcript currently contains the source segment needed by this animation.
Run `task check` after edits. Use key PNG frames for visual QA; render an encoded
CapCut master only when requested, through `task render:capcut` and its alpha QA.

## Monaco Editor

`Video-006-leetcode-p01-a03-monaco-editor` covers **09:33.860–10:00.160**
(26.300 s). Its chronological placement precedes the Docker inserts; its ID
preserves the existing composition IDs and records the third authored insert.

The scene explicitly labels the authored Two Sum page as an example of embedding
Monaco in a website. It shows an identified full-page screenshot of the official
Monaco website, scrolls down to its editor examples, then enlarges the real editor and demonstrates
completion of `seen.set(value, index)`. It uses the same light episode palette
and leaves the upper-right webcam area free.

Monaco 0.55.1, its TypeScript tokenizer, font and editor worker are bundled
locally from the pinned npm dependency. A completion provider scoped to this
demo model supplies the three relevant `Map` methods; Monaco renders and filters
the actual suggestion widget. This is a focused editor demonstration, not a
full TypeScript language server or a code-execution backend. The Run/Submit
controls illustrate the surrounding product and do not execute code.

`scene.ts` derives the code and cursor state from milliseconds. The editor waits
for fonts and its suggestion DOM before releasing Remotion's render gate; timing
does not depend on network latency, simulated keyboard speed or cursor blinking.
Keep these readiness gates when extending the demo. Models and editors are
disposed on unmount. The screenshot source is documented alongside the image
in `apps/remotion/public/assets/006-leetcode/monaco/`.

Set `withAudio: true` in Studio to hear the source excerpt. Regenerate it with:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/leet_code_audio.WAV \
  -ss 573.860 -t 26.300 -ac 1 -ar 16000 -c:a pcm_s16le \
  apps/remotion/public/generated/006-leetcode/p01-a03-monaco-editor.wav
```
