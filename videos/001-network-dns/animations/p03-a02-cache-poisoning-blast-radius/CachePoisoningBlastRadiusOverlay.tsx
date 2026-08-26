import React from 'react';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {useDnsTimedPhases} from '../../shared/useDnsTimedPhases';
import {CachePoisoningDiagram} from './CachePoisoningDiagram';
import {poisoningPhases} from './content';

export const CachePoisoningBlastRadiusOverlay: React.FC = () => {
  const {activeIndex, phase, phaseProgress, reveal, runtimeProgress} = useDnsTimedPhases(poisoningPhases);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="CACHE POISONING" meta="FORGED REFERRAL / ZONE IMPACT" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <CachePoisoningDiagram phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus
        accent={phase.accent}
        left={phase.status}
        right={`DNS / 018 / ${String(activeIndex + 1).padStart(2, '0')}`}
        reveal={reveal}
      />
    </div>
  );
};
