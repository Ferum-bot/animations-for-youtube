import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CodeEditor, PresenterPreview, presence, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {focusAt, lines} from './transaction';

const media = {
  photoSrc: 'generated/010-binance/create-order-sql.jpg',
  audioSrc: 'generated/010-binance/create-order-sql.mp3',
};

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="SQL создания заявки" opacity={presence(timeMs, 0, endMs, 300)}>
      <CodeEditor layout="wide" scale={1.18} minimumTop={404} lines={lines} fieldStrength={focusAt(timeMs)}/>
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
