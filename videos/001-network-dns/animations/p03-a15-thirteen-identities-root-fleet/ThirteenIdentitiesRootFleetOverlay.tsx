import React from 'react';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {useDnsTimedPhases} from '../../shared/useDnsTimedPhases';
import {rootFleetRevealPhases} from './content';
import {RootFleetRevealDiagram} from './RootFleetRevealDiagram';

export const ThirteenIdentitiesRootFleetOverlay: React.FC = () => {
  const {activeIndex, phase, phaseProgress, reveal, runtimeProgress} = useDnsTimedPhases(rootFleetRevealPhases, 520);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="ROOT SCALE" meta="13 IDs / FLEET / 12 OPERATORS" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <RootFleetRevealDiagram phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus accent={phase.accent} left={phase.status} right={`DNS / 029 / ${String(activeIndex + 1).padStart(2, '0')}`} reveal={reveal} />
    </div>
  );
};
