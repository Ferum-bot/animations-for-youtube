import React from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, easing, PresenterPreview, progress, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';

export const accessAssets = 'assets/011-websocket/access';
export const AccessSourceStage: React.FC<PreviewProps & {
  label: string; audio: string; children: React.ReactNode;
}> = ({label,audio,children,...preview}) => {
  const {timeMs,endMs} = useSceneTime();
  const enter = arrive(timeMs,0,230);
  const exit = progress(timeMs,endMs-250,endMs,easing.transform);
  return <AbsoluteFill>
    <PresenterPreview {...preview} media={{photoSrc:'assets/011-websocket/reconnect/presenter.jpg',
      audioSrc:`generated/011-websocket/${audio}.m4a`}}/>
    <SceneStage label={label}>
      <g opacity={enter*(1-exit)} transform={`translate(0 ${10*(1-enter)})`}>{children}</g>
    </SceneStage>
  </AbsoluteFill>;
};
