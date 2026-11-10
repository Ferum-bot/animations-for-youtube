import React from 'react';
import {OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';

type PresenterCut = {readonly from:number; readonly to:number; readonly file:string; readonly trim:number};

export function PresenterPane({cuts}: {readonly cuts: readonly PresenterCut[]}) {
  const {width, height, fps} = useVideoConfig();
  const frame = (ms: number) => Math.round(ms * fps / 1000);
  const scale = width / 1680;
  return <div data-pane="presenter" style={{position:'absolute', top:height*0.55, left:0, width, height:height*0.45, overflow:'hidden'}}>
    {cuts.map(cut => <Sequence key={cut.from} from={frame(cut.from)} durationInFrames={frame(cut.to)-frame(cut.from)}
      premountFor={12} name={cut.file}>
      <OffthreadVideo muted src={staticFile(cut.file)} trimBefore={frame(cut.trim)}
        style={{position:'absolute', width:3840*scale, height:2160*scale, left:-2070*scale, top:-605*scale}}/>
    </Sequence>)}
  </div>;
}
