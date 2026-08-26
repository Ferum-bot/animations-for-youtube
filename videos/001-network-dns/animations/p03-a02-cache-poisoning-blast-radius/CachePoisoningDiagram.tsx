import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {PoisoningPhase} from './content';
import {affectedNames, poisoningStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const CacheRecord: React.FC<{
  readonly accent: 'primary' | 'signal';
  readonly label: string;
  readonly value: string;
  readonly visible: number;
}> = ({accent, label, value, visible}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        height: 62,
        marginBottom: 10,
        padding: '12px 13px',
        boxSizing: 'border-box',
        borderLeft: `5px solid ${theme[accent]}`,
        background: `${theme.background}DE`,
        opacity: visible,
        transform: `translateX(${(1 - visible) * -14}px)`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 10}}>
        <span style={{color: theme.text, font: `800 10px ${theme.fontMono}`}}>{label}</span>
        <span style={{color: theme[accent], font: `800 8px ${theme.fontMono}`}}>{accent === 'signal' ? 'FORGED' : 'VALID'}</span>
      </div>
      <div style={{marginTop: 9, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>{value}</div>
    </div>
  );
};

const PoisonedCache: React.FC<{
  readonly progress: number;
  readonly stage: number;
}> = ({progress, stage}) => {
  const theme = useChannelTheme();
  const delegationReveal = stage === 1 ? progress : stage > 1 ? 1 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 46,
        width: 330,
        height: 424,
        padding: '20px 18px',
        boxSizing: 'border-box',
        borderTop: `7px solid ${stage >= 1 ? theme.signal : theme.primary}`,
        background: `${theme.surface}F5`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span style={{color: theme.text, font: `800 17px ${theme.fontSans}`}}>RECURSIVE CACHE</span>
        <span style={{color: stage >= 2 ? theme.signal : theme.muted, font: `800 8px ${theme.fontMono}`}}>{stage >= 2 ? 'POISONED' : 'LOCAL COPY'}</span>
      </div>
      <div style={{marginTop: 11, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>DATA ACCEPTED ONCE / REUSED MANY TIMES</div>

      <div style={{marginTop: 24}}>
        <CacheRecord accent="signal" label="www.example.com / A" value="203.0.113.66" visible={stage === 0 ? progress : 0.22} />
        <CacheRecord accent="signal" label="example.com / NS" value="ns.attacker.invalid." visible={delegationReveal} />
        <CacheRecord accent="signal" label="ns.attacker.invalid / A" value="203.0.113.66" visible={clamp01(delegationReveal * 1.6 - 0.28)} />
      </div>

      <div style={{position: 'absolute', left: 18, right: 18, bottom: 18}}>
        <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
          <span>TTL / POISON LIFETIME</span>
          <span style={{color: stage >= 2 ? theme.signal : theme.muted}}>{stage >= 2 ? 'ACTIVE' : '—'}</span>
        </div>
        <div style={{height: 5, marginTop: 9, background: theme.line}}>
          <div style={{height: '100%', width: stage >= 2 ? '82%' : '0%', background: theme.signal}} />
        </div>
      </div>
    </div>
  );
};

const ZoneBlastRadius: React.FC<{
  readonly progress: number;
  readonly stage: number;
}> = ({progress, stage}) => {
  const theme = useChannelTheme();
  const showTree = stage >= 1;
  const spreadProgress = stage === 3 ? progress : stage > 3 ? 1 : 0;
  const lesson = stage >= 4;

  return (
    <div style={{position: 'absolute', left: 382, top: 26, width: 478, height: 470}}>
      <div
        style={{
          position: 'absolute',
          left: 116,
          top: 0,
          width: 246,
          height: 76,
          padding: '16px 15px',
          boxSizing: 'border-box',
          borderTop: `6px solid ${showTree ? theme.signal : theme.line}`,
          background: `${theme.surface}F3`,
          opacity: showTree ? 1 : 0.24,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span style={{color: theme.text, font: `800 15px ${theme.fontSans}`}}>EXAMPLE.COM</span>
          <span style={{color: theme.signal, font: `800 8px ${theme.fontMono}`}}>ZONE</span>
        </div>
        <div style={{marginTop: 9, color: theme.signal, font: `700 8px ${theme.fontMono}`}}>NS → ATTACKER-CONTROLLED</div>
      </div>

      <svg width={478} height={390} style={{position: 'absolute', left: 0, top: 58, overflow: 'visible'}}>
        <path d="M 239 18 V 82" fill="none" stroke={showTree ? theme.signal : theme.line} strokeWidth={5} opacity={showTree ? 1 : 0.2} />
        <path d="M 44 82 H 434" fill="none" stroke={showTree ? theme.signal : theme.line} strokeWidth={4} opacity={showTree ? 1 : 0.2} />
        {affectedNames.map((_, index) => {
          const x = 44 + index * 97.5;
          const branchReveal = clamp01(spreadProgress * 1.8 - index * 0.13);
          return (
            <g key={index}>
              <line x1={x} y1={82} x2={x} y2={142} stroke={theme.signal} strokeWidth={4} opacity={showTree ? 0.3 + branchReveal * 0.7 : 0.1} />
              <line x1={x - 8} y1={134} x2={x + 8} y2={150} stroke={theme.signal} strokeWidth={4} opacity={branchReveal} />
              <line x1={x + 8} y1={134} x2={x - 8} y2={150} stroke={theme.signal} strokeWidth={4} opacity={branchReveal} />
            </g>
          );
        })}
      </svg>

      <div style={{position: 'absolute', left: 0, top: 208, display: 'flex', gap: 10}}>
        {affectedNames.map((name, index) => {
          const affected = clamp01(spreadProgress * 1.8 - index * 0.13);
          return (
            <div
              key={name}
              style={{
                width: 87.5,
                height: 84,
                padding: '14px 7px',
                boxSizing: 'border-box',
                borderTop: `5px solid ${affected > 0.2 ? theme.signal : theme.primary}`,
                background: `${theme.surface}EC`,
                opacity: showTree ? 1 : 0.16,
                textAlign: 'center',
              }}
            >
              <div style={{color: theme.text, font: `800 11px ${theme.fontMono}`}}>{name}</div>
              <div style={{marginTop: 12, color: affected > 0.2 ? theme.signal : theme.muted, font: `700 7px ${theme.fontMono}`}}>{affected > 0.2 ? 'MISDIRECTED' : 'NAME'}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 48,
          top: 326,
          width: 382,
          height: 112,
          padding: '18px 20px',
          boxSizing: 'border-box',
          borderLeft: `6px solid ${lesson ? theme.signal : theme.line}`,
          background: `${theme.background}E8`,
          opacity: lesson ? progress : 0,
          transform: `translateY(${(1 - (lesson ? progress : 0)) * 14}px)`,
        }}
      >
        <div style={{color: theme.signal, font: `800 11px ${theme.fontMono}`}}>CACHE = TRUST AMPLIFIER</div>
        <div style={{marginTop: 13, color: theme.text, font: `800 17px ${theme.fontSans}`, lineHeight: 1.08}}>Одна ложная делегация меняет ответы для всей зоны</div>
      </div>
    </div>
  );
};

export const CachePoisoningDiagram: React.FC<{
  readonly phase: PoisoningPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const stage = poisoningStage[phase.focus];

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 382, width: contentWidth, height: 570, opacity: reveal}}>
      <PoisonedCache progress={phaseProgress} stage={stage} />
      <ZoneBlastRadius progress={phaseProgress} stage={stage} />
    </div>
  );
};
