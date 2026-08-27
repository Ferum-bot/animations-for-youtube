import React from 'react';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {conclusionSceneWindows} from './content';
import {sceneOpacity} from './motion';
import {LongevityScene} from './scenes/LongevityScene';
import {LookupControlScene} from './scenes/LookupControlScene';
import {PatchworkScene} from './scenes/PatchworkScene';
import {ThreeLeversScene} from './scenes/ThreeLeversScene';
import {TwoPillarsScene} from './scenes/TwoPillarsScene';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

export const ConclusionRecapDiagram: React.FC<{readonly elapsedMs: number}> = ({elapsedMs}) => {
  const windows = conclusionSceneWindows;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 394, width: contentWidth, height: 510}}>
      <div style={{position: 'absolute', inset: 0, opacity: sceneOpacity(elapsedMs, windows.pillars.startMs, windows.pillars.endMs)}}><TwoPillarsScene elapsedMs={elapsedMs} /></div>
      <div style={{position: 'absolute', inset: 0, opacity: sceneOpacity(elapsedMs, windows.longevity.startMs, windows.longevity.endMs)}}><LongevityScene elapsedMs={elapsedMs} /></div>
      <div style={{position: 'absolute', inset: 0, opacity: sceneOpacity(elapsedMs, windows.patchwork.startMs, windows.patchwork.endMs)}}><PatchworkScene elapsedMs={elapsedMs} /></div>
      <div style={{position: 'absolute', inset: 0, opacity: sceneOpacity(elapsedMs, windows.controlPlane.startMs, windows.controlPlane.endMs)}}><LookupControlScene elapsedMs={elapsedMs} /></div>
      <div style={{position: 'absolute', inset: 0, opacity: sceneOpacity(elapsedMs, windows.levers.startMs, windows.levers.endMs)}}><ThreeLeversScene elapsedMs={elapsedMs} /></div>
    </div>
  );
};
