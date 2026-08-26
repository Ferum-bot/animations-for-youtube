import React from 'react';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {useDnsTimedPhases} from '../../shared/useDnsTimedPhases';
import {smartHomeFingerprintPhases} from './content';
import {SmartHomeFingerprintDiagram} from './SmartHomeFingerprintDiagram';

export const SmartHomeDnsFingerprintOverlay: React.FC = () => {
  const {activeIndex, phase, phaseProgress, reveal, runtimeProgress} = useDnsTimedPhases(smartHomeFingerprintPhases, 460);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="PRIVACY 01" meta="HOME / DNS TRACE / DEVICE / ACTIVITY" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <SmartHomeFingerprintDiagram phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus accent={phase.accent} left={phase.status} right={`DNS / 023 / ${String(activeIndex + 1).padStart(2, '0')}`} reveal={reveal} />
    </div>
  );
};
