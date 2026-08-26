import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {getActiveTimedPhaseIndex} from '../../shared/getActiveTimedPhaseIndex';
import {recordTypePhases} from './content';
import {RecordTypeShowcase} from './RecordTypeShowcase';

export const RecordTypesAtlasOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const elapsedMs = (frame / fps) * 1000;
  const reveal = smoothProgress(frame, 4, 18);
  const activeIndex = getActiveTimedPhaseIndex(recordTypePhases, elapsedMs);
  const phase = recordTypePhases[activeIndex] ?? recordTypePhases[0];
  const phaseReveal = smoothProgress(
    frame,
    msToFrames(phase.startMs, fps),
    msToFrames(phase.startMs + 520, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="ТИПЫ DNS-ЗАПИСЕЙ" meta="TYPE → MEANING" progress={runtimeProgress} />
      <DnsSceneHeading
        accent={phase.accent}
        eyebrow={phase.eyebrow}
        reveal={phaseReveal}
        title={phase.title}
      />
      <RecordTypeShowcase
        activeIndex={activeIndex}
        phase={phase}
        phaseReveal={phaseReveal}
        reveal={reveal}
      />
      <DnsSceneStatus
        accent={phase.accent}
        left={`${phase.typeLabel} / ACTIVE TYPE`}
        right="DNS / 007"
        reveal={reveal}
      />
    </div>
  );
};
