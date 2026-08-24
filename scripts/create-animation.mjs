import {access, mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {assertSlug, parseArgs, readJson, writeJson} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const video = args.video;
const animation = args.animation;
const title = args.title ?? animation;
const kind = args.kind ?? '2d';

if (!video || !animation) throw new Error('--video and --animation are required');
assertSlug(video, 'video');
assertSlug(animation, 'animation');
if (!['2d', '3d'].includes(kind)) throw new Error('--kind must be 2d or 3d');

const videoDirectory = path.resolve('videos', video);
await access(path.join(videoDirectory, 'video.json'));
const directory = path.join(videoDirectory, 'animations', animation);
await mkdir(path.join(directory, 'assets'), {recursive: true});
const serializedTitle = JSON.stringify(title);

await writeJson(path.join(directory, 'animation.json'), {
  id: animation,
  title,
  kind,
  durationMs: 4000,
  defaultProps: {themeId: 'graphite', transparent: true},
});

const component = `import React from 'react';
import {MotionStage} from '@channel/design-system';
import type {ThemeId} from '@channel/design-system';

type Props = {
  themeId?: ThemeId;
  transparent?: boolean;
};

const Composition: React.FC<Props> = ({
  themeId = 'graphite',
  transparent = true,
}) => (
  <MotionStage themeId={themeId} transparent={transparent}>
    <div style={{position: 'absolute', left: 74, top: 74, fontSize: 56, fontWeight: 800}}>
      {${serializedTitle}}
    </div>
  </MotionStage>
);

export default Composition;
`;
await writeFile(path.join(directory, 'Composition.tsx'), component, 'utf8');

const anchorsPath = path.join(videoDirectory, 'anchors.json');
const timelinePath = path.join(videoDirectory, 'timeline.json');
const anchors = await readJson(anchorsPath);
const timeline = await readJson(timelinePath);
const anchor = `${animation}-start`;
anchors[anchor] ??= 0;
if (!timeline.some((cue) => cue.animation === animation)) {
  timeline.push({
    id: `show-${animation}`,
    animation,
    anchor,
    offsetMs: 0,
    durationMs: 4000,
    props: {themeId: 'graphite', transparent: true},
  });
}
await writeJson(anchorsPath, anchors);
await writeJson(timelinePath, timeline);

console.log(`Created videos/${video}/animations/${animation}`);
