import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {RootIdentityBadge, RootServerGlyph} from '../../shared/DnsRootSystemPrimitives';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {rootServerLetters} from '../../shared/rootServerData';
import type {RootMythPhase} from './content';
import {rootMythStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

export const RootMythDiagram: React.FC<{
  readonly phase: RootMythPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = rootMythStage[phase.focus];
  const correction = stage === 1 ? phaseProgress : stage > 1 ? 1 : 0;
  const identitiesReveal = stage === 2 ? phaseProgress : 0;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 392, width: contentWidth, height: 550, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 228, height: 242}}>
        <div style={{color: correction > 0.5 ? theme.muted : theme.signal, font: `800 154px ${theme.fontSans}`, lineHeight: 0.84, letterSpacing: -12}}>13</div>
        <div style={{marginTop: 22, color: correction > 0.5 ? theme.muted : theme.signal, font: `800 12px ${theme.fontMono}`, letterSpacing: 1.5}}>PHYSICAL SERVERS?</div>
        <div style={{position: 'absolute', left: 0, top: 143, width: 215, height: 10, background: theme.signal, transform: `scaleX(${correction}) rotate(-8deg)`, transformOrigin: 'left center'}} />
      </div>

      <div style={{position: 'absolute', left: 286, top: 4, width: 574, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, opacity: 1 - identitiesReveal * 0.96}}>
        {rootServerLetters.map((letter, index) => {
          const itemReveal = clamp01(phase.focus === 'myth' ? phaseProgress * 1.8 - index * 0.055 : 1);
          return <RootServerGlyph key={letter} label={`SERVER ${letter}`} reveal={itemReveal} state={correction > 0.55 ? 'saturated' : 'neutral'} width={104} />;
        })}
      </div>

      <div style={{position: 'absolute', left: 286, top: 6, width: 574, display: 'grid', gridTemplateColumns: 'repeat(7, 48px)', gap: 17, opacity: identitiesReveal}}>
        {rootServerLetters.map((letter, index) => (
          <RootIdentityBadge key={letter} active={index === 0 || index === 12} letter={letter} reveal={clamp01(identitiesReveal * 1.8 - index * 0.055)} tone="success" />
        ))}
      </div>

      <div style={{position: 'absolute', left: 286, top: 194, width: 574, height: 3, background: theme.line}}>
        <div style={{width: `${correction * 100}%`, height: '100%', background: theme.primary}} />
      </div>
      <div style={{position: 'absolute', left: 286, top: 220, width: 574, display: 'grid', gridTemplateColumns: '1fr 70px 1fr', alignItems: 'center', opacity: correction}}>
        <div>
          <div style={{color: theme.signal, font: `800 10px ${theme.fontMono}`}}>WRONG MODEL</div>
          <div style={{marginTop: 10, color: theme.muted, font: `800 16px ${theme.fontSans}`, textDecoration: 'line-through'}}>13 отдельных машин</div>
        </div>
        <div style={{color: theme.primary, font: `800 24px ${theme.fontMono}`, textAlign: 'center'}}>→</div>
        <div>
          <div style={{color: theme.success, font: `800 10px ${theme.fontMono}`}}>CORRECT MODEL</div>
          <div style={{marginTop: 10, color: theme.text, font: `800 16px ${theme.fontSans}`}}>13 логических имён</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 354, width: contentWidth, height: 94, boxSizing: 'border-box', padding: '19px 22px', background: theme.surface, borderLeft: `7px solid ${theme.success}`, opacity: identitiesReveal, transform: `translateY(${(1 - identitiesReveal) * 12}px)`}}>
        <div style={{color: theme.success, font: `800 10px ${theme.fontMono}`}}>MENTAL MODEL / REBUILT</div>
        <div style={{marginTop: 12, color: theme.text, font: `800 20px ${theme.fontSans}`}}>A–M — адресуемые идентификаторы, а не тринадцать корпусов</div>
      </div>
    </div>
  );
};
