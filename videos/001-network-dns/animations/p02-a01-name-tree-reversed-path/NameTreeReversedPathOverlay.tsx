import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {DomainTree} from './DomainTree';
import {nameTreeTiming} from './content';
import {PathTransformation} from './PathTransformation';

export const NameTreeReversedPathOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const openingReveal = smoothProgress(frame, 4, 18);
  const filesystemReveal = smoothProgress(
    frame,
    msToFrames(nameTreeTiming.filesystemPathMs, fps),
    msToFrames(nameTreeTiming.filesystemPathMs + 760, fps),
  );
  const reverseProgress = smoothProgress(
    frame,
    msToFrames(nameTreeTiming.reversePathMs, fps),
    msToFrames(nameTreeTiming.reversePathMs + 1_200, fps),
  );
  const dnsReveal = smoothProgress(
    frame,
    msToFrames(nameTreeTiming.dnsNameMs, fps),
    msToFrames(nameTreeTiming.dnsNameMs + 700, fps),
  );
  const treeReveal = smoothProgress(
    frame,
    msToFrames(nameTreeTiming.parallelBranchMs - 420, fps),
    msToFrames(nameTreeTiming.parallelBranchMs + 420, fps),
  );
  const branchReveal = smoothProgress(
    frame,
    msToFrames(nameTreeTiming.parallelBranchMs - 420, fps),
    msToFrames(nameTreeTiming.parallelBranchMs + 760, fps),
  );
  const noConflictReveal = smoothProgress(
    frame,
    msToFrames(nameTreeTiming.noConflictMs, fps),
    msToFrames(nameTreeTiming.noConflictMs + 620, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="ИМЯ КАК ПУТЬ" meta="LEAF → ROOT" progress={runtimeProgress} />
      <PathTransformation
        dnsReveal={dnsReveal}
        filesystemReveal={filesystemReveal}
        reverseProgress={reverseProgress}
        reveal={openingReveal * (1 - treeReveal)}
      />
      <DomainTree
        branchReveal={branchReveal}
        noConflictReveal={noConflictReveal}
        reveal={treeReveal}
      />
      <DnsSceneStatus
        accent={treeReveal > 0.5 ? 'success' : 'primary'}
        left={treeReveal > 0.5 ? 'TWO BRANCHES / VALID' : 'PATH TRANSFORMATION'}
        right="DNS / 002"
        reveal={openingReveal}
      />
    </div>
  );
};
