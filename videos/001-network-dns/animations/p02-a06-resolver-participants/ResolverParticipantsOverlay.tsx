import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {participantPhaseCopy, resolverParticipantsTiming} from './content';
import {ResolverRoleChain} from './ResolverRoleChain';

type Phase = keyof typeof participantPhaseCopy;

const getPhase = (elapsedMs: number): Phase => {
  if (elapsedMs >= resolverParticipantsTiming.completeMs) return 'complete';
  if (elapsedMs >= resolverParticipantsTiming.authorityMs) return 'authority';
  if (elapsedMs >= resolverParticipantsTiming.recursiveMs) return 'recursive';
  if (elapsedMs >= resolverParticipantsTiming.stubMs) return 'stub';
  return 'opening';
};

const getPhaseStartMs = (phase: Phase): number => {
  if (phase === 'complete') return resolverParticipantsTiming.completeMs;
  if (phase === 'authority') return resolverParticipantsTiming.authorityMs;
  if (phase === 'recursive') return resolverParticipantsTiming.recursiveMs;
  if (phase === 'stub') return resolverParticipantsTiming.stubMs;
  return resolverParticipantsTiming.openingMs;
};

export const ResolverParticipantsOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const elapsedMs = (frame / fps) * 1000;
  const reveal = smoothProgress(frame, 4, 18);
  const stubReveal = smoothProgress(
    frame,
    msToFrames(resolverParticipantsTiming.stubMs, fps),
    msToFrames(resolverParticipantsTiming.stubMs + 620, fps),
  );
  const stubDetailReveal = smoothProgress(
    frame,
    msToFrames(resolverParticipantsTiming.libraryMs, fps),
    msToFrames(resolverParticipantsTiming.callMs + 700, fps),
  );
  const recursiveReveal = smoothProgress(
    frame,
    msToFrames(resolverParticipantsTiming.recursiveMs, fps),
    msToFrames(resolverParticipantsTiming.recursiveMs + 720, fps),
  );
  const recursiveDetailReveal = smoothProgress(
    frame,
    msToFrames(resolverParticipantsTiming.publicResolversMs, fps),
    msToFrames(resolverParticipantsTiming.publicResolversMs + 620, fps),
  );
  const authorityReveal = smoothProgress(
    frame,
    msToFrames(resolverParticipantsTiming.authorityMs, fps),
    msToFrames(resolverParticipantsTiming.authorityMs + 720, fps),
  );
  const completeReveal = smoothProgress(
    frame,
    msToFrames(resolverParticipantsTiming.completeMs, fps),
    msToFrames(resolverParticipantsTiming.completeMs + 620, fps),
  );
  const recursiveTravel = smoothProgress(
    frame,
    msToFrames(resolverParticipantsTiming.recursiveMs - 480, fps),
    msToFrames(resolverParticipantsTiming.recursiveMs + 620, fps),
  );
  const authorityTravel = smoothProgress(
    frame,
    msToFrames(resolverParticipantsTiming.authorityMs - 480, fps),
    msToFrames(resolverParticipantsTiming.authorityMs + 620, fps),
  );
  const routeProgress = 0.02 + recursiveTravel * 0.48 + authorityTravel * 0.5;
  const activeIndex = authorityReveal > 0.1 ? 2 : recursiveReveal > 0.1 ? 1 : 0;
  const phase = getPhase(elapsedMs);
  const phaseStartMs = getPhaseStartMs(phase);
  const headingReveal = smoothProgress(
    frame,
    msToFrames(phaseStartMs, fps),
    msToFrames(phaseStartMs + 480, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="УЧАСТНИКИ ЗАПРОСА" meta="STUB / RECURSIVE / AUTH" progress={runtimeProgress} />
      <DnsSceneHeading
        accent={phase === 'complete' || phase === 'authority' ? 'success' : phase === 'recursive' ? 'signal' : 'primary'}
        eyebrow={participantPhaseCopy[phase].eyebrow}
        reveal={headingReveal}
        title={participantPhaseCopy[phase].title}
      />
      <ResolverRoleChain
        activeIndex={activeIndex}
        authorityReveal={authorityReveal}
        completeReveal={completeReveal}
        overviewReveal={reveal}
        processReveal={reveal}
        recursiveDetailReveal={recursiveDetailReveal}
        recursiveReveal={recursiveReveal}
        routeProgress={routeProgress}
        stubDetailReveal={stubDetailReveal}
        stubReveal={stubReveal}
      />
      <DnsSceneStatus
        accent={activeIndex === 2 ? 'success' : activeIndex === 1 ? 'signal' : 'primary'}
        left={phase === 'opening' ? 'ТВОЙ ПРОЦЕСС / LOCAL' : activeIndex === 2 ? 'AUTHORITATIVE CHAIN / READY' : activeIndex === 1 ? 'RECURSIVE RESOLVER / ACTIVE' : 'STUB RESOLVER / IN PROCESS'}
        right="DNS / 008"
        reveal={reveal}
      />
    </div>
  );
};
