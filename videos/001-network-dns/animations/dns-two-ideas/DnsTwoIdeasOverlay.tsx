import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {ArchitectureDiagram} from './ArchitectureDiagram';
import {FinalThesis} from './FinalThesis';
import {OpeningStatement} from './OpeningStatement';
import {dnsTwoIdeasTiming} from './content';

export const DnsTwoIdeasOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const openingEnter = smoothProgress(frame, 6, 20);
  const openingExit = smoothProgress(
    frame,
    msToFrames(dnsTwoIdeasTiming.firstIdeaMs - 300, fps),
    msToFrames(dnsTwoIdeasTiming.firstIdeaMs + 260, fps),
  );
  const branchProgress = smoothProgress(
    frame,
    msToFrames(dnsTwoIdeasTiming.firstIdeaMs, fps),
    msToFrames(dnsTwoIdeasTiming.branchesExpandMs + 700, fps),
  );
  const distributionProgress = smoothProgress(
    frame,
    msToFrames(dnsTwoIdeasTiming.secondIdeaMs, fps),
    msToFrames(dnsTwoIdeasTiming.dataSeparatesMs + 700, fps),
  );
  const globalScaleProgress = smoothProgress(
    frame,
    msToFrames(dnsTwoIdeasTiming.globalScaleMs, fps),
    msToFrames(dnsTwoIdeasTiming.globalScaleMs + 650, fps),
  );
  const unifyProgress = smoothProgress(
    frame,
    msToFrames(dnsTwoIdeasTiming.ideasUnifyMs, fps),
    msToFrames(dnsTwoIdeasTiming.ideasUnifyMs + 700, fps),
  );
  const thesisReveal = smoothProgress(
    frame,
    msToFrames(dnsTwoIdeasTiming.thesisMs, fps),
    msToFrames(dnsTwoIdeasTiming.thesisMs + 680, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  const diagramOpacity = openingExit * Math.max(0, 1 - thesisReveal * 3);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome
        label="АРХИТЕКТУРА DNS"
        meta="1983 / TWO IDEAS"
        progress={runtimeProgress}
      />
      <OpeningStatement
        opacity={openingEnter * (1 - openingExit)}
        shift={(1 - openingEnter) * 24 - openingExit * 18}
      />
      <ArchitectureDiagram
        opacity={diagramOpacity}
        branchProgress={branchProgress}
        distributionProgress={distributionProgress}
        globalScaleProgress={globalScaleProgress}
        unifyProgress={unifyProgress}
      />
      <FinalThesis reveal={thesisReveal} />
    </div>
  );
};
