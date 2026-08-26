import React from 'react';
import {interpolate} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp, clamp01} from '@channel/motion-core';
import {DnsDatacenterNode, DnsRoutingRecord} from '../../shared/DnsTrafficControlPrimitives';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {DnsControlLeverPhase} from './content';
import {authorityReplicas, controlledDestinations, dnsControlLeverStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const ControlLever: React.FC<{readonly progress: number}> = ({progress}) => {
  const theme = useChannelTheme();
  const handleTop = interpolate(progress, [0, 1], [36, 214], clamp);

  return (
    <div style={{position: 'relative', width: 184, height: 310, boxSizing: 'border-box', padding: '18px 18px', background: theme.surface, borderTop: `7px solid ${theme.success}`}}>
      <div style={{color: theme.success, font: `800 9px ${theme.fontMono}`}}>DNS LEVER</div>
      <div style={{position: 'absolute', left: 83, top: 54, width: 14, height: 210, background: theme.line}} />
      <div style={{position: 'absolute', left: 52, top: 54 + handleTop, width: 76, height: 20, background: theme.success, transform: 'translateY(-50%)'}} />
      <div style={{position: 'absolute', left: 18, top: 54, color: theme.muted, font: `800 7px ${theme.fontMono}`}}>LOOKUP</div>
      <div style={{position: 'absolute', left: 18, bottom: 41, color: theme.success, font: `800 7px ${theme.fontMono}`}}>CONTROL</div>
      <div style={{position: 'absolute', left: 18, bottom: 16, color: theme.text, font: `800 10px ${theme.fontSans}`}}>ROUTE THE SYSTEM</div>
    </div>
  );
};

const ReplicaLayer: React.FC<{readonly opacity: number; readonly progress: number}> = ({opacity, progress}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <svg viewBox={`0 0 ${contentWidth} 300`} style={{position: 'absolute', inset: 0, width: contentWidth, height: 300}}>
        {[140, 430, 720].map((x, index) => (
          <path key={x} d={`M${x} 82 C${x} 154 430 154 430 224`} fill="none" pathLength={1} stroke={index === 1 ? theme.signal : theme.primary} strokeDasharray="1" strokeDashoffset={1 - clamp01(progress * 1.6 - index * 0.12)} strokeWidth="5" />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 0, top: 0, width: contentWidth, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28}}>
        {authorityReplicas.map((replica, index) => (
          <DnsDatacenterNode key={replica.label} label={replica.label} detail={replica.detail} reveal={clamp01(progress * 1.8 - index * 0.12)} state="active" width={268} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 250, top: 224}}>
        <DnsRoutingRecord name="GLOBAL ZONE DATA" reveal={progress} tone="primary" ttl="REPLICATED" value="NAME / TTL / TYPE / VALUE" width={360} />
      </div>
    </div>
  );
};

export const DnsControlLeverDiagram: React.FC<{
  readonly phase: DnsControlLeverPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = dnsControlLeverStage[phase.focus];
  const controlReveal = stage === 1 ? phaseProgress : stage > 1 ? 1 : 0;
  const engineeringReveal = stage === 2 ? phaseProgress : stage > 2 ? 1 : 0;
  const leverReveal = stage === 3 ? phaseProgress : 0;
  const replicaOpacity = stage === 0 ? 1 : Math.max(0, 1 - controlReveal * 1.6);
  const hasSwitchedRoute = stage >= 3 && phaseProgress > 0.55;
  const routeValue = hasSwitchedRoute ? 'A 203.0.113.42 / BACKUP' : 'A 203.0.113.10 / PRIMARY';
  const controlLeft = stage >= 3 ? 216 : 0;
  const controlWidth = stage >= 3 ? 644 : contentWidth;
  const nodeWidth = stage >= 3 ? 313 : 421;
  const columnGap = 18;
  const recordCenter = controlLeft + controlWidth / 2;
  const leftColumnCenter = controlLeft + nodeWidth / 2;
  const rightColumnCenter = controlLeft + nodeWidth + columnGap + nodeWidth / 2;
  const routeDraw = clamp01(controlReveal * 1.5);

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 394, width: contentWidth, height: 560, opacity: reveal}}>
      <ReplicaLayer opacity={replicaOpacity} progress={stage === 0 ? phaseProgress : 1} />

      <div style={{position: 'absolute', left: 0, top: 0, width: contentWidth, height: 420, opacity: controlReveal}}>
        <div style={{position: 'absolute', left: controlLeft, top: 0}}>
          <DnsRoutingRecord name="service.example.com" tone={stage >= 3 ? 'success' : 'primary'} ttl="TTL 30" value={routeValue} width={controlWidth} />
        </div>
        <svg viewBox={`0 0 ${contentWidth} 330`} style={{position: 'absolute', left: 0, top: 0, width: contentWidth, height: 330}}>
          <path d={`M${recordCenter} 88 V132 H${leftColumnCenter} V176`} fill="none" pathLength={1} stroke={theme.primary} strokeDasharray="1" strokeDashoffset={1 - routeDraw} strokeWidth="5" />
          <path d={`M${recordCenter} 132 H${rightColumnCenter} V176`} fill="none" pathLength={1} stroke={theme.primary} strokeDasharray="1" strokeDashoffset={1 - routeDraw} strokeWidth="5" />
          <path d={`M${leftColumnCenter} 258 V276`} fill="none" pathLength={1} stroke={hasSwitchedRoute ? theme.signal : theme.primary} strokeDasharray="1" strokeDashoffset={1 - routeDraw} strokeWidth="5" />
          <path d={`M${rightColumnCenter} 258 V276`} fill="none" pathLength={1} stroke={hasSwitchedRoute ? theme.success : theme.line} strokeDasharray="1" strokeDashoffset={1 - routeDraw} strokeWidth="5" />
        </svg>
        <div style={{position: 'absolute', left: controlLeft, top: 176, width: controlWidth, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: columnGap}}>
          {controlledDestinations.map((destination, index) => {
            const detail = index === 2 && hasSwitchedRoute ? 'DRAINED' : index === 3 && hasSwitchedRoute ? 'ACTIVE' : destination.detail;
            const state = index === 3 ? (hasSwitchedRoute ? 'active' : 'standby') : index === 2 && hasSwitchedRoute ? 'offline' : 'active';

            return <DnsDatacenterNode key={destination.label} label={destination.label} detail={detail} reveal={clamp01(controlReveal * 1.7 - index * 0.1)} state={state} width={nodeWidth} />;
          })}
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 408, width: contentWidth, height: 78, display: 'grid', gridTemplateColumns: '1fr 78px 1fr', alignItems: 'center', padding: '14px 18px', boxSizing: 'border-box', background: theme.surface, borderLeft: `7px solid ${theme.signal}`, opacity: engineeringReveal * (1 - leverReveal)}}>
        <span style={{color: theme.muted, font: `800 15px ${theme.fontSans}`, textDecoration: 'line-through'}}>ПРОСТО СПРАВОЧНИК</span>
        <span style={{color: theme.success, font: `800 24px ${theme.fontMono}`, textAlign: 'center'}}>→</span>
        <span style={{color: theme.text, font: `800 17px ${theme.fontSans}`}}>ТОЧКА УПРАВЛЕНИЯ ТРАФИКОМ</span>
      </div>

      <div style={{position: 'absolute', left: 0, top: 0, opacity: leverReveal, transform: `translateX(${(1 - leverReveal) * -18}px)`}}>
        <ControlLever progress={leverReveal} />
      </div>
      <div style={{position: 'absolute', left: 216, top: 500, width: 644, height: 5, background: theme.line, opacity: leverReveal}}>
        <div style={{width: `${leverReveal * 100}%`, height: '100%', background: theme.success}} />
      </div>
    </div>
  );
};
