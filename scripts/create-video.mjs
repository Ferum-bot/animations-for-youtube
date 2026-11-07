import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {assertSlug, parseArgs, writeJson} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const video = args.video;
const title = args.title ?? video;

if (!video) throw new Error('--video is required');
assertSlug(video, 'video');

const directory = path.resolve('videos', video);
// Fail before writing any metadata if this video already exists.
await mkdir(directory);
await mkdir(path.join(directory, 'animations'), {recursive: true});
await mkdir(path.join(directory, 'shared'), {recursive: true});
await mkdir(path.join(directory, 'media'), {recursive: true});

await writeJson(path.join(directory, 'video.json'), {
  id: video,
  title,
  width: 2560,
  height: 1440,
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
  '# Video-local library\n\nUse `@channel/motion-v2` for new visuals. Keep narration, source data and episode-specific components here. Read `packages/motion-v2/README.md` and the root style rules. Legacy visual libraries are deprecated for new work.\n',
  'utf8',
);

console.log(`Created videos/${video}`);
