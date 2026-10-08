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

## Leaderboard SQL

`Video-006-leetcode-p01-a04-leaderboard-sql` covers **18:25.960–18:49.300**
(23.340 s, rounded to 700 frames at 30 fps). It uses the centered code panel
below the webcam, the episode's JetBrains-inspired palette, 30% foreground
enlargement and a restrained blur on the stationary context.

`sql.ts` contains the author's query, with copy/paste line breaks repaired in
underscored names and `last_solve`. `COUNT(DISTINCT problem_id)` counts unique
accepted problems, and `MAX(accepted_at)` is the latest AC timestamp, including
repeat accepted submissions. The query's ordering is preserved: solved descending,
then last_solve ascending by default. No penalty calculation or extra tie-breaker
is added. The page parameter is zero-based.

`cues.ts` maps spoken anchors to the selected user, aggregates, source table,
contest and verdict filters, grouping, ordering, and LIMIT/OFFSET. Timing and
SQL tokens remain local; shared rendering stays in `shared/code`.

Set `withAudio: true` in Studio to check the narration. Regenerate its excerpt:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/leet_code_audio.WAV \
  -ss 1105.960 -t 23.340 -ac 1 -ar 16000 -c:a pcm_s16le \
  apps/remotion/public/generated/006-leetcode/p01-a04-leaderboard-sql.wav
```

## Isolate

Two independently editable inserts cover the isolation deep dive (part 02):

- `Video-006-leetcode-p02-a01-isolate-lifecycle`: **28:38.560–28:48.620**,
  10.060 s (302 frames). Introduces all three commands, then highlights init,
  resource limits, the Python invocation and cleanup in spoken order.
- `Video-006-leetcode-p02-a02-isolate-limits`: **29:01.720–29:24.580**,
  22.860 s (686 frames). Highlights CPU time, wall time, memory and process count,
  compares the two time limits, and returns to the complete command listing.

The raw full-audio ASR omitted the wall-time and memory phrases. The limits cues
and corresponding transcript segments were recovered with a second local
Whisper large-v3-turbo q5_0 / Metal pass over this 22.860 s excerpt. Keep these
anchors when ingesting another transcript; recheck them if the audio edit changes.

`shared/isolate/command.ts` preserves the executable content of the author's
screenshot. The inline create/cleanup comments become synchronized captions;
blank rows separate invocations. Commands are visual content, never executed.
Real use also requires placing `solution.py` in the directory returned by init
before run, as described in the [Isolate manual](https://www.ucw.cz/isolate/isolate.1.html).

The captions distinguish `--time=2` (CPU seconds) from `--wall-time=5` (elapsed
seconds including waiting). `--mem=262144` limits address space to 256 MiB;
`--processes=1` permits one process total, not one extra child. The supplied
example does not enable `--cg`; it must not be labeled as a cgroup-memory example.
Both scenes use 30% foreground enlargement, stationary blurred context and the
existing webcam-safe position. Their 74 px line spacing accommodates adjacent
highlighted rows without changing the Docker or SQL layouts.

Regenerate the optional Studio audio:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/leet_code_audio.WAV \
  -ss 1718.560 -t 10.060 -ac 1 -ar 16000 -c:a pcm_s16le \
  apps/remotion/public/generated/006-leetcode/p02-a01-isolate-lifecycle.wav
ffmpeg -i /Users/mdpopov/Movies/CapCut/leet_code_audio.WAV \
  -ss 1741.720 -t 22.860 -ac 1 -ar 16000 -c:a pcm_s16le \
  apps/remotion/public/generated/006-leetcode/p02-a02-isolate-limits.wav
```

## gVisor runtime

`Video-006-leetcode-p02-a03-gvisor-runsc` covers **32:52.320–33:03.320**
(11.000 s, 330 frames). A compact single-line panel introduces the abbreviated
Docker command, enlarges `--runtime=runsc` by 30% during the runtime explanation,
then returns to the complete example. The panel stays below the webcam.

The literal `...` markers preserve the author's omitted arguments; this is not
a complete runnable command. Real use assumes runsc is installed and registered
with Docker, as described in the [gVisor Docker quick start](https://gvisor.dev/docs/user_guide/quick_start/docker/).
The animation displays the command without executing it.

Regenerate the optional Studio audio:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/leet_code_audio.WAV \
  -ss 1972.320 -t 11.000 -ac 1 -ar 16000 -c:a pcm_s16le \
  apps/remotion/public/generated/006-leetcode/p02-a03-gvisor-runsc.wav
```
