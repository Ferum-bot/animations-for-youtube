import React from 'react';
import {interpolate} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp, clamp01} from '@channel/motion-core';
import {DnsBrowserGlyph, DnsObserverEye, DnsOperatorGlyph} from '../../shared/DnsPrivacyActors';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {ResolverOwnershipPhase} from './content';
import {resolverOwnershipStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

type ActorProps = {
  readonly active: boolean;
  readonly accent: string;
  readonly eyebrow: string;
  readonly label: string;
  readonly children: React.ReactNode;
};

const Actor: React.FC<ActorProps> = ({active, accent, eyebrow, label, children}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'relative', width: 178, height: 150, boxSizing: 'border-box', padding: '16px 17px', background: `${theme.surface}${active ? 'F7' : 'A8'}`, borderTop: `6px solid ${active ? accent : theme.line}`, opacity: active ? 1 : 0.52}}>
      <div style={{color: active ? accent : theme.muted, font: `800 8px ${theme.fontMono}`, letterSpacing: 0.8}}>{eyebrow}</div>
      <div style={{position: 'absolute', left: 16, bottom: 16}}>{children}</div>
      <div style={{position: 'absolute', left: 105, top: 70, width: 56, color: theme.text, font: `800 12px ${theme.fontSans}`, lineHeight: 1.05}}>{label}</div>
    </div>
  );
};

