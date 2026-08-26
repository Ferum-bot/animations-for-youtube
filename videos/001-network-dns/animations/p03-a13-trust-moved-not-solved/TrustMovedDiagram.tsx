import React from 'react';
import {interpolate} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp} from '@channel/motion-core';
import {DnsBrowserGlyph, DnsObserverEye, DnsOperatorGlyph} from '../../shared/DnsPrivacyActors';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {TrustMovedPhase} from './content';
import {trustMovedStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const Endpoint: React.FC<{
  readonly accent: string;
  readonly label: string;
  readonly active: boolean;
  readonly glyph: React.ReactNode;
  readonly left: number;
}> = ({accent, label, active, glyph, left}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'absolute', left, top: 18, width: 170, height: 134, boxSizing: 'border-box', padding: '15px 16px', background: theme.surface, borderTop: `6px solid ${active ? accent : theme.line}`, opacity: active ? 1 : 0.48}}>
      <div style={{color: active ? accent : theme.muted, font: `800 8px ${theme.fontMono}`}}>{label}</div>
      <div style={{position: 'absolute', left: 16, bottom: 14}}>{glyph}</div>
    </div>
  );
};

export const TrustMovedDiagram: React.FC<{
  readonly phase: TrustMovedPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = trustMovedStage[phase.focus];
  const channelHidden = stage >= 1;
  const endpointVisible = stage >= 2;
  const verdict = stage >= 3;
  const routeProgress = channelHidden ? (stage === 1 ? phaseProgress : 1) : 0;
  const trustProgress = verdict ? phaseProgress : 0;
  const tokenLeft = interpolate(trustProgress, [0, 1], [342, 672], clamp);

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 390, width: contentWidth, height: 510, opacity: reveal}}>
      <Endpoint accent={theme.success} active glyph={<DnsBrowserGlyph accent={theme.success} encrypted />} label="BROWSER" left={0} />
      <Endpoint accent={theme.signal} active={!channelHidden} glyph={<DnsOperatorGlyph accent={channelHidden ? theme.muted : theme.signal} kind="provider" />} label="ISP / PATH" left={345} />
      <Endpoint accent={theme.primary} active={endpointVisible} glyph={<DnsOperatorGlyph accent={endpointVisible ? theme.primary : theme.muted} kind="resolver" />} label="CHOSEN RESOLVER" left={690} />

      <svg viewBox={`0 0 ${contentWidth} 230`} style={{position: 'absolute', left: 0, top: 0, width: contentWidth, height: 230, overflow: 'visible'}}>
        <path d="M170 84 C315 210 545 210 690 84" fill="none" pathLength={1} stroke={theme.success} strokeDasharray="1" strokeDashoffset={1 - routeProgress} strokeWidth="8" />
      </svg>
      <div style={{position: 'absolute', left: 226, top: 177, width: 408, textAlign: 'center', color: theme.success, font: `800 9px ${theme.fontMono}`, opacity: routeProgress}}>ENCRYPTED CHANNEL</div>

      <div style={{position: 'absolute', left: 398, top: 214, opacity: channelHidden ? 1 : 0}}>
        <DnsObserverEye accent={theme.signal} crossed />
        <div style={{marginTop: 8, marginLeft: -23, width: 100, color: theme.signal, font: `800 8px ${theme.fontMono}`, textAlign: 'center'}}>PATH CAN'T READ</div>
      </div>
      <div style={{position: 'absolute', left: 748, top: 214, opacity: endpointVisible ? phaseProgress : 0}}>
        <DnsObserverEye accent={theme.primary} />
        <div style={{marginTop: 8, marginLeft: -21, width: 96, color: theme.primary, font: `800 8px ${theme.fontMono}`, textAlign: 'center'}}>RESOLVER CAN</div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 326, width: contentWidth, height: 3, background: theme.line}} />
      <div style={{position: 'absolute', left: tokenLeft, top: 296, width: 188, height: 66, boxSizing: 'border-box', padding: '12px 15px', background: theme.background, border: `3px solid ${verdict ? theme.signal : theme.primary}`, opacity: endpointVisible ? 1 : 0}}>
        <div style={{color: verdict ? theme.signal : theme.primary, font: `800 8px ${theme.fontMono}`}}>TRUST TOKEN</div>
        <div style={{marginTop: 8, color: theme.text, font: `800 12px ${theme.fontSans}`}}>ИСТОРИЯ ЗАПРОСОВ</div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 404, width: contentWidth, height: 72, boxSizing: 'border-box', padding: '15px 18px', background: theme.surface, borderLeft: `7px solid ${theme.signal}`, opacity: verdict ? phaseProgress : 0, transform: `translateY(${verdict ? (1 - phaseProgress) * 10 : 10}px)`}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <span style={{color: theme.muted, font: `800 11px ${theme.fontSans}`, textDecoration: 'line-through'}}>ДОВЕРИЕ УДАЛЕНО</span>
          <span style={{color: theme.signal, font: `800 20px ${theme.fontSans}`}}>ДОВЕРИЕ ПЕРЕНЕСЕНО</span>
        </div>
        <div style={{marginTop: 9, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>DoH SOLVES THE CHANNEL — NOT THE OPERATOR</div>
      </div>
    </div>
  );
};
