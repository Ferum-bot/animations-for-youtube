import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PresenterPreview, type PreviewProps, SceneStage, useSceneTime} from '@channel/motion-v2';
import {SourceList} from './SourceList';
import {sourceLists} from './listShots';
import {assetRoot, SourceClipping} from './SourceClipping';
import {pages} from './shots';

const previewMedia = {
  photoSrc: `${assetRoot}/presenter.jpg`,
  audioSrc: 'generated/011-websocket/reconnect-sources.m4a',
};

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs} = useSceneTime();
  return <AbsoluteFill>
    <PresenterPreview {...props} media={previewMedia} />
    <SceneStage label="Лавина переподключений: страницы источников">
      {pages.filter(({start, end}) => timeMs >= start && timeMs < end).map((shot) =>
        <SourceClipping key={shot.page} shot={shot} ms={timeMs - shot.start} />)}
      {sourceLists.filter(({start, end}) => timeMs >= start && timeMs < end).map((shot) =>
        <SourceList key={shot.start} shot={shot} ms={timeMs - shot.start} />)}
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
