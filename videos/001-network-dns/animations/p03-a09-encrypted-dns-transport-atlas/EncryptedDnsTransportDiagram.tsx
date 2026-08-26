import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {DnsTransportLane, EncryptedDnsTransportPhase} from './content';
import {dnsTransportLanes, encryptedDnsTransportStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const DnsMessageCard: React.FC<{readonly compact?: boolean; readonly reveal: number}> = ({compact = false, reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        width: compact ? 128 : 290,
        height: compact ? 56 : 88,
        boxSizing: 'border-box',
        padding: compact ? '10px 12px' : '15px 18px',
        borderTop: `6px solid ${theme.signal}`,
        background: theme.surface,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 10}px)`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', color: theme.text, font: `800 ${compact ? 10 : 13}px ${theme.fontMono}`}}>
        <span>DNS MESSAGE</span><span style={{color: theme.signal}}>QUERY</span>
      </div>
      <div style={{display: 'flex', gap: compact ? 4 : 7, marginTop: compact ? 8 : 13}}>
        {['ID', 'QNAME', 'QTYPE'].map((field) => (
          <div key={field} style={{flex: field === 'QNAME' ? 1.8 : 1, padding: compact ? '4px 3px' : '7px 6px', background: theme.background, color: theme.muted, font: `700 ${compact ? 6 : 8}px ${theme.fontMono}`, textAlign: 'center'}}>{field}</div>
        ))}
      </div>
    </div>
  );
};

const TransportLane: React.FC<{
  readonly lane: DnsTransportLane;
  readonly index: number;
  readonly active: boolean;
  readonly complete: boolean;
  readonly progress: number;
}> = ({lane, index, active, complete, progress}) => {
  const theme = useChannelTheme();
  const accent = theme[lane.accent];
  const visible = active || complete;
  const reveal = visible ? (active ? progress : 1) : 0.16;
  const layerReveal = lane.layers.map((_, layerIndex) => clamp01(reveal * 1.45 - layerIndex * 0.2));
  const envelopeReveal = layerReveal[1] ?? 0;
  const endpointReveal = layerReveal[2] ?? 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 146 + index * 118,
        width: contentWidth,
        height: 96,
        opacity: visible ? 1 : 0.35,
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, width: 82, height: 96, borderTop: `6px solid ${accent}`, background: theme.surface, textAlign: 'center'}}>
        <div style={{marginTop: 16, color: accent, font: `800 22px ${theme.fontSans}`}}>{lane.shortLabel}</div>
        <div style={{marginTop: 11, color: theme.muted, font: `700 7px ${theme.fontMono}`}}>RFC PATH</div>
      </div>

      <div style={{position: 'absolute', left: 104, top: 19}}>
        <DnsMessageCard compact reveal={layerReveal[0] ?? 0} />
      </div>

      <div style={{position: 'absolute', left: 248, top: 47, width: 42, height: 2, background: theme.line}}>
        <div style={{height: '100%', width: `${envelopeReveal * 100}%`, background: accent}} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 302,
          top: 11,
          width: 368,
          height: 74,
          boxSizing: 'border-box',
          padding: '12px 14px',
          border: `2px solid ${accent}`,
          background: `${theme.background}E8`,
          opacity: envelopeReveal,
          transform: `scaleX(${0.96 + envelopeReveal * 0.04})`,
          transformOrigin: 'left center',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          {lane.layers.slice(1).map((layer, layerIndex) => (
            <React.Fragment key={layer}>
              {layerIndex > 0 ? <span style={{color: theme.muted, font: `700 10px ${theme.fontMono}`}}>OVER</span> : null}
              <div style={{padding: '8px 10px', background: layerIndex === 0 ? accent : theme.surface, color: layerIndex === 0 ? theme.background : theme.text, font: `800 9px ${theme.fontMono}`, opacity: layerReveal[layerIndex + 1] ?? 0}}>{layer}</div>
            </React.Fragment>
          ))}
        </div>
        <div style={{marginTop: 9, color: theme.muted, font: `700 7px ${theme.fontMono}`}}>{lane.note}</div>
      </div>

      <div style={{position: 'absolute', left: 690, top: 11, width: 170, height: 74, boxSizing: 'border-box', padding: '13px 14px', background: theme.surface, borderTop: `5px solid ${accent}`, opacity: endpointReveal}}>
        <div style={{color: theme.muted, font: `700 7px ${theme.fontMono}`}}>DESTINATION</div>
        <div style={{marginTop: 9, color: theme.text, font: `800 12px ${theme.fontSans}`}}>DNS RESOLVER</div>
        <div style={{marginTop: 6, color: accent, font: `800 8px ${theme.fontMono}`}}>ENDPOINT / {lane.endpoint}</div>
      </div>
    </div>
  );
};

export const EncryptedDnsTransportDiagram: React.FC<{
  readonly phase: EncryptedDnsTransportPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = encryptedDnsTransportStage[phase.focus];
  const compare = stage === 4;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 366, width: contentWidth, height: 566, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 290}}>
        <DnsMessageCard reveal={stage === 0 ? phaseProgress : 1} />
      </div>
      <div style={{position: 'absolute', left: 320, top: 0, width: 540, height: 88, boxSizing: 'border-box', padding: '15px 18px', borderLeft: `5px solid ${compare ? theme.success : theme.primary}`, background: `${theme.surface}D8`}}>
        <div style={{color: theme.muted, font: `700 8px ${theme.fontMono}`}}>MENTAL MODEL</div>
        <div style={{marginTop: 12, color: theme.text, font: `800 16px ${theme.fontSans}`}}>ОДИН И ТОТ ЖЕ DNS-ПАКЕТ</div>
        <div style={{marginTop: 7, color: compare ? theme.success : theme.primary, font: `800 9px ${theme.fontMono}`}}>{compare ? 'THREE ENCRYPTED TRANSPORTS' : 'CHOOSE AN OUTER TRANSPORT'}</div>
      </div>

      {dnsTransportLanes.map((lane, index) => {
        const laneStage = index + 1;
        return (
          <TransportLane
            key={lane.id}
            active={stage === laneStage || compare}
            complete={stage > laneStage}
            index={index}
            lane={lane}
            progress={stage === laneStage ? phaseProgress : compare ? 1 : 0}
          />
        );
      })}

      <div style={{position: 'absolute', left: 104, bottom: 2, width: 650, height: 62, boxSizing: 'border-box', padding: '14px 18px', borderLeft: `6px solid ${theme.success}`, background: `${theme.background}EC`, opacity: compare ? phaseProgress : 0, transform: `translateY(${compare ? (1 - phaseProgress) * 12 : 12}px)`}}>
        <div style={{color: theme.success, font: `800 9px ${theme.fontMono}`}}>SHARED JOB</div>
        <div style={{marginTop: 8, color: theme.text, font: `800 14px ${theme.fontSans}`}}>Наблюдатель на пути больше не читает DNS-сообщение</div>
      </div>
    </div>
  );
};
