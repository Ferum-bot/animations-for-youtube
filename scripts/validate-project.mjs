import {createHash} from 'node:crypto';
import {access, readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {parseArgs, readJson} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const requestedVideo = args.video;
const errors = [];
const warnings = [];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const videosRoot = path.resolve('videos');
const entries = (await readdir(videosRoot, {withFileTypes: true}))
  .filter((entry) => entry.isDirectory())
  .filter((entry) => !requestedVideo || entry.name === requestedVideo);

if (requestedVideo && entries.length === 0) {
  errors.push(`Video not found: ${requestedVideo}`);
}

for (const entry of entries) {
  const directory = path.join(videosRoot, entry.name);
  const video = await readJson(path.join(directory, 'video.json'));
  const anchors = await readJson(path.join(directory, 'anchors.json'));
  const timeline = await readJson(path.join(directory, 'timeline.json'));
  const transcript = await readJson(path.join(directory, 'transcript.json'));
  const animationDirectories = (await readdir(path.join(directory, 'animations'), {withFileTypes: true}))
    .filter((item) => item.isDirectory());
  const animationIds = new Set();

  if (video.id !== entry.name) errors.push(`${entry.name}: video.json id must match directory name`);
  if (!slugPattern.test(video.id)) errors.push(`${entry.name}: invalid video id`);
  if (![video.width, video.height, video.fps, video.durationMs].every((value) => Number.isFinite(value) && value > 0)) {
    errors.push(`${entry.name}: width, height, fps, and durationMs must be positive numbers`);
  }
  if (video.audio) {
    const publicAudioPath = path.resolve('apps/remotion/public', video.audio);
    try {
      const audio = await readFile(publicAudioPath);
      const hash = createHash('sha256').update(audio).digest('hex');
      if (video.source?.audioSha256 && video.source.audioSha256 !== hash) {
        errors.push(`${entry.name}: ingested audio changed; run video:ingest again`);
      }
    } catch {
      warnings.push(`${entry.name}: ingested audio is not present on this machine`);
    }
  }

  for (const animationDirectory of animationDirectories) {
    const metadata = await readJson(path.join(directory, 'animations', animationDirectory.name, 'animation.json'));
    if (metadata.id !== animationDirectory.name) {
      errors.push(`${entry.name}/${animationDirectory.name}: animation id must match directory name`);
    }
    if (!slugPattern.test(metadata.id)) errors.push(`${entry.name}/${metadata.id}: invalid animation id`);
    if (!Number.isFinite(metadata.durationMs) || metadata.durationMs <= 0) {
      errors.push(`${entry.name}/${metadata.id}: durationMs must be positive`);
    }
    animationIds.add(metadata.id);
    try {
      await access(path.join(directory, 'animations', animationDirectory.name, 'Composition.tsx'));
    } catch {
      errors.push(`${entry.name}/${metadata.id}: Composition.tsx is missing`);
    }
  }

  const cueIds = new Set();
  for (const cue of timeline) {
    if (cueIds.has(cue.id)) errors.push(`${entry.name}: duplicate timeline cue ${cue.id}`);
    cueIds.add(cue.id);
    if (!animationIds.has(cue.animation)) errors.push(`${entry.name}/${cue.id}: unknown animation ${cue.animation}`);
    if (anchors[cue.anchor] === undefined) errors.push(`${entry.name}/${cue.id}: missing anchor ${cue.anchor}`);
    if (!Number.isFinite(cue.durationMs) || cue.durationMs <= 0) {
      errors.push(`${entry.name}/${cue.id}: durationMs must be positive`);
    }
    const endMs = (anchors[cue.anchor] ?? 0) + cue.offsetMs + cue.durationMs;
    if (endMs > video.durationMs) errors.push(`${entry.name}/${cue.id}: cue ends after the video`);
  }

  let previousEnd = -1;
  for (const segment of transcript) {
    if (segment.startMs < previousEnd) warnings.push(`${entry.name}/${segment.id}: transcript overlaps previous segment`);
    if (segment.endMs <= segment.startMs) errors.push(`${entry.name}/${segment.id}: invalid transcript range`);
    previousEnd = segment.endMs;
  }
}

for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${entries.length} video(s) with ${warnings.length} warning(s)`);
}
