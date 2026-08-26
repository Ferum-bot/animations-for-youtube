import React from 'react';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {useDnsTimedPhases} from '../../shared/useDnsTimedPhases';
import {rootMythPhases} from './content';
import {RootMythDiagram} from './RootMythDiagram';

export const RootMythColdOpenOverlay: React.FC = () => {
  const {activeIndex, phase, phaseProgress, reveal, runtimeProgress} = useDnsTimedPhases(rootMythPhases, 520);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="МИФ 01" meta="ROOT / 13 / PHYSICAL?" progress={runtimeProgress} />
      <DnsSceneHeading accent={phase.accent} eyebrow={phase.eyebrow} reveal={phaseProgress} title={phase.title} />
      <RootMythDiagram phase={phase} phaseProgress={phaseProgress} reveal={reveal} />
      <DnsSceneStatus accent={phase.accent} left={phase.status} right={`DNS / 028 / ${String(activeIndex + 1).padStart(2, '0')}`} reveal={reveal} />
    </div>
  );
};
