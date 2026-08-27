import React from 'react';
import {interpolate} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp} from '@channel/motion-core';
import {DnsDatacenterNode, DnsRoutingRecord} from '../../../shared/DnsTrafficControlPrimitives';
import {ConclusionPath, ConclusionTag} from '../ConclusionPrimitives';
import {progressBetween} from '../motion';

const destinations = [
  {label: 'EDGE / EU', detail: '198.51.100.10'},
  {label: 'EDGE / US', detail: '203.0.113.42'},
  {label: 'BACKUP', detail: '192.0.2.18'},
] as const;

export const LookupControlScene: React.FC<{readonly elapsedMs: number}> = ({elapsedMs}) => {
  const theme = useChannelTheme();
  const engineerReveal = progressBetween(elapsedMs, 46_680, 47_420);
  const lookupReveal = progressBetween(elapsedMs, 50_280, 50_940);
  const controlReveal = progressBetween(elapsedMs, 52_200, 52_940);
  const recordLeft = interpolate(controlReveal, [0, 1], [180, 0], clamp);
  const recordWidth = interpolate(controlReveal, [0, 1], [500, 860], clamp);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 286, top: 6}}>
        <ConclusionTag label={controlReveal > 0.5 ? 'CONTROL PLANE' : 'ENGINEERING MODEL'} tone={controlReveal > 0.5 ? 'success' : 'signal'} reveal={engineerReveal} />
      </div>

      <div style={{position: 'absolute', left: recordLeft, top: 64}}>
        <DnsRoutingRecord name="service.example.com" tone={controlReveal > 0.5 ? 'success' : 'primary'} ttl="TTL 30" value="A 203.0.113.42" width={recordWidth} reveal={engineerReveal} />
      </div>

      <div style={{position: 'absolute', left: 180, top: 184, width: 500, height: 92, boxSizing: 'border-box', padding: '25px 28px', background: theme.surface, opacity: engineerReveal * (1 - controlReveal)}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 48px 1fr', alignItems: 'center', color: theme.text, font: `900 23px ${theme.fontMono}`}}>
          <span>NAME</span>
          <span style={{color: theme.primary}}>→</span>
          <span>IP</span>
        </div>
        <div style={{marginTop: 13, color: theme.muted, font: `800 8px ${theme.fontMono}`, opacity: lookupReveal}}>CORRECT — BUT INCOMPLETE MODEL</div>
      </div>

      <svg viewBox="0 0 860 390" style={{position: 'absolute', left: 0, top: 0, width: 860, height: 390, opacity: controlReveal}}>
        <ConclusionPath d="M430 152 V210 H138 V256" progress={controlReveal} tone="success" />
        <ConclusionPath d="M430 210 V256" progress={controlReveal} tone="success" />
        <ConclusionPath d="M430 210 H722 V256" progress={controlReveal} tone="primary" />
      </svg>

      <div style={{position: 'absolute', left: 0, top: 256, width: 860, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, opacity: controlReveal}}>
        {destinations.map((destination, index) => (
          <DnsDatacenterNode key={destination.label} label={destination.label} detail={destination.detail} state={index === 2 ? 'standby' : 'active'} reveal={progressBetween(controlReveal, index * 0.16, Math.min(1, index * 0.16 + 0.55))} width={276} />
        ))}
      </div>

      <div style={{position: 'absolute', left: 0, top: 376, width: 860, height: 76, boxSizing: 'border-box', padding: '20px 22px', background: theme.surface, borderLeft: `7px solid ${theme.success}`, opacity: controlReveal}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{color: theme.muted, font: `800 12px ${theme.fontSans}`, textDecoration: 'line-through'}}>RESOLVE ONLY</span>
          <span style={{color: theme.success, font: `900 18px ${theme.fontSans}`}}>ONE RECORD → WHOLE TRAFFIC FLOW</span>
        </div>
      </div>
    </div>
  );
};
