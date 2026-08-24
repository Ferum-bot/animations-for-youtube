import {mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {parseArgs} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const composition = args.composition;
const frames = (args.frames ?? '')
  .split(',')
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isInteger(value) && value >= 0);

if (!composition) throw new Error('--composition is required');
if (frames.length === 0) throw new Error('--frames must contain comma-separated frame numbers');

const outputDirectory = path.resolve('out/qa', composition);
await mkdir(outputDirectory, {recursive: true});

for (const frame of frames) {
  const output = `../../out/qa/${composition}/frame-${String(frame).padStart(4, '0')}.png`;
  const result = spawnSync(
    'pnpm',
    [
      '--filter',
      '@channel/remotion',
      'exec',
      'remotion',
      'still',
      'src/index.tsx',
      composition,
      output,
      `--frame=${frame}`,
      '--image-format=png',
    ],
    {stdio: 'inherit'},
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Rendered ${frames.length} QA frame(s) to ${path.relative(process.cwd(), outputDirectory)}`);

