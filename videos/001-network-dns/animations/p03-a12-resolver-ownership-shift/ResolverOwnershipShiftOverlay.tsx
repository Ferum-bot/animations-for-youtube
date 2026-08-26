import React from 'react';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {useDnsTimedPhases} from '../../shared/useDnsTimedPhases';
import {resolverOwnershipPhases} from './content';
import {ResolverOwnershipShiftDiagram} from './ResolverOwnershipShiftDiagram';

export const ResolverOwnershipShiftOverlay: React.FC = () => {
  const {activeIndex, phase, phaseProgress, reveal, runtimeProgress} = useDnsTimedPhases(resolverOwnershipPhases, 520);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="PRIVACY 04" meta="BROWSER / ISP / CHOSEN RESOLVER" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <ResolverOwnershipShiftDiagram phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus accent={phase.accent} left={phase.status} right={`DNS / 026 / ${String(activeIndex + 1).padStart(2, '0')}`} reveal={reveal} />
    </div>
  );
};
