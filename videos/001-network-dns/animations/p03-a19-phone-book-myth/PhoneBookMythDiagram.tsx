import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {DnsRoutingRecord} from '../../shared/DnsTrafficControlPrimitives';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {PhoneBookMythPhase} from './content';
import {phoneBookMythStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const directoryRows = [
  ['ALICE', '+1 202 555 0134'],
  ['BOB', '+44 20 7946 0182'],
  ['CAROL', '+49 30 9018 220'],
] as const;

const PhoneBookSheet: React.FC<{readonly crossed: number; readonly reveal: number}> = ({crossed, reveal}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'relative', width: 340, height: 276, boxSizing: 'border-box', padding: '25px 26px', background: theme.surface, borderLeft: `10px solid ${theme.signal}`, opacity: reveal}}>
      <div style={{display: 'flex', justifyContent: 'space-between', color: theme.signal, font: `800 9px ${theme.fontMono}`}}>
        <span>PHONE DIRECTORY</span>
        <span>A–Z</span>
      </div>
      <div style={{marginTop: 23, height: 2, background: theme.line}} />
      {directoryRows.map(([name, number], index) => (
        <div key={name} style={{display: 'grid', gridTemplateColumns: '74px 1fr', gap: 20, padding: '17px 0', borderBottom: `2px solid ${theme.line}`, opacity: 1 - crossed * (0.25 + index * 0.08)}}>
          <span style={{color: theme.text, font: `800 10px ${theme.fontSans}`}}>{name}</span>
          <span style={{color: theme.muted, font: `800 9px ${theme.fontMono}`}}>{number}</span>
        </div>
      ))}
      <div style={{position: 'absolute', left: 22, top: 130, width: 300, height: 10, background: theme.signal, transform: `scaleX(${crossed}) rotate(-24deg)`, transformOrigin: 'left center'}} />
    </div>
  );
};

export const PhoneBookMythDiagram: React.FC<{
  readonly phase: PhoneBookMythPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = phoneBookMythStage[phase.focus];
  const correction = stage === 1 ? phaseProgress : stage > 1 ? 1 : 0;
  const reframe = stage === 2 ? phaseProgress : 0;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 402, width: contentWidth, height: 520, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <PhoneBookSheet crossed={correction} reveal={1 - reframe * 0.55} />
      </div>
      <div style={{position: 'absolute', left: 385, top: 88, color: correction > 0.4 ? theme.signal : theme.muted, font: `800 42px ${theme.fontMono}`, opacity: 1 - reframe}}>≠</div>
      <div style={{position: 'absolute', left: 470, top: 0, width: 390}}>
        <DnsRoutingRecord name="service.example" reveal={clamp01(phaseProgress * 1.5)} tone={stage === 0 ? 'primary' : 'success'} ttl="TTL 30" value="A 203.0.113.42" width={390} />
        <div style={{marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          {[
            ['LOOKUP', 'NAME → VALUE'],
            ['ROUTING', 'VALUE → DESTINATION'],
            ['FAILOVER', 'PRIMARY → BACKUP'],
            ['POLICY', 'TTL → CHANGE SPEED'],
          ].map(([label, detail], index) => {
            const capabilityReveal = stage === 0 ? 0.16 : clamp01(correction * 1.8 - index * 0.12);
            return (
              <div key={label} style={{height: 78, padding: '14px 15px', boxSizing: 'border-box', background: theme.surface, borderTop: `5px solid ${index === 0 ? theme.primary : theme.success}`, opacity: capabilityReveal, transform: `translateY(${(1 - capabilityReveal) * 9}px)`}}>
                <div style={{color: index === 0 ? theme.primary : theme.success, font: `800 9px ${theme.fontMono}`}}>{label}</div>
                <div style={{marginTop: 12, color: theme.muted, font: `800 8px ${theme.fontMono}`}}>{detail}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 344, width: contentWidth, height: 104, display: 'grid', gridTemplateColumns: '1fr 74px 1fr', alignItems: 'center', boxSizing: 'border-box', padding: '18px 22px', background: theme.background, borderTop: `7px solid ${theme.success}`, opacity: reframe, transform: `translateY(${(1 - reframe) * 12}px)`}}>
        <div>
          <div style={{color: theme.signal, font: `800 9px ${theme.fontMono}`}}>DIRECTORY</div>
          <div style={{marginTop: 11, color: theme.muted, font: `800 18px ${theme.fontSans}`, textDecoration: 'line-through'}}>Ищет статичную запись</div>
        </div>
        <div style={{color: theme.success, font: `800 28px ${theme.fontMono}`, textAlign: 'center'}}>→</div>
        <div>
          <div style={{color: theme.success, font: `800 9px ${theme.fontMono}`}}>DNS</div>
          <div style={{marginTop: 11, color: theme.text, font: `800 18px ${theme.fontSans}`}}>Направляет поток</div>
        </div>
      </div>
    </div>
  );
};
