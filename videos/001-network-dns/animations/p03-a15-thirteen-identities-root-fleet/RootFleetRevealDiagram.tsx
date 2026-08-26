import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {RootIdentityBadge, RootServerGlyph} from '../../shared/DnsRootSystemPrimitives';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {rootServerLetters, rootServerSystemFacts} from '../../shared/rootServerData';
import type {RootFleetRevealPhase} from './content';
import {rootFleetRevealStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const fleetNodes = Array.from({length: 21}, (_, index) => `POP ${String(index + 1).padStart(2, '0')}`);

export const RootFleetRevealDiagram: React.FC<{
  readonly phase: RootFleetRevealPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = rootFleetRevealStage[phase.focus];
  const fleetReveal = stage === 1 ? phaseProgress : stage > 1 ? 1 : 0;
  const operatorReveal = stage === 2 ? phaseProgress : 0;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 394, width: contentWidth, height: 560, opacity: reveal}}>
      <div style={{display: 'flex', justifyContent: 'space-between', width: contentWidth}}>
        {rootServerLetters.map((letter, index) => (
          <RootIdentityBadge key={letter} active={index === 0 || index === 12} letter={letter} reveal={clamp01(phaseProgress * 1.8 - index * 0.045)} tone={stage === 0 ? 'primary' : 'success'} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, top: 68, width: contentWidth, height: 3, background: theme.line}}>
        <div style={{height: '100%', width: `${fleetReveal * 100}%`, background: theme.success}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 82, width: contentWidth, display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `800 8px ${theme.fontMono}`, opacity: fleetReveal}}>
        <span>13 LOGICAL IDENTITIES</span>
        <span>ONE ROOT ZONE / MANY SERVING LOCATIONS</span>
      </div>

      <div style={{position: 'absolute', left: 0, top: 122, width: contentWidth, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, opacity: fleetReveal}}>
        {fleetNodes.map((label, index) => (
          <RootServerGlyph key={label} label={label} reveal={clamp01(fleetReveal * 2.1 - index * 0.045)} state={index % 5 === 0 ? 'healthy' : 'neutral'} width={114} />
        ))}
      </div>

      <div style={{position: 'absolute', left: 0, top: 350, width: contentWidth, display: 'grid', gridTemplateColumns: '1fr 1.45fr 1.1fr', gap: 12, opacity: fleetReveal}}>
        {[
          {value: String(rootServerSystemFacts.identityCount), label: 'LOGICAL IDs', accent: theme.primary},
          {value: 'THOUSANDS', label: 'PHYSICAL INSTANCES', accent: theme.success},
          {value: String(rootServerSystemFacts.operatorCount), label: 'OPERATORS', accent: theme.signal},
        ].map((item) => (
          <div key={item.label} style={{height: 82, padding: '13px 16px', boxSizing: 'border-box', background: theme.surface, borderTop: `5px solid ${item.accent}`}}>
            <div style={{color: item.accent, font: `800 24px ${theme.fontSans}`}}>{item.value}</div>
            <div style={{marginTop: 8, color: theme.muted, font: `800 8px ${theme.fontMono}`}}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: 0, top: 458, width: contentWidth, opacity: operatorReveal}}>
        <div style={{display: 'flex', justifyContent: 'space-between', color: theme.signal, font: `800 9px ${theme.fontMono}`}}>
          <span>12 INDEPENDENT OPERATORS</span>
          <span>GEOGRAPHICALLY DISTRIBUTED</span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 7, marginTop: 14}}>
          {Array.from({length: rootServerSystemFacts.operatorCount}, (_, index) => (
            <div key={index} style={{height: 9, background: index % 3 === 0 ? theme.signal : index % 2 === 0 ? theme.success : theme.primary, transform: `scaleX(${clamp01(operatorReveal * 1.7 - index * 0.05)})`, transformOrigin: 'left center'}} />
          ))}
        </div>
      </div>
    </div>
  );
};
