import {spawn, spawnSync} from 'node:child_process';
import {mkdtemp, rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import path from 'node:path';

/**
 * The verified CapCut macOS workflow expects associated (premultiplied) RGB in these
 * ProRes overlays. Browser PNGs contain straight RGB. Convert exactly once,
 * in 16-bit RGB before YUV encoding; an alpha-capable pixel format alone is
 * insufficient. Other editors may require a different alpha interpretation.
 */
export const capcutAlphaFilter = 'format=gbrap16le,premultiply=inplace=1,format=yuva444p10le';

// Remotion's bundled FFmpeg omits premultiply. Use the installed full FFmpeg
// with lossless source frames, without replacing bundled runtime binaries.
export const renderCapCutMedia = async ({serveUrl, composition, inputProps, outputLocation, puppeteerInstance, concurrency = 4, onProgress = () => {}}) => {
  const filters = spawnSync('ffmpeg', ['-hide_banner', '-filters'], {encoding: 'utf8'});
  if (filters.status !== 0 || !/\bpremultiply\b/.test(filters.stdout)) {
    throw new Error('CapCut export needs a full FFmpeg installation with the premultiply filter');
  }
  const require = createRequire(import.meta.url);
  const remotionRequire = createRequire(require.resolve('@remotion/cli/package.json'));
  const {renderFrames} = remotionRequire('@remotion/renderer');
  const outputDir = await mkdtemp(path.join(tmpdir(), 'capcut-frames-'));
  try {
    const {frameCount, assetsInfo} = await renderFrames({
      serveUrl, composition, inputProps, outputDir, puppeteerInstance, concurrency,
      imageFormat: 'png', muted: true,
      onStart: () => {},
      onFrameUpdate: (count) => onProgress({progress: count / composition.durationInFrames * 0.8}),
    });
    if (frameCount !== composition.durationInFrames) throw new Error('Incomplete CapCut frame sequence');
    await new Promise((resolve, reject) => {
      const encoder = spawn('ffmpeg', [
        '-hide_banner', '-loglevel', 'error', '-nostdin', '-n',
        '-framerate', String(composition.fps), '-start_number', String(assetsInfo.firstFrameIndex),
        '-i', assetsInfo.imageSequenceName, '-frames:v', String(frameCount),
        '-vf', capcutAlphaFilter, '-c:v', 'prores_ks', '-profile:v', '4',
        '-pix_fmt', 'yuva444p10le', '-alpha_bits', '16',
        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
        '-an', outputLocation,
      ], {stdio: 'inherit'});
      encoder.on('error', reject);
      encoder.on('close', (code) => code === 0 ? resolve() : reject(new Error(`CapCut encoder exited with ${code}`)));
    });
    onProgress({progress: 1});
  } finally {
    await rm(outputDir, {recursive: true, force: true});
  }
};
