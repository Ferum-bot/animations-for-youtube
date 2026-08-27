import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {ConclusionBlock, ConclusionPath, ConclusionTag} from '../ConclusionPrimitives';
import {progressBetween} from '../motion';

const eras = [
  {year: '1983', label: 'DNS CORE'},
  {year: '1990s', label: 'WEB'},
  {year: '2000s', label: 'MOBILE'},
  {year: 'TODAY', label: 'CLOUD'},
] as const;

export const LongevityScene: React.FC<{readonly elapsedMs: number}> = ({elapsedMs}) => {
  const theme = useChannelTheme();
  const timelineReveal = progressBetween(elapsedMs, 17_280, 18_080);
  const travelProgress = progressBetween(elapsedMs, 17_700, 20_600);
  const successReveal = progressBetween(elapsedMs, 20_760, 21_520);

  return (
    <div style={{position: 'absolute', inset: 0, perspective: 900}}>
      <div style={{position: 'absolute', left: 0, top: 8, width: 860, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', opacity: timelineReveal}}>
        <span style={{color: theme.primary, font: `900 64px ${theme.fontSans}`, letterSpacing: -4}}>1983</span>
        <span style={{color: theme.success, font: `900 64px ${theme.fontSans}`, letterSpacing: -4}}>40+ ЛЕТ</span>
      </div>

      <svg viewBox="0 0 860 250" style={{position: 'absolute', left: 0, top: 104, width: 860, height: 250}}>
        <ConclusionPath d="M40 86 H820" progress={timelineReveal} tone="muted" width={4} />
        <ConclusionPath d="M40 86 H820" progress={travelProgress} tone="primary" width={7} />
      </svg>

      <div style={{position: 'absolute', left: 18, top: 158, width: 824, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, transform: `rotateX(${(1 - timelineReveal) * 8}deg)`, transformOrigin: 'center top'}}>
        {eras.map((era, index) => {
          const reveal = progressBetween(travelProgress, index * 0.24, Math.min(1, index * 0.24 + 0.18));
          return (
            <div key={era.year} style={{position: 'relative'}}>
              <span style={{position: 'absolute', left: 12, top: -34, width: 14, height: 14, background: index === 3 ? theme.success : theme.primary, transform: 'rotate(45deg)', opacity: reveal}} />
              <ConclusionBlock title={era.label} detail={era.year} tone={index === 3 ? 'success' : 'primary'} width={192} height={104} reveal={reveal} />
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 118, top: 318, opacity: successReveal}}>
        <ConclusionBlock title="МОДЕЛЬ НЕ ИЗМЕНИЛАСЬ" detail="HIERARCHY + DISTRIBUTED CACHE" tone="success" width={624} height={100} reveal={successReveal} />
      </div>
      <div style={{position: 'absolute', left: 302, top: 444}}>
        <ConclusionTag label="GLOBAL / DISTRIBUTED / PROVEN" tone="success" reveal={successReveal} />
      </div>
    </div>
  );
};
