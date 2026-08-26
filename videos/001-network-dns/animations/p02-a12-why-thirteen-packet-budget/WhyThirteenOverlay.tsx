import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {getActiveTimedPhaseIndex} from '../../shared/getActiveTimedPhaseIndex';
import {packetBudgetPhases} from './content';
import {PacketBudgetDiagram} from './PacketBudgetDiagram';

export const WhyThirteenOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const elapsedMs = (frame / fps) * 1000;
  const reveal = smoothProgress(frame, 4, 18);
  const activeIndex = getActiveTimedPhaseIndex(packetBudgetPhases, elapsedMs);
  const phase = packetBudgetPhases[activeIndex] ?? packetBudgetPhases[0];
  const phaseProgress = smoothProgress(
    frame,
    msToFrames(phase.startMs, fps),
    msToFrames(phase.startMs + 760, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="WHY 13?" meta="512 B / BYTE BUDGET" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <PacketBudgetDiagram phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus
        accent={phase.accent}
        left={phase.status}
        right={`DNS / 014 / ${String(activeIndex + 1).padStart(2, '0')}`}
        reveal={reveal}
      />
    </div>
  );
};
