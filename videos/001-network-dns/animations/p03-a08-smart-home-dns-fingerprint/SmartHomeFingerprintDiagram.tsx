import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {SmartHomeDevice, SmartHomeFingerprintPhase} from './content';
import {smartHomeDevices, smartHomeFingerprintStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const deviceAccent = {
  camera: 'signal',
  television: 'primary',
  speaker: 'success',
} as const satisfies Record<SmartHomeDevice['id'], 'primary' | 'signal' | 'success'>;

const DeviceIcon: React.FC<{readonly device: SmartHomeDevice; readonly active: boolean}> = ({device, active}) => {
  const theme = useChannelTheme();
  const accent = theme[deviceAccent[device.id]];
  const common = {position: 'relative' as const, margin: '0 auto', opacity: active ? 1 : 0.58};

  if (device.id === 'camera') {
    return (
      <div style={{...common, width: 62, height: 38, border: `3px solid ${accent}`, background: theme.background}}>
        <div style={{position: 'absolute', left: 20, top: 8, width: 16, height: 16, border: `3px solid ${accent}`, borderRadius: '50%'}} />
        <div style={{position: 'absolute', right: -15, top: 9, width: 12, height: 16, background: accent, clipPath: 'polygon(0 25%, 100% 0, 100% 100%, 0 75%)'}} />
      </div>
    );
  }

  if (device.id === 'television') {
    return (
      <div style={{...common, width: 72, height: 48, border: `3px solid ${accent}`, background: theme.background}}>
        <div style={{position: 'absolute', left: 31, bottom: -10, width: 10, height: 8, background: accent}} />
        <div style={{position: 'absolute', left: 20, bottom: -13, width: 32, height: 3, background: accent}} />
      </div>
    );
  }

  return (
    <div style={{...common, width: 48, height: 56, border: `3px solid ${accent}`, borderRadius: '24px 24px 12px 12px', background: theme.background}}>
      <div style={{position: 'absolute', left: 11, top: 16, width: 20, height: 12, borderTop: `3px solid ${accent}`, borderBottom: `3px solid ${accent}`}} />
    </div>
  );
};

const DeviceNode: React.FC<{
  readonly device: SmartHomeDevice;
  readonly active: boolean;
  readonly reveal: number;
}> = ({device, active, reveal}) => {
  const theme = useChannelTheme();
  const accent = theme[deviceAccent[device.id]];

  return (
    <div
      style={{
        position: 'absolute',
        left: device.x,
        top: device.y,
        width: 116,
        textAlign: 'center',
        opacity: reveal * (active ? 1 : 0.62),
        transform: `translateY(${(1 - reveal) * 10}px)`,
      }}
    >
      <DeviceIcon active={active} device={device} />
      <div style={{marginTop: 12, color: active ? theme.text : theme.muted, font: `800 9px ${theme.fontMono}`}}>{device.label}</div>
      <div style={{width: active ? 54 : 22, height: 3, margin: '8px auto 0', background: accent}} />
    </div>
  );
};

const QueryPath: React.FC<{
  readonly device: SmartHomeDevice;
  readonly index: number;
  readonly progress: number;
  readonly identified: boolean;
}> = ({device, index, progress, identified}) => {
  const theme = useChannelTheme();
  const accent = theme[deviceAccent[device.id]];
  const startX = device.x + 116;
  const startY = device.y + 28;
  const endX = 532;
  const lineWidth = Math.max(0, endX - startX);
  const staggeredProgress = clamp01(progress * 1.42 - index * 0.22);

  return (
    <>
      <div style={{position: 'absolute', left: startX, top: startY, width: lineWidth, height: 2, background: theme.line}}>
        <div style={{width: `${staggeredProgress * 100}%`, height: '100%', background: accent}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: startX + lineWidth * staggeredProgress - 5,
          top: startY - 4,
          width: 10,
          height: 10,
          background: accent,
          transform: 'rotate(45deg)',
          opacity: staggeredProgress > 0 && staggeredProgress < 1 ? 1 : 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 346,
          top: startY - 22,
          width: 180,
          color: identified ? accent : theme.muted,
          font: `700 8px ${theme.fontMono}`,
          textAlign: 'right',
          opacity: staggeredProgress,
        }}
      >
        {device.domain}
      </div>
    </>
  );
};

