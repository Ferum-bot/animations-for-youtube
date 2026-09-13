import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {parseArgs} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.input) throw new Error('--input is required');
const input = path.resolve(args.input);
const probe = spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', input], {encoding: 'utf8'});
if (probe.status !== 0) throw new Error(probe.stderr || 'Could not inspect MOV');
const {streams} = JSON.parse(probe.stdout);
const video = streams.find((stream) => stream.codec_type === 'video');
if (!video || video.codec_name !== 'prores' || video.profile !== '4444' || !video.pix_fmt.startsWith('yuva444p')) {
  throw new Error('Expected ProRes 4444 with an alpha-capable pixel format');
}
if (video.width !== 2560 || video.height !== 1440 || video.r_frame_rate !== '30/1') {
  throw new Error('Expected QHD at 30 fps');
}
const frameCount = Number(video.nb_frames);
if (!Number.isInteger(frameCount) || frameCount < 1) throw new Error('Missing frame count');
const frames = args.frames ? args.frames.split(',').map(Number) :
  [...new Set([0, 1, Math.floor(frameCount / 4), Math.floor(frameCount / 2), Math.floor(frameCount * 3 / 4), frameCount - 2, frameCount - 1])];
if (!frames.every((frame) => Number.isInteger(frame) && frame >= 0 && frame < frameCount)) throw new Error('Invalid QA frame range');
const transparentRight = args['transparent-right'] === undefined ? video.width : Number(args['transparent-right']);
if (!Number.isInteger(transparentRight) || transparentRight < 0 || transparentRight > video.width) throw new Error('Invalid transparent-right boundary');

for (const frame of frames) {
  const decoded = spawnSync('ffmpeg', [
    '-v', 'error', '-xerror', '-ss', String(frame / 30), '-i', input,
    '-frames:v', '1', '-pix_fmt', 'rgba', '-f', 'rawvideo', 'pipe:1',
  ], {maxBuffer: video.width * video.height * 4 + 1024 * 1024});
  if (decoded.status !== 0) throw new Error(decoded.stderr.toString() || `Cannot decode frame ${frame}`);
  const pixels = decoded.stdout;
  if (pixels.length !== video.width * video.height * 4) throw new Error(`Incomplete frame ${frame}`);
  let excessPixels = 0;
  let maxExcess = 0;
  for (let offset = 0; offset < pixels.length; offset += 4) {
    const alpha = pixels[offset + 3];
    const excess = Math.max(pixels[offset], pixels[offset + 1], pixels[offset + 2]) - alpha;
    // Small ringing/rounding is possible in ProRes. Straight RGB at tiny alpha
    // exceeds this margin by tens or hundreds, producing bright/color fringes.
    if (excess > 6) {excessPixels += 1; maxExcess = Math.max(maxExcess, excess);}
    if ((offset / 4) % video.width >= transparentRight && alpha !== 0) {
      throw new Error(`Frame ${frame}: nonzero alpha inside presenter-safe area`);
    }
  }
  if (excessPixels > 0) throw new Error(`Frame ${frame}: ${excessPixels} pixels exceed premultiplied RGB bounds (max ${maxExcess}); do not deliver to CapCut`);
}
console.log(`CapCut alpha OK: ${path.basename(input)}; ${frames.length} decoded frames`);
