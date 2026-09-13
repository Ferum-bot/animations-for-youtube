import {access, mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import path from 'node:path';
import {assertSlug, parseArgs, readJson} from './lib.mjs';
import {renderCapCutMedia} from './capcut-prores.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.video || !args.animation) throw new Error('--video and --animation are required');
assertSlug(args.video, 'video');
assertSlug(args.animation, 'animation');
const outputLocation = path.resolve(args.output ?? `renders/${args.video}/clips/${args.animation}.mov`);
await access(outputLocation).then(() => {throw new Error(`Output already exists: ${outputLocation}`);}, () => {});
const metadata = await readJson(`videos/${args.video}/animations/${args.animation}/animation.json`);
const inputProps = {...metadata.defaultProps, ...JSON.parse(args.props ?? '{}')};
await mkdir(path.dirname(outputLocation), {recursive: true});

const require = createRequire(import.meta.url);
const remotionRequire = createRequire(require.resolve('@remotion/cli/package.json'));
const {bundle} = remotionRequire('@remotion/bundler');
const {openBrowser, selectComposition} = remotionRequire('@remotion/renderer');
const serveUrl = await bundle({entryPoint: path.resolve('apps/remotion/src/index.tsx'), publicDir: path.resolve('apps/remotion/public')});
const browser = await openBrowser('chrome', {chromiumOptions: {gl: 'angle'}});
try {
  const composition = await selectComposition({serveUrl, id: `Video-${args.video}-${args.animation}`, inputProps, puppeteerInstance: browser});
  if (composition.width !== 2560 || composition.height !== 1440 || composition.fps !== 30) {
    throw new Error('CapCut production export must be 2560x1440 at 30 fps');
  }
  await renderCapCutMedia({serveUrl, composition, inputProps, outputLocation, puppeteerInstance: browser});
  const verification = spawnSync(process.execPath, [path.resolve('scripts/check-capcut-alpha.mjs'), '--input', outputLocation], {stdio: 'inherit'});
  if (verification.status !== 0) throw new Error('CapCut export failed encoded-alpha acceptance');
  console.log(`Rendered CapCut ProRes 4444: ${outputLocation}`);
} finally {
  await browser.close({silent: true});
}
