import React from 'react';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {useDnsTimedPhases} from '../../shared/useDnsTimedPhases';
import {responseRacePhases} from './content';
import {ResponseRaceDiagram} from './ResponseRaceDiagram';

export const ForgedResponseRaceOverlay: React.FC = () => {
  const {activeIndex, phase, phaseProgress, reveal, runtimeProgress} = useDnsTimedPhases(responseRacePhases);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="RESPONSE RACE" meta="QUERY / MATCH / FIRST ARRIVAL" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <ResponseRaceDiagram phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus
        accent={phase.accent}
        left={phase.status}
        right={`DNS / 017 / ${String(activeIndex + 1).padStart(2, '0')}`}
        reveal={reveal}
      />
    </div>
  );
};