const QueryHistoryToken: React.FC<{readonly progress: number; readonly visible: number}> = ({progress, visible}) => {
  const theme = useChannelTheme();
  const left = interpolate(progress, [0, 1], [330, 682], clamp);
  const accent = progress > 0.55 ? theme.primary : theme.signal;

  return (
    <div style={{position: 'absolute', left, top: 190, width: 166, height: 52, boxSizing: 'border-box', padding: '10px 13px', background: theme.background, border: `2px solid ${accent}`, opacity: visible, transform: `translateY(${Math.sin(progress * Math.PI) * -34}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 9}}>
        <DnsObserverEye accent={accent} />
        <div>
          <div style={{color: accent, font: `800 8px ${theme.fontMono}`}}>QUERY HISTORY</div>
          <div style={{marginTop: 5, color: theme.text, font: `800 10px ${theme.fontSans}`}}>КТО ВИДИТ?</div>
        </div>
      </div>
    </div>
  );
};

const PolicyTool: React.FC<{readonly label: string; readonly disabled: boolean; readonly left: number}> = ({label, disabled, left}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'absolute', left, top: 354, width: 162, height: 58, boxSizing: 'border-box', padding: '14px 13px', borderLeft: `5px solid ${disabled ? theme.signal : theme.success}`, background: theme.surface, opacity: disabled ? 0.42 : 1}}>
      <div style={{color: disabled ? theme.muted : theme.text, font: `800 9px ${theme.fontSans}`}}>{label}</div>
      <div style={{marginTop: 8, color: disabled ? theme.signal : theme.success, font: `800 7px ${theme.fontMono}`}}>{disabled ? 'NO DNS VISIBILITY' : 'LOCAL DNS POLICY'}</div>
      {disabled ? <div style={{position: 'absolute', left: 8, right: 8, top: 27, height: 3, background: theme.signal, transform: 'rotate(-8deg)'}} /> : null}
    </div>
  );
};

export const ResolverOwnershipShiftDiagram: React.FC<{
  readonly phase: ResolverOwnershipPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = resolverOwnershipStage[phase.focus];
  const encrypted = stage >= 1;
  const chosenRoute = stage >= 2;
  const controlShift = stage >= 3;
  const toolsDisabled = stage >= 4;
  const showChoice = stage >= 5;
  const showDefault = stage >= 6;
  const tunnelProgress = chosenRoute ? (stage === 2 ? phaseProgress : 1) : encrypted ? phaseProgress * 0.42 : 0;
  const historyProgress = controlShift ? (stage === 3 ? phaseProgress : 1) : 0;
  const providerRouteOpacity = chosenRoute ? 0.2 : 1;
  const choiceReveal = showChoice ? (stage === 5 ? phaseProgress : 1) : 0;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 370, width: contentWidth, height: 570, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <Actor active accent={encrypted ? theme.success : theme.signal} eyebrow="YOUR PROCESS" label="БРАУЗЕР">
          <DnsBrowserGlyph accent={encrypted ? theme.success : theme.signal} encrypted={encrypted} />
        </Actor>
      </div>
      <div style={{position: 'absolute', left: 340, top: 0}}>
        <Actor active={!chosenRoute} accent={theme.signal} eyebrow="LOCAL OPERATOR" label="ПРОВАЙДЕР">
          <DnsOperatorGlyph accent={!chosenRoute ? theme.signal : theme.muted} kind="provider" />
        </Actor>
      </div>
      <div style={{position: 'absolute', right: 0, top: 0}}>
        <Actor active={chosenRoute} accent={theme.primary} eyebrow="REMOTE OPERATOR" label="ВЫБРАННЫЙ DNS">
          <DnsOperatorGlyph accent={chosenRoute ? theme.primary : theme.muted} kind="resolver" />
        </Actor>
      </div>

      <svg viewBox={`0 0 ${contentWidth} 260`} style={{position: 'absolute', left: 0, top: 0, width: contentWidth, height: 260, overflow: 'visible'}}>
        <path d="M178 78 H340" fill="none" stroke={theme.signal} strokeWidth="6" opacity={providerRouteOpacity} />
        <path d="M178 73 C350 170 520 170 682 73" fill="none" pathLength={1} stroke={theme.success} strokeDasharray="1" strokeDashoffset={1 - tunnelProgress} strokeWidth="7" />
      </svg>
      <div style={{position: 'absolute', left: 220, top: 42, color: theme.signal, font: `800 8px ${theme.fontMono}`, opacity: providerRouteOpacity}}>PLAIN DNS</div>
      <div style={{position: 'absolute', left: 352, top: 158, color: theme.success, font: `800 8px ${theme.fontMono}`, opacity: clamp01(tunnelProgress * 1.6)}}>ENCRYPTED DoH TUNNEL</div>

      <QueryHistoryToken progress={historyProgress} visible={controlShift ? 1 : stage === 0 ? phaseProgress : 0} />

      <div style={{position: 'absolute', left: 340, top: 286, width: 340, height: 2, background: theme.line}}>
        <div style={{width: `${historyProgress * 100}%`, height: '100%', background: theme.primary}} />
      </div>
      <div style={{position: 'absolute', left: 340, top: 300, color: theme.muted, font: `700 7px ${theme.fontMono}`}}>TRUST CONTROL</div>
      <div style={{position: 'absolute', left: 608, top: 300, color: historyProgress > 0.78 ? theme.primary : theme.muted, font: `800 7px ${theme.fontMono}`}}>MOVED</div>

      <PolicyTool disabled={toolsDisabled} label="MALWARE FILTER" left={340} />
      <PolicyTool disabled={toolsDisabled} label="PARENTAL CONTROL" left={518} />

      <div style={{position: 'absolute', left: 0, top: 462, width: contentWidth, height: 82, boxSizing: 'border-box', background: `${theme.background}F2`, border: `2px solid ${theme.line}`, opacity: choiceReveal, transform: `translateY(${(1 - choiceReveal) * 12}px)`}}>
        <div style={{position: 'absolute', left: 18, top: 15, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>BROWSER SETTINGS / SECURE DNS</div>
        <div style={{position: 'absolute', left: 18, bottom: 14, color: theme.text, font: `800 13px ${theme.fontSans}`}}>Использовать безопасный DNS</div>
        <div style={{position: 'absolute', left: 348, top: 15, width: 490, height: 50, background: theme.surface, borderLeft: `6px solid ${showDefault ? theme.signal : theme.success}`}}>
          <div style={{position: 'absolute', left: 16, top: 10, color: theme.muted, font: `700 7px ${theme.fontMono}`}}>RESOLVER</div>
          <div style={{position: 'absolute', left: 16, top: 27, color: theme.text, font: `800 11px ${theme.fontSans}`}}>{showDefault ? 'Выбран браузером по умолчанию' : 'Выбран пользователем'}</div>
          <div style={{position: 'absolute', right: 15, top: 12, padding: '7px 9px', background: showDefault ? theme.signal : theme.success, color: theme.background, font: `800 8px ${theme.fontMono}`, opacity: showDefault ? phaseProgress : 1}}>{showDefault ? 'DEFAULT' : 'MANUAL'}</div>
        </div>
      </div>
    </div>
  );
};
