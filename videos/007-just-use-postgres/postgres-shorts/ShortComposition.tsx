import React from 'react';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {useSceneTime, useV2Font} from '@channel/motion-v2';
import {EndCard} from '../intro-shorts/EndCard';
import {ink, type Platform} from '../intro-shorts/palette';
import {bodyDuration, clipByNumber, sourceSeconds} from './timing';
import {DataScenes} from './DataScenes';
import {QueueScenes} from './QueueScenes';
import {MvccScenes} from './MvccScenes';
import {SystemScenes} from './SystemScenes';
import {EvidenceScenes} from './EvidenceScenes';
import type {SceneProps} from './ui';
import {Cover} from './Cover';

function BodyScene(props: SceneProps) {
  const {number} = props;
  if (number <= 7) return <DataScenes {...props} />;
  if (number <= 12) return <QueueScenes {...props} />;
  if ([14, 15, 16, 17].includes(number)) return <MvccScenes {...props} />;
  if ([13, 18, 21, 24].includes(number)) return <EvidenceScenes {...props} />;
  return <SystemScenes {...props} />;
}

export type ShortProps = {
  readonly withAudio?: boolean;
  readonly platform?: Platform;
  readonly cover?: boolean;
};
export function ShortComposition({
  number,
  withAudio = true,
  platform = 'shorts',
  cover = false,
}: ShortProps & {readonly number: number}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  const {width} = useVideoConfig();
  const clip = clipByNumber(number);
  const bodyMs = bodyDuration(clip);
  const t = sourceSeconds(clip, timeMs);
  return (
    <AbsoluteFill style={{backgroundColor: ink.background}}>
      {withAudio && !cover && (
        <Audio
          src={staticFile(
            `generated/007-just-use-postgres/postgres-shorts/${clip.slug}.wav`,
          )}
        />
      )}
      <div
        style={{
          position: 'absolute',
          width: 1080,
          height: 1920,
          overflow: 'hidden',
          transform: `scale(${width / 1080})`,
          transformOrigin: 'top left',
          background: ink.background,
          color: ink.text,
          fontFamily: ink.fontSans,
        }}
      >
        {cover ? (
          <Cover number={number} />
        ) : timeMs >= bodyMs ? (
          <EndCard platform={platform} elapsedMs={timeMs - bodyMs} />
        ) : (
          <BodyScene number={number} t={t} />
        )}
      </div>
    </AbsoluteFill>
  );
}
