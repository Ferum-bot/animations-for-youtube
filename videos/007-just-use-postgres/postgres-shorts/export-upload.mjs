// Explicit export command only. No publishing metadata files are generated.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {
  readFile,
  mkdir,
  mkdtemp,
  rm,
  copyFile,
  writeFile,
} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import os from 'node:os';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const require = createRequire(path.join(root, 'package.json'));
const cliRequire = createRequire(require.resolve('@remotion/cli/package.json'));
const {bundle} = cliRequire('@remotion/bundler');
const {getCompositions, openBrowser, renderMedia, renderStill} =
  cliRequire('@remotion/renderer');
const clips = JSON.parse(await readFile(path.join(here, 'clips.json'), 'utf8'));
const items = [
  {
    number: 1,
    slug: 'trend-origin',
    bodyMs: 54800,
    audio: 'intro-shorts/trend-origin-v2.wav',
  },
  ...clips.map((c) => ({
    ...c,
    bodyMs: c.cuts.reduce((n, x) => n + x.endMs - x.startMs, 0),
    audio: `postgres-shorts/${c.slug}.wav`,
  })),
];
const outroFrames = 150;
const coversOnly = process.argv.includes('--covers-only');
const withProps = (composition, props) => ({
  ...composition,
  props: {...composition.props, ...props},
});
const output = path.resolve(root, 'videos/007-just-use-postgres/output');
const scratch = await mkdtemp(path.join(os.tmpdir(), 'postgres-upload-'));
console.log(`Scratch: ${scratch}`);
const run = (args) => {
  const result = spawnSync(
    'ffmpeg',
    ['-nostdin', '-v', 'error', '-y', ...args],
    {encoding: 'utf8', maxBuffer: 8 * 1024 * 1024},
  );
  if (result.status !== 0)
    throw new Error(result.stderr || `ffmpeg exited ${result.status}`);
};
let browser;
try {
  const serveUrl = await bundle({
    entryPoint: path.join(root, 'apps/remotion/src/index.tsx'),
    publicDir: path.join(root, 'apps/remotion/public'),
    outDir: path.join(scratch, 'bundle'),
  });
  browser = await openBrowser('chrome', {chromiumOptions: {gl: 'angle'}});
  const compositions = await getCompositions(serveUrl, {
    puppeteerInstance: browser,
  });
  const find = (number, slug, platform = 'shorts') => {
    const id = `Video-007-just-use-postgres-p${String(number).padStart(2, '0')}-${platform === 'shorts' ? 'a01' : 'a02'}-${slug}${platform === 'shorts' ? '' : '-tiktok'}`;
    const composition = compositions.find((c) => c.id === id);
    if (!composition) throw new Error(`Missing composition ${id}`);
    return composition;
  };
  const common = {
    serveUrl,
    puppeteerInstance: browser,
    codec: 'h264',
    crf: 18,
    pixelFormat: 'yuv420p',
    colorSpace: 'bt709',
    x264Preset: 'fast',
    imageFormat: 'png',
    concurrency: 4,
    muted: true,
    overwrite: true,
    chromiumOptions: {gl: 'angle'},
  };
  if (!coversOnly)
    for (const platform of ['shorts', 'tictok']) {
      const composition = find(
        1,
        'trend-origin',
        platform === 'shorts' ? 'shorts' : 'tiktok',
      );
      console.log(`Rendering ${platform} ending`);
      await renderMedia({
        ...common,
        composition: withProps(composition, {
          withAudio: false,
          platform: platform === 'shorts' ? 'shorts' : 'tiktok',
        }),
        frameRange: [
          Math.ceil(items[0].bodyMs * 0.03),
          Math.ceil(items[0].bodyMs * 0.03) + outroFrames - 1,
        ],
        outputLocation: path.join(scratch, `${platform}-end.mp4`),
      });
    }
  for (const item of items) {
    const number = String(item.number).padStart(2, '0');
    const name = `${number}-${item.slug}`;
    const composition = find(item.number, item.slug);
    const bodyFrames = Math.ceil(item.bodyMs * 0.03);
    if (composition.durationInFrames !== bodyFrames + outroFrames) {
      throw new Error(`Timing mismatch for ${composition.id}`);
    }
    const body = path.join(scratch, `${name}-body.mp4`);
    if (!coversOnly) {
      console.log(`Rendering ${name}: ${bodyFrames} body frames`);
      let last = -1;
      await renderMedia({
        ...common,
        composition: withProps(composition, {withAudio: false}),
        frameRange: [0, bodyFrames - 1],
        outputLocation: body,
        onProgress: (p) => {
          const bucket = Math.floor(p.progress * 4);
          if (bucket !== last) {
            console.log(`${name} ${Math.round(p.progress * 100)}%`);
            last = bucket;
          }
        },
      });
    }
    const cover = path.join(scratch, `${name}-cover.jpg`);
    await renderStill({
      serveUrl,
      puppeteerInstance: browser,
      composition: withProps(composition, {withAudio: false, cover: true}),
      frame: 0,
      imageFormat: 'jpeg',
      jpegQuality: 95,
      output: cover,
      chromiumOptions: {gl: 'angle'},
    });
    for (const platform of ['shorts', 'tictok']) {
      const directory = path.join(output, platform, name);
      await mkdir(directory, {recursive: true});
      if (!coversOnly) {
        const list = path.join(scratch, 'concat.txt');
        await writeFile(
          list,
          `file '${body}'\nfile '${path.join(scratch, `${platform}-end.mp4`)}'\n`,
        );
        run([
          '-f',
          'concat',
          '-safe',
          '0',
          '-i',
          list,
          '-i',
          path.join(
            root,
            'apps/remotion/public/generated/007-just-use-postgres',
            item.audio,
          ),
          '-map',
          '0:v:0',
          '-map',
          '1:a:0',
          '-c:v',
          'copy',
          '-af',
          'apad',
          '-c:a',
          'aac',
          '-b:a',
          '256k',
          '-ar',
          '48000',
          '-t',
          String((bodyFrames + outroFrames) / 30),
          '-movflags',
          '+faststart',
          path.join(directory, `${name}.mp4`),
        ]);
      }
      await copyFile(cover, path.join(directory, 'preview.jpg'));
    }
    if (!coversOnly) await rm(body);
    await rm(cover);
    console.log(`DONE ${name} — both platforms`);
  }
} finally {
  try {
    if (browser) await browser.close({silent: true});
  } finally {
    await rm(scratch, {recursive: true, force: true});
    console.log('Temporary export files removed');
  }
}
