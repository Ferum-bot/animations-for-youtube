import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {assertSlug, parseArgs, writeJson} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const video = args.video;
const title = args.title ?? video;

if (!video) throw new Error('--video is required');
assertSlug(video, 'video');

const directory = path.resolve('videos', video);
await mkdir(path.join(directory, 'animations'), {recursive: true});
await mkdir(path.join(directory, 'shared'), {recursive: true});
await mkdir(path.join(directory, 'media'), {recursive: true});

await writeJson(path.join(directory, 'video.json'), {
  id: video,
  title,
  width: 1920,
  height: 1080,
  fps: 30,
  durationMs: 30000,
  audio: null,
});
await writeJson(path.join(directory, 'anchors.json'), {});
await writeJson(path.join(directory, 'timeline.json'), []);
await writeJson(path.join(directory, 'transcript.json'), []);
await writeFile(
  path.join(directory, 'media', 'README.md'),
  '# Local media\n\nUse `task video:ingest` to add the final audio and transcript. Raw media is not committed.\n',
  'utf8',
);
await writeFile(
  path.join(directory, 'shared', 'README.md'),
  '# Video-local library\n\nPlace components used by multiple animations of this video here.\n',
  'utf8',
);

console.log(`Created videos/${video}`);

