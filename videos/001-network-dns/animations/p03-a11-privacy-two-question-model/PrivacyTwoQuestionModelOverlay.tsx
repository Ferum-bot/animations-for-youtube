import React from 'react';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {useDnsTimedPhases} from '../../shared/useDnsTimedPhases';
import {privacyQuestionPhases} from './content';
import {PrivacyTwoQuestionDiagram} from './PrivacyTwoQuestionDiagram';

export const PrivacyTwoQuestionModelOverlay: React.FC = () => {
  const {activeIndex, phase, phaseProgress, reveal, runtimeProgress} = useDnsTimedPhases(privacyQuestionPhases, 520);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="PRIVACY 03" meta="CHANNEL / RESOLVER / TRUST" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <PrivacyTwoQuestionDiagram phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus accent={phase.accent} left={phase.status} right={`DNS / 025 / ${String(activeIndex + 1).padStart(2, '0')}`} reveal={reveal} />
    </div>
  );
};
