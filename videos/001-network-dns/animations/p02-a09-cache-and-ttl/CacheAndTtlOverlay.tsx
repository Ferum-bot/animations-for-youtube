import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, clamp01, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {getActiveTimedPhaseIndex} from '../../shared/getActiveTimedPhaseIndex';
import {CacheLifecycleDiagram} from './CacheLifecycleDiagram';
import {cachePhases} from './content';

export const CacheAndTtlOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const elapsedMs = (frame / fps) * 1000;
  const reveal = smoothProgress(frame, 4, 18);
  const activeIndex = getActiveTimedPhaseIndex(cachePhases, elapsedMs);
  const phase = cachePhases[activeIndex] ?? cachePhases[0];
  const phaseProgress = smoothProgress(
    frame,
    msToFrames(phase.startMs, fps),
    msToFrames(phase.startMs + 760, fps),
  );
  const ttlProgress = phase.route === 'ttl'
    ? clamp01(1 - (elapsedMs - phase.startMs) / 4_320)
    : 1;
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome
        label="КЭШ И TTL"
        meta="COPY / HIT / EXPIRE"
        progress={runtimeProgress}
      />
      <DnsSceneHeading
        accent={phase.accent}
        eyebrow={phase.eyebrow}
        reveal={phaseProgress}
        title={phase.title}
      />
      <CacheLifecycleDiagram
        entryCount={phase.cachedEntries}
        phaseProgress={phaseProgress}
        reveal={reveal}
        route={phase.route}
        ttlProgress={ttlProgress}
      />
      <DnsSceneStatus
        accent={phase.accent}
        left={phase.status}
        right={`DNS / 011 / ${String(activeIndex + 1).padStart(2, '0')}`}
        reveal={reveal}
      />
    </div>
  );
};
