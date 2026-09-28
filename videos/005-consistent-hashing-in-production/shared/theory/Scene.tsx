import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fadeEnvelope, msToFrames} from '@channel/motion-core';
import {HashingStage, type PreviewBackground} from '../HashingStage';
import video from '../../video.json';

export type SceneProps = {readonly withAudio?: boolean; readonly previewBackground?: PreviewBackground};
export const Scene: React.FC<
  SceneProps & {
    readonly startMs: number;
    readonly durationMs: number;
    readonly children: (timeMs: number) => React.ReactNode;
  }
> = ({startMs, durationMs, withAudio = false, previewBackground = 'transparent', children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const durationInFrames = msToFrames(durationMs, fps);
  return (
    <>
      {withAudio ? (
        <Audio
          src={staticFile(video.audio)}
          trimBefore={msToFrames(startMs, fps)}
          trimAfter={msToFrames(startMs, fps) + durationInFrames}
        />
      ) : null}
      <HashingStage
        opacity={fadeEnvelope({frame, durationInFrames, enterFrames: 10, exitFrames: 12})}
        previewBackground={previewBackground}
        label="Теория consistent hashing"
      >
        {children((frame * 1000) / fps)}
      </HashingStage>
    </>
  );
};
