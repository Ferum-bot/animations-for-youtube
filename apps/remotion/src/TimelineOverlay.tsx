import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {resolveCue} from '@channel/audio-sync';
import type {AnimationCue, VideoAnchors} from '@channel/audio-sync';

export type TimelineComponent = React.ComponentType<any>;

type TimelineOverlayProps = {
  anchors: VideoAnchors;
  audio: string | null;
  components: Record<string, TimelineComponent>;
  timeline: AnimationCue[];
};

export const TimelineOverlay: React.FC<TimelineOverlayProps> = ({
  anchors,
  audio,
  components,
  timeline,
}) => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill>
      {audio ? <Audio src={staticFile(audio)} /> : null}
      {timeline.map((cue) => {
        const Component = components[cue.animation];
        if (!Component) {
          throw new Error(`Unknown animation: ${cue.animation}`);
        }

        const resolved = resolveCue(cue, anchors, fps);
        return (
          <Sequence
            key={cue.id}
            name={cue.id}
            from={resolved.fromFrame}
            durationInFrames={resolved.durationInFrames}
          >
            <Component {...cue.props} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
