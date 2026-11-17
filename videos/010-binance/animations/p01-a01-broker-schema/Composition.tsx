import React from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, PresenterPreview, presence, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {beatsAt, sourceStart} from './cues';
import {SqlEditor} from './SqlEditor';

const media = {
  photoSrc: 'generated/010-binance/broker-schema.jpg',
  audioSrc: 'generated/010-binance/broker-schema.mp3',
};

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const now = sourceStart + timeMs;
  const {current, previous} = beatsAt(now);
  const swap = previous.table !== current.table;
  const sinceCue = now - current.at;
  const focus = arrive(sinceCue, 0, 420);

  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Схема базы данных брокера" opacity={presence(timeMs, 0, endMs, 330)}>
      {swap && sinceCue < 280 ? <g opacity={1 - arrive(sinceCue, 0, 280)}>
        <SqlEditor table={previous.table}
          fieldStrength={field => Number(previous.fields.some(name => name === field))}/>
      </g> : <g opacity={swap ? arrive(sinceCue, 280, 320) : 1}>
        <SqlEditor table={current.table} fieldStrength={field => {
          const from = Number(!swap && previous.fields.some(name => name === field));
          const to = Number(current.fields.some(name => name === field));
          return from + (to - from) * focus;
        }}/>
      </g>}
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
