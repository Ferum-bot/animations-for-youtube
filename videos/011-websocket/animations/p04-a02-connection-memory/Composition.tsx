import React from 'react';
import {arrive, easing, progress, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage} from '../../shared/AccessSourceStage';
import {chapterColors as colors} from '../../shared/chapterColors';
import {Sources} from './Sources';
import {Layers} from './Layers';

// CapCut: 14:43.160 in, sources end at 15:07.080, layers start at 15:11.840.
const sourcesEnd = 23920;
const layersStart = 28680;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const sourcesOn = timeMs < sourcesEnd;
  const layersOn = timeMs > layersStart;
  const opacity = sourcesOn ? 1-progress(timeMs,sourcesEnd-300,sourcesEnd,easing.transform)
    : arrive(timeMs,layersStart,320);
  return <AccessSourceStage {...props} audio="connection-memory" label="Отправка данных и память одного соединения">
    {(sourcesOn || layersOn) && <g opacity={opacity} fill={colors.text}>
      <rect width={1460} height={1440} fill={colors.background}/>
      {sourcesOn ? <Sources ms={timeMs}/> : <Layers ms={timeMs-layersStart}/>}
    </g>}
  </AccessSourceStage>;
};
export default Composition;
