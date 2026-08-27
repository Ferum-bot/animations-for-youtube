import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {ConclusionBlock, ConclusionPath, ConclusionTag} from '../ConclusionPrimitives';
import {progressBetween} from '../motion';

export const TwoPillarsScene: React.FC<{readonly elapsedMs: number}> = ({elapsedMs}) => {
  const theme = useChannelTheme();
  const foundationReveal = progressBetween(elapsedMs, 0, 820);
  const ideasReveal = progressBetween(elapsedMs, 5_120, 5_820);
  const delegationReveal = progressBetween(elapsedMs, 9_020, 9_720);
  const cacheReveal = progressBetween(elapsedMs, 14_120, 14_820);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 860, height: 96, boxSizing: 'border-box', padding: '17px 18px', background: theme.surface, borderTop: `7px solid ${theme.signal}`, opacity: foundationReveal}}>
        <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `800 8px ${theme.fontMono}`}}>
          <span>MODERN INTERNET</span>
          <span>DEPENDENCY / DNS</span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20}}>
          {['WEB', 'MAIL', 'CLOUD', 'MICROSERVICES'].map((service, index) => (
            <div key={service} style={{height: 22, borderLeft: `5px solid ${index === 3 ? theme.signal : theme.primary}`, paddingLeft: 10, color: theme.text, font: `800 10px ${theme.fontMono}`}}>{service}</div>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 860 430" style={{position: 'absolute', inset: 0, width: 860, height: 430}}>
        <ConclusionPath d="M430 96 V146 H225 V194" progress={ideasReveal} tone="primary" />
        <ConclusionPath d="M430 146 H635 V194" progress={ideasReveal} tone="success" />
        <ConclusionPath d="M225 374 V410" progress={delegationReveal} tone="primary" />
        <ConclusionPath d="M635 374 V410" progress={cacheReveal} tone="success" />
      </svg>

      <div style={{position: 'absolute', left: 70, top: 194}}>
        <ConclusionBlock title="ИЕРАРХИЯ + ДЕЛЕГИРОВАНИЕ" detail="EACH AUTHORITY OWNS ONE ZONE" tone="primary" width={310} height={180} reveal={ideasReveal * (0.4 + delegationReveal * 0.6)} />
        <div style={{position: 'absolute', left: 18, bottom: 18, right: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, opacity: delegationReveal}}>
          {['ROOT', 'TLD', 'ZONE'].map((label) => <div key={label} style={{paddingTop: 10, borderTop: `4px solid ${theme.primary}`, color: theme.muted, font: `800 8px ${theme.fontMono}`}}>{label}</div>)}
        </div>
      </div>
      <div style={{position: 'absolute', left: 480, top: 194}}>
        <ConclusionBlock title="РАСПРЕДЕЛЁННЫЕ ДАННЫЕ" detail="CACHE BRINGS ANSWERS CLOSER" tone="success" width={310} height={180} reveal={ideasReveal * (0.4 + cacheReveal * 0.6)} />
        <div style={{position: 'absolute', left: 18, bottom: 18, right: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, opacity: cacheReveal}}>
          {['AUTH', 'RESOLVER', 'CACHE'].map((label) => <div key={label} style={{paddingTop: 10, borderTop: `4px solid ${theme.success}`, color: theme.muted, font: `800 8px ${theme.fontMono}`}}>{label}</div>)}
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 410, width: 860, height: 54, boxSizing: 'border-box', padding: '17px 20px', background: theme.surface, borderLeft: `7px solid ${theme.signal}`, opacity: ideasReveal}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <ConclusionTag label="TWO IDEAS" tone="signal" reveal={ideasReveal} />
          <span style={{color: theme.text, font: `800 13px ${theme.fontSans}`}}>ONE GLOBAL SYSTEM</span>
        </div>
      </div>
    </div>
  );
};
