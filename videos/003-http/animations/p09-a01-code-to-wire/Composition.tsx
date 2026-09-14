import React from 'react';
import {Audio} from '@remotion/media';
import {msToFrames} from '@channel/motion-core';
import {staticFile, useVideoConfig} from 'remotion';
import type {HttpSceneProps} from '../../shared/NarratedHttpScene';
import {useTimeMs, reveal} from '../../shared/timing';
import {JourneyStage, JourneyChrome} from '../../shared/journey/Stage';
import {JourneyCat} from '../../shared/journey/Cat';
import {PhysicalWorld} from '../../shared/journey/PhysicalWorld';
import {palette} from '../../shared/journey/theme';
import {
  cue,
  journeyStartMs,
  progress,
  shots,
  shotEnd,
  type ShotId,
} from '../../shared/journey/timing';
import {Assembly, Invitation, Receiver, Segments, Socket} from './HttpOne';
import {Frames, Framing} from './HttpTwo';
import {Blocking, Multiplex, Quic} from './Transport';
import {Comparison, Readability} from './Resolution';
import {Wire} from './Wire';
import {RequestTransit} from '../../shared/journey/Transit';
import type {SceneProps} from '../../shared/journey/types';

const scenes = {
  invitation: Invitation,
  assembly: Assembly,
  socket: Socket,
  segments: Segments,
  receiver: Receiver,
  wire: Wire,
  frames: Frames,
  framing: Framing,
  multiplex: Multiplex,
  blocking: Blocking,
  quic: Quic,
  comparison: Comparison,
  readability: Readability,
} satisfies Record<ShotId, React.ComponentType<SceneProps>>;

const Composition: React.FC<HttpSceneProps> = ({
  withAudio = false,
  previewBackground = 'transparent',
}) => {
  const time = useTimeMs(),
    {fps} = useVideoConfig();
  const packing = time >= cue('p09-journey-encapsulate') && time < cue('p09-journey-http2') + 650;
  const transport =
    time >= cue('p09-journey-http3') && time < cue('p09-journey-independent') + 2700;
  return (
    <>
      {withAudio ? (
        <Audio
          src={staticFile('generated/003-http/audio.wav')}
          trimBefore={msToFrames(journeyStartMs, fps)}
        />
      ) : null}
      <JourneyStage time={time} background={previewBackground}>
        {packing ? (
          <div
            style={{
              opacity:
                reveal(time, cue('p09-journey-encapsulate'), 750) *
                (1 - progress(time, 'p09-journey-http2', 650)),
            }}
          >
            <PhysicalWorld time={time} kind="packing" />
          </div>
        ) : null}
        {transport ? (
          <div
            style={{
              opacity:
                reveal(time, cue('p09-journey-http3'), 750) *
                (1 - reveal(time, cue('p09-journey-independent') + 2300, 350)),
            }}
          >
            <PhysicalWorld time={time} kind="transport" />
          </div>
        ) : null}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 2560 1440"
          style={{position: 'absolute', fontFamily: palette.fontSans}}
        >
          {shots.map((shot, index) => {
            const end = shotEnd(index);
            if (time < shot.start || time >= end + 300) return null;
            const enter = reveal(time, shot.start + (index === 0 ? 0 : 280), 450);
            const opacity = enter * (index === shots.length - 1 ? 1 : 1 - reveal(time, end, 280));
            const Scene = scenes[shot.id];
            return (
              <g key={shot.id} opacity={opacity} transform={`translate(0 ${(1 - enter) * 20})`}>
                <Scene time={time} />
              </g>
            );
          })}
          <RequestTransit time={time} />
          <JourneyChrome time={time} />
        </svg>
        <JourneyCat time={time} />
      </JourneyStage>
    </>
  );
};
export default Composition;
