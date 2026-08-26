import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {phaseCopy, zoneDelegationTiming} from './content';
import {ZoneNarrative} from './ZoneNarrative';
import {ZoneWorld} from './ZoneWorld';

type Phase = keyof typeof phaseCopy;

const getPhase = (elapsedMs: number): Phase => {
  if (elapsedMs >= zoneDelegationTiming.distributedMs) return 'distributed';
  if (elapsedMs >= zoneDelegationTiming.noCenterMs) return 'bottleneck';
  if (elapsedMs >= zoneDelegationTiming.localScopeMs) return 'noCenter';
  if (elapsedMs >= zoneDelegationTiming.childAuthorityMs) return 'authority';
  if (elapsedMs >= zoneDelegationTiming.handoffMs) return 'handoff';
  if (elapsedMs >= zoneDelegationTiming.zoneCutMs) return 'cut';
  return 'tree';
};

const getPhaseStartMs = (phase: Phase): number => {
  if (phase === 'distributed') return zoneDelegationTiming.distributedMs;
  if (phase === 'bottleneck') return zoneDelegationTiming.noCenterMs;
  if (phase === 'noCenter') return zoneDelegationTiming.localScopeMs;
  if (phase === 'authority') return zoneDelegationTiming.childAuthorityMs;
  if (phase === 'handoff') return zoneDelegationTiming.handoffMs;
  if (phase === 'cut') return zoneDelegationTiming.zoneCutMs;
  return zoneDelegationTiming.treeMs;
};

export const ZoneDelegationOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const elapsedMs = (frame / fps) * 1000;
  const hierarchyReveal = smoothProgress(frame, 4, 24);
  const cutReveal = smoothProgress(
    frame,
    msToFrames(zoneDelegationTiming.zoneCutMs, fps),
    msToFrames(zoneDelegationTiming.zoneCutMs + 900, fps),
  );
  const handoffProgress = smoothProgress(
    frame,
    msToFrames(zoneDelegationTiming.handoffMs, fps),
    msToFrames(zoneDelegationTiming.childAuthorityMs, fps),
  );
  const authorityReveal = smoothProgress(
    frame,
    msToFrames(zoneDelegationTiming.childAuthorityMs - 500, fps),
    msToFrames(zoneDelegationTiming.childAuthorityMs + 900, fps),
  );
  const localScopeReveal = smoothProgress(
    frame,
    msToFrames(zoneDelegationTiming.localScopeMs, fps),
    msToFrames(zoneDelegationTiming.noCenterMs + 900, fps),
  );
  const distributedReveal = smoothProgress(
    frame,
    msToFrames(zoneDelegationTiming.distributedMs, fps),
    msToFrames(zoneDelegationTiming.distributedMs + 1_600, fps),
  );
  const phase = getPhase(elapsedMs);
  const phaseStartMs = getPhaseStartMs(phase);
  const phaseReveal = smoothProgress(
    frame,
    msToFrames(Math.max(0, phaseStartMs - 300), fps),
    msToFrames(phaseStartMs + 300, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  const cameraZ = 13.5 + distributedReveal * 1.7;

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="ДЕЛЕГИРОВАНИЕ" meta="ZONE CUT / NS REFERRAL" progress={runtimeProgress} />
      <div style={{position: 'absolute', left: 0, top: 138, width: 1080, height: 650, overflow: 'hidden', opacity: hierarchyReveal}}>
        <ThreeCanvas
          camera={{fov: 43, position: [0.2 + distributedReveal * 0.3, 0.35, cameraZ]}}
          height={650}
          style={{backgroundColor: 'transparent'}}
          width={1080}
        >
          <ZoneWorld
            authorityReveal={authorityReveal}
            cutReveal={cutReveal}
            distributedReveal={distributedReveal}
            handoffProgress={handoffProgress}
            hierarchyReveal={hierarchyReveal}
            localScopeReveal={localScopeReveal}
          />
        </ThreeCanvas>
      </div>
      <ZoneNarrative
        authorityReveal={authorityReveal}
        cutReveal={cutReveal}
        handoffProgress={handoffProgress}
        hierarchyReveal={hierarchyReveal}
        phase={phase}
        phaseReveal={phaseReveal}
      />
      <DnsSceneStatus
        accent={authorityReveal > 0.7 ? 'success' : 'signal'}
        left={phaseCopy[phase].status}
        right="DNS / 005 / 3D"
        reveal={hierarchyReveal}
      />
    </div>
  );
};
