import React from 'react';
import {interpolate} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp, clamp01} from '@channel/motion-core';
import {RootIdentityBadge, RootServerGlyph} from '../../shared/DnsRootSystemPrimitives';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {RootServerLetter} from '../../shared/DnsRootSystemPrimitives';
import type {RootResiliencePhase} from './content';
import {rootResilienceStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const representativeRoots = ['A', 'D', 'F', 'H', 'J', 'M'] as const satisfies readonly RootServerLetter[];

export const RootResilienceDiagram: React.FC<{
  readonly phase: RootResiliencePhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = rootResilienceStage[phase.focus];
  const attackVisible = stage >= 2;
  const degraded = stage >= 3;
  const verdict = stage >= 4;
  const floodProgress = stage === 2 ? phaseProgress : stage > 2 ? 1 : 0;
  const serviceProgress = degraded ? (stage === 3 ? phaseProgress : 1) : 0;
  const queryLeft = interpolate(serviceProgress, [0, 1], [54, 756], clamp);

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 402, width: contentWidth, height: 540, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: contentWidth, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18}}>
        {representativeRoots.map((letter, index) => {
          const affected = index === 1 || index === 3;
          return (
            <div key={letter} style={{display: 'grid', justifyItems: 'center', gap: 11}}>
              <RootIdentityBadge active={attackVisible && affected} letter={letter} reveal={clamp01(phaseProgress * 1.7 - index * 0.06)} tone={affected && attackVisible ? 'signal' : 'success'} />
              <RootServerGlyph label={affected && degraded ? 'LINK SATURATED' : 'INSTANCE 01'} state={affected && degraded ? 'saturated' : 'healthy'} width={128} />
              <RootServerGlyph label="INSTANCE 02" state="healthy" width={128} />
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 0, top: 208, width: contentWidth, height: 3, background: theme.line}}>
        <div style={{width: `${attackVisible ? 100 : 0}%`, height: '100%', background: attackVisible ? theme.signal : theme.success}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 222, width: contentWidth, display: 'flex', justifyContent: 'space-between', color: attackVisible ? theme.signal : theme.success, font: `800 9px ${theme.fontMono}`}}>
        <span>{attackVisible ? '2015 / HIGH-QUERY EVENT' : 'NORMAL ROOT TRAFFIC'}</span>
        <span>{attackVisible ? 'UP TO 5M QPS / AFFECTED LETTER' : 'MULTIPLE INDEPENDENT PATHS'}</span>
      </div>

      {attackVisible ? (
        <div style={{position: 'absolute', left: 0, top: 254, width: contentWidth, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 7, opacity: floodProgress}}>
          {Array.from({length: 12}, (_, index) => (
            <div key={index} style={{height: 13, background: index % 4 === 0 ? theme.signal : theme.line, transform: `scaleX(${clamp01(floodProgress * 1.9 - index * 0.055)})`, transformOrigin: 'left center'}} />
          ))}
        </div>
      ) : null}

      <div style={{position: 'absolute', left: 0, top: 316, width: contentWidth, height: 70, boxSizing: 'border-box', padding: '18px 20px', background: theme.surface, borderLeft: `7px solid ${degraded ? theme.success : theme.primary}`, opacity: stage >= 1 ? 1 : 0}}>
        <div style={{color: degraded ? theme.success : theme.primary, font: `800 9px ${theme.fontMono}`}}>{degraded ? 'REQUEST RETRIES THROUGH A REACHABLE ROOT' : 'ONE NODE CAN DISAPPEAR WITHOUT REMOVING THE SERVICE'}</div>
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 14, height: 4, background: theme.line}}>
          <div style={{position: 'absolute', left: queryLeft, top: -6, width: 16, height: 16, background: degraded ? theme.success : theme.primary, transform: 'rotate(45deg)'}} />
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 414, width: contentWidth, height: 88, boxSizing: 'border-box', padding: '18px 22px', background: theme.background, borderTop: `7px solid ${theme.success}`, opacity: verdict ? phaseProgress : 0, transform: `translateY(${verdict ? (1 - phaseProgress) * 12 : 12}px)`}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <span style={{color: theme.signal, font: `800 15px ${theme.fontSans}`, textDecoration: 'line-through'}}>PARTIAL FAILURE = OUTAGE</span>
          <span style={{color: theme.success, font: `800 21px ${theme.fontSans}`}}>SERVICE CONTINUES</span>
        </div>
        <div style={{marginTop: 11, color: theme.muted, font: `800 8px ${theme.fontMono}`}}>SOME LOCATIONS OR LINKS MAY SATURATE — THE DISTRIBUTED ROOT REMAINS REACHABLE</div>
      </div>
    </div>
  );
};
