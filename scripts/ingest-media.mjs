import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {access, copyFile, mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {parseArgs, readJson, writeJson} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const videoId = args.video;
const audioPath = args.audio ? path.resolve(args.audio) : null;
const transcriptPath = args.transcript ? path.resolve(args.transcript) : null;
if (!videoId || !audioPath || !transcriptPath) {
  throw new Error('--video, --audio, and --transcript are required');
}

await access(audioPath);
await access(transcriptPath);
const videoDirectory = path.resolve('videos', videoId);
const videoPath = path.join(videoDirectory, 'video.json');
const video = await readJson(videoPath);
const extension = path.extname(audioPath).toLowerCase() || '.wav';
const publicDirectory = path.resolve('apps/remotion/public/generated', videoId);
const publicAudioPath = path.join(publicDirectory, `audio${extension}`);
await mkdir(publicDirectory, {recursive: true});
await copyFile(audioPath, publicAudioPath);

const transcriptSource = await readFile(transcriptPath, 'utf8');
const transcript = normalizeTranscript(transcriptSource, path.extname(transcriptPath).toLowerCase());
await writeJson(path.join(videoDirectory, 'transcript.json'), transcript);

const audioBuffer = await readFile(audioPath);
video.audio = `generated/${videoId}/audio${extension}`;
video.durationMs = probeDurationMs(audioPath) ?? Math.max(1000, (transcript.at(-1)?.endMs ?? 0) + 500);
video.source = {
  audioSha256: createHash('sha256').update(audioBuffer).digest('hex'),
  transcriptSha256: createHash('sha256').update(transcriptSource).digest('hex'),
};
await writeJson(videoPath, video);
console.log(`Ingested audio and ${transcript.length} transcript segment(s) for ${videoId}`);

function probeDurationMs(sourcePath) {
  const result = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', sourcePath],
    {encoding: 'utf8'},
  );
  const seconds = Number(result.stdout.trim());
  return result.status === 0 && Number.isFinite(seconds) && seconds > 0
    ? Math.round(seconds * 1000)
    : null;
}

function normalizeTranscript(source, extension) {
  if (extension === '.json') {
    const parsed = JSON.parse(source);
    if (!Array.isArray(parsed)) throw new Error('Transcript JSON must be an array');
    return parsed.map((segment, index) => ({
      id: String(segment.id ?? `segment-${String(index + 1).padStart(3, '0')}`),
      startMs: Number(segment.startMs),
      endMs: Number(segment.endMs),
      text: String(segment.text ?? '').trim(),
    }));
  }

  const blocks = source.replaceAll('\r\n', '\n').trim().split(/\n{2,}/);
  return blocks.flatMap((block, index) => {
    const lines = block.split('\n').filter(Boolean);
    const timingIndex = lines.findIndex((line) => line.includes('-->'));
    if (timingIndex === -1) return [];
    const [start, end] = lines[timingIndex].split('-->').map((part) => part.trim().split(' ')[0]);
    return [{
      id: `segment-${String(index + 1).padStart(3, '0')}`,
      startMs: parseTimestamp(start),
      endMs: parseTimestamp(end),
      text: lines.slice(timingIndex + 1).join(' ').replace(/<[^>]+>/g, '').trim(),
    }];
  });
}

function parseTimestamp(value) {
  const match = /^(?:(\d{2}):)?(\d{2}):(\d{2})[,.](\d{3})$/.exec(value);
  if (!match) throw new Error(`Unsupported timestamp: ${value}`);
  const [, hours = '0', minutes, seconds, milliseconds] = match;
  return Number(hours) * 3_600_000 + Number(minutes) * 60_000 + Number(seconds) * 1000 + Number(milliseconds);
}
