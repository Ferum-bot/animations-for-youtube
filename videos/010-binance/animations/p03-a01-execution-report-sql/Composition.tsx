import React from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, CodeEditor, PresenterPreview, presence, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {activeAt, orderPage, pageChangeMs, positionPage} from './transaction';

const media = {
  photoSrc: 'generated/010-binance/execution-report-sql.jpg',
  audioSrc: 'generated/010-binance/execution-report-sql.mp3',
};

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const {active, previous, since} = activeAt(timeMs);
  const focus = arrive(timeMs, since, 370);
  const secondPage = timeMs >= pageChangeMs;
  const opacity = secondPage ? arrive(timeMs, pageChangeMs, 190)
    : 1 - arrive(timeMs, pageChangeMs - 150, 150);

  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="SQL обработки исполнения" opacity={presence(timeMs, 0, endMs, 300)}>
      <g opacity={opacity}>
        <CodeEditor layout="wide" scale={1.18} minimumTop={404}
          lines={secondPage ? positionPage : orderPage}
          firstLineNumber={secondPage ? orderPage.length + 1 : 1}
          fieldStrength={field => Number(field === previous) * (1 - focus) + Number(field === active) * focus}/>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
