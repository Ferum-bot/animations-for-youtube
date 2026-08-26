import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {getActiveTimedPhaseIndex} from '../../shared/getActiveTimedPhaseIndex';
import {AnycastRouteMap} from './AnycastRouteMap';
import {anycastPhases} from './content';

export const RootAnycastOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const elapsedMs = (frame / fps) * 1000;
  const reveal = smoothProgress(frame, 4, 18);
  const activeIndex = getActiveTimedPhaseIndex(anycastPhases, elapsedMs);
  const phase = anycastPhases[activeIndex] ?? anycastPhases[0];
  const phaseProgress = smoothProgress(
    frame,
    msToFrames(phase.startMs, fps),
    msToFrames(phase.startMs + 620, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="ROOT ANYCAST" meta="REPLICATE / ANNOUNCE / ROUTE" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <AnycastRouteMap phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus
        accent={phase.accent}
        left={phase.status}
        right={`DNS / 015 / ${String(activeIndex + 1).padStart(2, '0')}`}
        reveal={reveal}
      />
    </div>
  );
};