const ActivityTimeline: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();
  const pulses = [0.08, 0.13, 0.19, 0.46, 0.51, 0.55, 0.62, 0.71, 0.76, 0.81, 0.89] as const;

  return (
    <div style={{position: 'absolute', left: 0, top: 420, width: contentWidth, height: 104, opacity: reveal, transform: `translateY(${(1 - reveal) * 12}px)`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
        <span>DNS ACTIVITY / 24 HOURS</span>
        <span style={{color: theme.success}}>PRESENCE LIKELY / 18:00–23:00</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 43, height: 2, background: theme.line}}>
        <div style={{position: 'absolute', left: '72%', width: '22%', top: -13, height: 28, background: `${theme.success}28`, borderLeft: `3px solid ${theme.success}`, borderRight: `3px solid ${theme.success}`}} />
        {pulses.map((position, index) => (
          <div
            key={position}
            style={{
              position: 'absolute',
              left: `${position * 100}%`,
              bottom: 0,
              width: 4,
              height: 12 + (index % 3) * 8,
              background: position >= 0.71 ? theme.success : index % 2 === 0 ? theme.primary : theme.signal,
            }}
          />
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 62, display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
        <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
      </div>
    </div>
  );
};

export const SmartHomeFingerprintDiagram: React.FC<{
  readonly phase: SmartHomeFingerprintPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = smartHomeFingerprintStage[phase.focus];
  const showQueries = stage >= 1;
  const showIdentity = stage >= 2;
  const showActivity = stage >= 3;
  const queryProgress = showQueries ? (stage === 1 ? phaseProgress : 1) : 0;
  const identityProgress = showIdentity ? (stage === 2 ? phaseProgress : 1) : 0;
  const activityProgress = showActivity ? phaseProgress : 0;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 376, width: contentWidth, height: 560, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 28, width: 470, height: 340, borderLeft: `2px solid ${theme.line}`, borderRight: `2px solid ${theme.line}`, borderBottom: `2px solid ${theme.line}`}}>
        <div style={{position: 'absolute', left: -2, top: -64, width: 474, height: 92, background: theme.surface, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'}} />
        <div style={{position: 'absolute', left: 20, top: 10, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>ТВОЙ ДОМ / LOCAL NETWORK</div>
        {smartHomeDevices.map((device, index) => (
          <React.Fragment key={device.id}>
            <DeviceNode active={stage === 0 || stage >= 2} device={device} reveal={clamp01(reveal * 1.4 - index * 0.12)} />
            <QueryPath device={device} identified={showIdentity} index={index} progress={queryProgress} />
          </React.Fragment>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 548,
          top: 4,
          width: 312,
          height: 364,
          boxSizing: 'border-box',
          padding: '22px 20px',
          borderTop: `7px solid ${showIdentity ? theme.signal : theme.primary}`,
          background: `${theme.surface}F2`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
          <span>PASSIVE DNS VIEW</span><span style={{color: showIdentity ? theme.signal : theme.primary}}>OBSERVER</span>
        </div>
        <div style={{marginTop: 18, color: theme.text, font: `800 19px ${theme.fontSans}`}}>ВИДНЫ ИМЕНА СЕРВИСОВ</div>
        <div style={{height: 2, margin: '18px 0 8px', background: theme.line}} />
        {smartHomeDevices.map((device, index) => {
          const rowReveal = clamp01(identityProgress * 1.5 - index * 0.24);
          const accent = theme[deviceAccent[device.id]];
          return (
            <div key={device.id} style={{height: 67, paddingTop: 12, boxSizing: 'border-box', borderBottom: `1px solid ${theme.line}`, opacity: showQueries ? 1 : 0.3}}>
              <div style={{color: theme.muted, font: `700 8px ${theme.fontMono}`}}>{device.domain}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, opacity: rowReveal}}>
                <div style={{width: 8, height: 8, background: accent, transform: 'rotate(45deg)'}} />
                <div style={{color: theme.text, font: `800 11px ${theme.fontSans}`}}>{device.label}</div>
                <div style={{marginLeft: 'auto', color: accent, font: `800 8px ${theme.fontMono}`}}>MATCH</div>
              </div>
            </div>
          );
        })}
        <div style={{marginTop: 15, color: showIdentity ? theme.signal : theme.muted, font: `800 9px ${theme.fontMono}`}}>
          {showIdentity ? 'DEVICE CLASS INFERRED' : 'COLLECTING DNS NAMES'}
        </div>
      </div>

      <ActivityTimeline reveal={activityProgress} />
    </div>
  );
};
