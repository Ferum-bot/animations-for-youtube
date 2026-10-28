# Notification System

Production compositions use 2560×1440 at 30 fps. Open with `task studio`.

## Database schema

Composition: `Video-008-notification-system-p01-a01-database-schema`.
The 102-second scene is placed in **CapCut project 1028 at 00:13:56:18**
(30 fps), ending at **00:15:38:18**. These are current edited-timeline timecodes,
not the original WAV timecodes. `anchors.json` uses the edited timeline.
`source-anchors.json` preserves the original WAV anchors (14:22–16:04).
`edit-timing.json` records the verified source-to-edit mapping and draft fingerprint.
This interval has no internal cuts or speed changes. Revalidate against the current
CapCut draft after further edits; do not apply its offset globally to other scenes.

The `users` panel is compact (1280×360), centered at x=640, y=540. The larger
`notifications` panel uses x=340, width=1880, y=380 to leave room for the existing
top-right webcam. Both use a cool light-gray surface and a 4 px slate outline
to stay distinct from the white screen recording. This episode uses a system-design layout,
explicitly approved instead of the compact talking-head layout.

The scene shows complete `CREATE TABLE users`, then `CREATE TABLE notifications`
and its indexes from the materials. Only SQL is visible, in a light DataGrip-style
editor with line numbers and syntax coloring. `schema.ts` owns the SQL; `cues.ts`
owns speech-driven line focus; `shared/SqlEditor.tsx` owns the common editor layout.
Active code lines smoothly scale to 118% over 420 ms; adjacent lines make room
vertically. The panel reserves expansion space and keeps a fixed outer size.
There are no headings, captions, relationship cards or explanatory footers.

Sources are identified in `video.json`. The source narration has priority over
page 9 of `notification-system-materials.pdf`: identifiers use UUIDv7 instead
of BIGSERIAL, the foreign key uses UUID, and optional provider metadata is shown.
The other three tables on that page are introduced after this scene's audio interval.
`transcript.json` contains the relevant raw ASR segments in original WAV time, without silent corrections.

Props:

- The SQL editor always uses the requested light theme, independently of the preview backdrop.
- `motionProfile`: `calm` (default), `technical`, or `energetic`.
- `previewBackground`: `transparent` (default), `light`, or `dark`.
- `withAudio`: `true` by default for synchronized playback from the start of the scene; set to `false` for a silent overlay.

The audio preview is an ignored generated asset. Recreate it from the original:

```bash
mkdir -p apps/remotion/public/generated/008-notification-system
ffmpeg -nostdin -ss 862 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 102 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a01-database-schema.wav
```

Run `task check` after edits. Render key stills outside the repository for visual
acceptance. Clip/full-overlay export requires an explicit request; use the
repository's CapCut ProRes 4444 pipeline for an authorized compositing master.

## Device tokens

Composition: `Video-008-notification-system-p01-a02-device-tokens`.
Insert at **00:17:01:13**, end at **00:17:31:13** (30 seconds, 900 frames).
The scene ends before the push/SMS provider diagram. Its local `edit-timing.json`
records the verified CapCut mapping; anchors use edited time and transcript segments
preserve original WAV time. The audio slice starts at 1046.833333 seconds in the WAV.

The complete table and partial index follow materials p. 9, with `user_id UUID`
matching the narrated and previously shown `users.id`. The 1480×560 editor is centered
at x=540, y=440, with the approved gray background, slate outline and syntax colors.
Speech-driven focus covers the table name, user, platform, token, active flag,
last-seen timestamp and a return to the active flag for old-token deactivation.
The shared editor and cue transition preserve the earlier database-schema scene.

Recreate the synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1046.833333 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 30 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a02-device-tokens.wav
```

## Scheduled-send query

Composition: `Video-008-notification-system-p01-a03-scheduled-query`.
Insert at **00:18:17:29**, end at **00:18:33:29** (16 seconds, 480 frames).
The full query follows materials p. 10: select notification IDs with status
`scheduled`, `send_at <= now()` and `LIMIT 1000`. The scene covers the narrated
query and the ten-second polling explanation, then exits before the next topic.

The 1040×280 editor is centered at x=760, y=580. It reuses the approved surface,
outline, syntax colors and 118% line emphasis. Focus follows SELECT, status,
due time and batch limit; the complete query then holds at normal size.
The scene's `edit-timing.json` records placement and the unchanged CapCut segment.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1123.366667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 16 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a03-scheduled-query.wav
```

## Campaign tables

Composition: `Video-008-notification-system-p01-a04-campaign-tables`.
Insert at **00:18:58:20**, end at **00:19:23:20** (25 seconds, 750 frames).
This covers the table walkthrough and ends before the cron-worker explanation.
The centered 1480 px editor shows `campaigns`, then `segments`, with the approved
gray surface, slate outline and speech-driven enlargement. Channel and template
share a cue because they are spoken together, avoiding an interrupted scale transition.

Narration overrides materials p. 9: `campaigns.segment_id` replaces `segment_sql`,
and `segments` stores `(segment_id, user_id)` membership pairs. UUID types match
the preceding schema. The pair is the primary key; `segment_id` alone is not unique,
so there is deliberately no invalid foreign key from campaigns to that column.
`user_id` references `users(id)`. The remaining campaign fields follow the document.
The local `edit-timing.json` records the verified montage placement.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1164.066667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 25 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a04-campaign-tables.wav
```

## Preferences

Composition: `Video-008-notification-system-p01-a05-preferences`.
Insert at **00:20:24:29**, end at **00:20:49:29** (25 seconds, 750 frames),
before the explanation of when to apply quiet-hour policies.

The complete `CREATE TABLE preferences` follows the narration and the matching
handwritten schema: `user_id UUID`, `options JSONB` and `quiet_opt JSONB`.
These names replace the PDF's `opt_out`, `quiet_from` and `quiet_to` representation.
The user key and empty-object JSONB defaults retain the document's approach.
The 1480×280 editor is centered at x=540, y=580 and reuses all approved visual
and motion settings. Focus follows the table name, user ID, options and quiet hours.
`edit-timing.json` records the verified montage placement; the raw narration remains
in the episode transcript without ASR corrections.

Recreate synchronized preview audio:

```bash
ffmpeg -nostdin -ss 1250.366667 -i /Users/mdpopov/Movies/CapCut/notification_system_audio.WAV \
  -t 25 -ar 16000 -ac 1 -c:a pcm_s16le \
  apps/remotion/public/generated/008-notification-system/p01-a05-preferences.wav
```
