import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {ConclusionBlock, ConclusionPath, ConclusionTag} from '../ConclusionPrimitives';
import {patchModules} from '../content';
import {progressBetween} from '../motion';

const modulePositions = [
  {left: 0, top: 0},
  {left: 0, top: 304},
  {left: 650, top: 0},
  {left: 650, top: 304},
] as const;

const modulePaths = [
  'M210 44 H246 V168 H280',
  'M210 348 H246 V236 H280',
  'M580 168 H614 V44 H650',
  'M580 236 H614 V348 H650',
] as const;

export const PatchworkScene: React.FC<{readonly elapsedMs: number}> = ({elapsedMs}) => {
  const theme = useChannelTheme();
  const constraintReveal = progressBetween(elapsedMs, 25_520, 26_320);
  const compatibilityReveal = progressBetween(elapsedMs, 29_320, 30_060);
  const historyReveal = progressBetween(elapsedMs, 33_320, 34_020);
  const verdictReveal = progressBetween(elapsedMs, 42_780, 43_520);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 218, top: 74, width: 424, height: 258, boxSizing: 'border-box', border: `4px solid ${compatibilityReveal > 0.5 ? theme.signal : theme.line}`, opacity: constraintReveal}}>
        <div style={{position: 'absolute', left: 16, top: -14, padding: '0 10px', background: theme.background, color: compatibilityReveal > 0.5 ? theme.signal : theme.muted, font: `800 9px ${theme.fontMono}`}}>BACKWARD COMPATIBILITY</div>
      </div>

      <div style={{position: 'absolute', left: 280, top: 124}}>
        <ConclusionBlock title="DNS CORE" detail="1983 / WIRE FORMAT / 16-BIT ID" tone={verdictReveal > 0.5 ? 'success' : 'signal'} width={300} height={160} reveal={constraintReveal} />
        <div style={{position: 'absolute', left: 18, bottom: 20, color: theme.text, font: `900 28px ${theme.fontSans}`, opacity: historyReveal}}>DO NOT BREAK</div>
      </div>

      <svg viewBox="0 0 860 430" style={{position: 'absolute', inset: 0, width: 860, height: 430}}>
        {modulePaths.map((path, index) => {
          const module = patchModules[index];
          const reveal = progressBetween(elapsedMs, 35_700 + index * 1_350, 36_360 + index * 1_350);
          if (!module) return null;
          return <ConclusionPath key={path} d={path} progress={reveal} tone={module.tone} />;
        })}
      </svg>

      {patchModules.map((module, index) => {
        const position = modulePositions[index];
        const reveal = progressBetween(elapsedMs, 35_700 + index * 1_350, 36_360 + index * 1_350);
        if (!position) return null;

        return (
          <div key={module.label} style={{position: 'absolute', left: position.left, top: position.top}}>
            <ConclusionBlock title={module.label} detail={module.detail} tone={module.tone} width={210} height={88} reveal={reveal} />
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 0, top: 404, width: 860, height: 62, boxSizing: 'border-box', padding: '20px 20px', background: theme.surface, borderLeft: `7px solid ${verdictReveal > 0.5 ? theme.success : theme.signal}`, opacity: historyReveal}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <ConclusionTag label="PATCHES, NOT REWRITE" tone={verdictReveal > 0.5 ? 'success' : 'signal'} reveal={historyReveal} />
          <span style={{color: theme.text, font: `800 13px ${theme.fontSans}`, opacity: verdictReveal}}>IMPERFECT — STILL RUNNING</span>
        </div>
      </div>
    </div>
  );
};
