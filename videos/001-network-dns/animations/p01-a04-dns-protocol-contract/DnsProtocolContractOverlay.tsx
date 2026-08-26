import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {ContractLedger} from './ContractLedger';
import {dnsProtocolContractTiming} from './content';
import type {ContractClauseIndex} from './content';
import {FinalThesis} from './FinalThesis';
import {ProtocolOverview} from './ProtocolOverview';

export const DnsProtocolContractOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const overviewEnter = smoothProgress(frame, 6, 20);
  const overviewExit = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.messagePairMs - 320, fps),
    msToFrames(dnsProtocolContractTiming.messagePairMs + 280, fps),
  );
  const messagesReveal = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.messagePairMs, fps),
    msToFrames(dnsProtocolContractTiming.messagePairMs + 620, fps),
  );
  const responseReveal = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.responseMs, fps),
    msToFrames(dnsProtocolContractTiming.responseMs + 420, fps),
  );
  const formatReveal = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.sharedFormatMs, fps),
    msToFrames(dnsProtocolContractTiming.sharedFormatMs + 650, fps),
  );
  const recordsReveal = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.resourceRecordsMs, fps),
    msToFrames(dnsProtocolContractTiming.resourceRecordsMs + 650, fps),
  );
  const exchangeReveal = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.exchangeRuleMs, fps),
    msToFrames(dnsProtocolContractTiming.exchangeRuleMs + 620, fps),
  );
  const requestProgress = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.exchangeRuleMs + 300, fps),
    msToFrames(dnsProtocolContractTiming.exchangeRuleMs + 1_050, fps),
  );
  const responseProgress = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.exchangeRuleMs + 1_050, fps),
    msToFrames(dnsProtocolContractTiming.exchangeRuleMs + 1_800, fps),
  );
  const ttlReveal = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.ttlMs, fps),
    msToFrames(dnsProtocolContractTiming.ttlMs + 520, fps),
  );
  const thesisReveal = smoothProgress(
    frame,
    msToFrames(dnsProtocolContractTiming.thesisMs, fps),
    msToFrames(dnsProtocolContractTiming.thesisMs + 650, fps),
  );
  const ttlStartFrame = msToFrames(dnsProtocolContractTiming.ttlMs, fps);
  const ttlRemaining = Math.max(0, 300 - Math.floor(Math.max(0, frame - ttlStartFrame) / fps));
  const activeClauseIndex: ContractClauseIndex = exchangeReveal > 0.08
    ? 3
    : recordsReveal > 0.08
      ? 2
      : formatReveal > 0.08
        ? 1
        : 0;
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  const ledgerOpacity = overviewExit * Math.max(0, 1 - thesisReveal * 3);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome
        label="КОНТРАКТ DNS"
        meta="QUERY / RESPONSE"
        progress={runtimeProgress}
      />
      <ProtocolOverview
        opacity={overviewEnter * (1 - overviewExit)}
        shift={(1 - overviewEnter) * 24 - overviewExit * 18}
      />
      <ContractLedger
        activeClauseIndex={activeClauseIndex}
        exchangeReveal={exchangeReveal}
        formatReveal={formatReveal}
        messagesReveal={messagesReveal}
        recordsReveal={recordsReveal}
        requestProgress={requestProgress}
        responseProgress={responseProgress}
        responseReveal={responseReveal}
        reveal={ledgerOpacity}
        ttlRemaining={ttlRemaining}
        ttlReveal={ttlReveal}
      />
      <FinalThesis reveal={thesisReveal} />
    </div>
  );
};
