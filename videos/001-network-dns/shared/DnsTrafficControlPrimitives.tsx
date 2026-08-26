import React from 'react';
import {useChannelTheme} from '@channel/design-system';

export type DnsTrafficTone = 'primary' | 'signal' | 'success';
export type DatacenterState = 'active' | 'standby' | 'offline';

const getToneColor = (
  theme: ReturnType<typeof useChannelTheme>,
  tone: DnsTrafficTone,
): string => {
  if (tone === 'signal') return theme.signal;
  if (tone === 'success') return theme.success;
  return theme.primary;
};

export const DnsRoutingRecord: React.FC<{
  readonly name: string;
  readonly reveal?: number;
  readonly tone?: DnsTrafficTone;
  readonly ttl: string;
  readonly value: string;
  readonly width?: number;
}> = ({name, reveal = 1, tone = 'primary', ttl, value, width = 320}) => {
  const theme = useChannelTheme();
  const accent = getToneColor(theme, tone);

  return (
    <div
      style={{
        width,
        height: 88,
        boxSizing: 'border-box',
        padding: '15px 17px',
        background: theme.surface,
        borderTop: `6px solid ${accent}`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 10}px)`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 12, color: theme.muted, font: `800 8px ${theme.fontMono}`}}>
        <span>{name}</span>
        <span style={{color: accent}}>{ttl}</span>
      </div>
      <div style={{marginTop: 15, color: theme.text, font: `800 15px ${theme.fontMono}`, letterSpacing: -0.3}}>{value}</div>
    </div>
  );
};

export const DnsDatacenterNode: React.FC<{
  readonly detail: string;
  readonly label: string;
  readonly reveal?: number;
  readonly state?: DatacenterState;
  readonly width?: number;
}> = ({detail, label, reveal = 1, state = 'active', width = 190}) => {
  const theme = useChannelTheme();
  const accent = state === 'offline' ? theme.signal : state === 'standby' ? theme.primary : theme.success;
  const stateLabel = state === 'offline' ? 'UNREACHABLE' : state === 'standby' ? 'STANDBY' : 'SERVING';

  return (
    <div
      style={{
        width,
        height: 82,
        boxSizing: 'border-box',
        padding: '14px 15px',
        background: theme.surface,
        borderLeft: `6px solid ${accent}`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 10}px)`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 10}}>
        <span style={{color: theme.text, font: `800 13px ${theme.fontSans}`}}>{label}</span>
        <span style={{color: accent, font: `800 7px ${theme.fontMono}`}}>{stateLabel}</span>
      </div>
      <div style={{marginTop: 14, color: theme.muted, font: `800 8px ${theme.fontMono}`}}>{detail}</div>
    </div>
  );
};

export const DnsTrafficSource: React.FC<{
  readonly label: string;
  readonly reveal?: number;
  readonly tone?: DnsTrafficTone;
  readonly width?: number;
}> = ({label, reveal = 1, tone = 'primary', width = 150}) => {
  const theme = useChannelTheme();
  const accent = getToneColor(theme, tone);

  return (
    <div style={{width, height: 48, boxSizing: 'border-box', padding: '13px 14px', background: theme.background, borderTop: `5px solid ${accent}`, color: accent, font: `800 9px ${theme.fontMono}`, opacity: reveal}}>
      {label}
    </div>
  );
};
