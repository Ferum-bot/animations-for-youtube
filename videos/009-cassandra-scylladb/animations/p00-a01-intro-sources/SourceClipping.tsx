import React from 'react';
import {Img, staticFile} from 'remotion';
import {scene, type Clipping} from './scene';
import {crops, sources} from './sources';
import {SourceHighlight} from './SourceHighlight';

/** Native page and extracted phrases share the same original-pixel coordinates. */
export const SourceClipping: React.FC<{
  readonly clipping: Clipping;
  readonly timeMs: number;
  readonly focus: number;
}> = ({clipping, timeMs, focus}) => {
  const crop = crops[clipping.crop];
  const scale = scene.width / crop.width;
  return <div style={{position: 'absolute', left: 0, top: clipping.top,
    width: scene.width, height: crop.height * scale, overflow: 'hidden'}}>
    <div style={{position: 'relative', width: crop.width, height: crop.height,
      transform: `scale(${scale})`, transformOrigin: 'top left'}}>
      <div style={{backgroundColor: crop.background,
        filter: `brightness(${1 - focus * 0.24})`}}>
        <Img src={staticFile(`assets/009-cassandra-scylladb/intro/${clipping.crop}.png`)}
          alt={sources[crop.source].title} style={{display: 'block', width: crop.width,
            height: crop.height, filter: `blur(${focus * 1.5}px)`}} />
      </div>
    </div>
    {(clipping.marks ?? []).map((mark) => <SourceHighlight key={mark.startMs}
        mark={mark} cropId={clipping.crop} timeMs={timeMs} />)}
  </div>;
};
