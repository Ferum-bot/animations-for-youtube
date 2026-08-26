import React from 'react';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {useDnsTimedPhases} from '../../shared/useDnsTimedPhases';
import {compatibilityPhases} from './content';
import {WireFormatDiagram} from './WireFormatDiagram';

export const SixteenBitCompatibilityTrapOverlay: React.FC = () => {
  const {activeIndex, phase, phaseProgress, reveal, runtimeProgress} = useDnsTimedPhases(compatibilityPhases);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="COMPATIBILITY TRAP" meta="16 BIT / WIRE FORMAT / INSTALLED BASE" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <WireFormatDiagram phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus
        accent={phase.accent}
        left={phase.status}
        right={`DNS / 019 / ${String(activeIndex + 1).padStart(2, '0')}`}
        reveal={reveal}
      />
    </div>
  );
};
