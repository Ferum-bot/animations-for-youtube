import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {PacketBudgetPhase} from './content';
import {packetBudget} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const packetWidth = 800;
const bytesToPixels = (bytes: number): number => (bytes / packetBudget.limit) * packetWidth;

const ByteTicks: React.FC = () => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'absolute', left: 30, top: 74, width: packetWidth, height: 22}}>
      {Array.from({length: 9}, (_, index) => (
        <div key={index} style={{position: 'absolute', left: `${(index / 8) * 100}%`, top: 0}}>
          <div style={{width: 1, height: index === 8 ? 17 : 9, background: index === 8 ? theme.signal : theme.line}} />
          <div style={{marginTop: 4, color: index === 8 ? theme.signal : theme.muted, font: `700 7px ${theme.fontMono}`, transform: 'translateX(-50%)'}}>
            {index * 64}
          </div>
        </div>
      ))}
    </div>
  );
};

const Segment: React.FC<{
  readonly bytes: number;
  readonly color: string;
  readonly label: string;
  readonly left: number;
  readonly reveal: number;
  readonly textColor?: string;
}> = ({bytes, color, label, left, reveal, textColor}) => {
  const theme = useChannelTheme();
  const width = bytesToPixels(bytes);
  const compact = width < 72;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: 0,
        width: width * reveal,
        height: 124,
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: color,
        borderRight: `3px solid ${theme.background}`,
      }}
    >
      <div style={{position: 'absolute', left: compact ? 4 : 14, top: 20, width: Math.max(0, width - (compact ? 8 : 24)), whiteSpace: 'nowrap'}}>
        <div style={{color: textColor ?? theme.text, font: `800 ${compact ? 16 : 26}px ${theme.fontSans}`}}>
          {compact ? bytes : `${bytes} B`}
        </div>
        <div style={{marginTop: compact ? 5 : 10, color: textColor ?? `${theme.text}C8`, font: `700 ${compact ? 7 : 8}px ${theme.fontMono}`}}>
          {compact ? 'B' : label}
        </div>
      </div>
    </div>
  );
};

