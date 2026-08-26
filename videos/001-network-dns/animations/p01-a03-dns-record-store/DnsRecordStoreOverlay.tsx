import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {dnsRecordStoreTiming} from './content';
import {FinalThesis} from './FinalThesis';
import {OpeningStatement} from './OpeningStatement';
import {RecordStoreDiagram} from './RecordStoreDiagram';

export const DnsRecordStoreOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const openingEnter = smoothProgress(frame, 6, 20);
  const openingExit = smoothProgress(
    frame,
    msToFrames(dnsRecordStoreTiming.recordSetMs - 360, fps),
    msToFrames(dnsRecordStoreTiming.recordSetMs + 260, fps),
  );
  const recordReveal = smoothProgress(
    frame,
    msToFrames(dnsRecordStoreTiming.recordSetMs, fps),
    msToFrames(dnsRecordStoreTiming.recordSetMs + 1_100, fps),
  );
  const ipFocusIn = smoothProgress(
    frame,
    msToFrames(dnsRecordStoreTiming.ipIsOneTypeMs, fps),
    msToFrames(dnsRecordStoreTiming.ipIsOneTypeMs + 520, fps),
  );
  const ipFocusOut = smoothProgress(
    frame,
    msToFrames(dnsRecordStoreTiming.distributedStoreMs - 420, fps),
    msToFrames(dnsRecordStoreTiming.distributedStoreMs + 260, fps),
  );
  const authorityReveal = smoothProgress(
    frame,
    msToFrames(dnsRecordStoreTiming.distributedStoreMs, fps),
    msToFrames(dnsRecordStoreTiming.distributedStoreMs + 900, fps),
  );
  const catalogueReveal = smoothProgress(
    frame,
    msToFrames(dnsRecordStoreTiming.catalogueGrowsMs, fps),
    msToFrames(dnsRecordStoreTiming.catalogueGrowsMs + 700, fps),
  );
  const operationalReveal = smoothProgress(
    frame,
    msToFrames(dnsRecordStoreTiming.operationalDataMs, fps),
    msToFrames(dnsRecordStoreTiming.operationalDataMs + 2_700, fps),
  );
  const thesisReveal = smoothProgress(
    frame,
    msToFrames(dnsRecordStoreTiming.thesisMs, fps),
    msToFrames(dnsRecordStoreTiming.thesisMs + 680, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  const diagramOpacity = openingExit * Math.max(0, 1 - thesisReveal * 3);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome
        label="DNS КАК ХРАНИЛИЩЕ"
        meta="NAME → RECORDS"
        progress={runtimeProgress}
      />
      <OpeningStatement
        opacity={openingEnter * (1 - openingExit)}
        shift={(1 - openingEnter) * 24 - openingExit * 18}
      />
      <RecordStoreDiagram
        authorityReveal={authorityReveal}
        ipFocus={ipFocusIn * (1 - ipFocusOut)}
        operationalReveal={Math.max(catalogueReveal * 0.2, operationalReveal)}
        recordReveal={recordReveal}
        reveal={diagramOpacity}
      />
      <FinalThesis reveal={thesisReveal} />
    </div>
  );
};
