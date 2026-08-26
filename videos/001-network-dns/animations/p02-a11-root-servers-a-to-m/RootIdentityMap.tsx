import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {rootServerLetters} from '../../shared/rootServerData';
import type {RootServerPhase} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const RootNode: React.FC<{
  readonly letter: string;
  readonly highlighted: boolean;
  readonly reveal: number;
}> = ({letter, highlighted, reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        width: 104,
        height: 70,
        boxSizing: 'border-box',
        padding: '10px 11px',
        borderTop: `5px solid ${highlighted ? theme.signal : theme.primary}`,
        background: `${theme.surface}F4`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 12}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <span style={{color: highlighted ? theme.signal : theme.text, font: `800 28px ${theme.fontSans}`}}>{letter}</span>
        <span style={{color: theme.muted, font: `700 7px ${theme.fontMono}`}}>ROOT</span>
      </div>
      <div style={{marginTop: 6, color: theme.muted, font: `700 7px ${theme.fontMono}`}}>LOGICAL ID</div>
    </div>
  );
};

const RootIdentityGrid: React.FC<{
  readonly phase: RootServerPhase;
  readonly phaseProgress: number;
}> = ({phase, phaseProgress}) => {
  const isSample = phase.focus === 'sample';

  return (
    <div style={{position: 'absolute', left: 0, top: 108, width: contentWidth, height: 190}}>
      {rootServerLetters.map((letter, index) => {
        const row = index < 7 ? 0 : 1;
        const column = row === 0 ? index : index - 7;
        const rowWidth = row === 0 ? 7 * 104 + 6 * 18 : 6 * 104 + 5 * 18;
        const x = (contentWidth - rowWidth) / 2 + column * 122;
        const stagger = clamp01(phaseProgress * 1.75 - index * 0.075);
        const visible = index < phase.visibleCount;
        const nodeReveal = !visible
          ? 0.08
          : phase.focus === 'sample' || phase.focus === 'config' || (phase.focus === 'set' && index === 0)
            ? 1
            : stagger;

        return (
          <div key={letter} style={{position: 'absolute', left: x, top: row * 94}}>
            <RootNode
              highlighted={isSample ? index === 0 : phase.focus === 'config'}
              letter={letter}
              reveal={nodeReveal}
            />
          </div>
        );
      })}
    </div>
  );
};

const ResolverConfig: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        top: 400,
        width: 720,
        height: 116,
        boxSizing: 'border-box',
        padding: '18px 20px',
        borderLeft: `6px solid ${theme.success}`,
        background: `${theme.surface}F7`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 18}px)`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span style={{color: theme.success, font: `800 12px ${theme.fontMono}`}}>RECURSIVE RESOLVER / START CONFIG</span>
        <span style={{color: theme.muted, font: `700 9px ${theme.fontMono}`}}>BUILT IN</span>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 6, marginTop: 19}}>
        {rootServerLetters.map((letter, index) => (
          <div
            key={letter}
            style={{
              padding: '8px 0',
              color: index === 0 ? theme.background : theme.text,
              background: index === 0 ? theme.success : theme.background,
              font: `800 11px ${theme.fontMono}`,
              textAlign: 'center',
            }}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export const RootIdentityMap: React.FC<{
  readonly phase: RootServerPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const sampleVisible = phase.focus === 'sample';

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 382, width: contentWidth, height: 570, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: contentWidth, textAlign: 'center'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 18}}>
          <span style={{color: theme.muted, font: `700 9px ${theme.fontMono}`}}>TOP OF DNS TREE</span>
          <span style={{color: theme.text, font: `800 45px ${theme.fontSans}`, lineHeight: 0.8}}>.</span>
          <span style={{color: theme.primary, font: `800 15px ${theme.fontMono}`}}>ROOT ZONE</span>
        </div>
        <div style={{width: 2, height: 42, margin: '11px auto 0', background: theme.primary}} />
      </div>

      <RootIdentityGrid phase={phase} phaseProgress={phaseProgress} />

      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 324,
          width: 640,
          padding: '14px 18px',
          boxSizing: 'border-box',
          color: sampleVisible ? theme.text : theme.muted,
          borderTop: `4px solid ${sampleVisible ? theme.signal : theme.line}`,
          background: `${theme.background}E8`,
          font: `800 18px ${theme.fontMono}`,
          letterSpacing: 0.4,
          opacity: phase.focus === 'summit' ? 0.12 : 1,
          textAlign: 'center',
        }}
      >
        {sampleVisible ? 'a.root-servers.net.' : '[ a … m ].root-servers.net.'}
      </div>

      {phase.focus === 'config' && <ResolverConfig reveal={phaseProgress} />}

      {phase.focus === 'count' && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 338,
            color: theme.signal,
            font: `800 11px ${theme.fontMono}`,
            opacity: phaseProgress,
          }}
        >
          13 NAMES ≠ 13 MACHINES
        </div>
      )}
    </div>
  );
};