const Equation: React.FC<{
  readonly overflow: boolean;
  readonly reveal: number;
}> = ({overflow, reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: 30,
        top: 322,
        width: packetWidth,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 14}px)`,
      }}
    >
      <div>
        <div style={{color: theme.text, font: `800 31px ${theme.fontSans}`, letterSpacing: -1.2}}>
          435 + 64 + 25 = <span style={{color: overflow ? theme.signal : theme.text}}>524 B</span>
        </div>
        <div style={{marginTop: 10, color: theme.muted, font: `700 9px ${theme.fontMono}`}}>BASE + QNAME + FOURTEENTH IDENTITY</div>
      </div>
      <div
        style={{
          minWidth: 154,
          padding: '14px 16px',
          boxSizing: 'border-box',
          color: theme.text,
          borderLeft: `6px solid ${overflow ? theme.signal : theme.line}`,
          background: `${theme.surface}FA`,
          font: `800 15px ${theme.fontMono}`,
          textAlign: 'right',
        }}
      >
        {overflow ? '+12 B / OVER' : 'CALCULATING'}
      </div>
    </div>
  );
};

const LegacyConclusion: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: 30,
        top: 430,
        width: packetWidth,
        height: 76,
        display: 'grid',
        gridTemplateColumns: '118px 1fr 120px',
        alignItems: 'center',
        boxSizing: 'border-box',
        padding: '0 22px',
        borderTop: `5px solid ${theme.success}`,
        background: `${theme.surface}F7`,
        opacity: reveal,
      }}
    >
      <span style={{color: theme.success, font: `800 24px ${theme.fontSans}`}}>1997</span>
      <div style={{height: 3, background: theme.line}}>
        <div style={{width: `${reveal * 100}%`, height: '100%', background: theme.success}} />
      </div>
      <span style={{color: theme.text, font: `800 14px ${theme.fontMono}`, textAlign: 'right'}}>TODAY</span>
    </div>
  );
};

export const PacketBudgetDiagram: React.FC<{
  readonly phase: PacketBudgetPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const showOutline = phase.visibleStage >= 1;
  const showOccupied = phase.visibleStage >= 2;
  const showName = phase.visibleStage >= 3;
  const showCandidate = phase.visibleStage >= 4;
  const showOverflow = phase.visibleStage >= 5;
  const candidateLeft = bytesToPixels(packetBudget.occupied + packetBudget.queryName);
  const usedWidth = bytesToPixels(packetBudget.occupied);
  const nameWidth = bytesToPixels(packetBudget.queryName);

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 382, width: contentWidth, height: 570, opacity: reveal}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{color: theme.muted, font: `700 9px ${theme.fontMono}`}}>CLASSIC DNS UDP PAYLOAD</span>
        <span style={{color: showOutline ? theme.signal : theme.muted, font: `800 22px ${theme.fontSans}`}}>MAX / 512 B</span>
      </div>

      <ByteTicks />

      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 110,
          width: packetWidth,
          height: 124,
          boxSizing: 'border-box',
          border: `3px solid ${showOutline ? theme.signal : theme.line}`,
          background: `${theme.background}CC`,
          opacity: showOutline ? 1 : 0.25,
        }}
      >
        {showOccupied && (
          <Segment bytes={packetBudget.occupied} color={theme.primary} label="BASE ROOT RESPONSE" left={0} reveal={phase.focus === 'occupied' ? phaseProgress : 1} />
        )}
        {showName && (
          <Segment bytes={packetBudget.queryName} color={theme.success} label="QNAME" left={usedWidth} reveal={phase.focus === 'name' ? phaseProgress : 1} />
        )}
        {showName && (
          <div
            style={{
              position: 'absolute',
              left: usedWidth + nameWidth,
              top: 0,
              width: bytesToPixels(13),
              height: 124,
              display: 'grid',
              placeItems: 'center',
              color: theme.muted,
              font: `800 7px ${theme.fontMono}`,
              writingMode: 'vertical-rl',
            }}
          >
            13 B FREE
          </div>
        )}
        {showCandidate && (
          <Segment
            bytes={packetBudget.candidate}
            color={theme.signal}
            label="14TH ID"
            left={candidateLeft}
            reveal={phase.focus === 'candidate' ? phaseProgress : 1}
          />
        )}
      </div>

      {showCandidate && (
        <div
          style={{
            position: 'absolute',
            left: 30 + packetWidth,
            top: 96,
            width: bytesToPixels(packetBudget.overflow),
            height: 154,
            boxSizing: 'border-box',
            borderRight: `4px solid ${theme.signal}`,
            background: showOverflow ? `${theme.signal}52` : 'transparent',
            opacity: phase.focus === 'candidate' ? phaseProgress : 1,
          }}
        >
          <div style={{position: 'absolute', right: -3, top: -24, color: theme.signal, font: `800 10px ${theme.fontMono}`, whiteSpace: 'nowrap'}}>
            +12 B
          </div>
        </div>
      )}

      {showCandidate && (
        <div
          style={{
            position: 'absolute',
            right: 30,
            top: 286,
            color: theme.signal,
            font: `800 9px ${theme.fontMono}`,
            opacity: phase.focus === 'candidate' ? phaseProgress : 1,
          }}
        >
          14TH ROOT ID / +25 B
        </div>
      )}

      <div style={{position: 'absolute', left: 30, top: 258, width: packetWidth, display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
        <span>0 B</span>
        <span style={{color: theme.signal}}>HARD BOUNDARY / 512 B</span>
      </div>

      {showCandidate && <Equation overflow={showOverflow} reveal={phaseProgress} />}
      {(phase.focus === 'answer' || phase.focus === 'legacy') && <LegacyConclusion reveal={phaseProgress} />}

      {phase.focus === 'question' && (
        <div
          style={{
            position: 'absolute',
            left: 240,
            top: 112,
            width: 380,
            height: 220,
            display: 'grid',
            placeItems: 'center',
            color: theme.signal,
            border: `2px solid ${theme.line}`,
            background: `${theme.surface}E8`,
            font: `800 112px ${theme.fontSans}`,
            letterSpacing: -7,
          }}
        >
          13?
        </div>
      )}
    </div>
  );
};
