import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import type {ConclusionTone} from '../ConclusionPrimitives';
import {ConclusionTag} from '../ConclusionPrimitives';
import {progressBetween} from '../motion';

type LeverRowProps = {
  readonly active: boolean;
  readonly detail: string;
  readonly label: string;
  readonly outcome: string;
  readonly reveal: number;
  readonly tone: ConclusionTone;
  readonly visual: string;
};

const LeverRow: React.FC<LeverRowProps> = ({active, detail, label, outcome, reveal, tone, visual}) => {
  const theme = useChannelTheme();
  const accent = tone === 'signal' ? theme.signal : tone === 'success' ? theme.success : theme.primary;

  return (
    <div style={{width: 860, height: 94, boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '150px 1fr 184px', alignItems: 'center', padding: '0 18px', background: theme.surface, borderLeft: `7px solid ${accent}`, opacity: reveal * (active ? 1 : 0.42), transform: `translateX(${(1 - reveal) * -18}px)`}}>
      <div>
        <div style={{color: accent, font: `900 19px ${theme.fontMono}`}}>{label}</div>
        <div style={{marginTop: 10, color: theme.muted, font: `800 7px ${theme.fontMono}`}}>{detail}</div>
      </div>
      <div style={{color: theme.text, font: `800 15px ${theme.fontMono}`, letterSpacing: -0.3}}>{visual}</div>
      <div style={{textAlign: 'right', color: active ? accent : theme.muted, font: `900 12px ${theme.fontSans}`}}>{outcome}</div>
    </div>
  );
};

export const ThreeLeversScene: React.FC<{readonly elapsedMs: number}> = ({elapsedMs}) => {
  const theme = useChannelTheme();
  const balanceReveal = progressBetween(elapsedMs, 54_380, 55_080);
  const ttlReveal = progressBetween(elapsedMs, 58_620, 59_320);
  const cnameReveal = progressBetween(elapsedMs, 61_400, 62_100);
  const synthesisReveal = progressBetween(elapsedMs, 63_840, 64_600);
  const masterReveal = progressBetween(elapsedMs, 67_120, 67_920);
  const activeIndex = masterReveal > 0.25 ? -1 : elapsedMs >= 61_400 ? 2 : elapsedMs >= 58_620 ? 1 : 0;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <LeverRow label="A / AAAA" detail="ONE NAME / MANY ANSWERS" visual="service → .10  /  .42  /  .88" outcome="BALANCE" tone="primary" reveal={balanceReveal} active={activeIndex === 0 || activeIndex === -1} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 112}}>
        <LeverRow label="TTL" detail="CACHE LIFETIME" visual="300s  →  30s  →  NEW ROUTE" outcome="SWITCH SPEED" tone="signal" reveal={ttlReveal} active={activeIndex === 1 || activeIndex === -1} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 224}}>
        <LeverRow label="CNAME" detail="LAYER OF INDIRECTION" visual="app → edge → origin" outcome="INDIRECTION" tone="primary" reveal={cnameReveal} active={activeIndex === 2 || activeIndex === -1} />
      </div>

      <div style={{position: 'absolute', left: 0, top: 354, width: 860, height: 108, boxSizing: 'border-box', padding: '20px 22px', background: theme.surface, borderTop: `8px solid ${theme.success}`, opacity: synthesisReveal}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <ConclusionTag label="THREE LEVERS / ONE CONTROL PLANE" tone="success" reveal={synthesisReveal} />
          <span style={{color: theme.muted, font: `800 8px ${theme.fontMono}`}}>SYSTEM DESIGN / ACTIVE</span>
        </div>
        <div style={{marginTop: 20, color: theme.text, font: `900 24px ${theme.fontSans}`, letterSpacing: -0.7, transform: `translateX(${(1 - masterReveal) * 14}px)`}}>
          <span style={{color: theme.success, opacity: masterReveal}}>DNS = </span>TRAFFIC CONTROL
        </div>
      </div>
    </div>
  );
};
