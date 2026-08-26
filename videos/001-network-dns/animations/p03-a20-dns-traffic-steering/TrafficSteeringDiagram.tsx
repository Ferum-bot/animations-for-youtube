import React from 'react';
import {interpolate} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp, clamp01} from '@channel/motion-core';
import {DnsDatacenterNode, DnsRoutingRecord, DnsTrafficSource} from '../../shared/DnsTrafficControlPrimitives';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {TrafficSteeringPhase} from './content';
import {trafficRegions, trafficSteeringStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const columnWidth = 264;
const columnGap = 34;

export const TrafficSteeringDiagram: React.FC<{
  readonly phase: TrafficSteeringPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = trafficSteeringStage[phase.focus];
  const failover = stage >= 1;
  const ttlResolved = stage >= 2;
  const rerouteProgress = failover ? (stage === 1 ? phaseProgress : 1) : 0;
  const ttlValue = stage < 2 ? 30 : Math.round(interpolate(phaseProgress, [0, 0.64, 1], [30, 0, 30], clamp));
  const activeRecordValue = ttlResolved && phaseProgress > 0.64 ? 'A 203.0.113.42 / BACKUP' : failover ? 'A 203.0.113.10 / PRIMARY' : 'A / GEO ANSWER / NEAREST';

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 394, width: contentWidth, height: 560, opacity: reveal}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: columnGap}}>
        {trafficRegions.map((region, index) => {
          const affected = index === 1;
          const backupReveal = affected && failover ? rerouteProgress : 0;
          return (
            <div key={region.source} style={{position: 'relative', width: columnWidth, height: 330}}>
              <div style={{position: 'absolute', left: 57, top: 0}}>
                <DnsTrafficSource label={region.source} reveal={clamp01(phaseProgress * 1.7 - index * 0.09)} tone={affected && failover ? 'signal' : 'success'} />
              </div>
              <svg viewBox={`0 0 ${columnWidth} 250`} style={{position: 'absolute', left: 0, top: 38, width: columnWidth, height: 250, overflow: 'visible'}}>
                <path d="M132 8 C132 74 132 108 132 157" fill="none" stroke={affected && failover ? theme.signal : theme.success} strokeWidth="7" opacity={affected && failover ? 1 - rerouteProgress * 0.68 : 1} />
                {affected && failover ? (
                  <path d="M132 8 C62 94 62 160 132 236" fill="none" pathLength={1} stroke={theme.primary} strokeDasharray="1" strokeDashoffset={1 - rerouteProgress} strokeWidth="7" />
                ) : null}
                <rect x={125} y={72 + index * 17} width={14} height={14} fill={affected && failover ? theme.signal : theme.success} transform={`rotate(45 132 ${79 + index * 17})`} />
              </svg>
              <div style={{position: 'absolute', left: 37, top: 194}}>
                <DnsDatacenterNode detail={region.detail} label={`${region.primary} / PRIMARY`} state={affected && failover ? 'offline' : 'active'} width={190} />
              </div>
              {affected ? (
                <div style={{position: 'absolute', left: 37, top: 286}}>
                  <DnsDatacenterNode detail="203.0.113.42" label={`${region.backup} / BACKUP`} reveal={backupReveal} state={ttlResolved && phaseProgress > 0.64 ? 'active' : 'standby'} width={190} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 0, top: 390, width: contentWidth, display: 'grid', gridTemplateColumns: '1fr 178px', gap: 14}}>
        <DnsRoutingRecord name="api.example.com" tone={failover ? (ttlResolved && phaseProgress > 0.64 ? 'success' : 'signal') : 'primary'} ttl={`TTL ${ttlValue}`} value={activeRecordValue} width={668} />
        <div style={{height: 88, boxSizing: 'border-box', padding: '15px 17px', background: theme.surface, borderTop: `6px solid ${ttlValue === 0 ? theme.success : failover ? theme.signal : theme.primary}`}}>
          <div style={{color: theme.muted, font: `800 8px ${theme.fontMono}`}}>CACHE WINDOW</div>
          <div style={{marginTop: 11, color: ttlValue === 0 ? theme.success : failover ? theme.signal : theme.primary, font: `800 24px ${theme.fontSans}`}}>{ttlValue}s</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 500, width: contentWidth, display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `800 8px ${theme.fontMono}`}}>
        <span>ANSWER CHANGES AFTER CACHE EXPIRATION</span>
        <span style={{color: ttlResolved ? theme.success : theme.primary}}>{ttlResolved ? 'NEW ROUTE / ACTIVE' : 'CURRENT ROUTE / ACTIVE'}</span>
      </div>
    </div>
  );
};
