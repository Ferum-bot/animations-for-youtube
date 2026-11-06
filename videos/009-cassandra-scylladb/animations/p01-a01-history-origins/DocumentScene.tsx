import React from 'react';
import {Img, staticFile} from 'remotion';
import {highlightProgress, QuoteHighlight} from '../../shared/source-documents/QuoteHighlight';
import {cues, highlights, scene} from './scene';
import {asset, sources, type DocumentId} from './sources';
import {SceneSurface} from './SceneSurface';

export const DocumentScene: React.FC<{
  readonly id: DocumentId;
  readonly timeMs: number;
}> = ({id, timeMs}) => {
  const source = sources[id];
  const scale = scene.width / source.width;
  const header = 'header' in source ? source.header : undefined;
  const headerHeight = (header?.height ?? 0) * scale;
  const bodyHeight = source.height * scale;
  const focus = Math.max(0, ...highlights[id].map((mark) => highlightProgress(mark, timeMs)));
  return <SceneSurface cue={cues[id]} timeMs={timeMs}
    top={id === 'facebook' ? 260 : 350} height={headerHeight + bodyHeight}
    background={source.background} label={source.label}>
    {header ? <Img src={staticFile(asset(header.image))} style={{display: 'block', width: scene.width}} /> : null}
    <div style={{position: 'relative', height: bodyHeight, overflow: 'hidden'}}>
      <Img src={staticFile(asset(source.image))} style={{display: 'block', width: scene.width,
        filter: `blur(${focus * 2}px) brightness(${1 - focus * 0.24})`}} />
      {highlights[id].map((mark) => <QuoteHighlight key={mark.startMs} mark={mark}
        timeMs={timeMs} width={scene.width} height={bodyHeight} sourceScale={scale}
        background={source.background} motion="reveal" />)}
    </div>
  </SceneSurface>;
};
