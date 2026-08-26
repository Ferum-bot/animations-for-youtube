import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {GovernanceFlow} from './GovernanceFlow';
import {tldGovernanceTiming} from './content';
import {TldField} from './TldField';

export const TldGovernanceStackOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const fieldReveal = smoothProgress(frame, 5, 22);
  const categoryReveal = smoothProgress(
    frame,
    msToFrames(tldGovernanceTiming.categoriesMs, fps),
    msToFrames(tldGovernanceTiming.categoriesMs + 780, fps),
  );
  const governanceReveal = smoothProgress(
    frame,
    msToFrames(tldGovernanceTiming.icannMs - 520, fps),
    msToFrames(tldGovernanceTiming.icannMs + 380, fps),
  );
  const registryReveal = smoothProgress(
    frame,
    msToFrames(tldGovernanceTiming.registryMs, fps),
    msToFrames(tldGovernanceTiming.registryMs + 620, fps),
  );
  const registrarReveal = smoothProgress(
    frame,
    msToFrames(tldGovernanceTiming.registrarMs, fps),
    msToFrames(tldGovernanceTiming.registrarMs + 620, fps),
  );
  const holderReveal = smoothProgress(
    frame,
    msToFrames(tldGovernanceTiming.holderMs, fps),
    msToFrames(tldGovernanceTiming.holderMs + 650, fps),
  );
  const activeIndex = holderReveal > 0.1 ? 3 : registrarReveal > 0.1 ? 2 : registryReveal > 0.1 ? 1 : 0;
  const domainProgress = interpolate(
    frame,
    [
      msToFrames(tldGovernanceTiming.icannMs, fps),
      msToFrames(tldGovernanceTiming.holderMs + 900, fps),
    ],
    [0, 1],
    clamp,
  );
  const count = Math.round(
    interpolate(
      frame,
      [msToFrames(tldGovernanceTiming.fieldMs, fps), msToFrames(tldGovernanceTiming.fieldMs + 1_050, fps)],
      [13, 250],
      clamp,
    ),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="ЭКОСИСТЕМА TLD" meta="ICANN / REGISTRY / REGISTRAR" progress={runtimeProgress} />
      <TldField
        categoryReveal={categoryReveal}
        count={count}
        reveal={fieldReveal * (1 - governanceReveal)}
      />
      <GovernanceFlow
        activeIndex={activeIndex}
        domainProgress={domainProgress}
        reveal={governanceReveal}
      />
      <DnsSceneStatus
        accent={governanceReveal > 0.5 ? 'signal' : 'primary'}
        left={governanceReveal > 0.5 ? 'ROLE PIPELINE / ACTIVE' : '250+ TOP-LEVEL DOMAINS'}
        right="DNS / 004"
        reveal={fieldReveal}
      />
    </div>
  );
};
