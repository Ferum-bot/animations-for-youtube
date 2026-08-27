import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {fadeEnvelope} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {useDnsTimedPhases} from '../../shared/useDnsTimedPhases';
import {ConclusionRecapDiagram} from './ConclusionRecapDiagram';
import {conclusionPhases} from './content';

export const DnsConclusionRecapOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const elapsedMs = (frame / fps) * 1000;
  const envelope = fadeEnvelope({frame, durationInFrames, enterFrames: 12, exitFrames: 14});
  const {activeIndex, phase, phaseProgress, runtimeProgress} = useDnsTimedPhases(conclusionPhases, 560);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity: envelope}}>
      <DnsPresenterOverlayChrome label="DNS / ФИНАЛ" meta="FOUNDATION / LEGACY / CONTROL" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <ConclusionRecapDiagram elapsedMs={elapsedMs} />
      <DnsSceneStatus accent={phase.accent} left={phase.status} right={`DNS / 037 / ${String(activeIndex + 1).padStart(2, '0')}`} reveal={phaseProgress} />
    </div>
  );
};
