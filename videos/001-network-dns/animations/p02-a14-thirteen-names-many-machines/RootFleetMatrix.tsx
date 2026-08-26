import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {rootServerLetters, rootServerSystemFacts} from '../../shared/rootServerData';
import type {RootFleetPhase} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const columnWidth = 52;
const columnGap = 15;
const fleetWidth = rootServerLetters.length * columnWidth + (rootServerLetters.length - 1) * columnGap;
const fleetLeft = (contentWidth - fleetWidth) / 2;
const featuredIdentityIndex = rootServerLetters.indexOf('L');

const getColumnVisibility = ({
  focus,
  index,
  progress,
}: {
  readonly focus: RootFleetPhase['focus'];
  readonly index: number;
  readonly progress: number;
}) => {
  if (focus === 'identity' || focus === 'fanout') {
    return index === featuredIdentityIndex ? (focus === 'identity' ? 1 : progress) : focus === 'identity' ? 0.12 : 0.06;
  }

  if (focus === 'fleet') {
    return index === featuredIdentityIndex ? 1 : clamp01(progress * 1.9 - index * 0.045);
  }

  return 1;
};

const IdentityStrip: React.FC<{
  readonly focus: RootFleetPhase['focus'];
  readonly progress: number;
}> = ({focus, progress}) => {
  const theme = useChannelTheme();
  const showAll = focus === 'fleet' || focus === 'scale' || focus === 'teaser';

  return (
    <div style={{position: 'absolute', left: fleetLeft, top: 0, display: 'flex', gap: columnGap}}>
      {rootServerLetters.map((letter, index) => {
        const visible = showAll ? getColumnVisibility({focus, index, progress}) : index === featuredIdentityIndex ? 1 : 0.12;
        const selected = index === featuredIdentityIndex && !showAll;
        return (
          <div
            key={letter}
            style={{
              width: columnWidth,
              height: 48,
              display: 'grid',
              placeItems: 'center',
              boxSizing: 'border-box',
              color: selected ? theme.background : theme.text,
              borderTop: `4px solid ${selected ? theme.signal : theme.primary}`,
              background: selected ? theme.signal : theme.surface,
              font: `800 16px ${theme.fontMono}`,
              opacity: visible,
            }}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
};

const FleetLinks: React.FC<{
  readonly focus: RootFleetPhase['focus'];
  readonly progress: number;
}> = ({focus, progress}) => {
  const theme = useChannelTheme();
  const showAll = focus === 'fleet' || focus === 'scale' || focus === 'teaser';

  return (
    <svg width={contentWidth} height={310} style={{position: 'absolute', left: 0, top: 44}}>
      {rootServerLetters.map((letter, index) => {
        const x = fleetLeft + index * (columnWidth + columnGap) + columnWidth / 2;
        const visible = showAll
          ? getColumnVisibility({focus, index, progress})
          : index === featuredIdentityIndex
            ? progress
            : 0;
        return (
          <line
            key={letter}
            x1={x}
            y1={4}
            x2={x}
            y2={270}
            stroke={index === featuredIdentityIndex && !showAll ? theme.signal : theme.primary}
            strokeDasharray="3 7"
            strokeWidth={2}
            opacity={visible * 0.7}
          />
        );
      })}
    </svg>
  );
};

const InstanceFleet: React.FC<{
  readonly focus: RootFleetPhase['focus'];
  readonly progress: number;
}> = ({focus, progress}) => {
  const theme = useChannelTheme();
  const showAll = focus === 'fleet' || focus === 'scale' || focus === 'teaser';

  return (
    <div style={{position: 'absolute', left: fleetLeft, top: 82, display: 'flex', gap: columnGap}}>
      {rootServerLetters.map((letter, columnIndex) => {
        const columnVisible = getColumnVisibility({focus, index: columnIndex, progress});
        return (
          <div key={letter} style={{width: columnWidth}}>
            {Array.from({length: 6}, (_, rowIndex) => {
              const instanceReveal = clamp01(columnVisible * 1.65 - rowIndex * 0.12);
              const selected = columnIndex === featuredIdentityIndex && !showAll;
              return (
                <div
                  key={rowIndex}
                  style={{
                    height: 29,
                    marginBottom: 9,
                    boxSizing: 'border-box',
                    borderLeft: `4px solid ${selected ? theme.signal : rowIndex % 3 === 0 ? theme.success : theme.primary}`,
                    background: `${theme.surface}F4`,
                    opacity: instanceReveal,
                    transform: `translateY(${(1 - instanceReveal) * -8}px)`,
                  }}
                >
                  <div style={{padding: '9px 0 0 8px', color: theme.muted, font: `700 6px ${theme.fontMono}`}}>
                    POP {String(rowIndex + 1).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const ScaleCounters: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();
  const counters = [
    {value: String(rootServerSystemFacts.identityCount), label: 'LOGICAL IDs', accent: theme.signal},
    {value: String(rootServerSystemFacts.operatorCount), label: 'INDEPENDENT OPERATORS', accent: theme.primary},
    {value: rootServerSystemFacts.instanceCountLabel, label: 'PHYSICAL INSTANCES', accent: theme.success},
  ] as const;

  return (
    <div style={{position: 'absolute', left: 52, top: 342, width: 756, display: 'grid', gridTemplateColumns: '1fr 1.3fr 1.3fr', gap: 14, opacity: reveal}}>
      {counters.map((counter, index) => (
        <div
          key={counter.label}
          style={{
            height: 92,
            padding: '14px 16px',
            boxSizing: 'border-box',
            borderTop: `5px solid ${counter.accent}`,
            background: `${theme.surface}F7`,
            transform: `translateY(${(1 - reveal) * (10 + index * 4)}px)`,
          }}
        >
          <div style={{color: counter.accent, font: `800 27px ${theme.fontSans}`}}>{counter.value}</div>
          <div style={{marginTop: 8, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>{counter.label}</div>
        </div>
      ))}
    </div>
  );
};

const OperatorRail: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'absolute', left: 52, top: 462, width: 756, opacity: reveal}}>
      <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
        <span>12 INDEPENDENT OPERATORS</span>
        <span>SAME ROOT ZONE DATA</span>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, marginTop: 12}}>
        {Array.from({length: rootServerSystemFacts.operatorCount}, (_, index) => (
          <div key={index} style={{height: 8, background: index % 3 === 0 ? theme.success : index % 2 === 0 ? theme.signal : theme.primary}} />
        ))}
      </div>
    </div>
  );
};

export const RootFleetMatrix: React.FC<{
  readonly phase: RootFleetPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const showScale = phase.focus === 'scale' || phase.focus === 'teaser';
  const matrixProgress = phase.focus === 'identity' ? 0 : phase.focus === 'fanout' || phase.focus === 'fleet' ? phaseProgress : 1;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 382, width: contentWidth, height: 570, opacity: reveal}}>
      <IdentityStrip focus={phase.focus} progress={phase.focus === 'fleet' ? phaseProgress : 1} />
      <FleetLinks focus={phase.focus} progress={matrixProgress} />
      <InstanceFleet focus={phase.focus} progress={matrixProgress} />
      {showScale && <ScaleCounters reveal={phase.focus === 'scale' ? phaseProgress : 1} />}
      {showScale && <OperatorRail reveal={phase.focus === 'scale' ? phaseProgress : 1} />}
    </div>
  );
};
