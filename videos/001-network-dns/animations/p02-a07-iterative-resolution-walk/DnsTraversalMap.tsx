import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {TraversalDirection, TraversalLevel} from './content';
import {authorityLevels} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const resolverWidth = 250;
const nodeLeft = 586;
const nodeWidth = 274;
const nodeHeight = 72;
const nodeGap = 22;
const resolverCenterY = 184;

const levelCenterY = (level: TraversalLevel): number =>
  level * (nodeHeight + nodeGap) + nodeHeight / 2;

const ResolverCard: React.FC<{
  readonly answerReveal: number;
  readonly reveal: number;
}> = ({answerReveal, reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 78,
        width: resolverWidth,
        height: 212,
        boxSizing: 'border-box',
        padding: '20px 18px',
        border: `2px solid ${theme.primary}`,
        borderTopWidth: 6,
        background: `${theme.surface}F2`,
        opacity: reveal,
        transform: `translateX(${(1 - reveal) * -18}px)`,
      }}
    >
      <div style={{color: theme.primary, font: `700 10px ${theme.fontMono}`, letterSpacing: 1.1}}>
        LOCAL / RECURSIVE
      </div>
      <div style={{marginTop: 15, color: theme.text, font: `800 21px ${theme.fontSans}`, letterSpacing: -0.6}}>
        DNS RESOLVER
      </div>
      <div style={{marginTop: 10, color: theme.muted, font: `10px ${theme.fontMono}`}}>
        CACHE MISS → ITERATIVE WALK
      </div>
      <div style={{marginTop: 24, borderTop: `2px solid ${theme.line}`, paddingTop: 13}}>
        <div style={{color: theme.muted, font: `9px ${theme.fontMono}`}}>CURRENT QUESTION</div>
        <div style={{marginTop: 8, color: theme.text, font: `700 11px ${theme.fontMono}`}}>
          noise.ks.chicago.edu. / A
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 18,
          bottom: 15,
          color: theme.success,
          font: `700 10px ${theme.fontMono}`,
          opacity: answerReveal,
        }}
      >
        CACHE + A 192.0.2.42
      </div>
    </div>
  );
};

const AuthorityNode: React.FC<{
  readonly active: boolean;
  readonly index: TraversalLevel;
  readonly reveal: number;
  readonly visited: boolean;
}> = ({active, index, reveal, visited}) => {
  const theme = useChannelTheme();
  const level = authorityLevels[index];
  const accent = index === 3 && visited ? theme.success : active ? theme.signal : theme.primary;

  return (
    <div
      style={{
        position: 'absolute',
        left: nodeLeft,
        top: index * (nodeHeight + nodeGap),
        width: nodeWidth,
        height: nodeHeight,
        boxSizing: 'border-box',
        padding: '14px 16px',
        borderLeft: `5px solid ${visited || active ? accent : theme.line}`,
        background: `${theme.surface}${active ? 'F5' : 'D8'}`,
        opacity: reveal * (visited || active ? 1 : 0.48),
        transform: `translateX(${(1 - reveal) * 22}px)`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{color: theme.text, font: `800 17px ${theme.fontSans}`, letterSpacing: -0.4}}>
          {level.label}
        </span>
        <span style={{color: accent, font: `700 9px ${theme.fontMono}`}}>
          L{index}
        </span>
      </div>
      <div style={{marginTop: 8, color: visited ? accent : theme.muted, font: `9px ${theme.fontMono}`}}>
        {level.role}
      </div>
    </div>
  );
};

export const DnsTraversalMap: React.FC<{
  readonly answerReveal: number;
  readonly direction: TraversalDirection;
  readonly level: TraversalLevel | null;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({answerReveal, direction, level, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const visitedLevel = level ?? -1;
  const targetY = level === null ? resolverCenterY : levelCenterY(level);
  const travel = direction === 'referral' || direction === 'answer' ? 1 - phaseProgress : phaseProgress;
  const packetX = resolverWidth + (nodeLeft - resolverWidth) * travel;
  const packetY = resolverCenterY + (targetY - resolverCenterY) * travel;
  const routeVisible = level === null || direction === 'idle' ? 0 : 1;
  const routeColor = direction === 'query' ? theme.primary : direction === 'answer' ? theme.success : theme.signal;

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 382,
        width: contentWidth,
        height: 570,
        opacity: reveal,
      }}
    >
      <ResolverCard answerReveal={answerReveal} reveal={reveal} />

      <div
        style={{
          position: 'absolute',
          left: nodeLeft - 28,
          top: levelCenterY(0),
          width: 3,
          height: levelCenterY(3) - levelCenterY(0),
          background: theme.line,
        }}
      >
        <div
          style={{
            width: '100%',
            height: `${clamp01((visitedLevel + 1) / authorityLevels.length) * 100}%`,
            background: answerReveal > 0.1 ? theme.success : theme.primary,
          }}
        />
      </div>

      {authorityLevels.map((item, index) => {
        const typedIndex = index as TraversalLevel;
        return (
          <AuthorityNode
            key={item.label}
            active={level === typedIndex && direction !== 'idle'}
            index={typedIndex}
            reveal={clamp01(reveal * 1.5 - index * 0.1)}
            visited={typedIndex <= visitedLevel}
          />
        );
      })}

      <svg
        width={contentWidth}
        height={420}
        style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: routeVisible}}
      >
        <line
          x1={resolverWidth}
          y1={resolverCenterY}
          x2={nodeLeft}
          y2={targetY}
          stroke={theme.line}
          strokeWidth={3}
        />
        <line
          x1={direction === 'query' ? resolverWidth : nodeLeft}
          y1={direction === 'query' ? resolverCenterY : targetY}
          x2={packetX}
          y2={packetY}
          stroke={routeColor}
          strokeWidth={4}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: packetX - 9,
          top: packetY - 9,
          width: 18,
          height: 18,
          background: routeColor,
          opacity: routeVisible,
          transform: 'rotate(45deg)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 430,
          width: contentWidth,
          display: 'grid',
          gridTemplateColumns: '1fr 70px 1.45fr',
          alignItems: 'center',
          borderTop: `2px solid ${theme.line}`,
          paddingTop: 16,
        }}
      >
        <div>
          <div style={{color: theme.muted, font: `9px ${theme.fontMono}`}}>SOURCE MACHINE</div>
          <div style={{marginTop: 7, color: theme.text, font: `700 11px ${theme.fontMono}`}}>
            filters.ks.vv.nl
          </div>
        </div>
        <div style={{color: theme.primary, font: `20px ${theme.fontMono}`, textAlign: 'center'}}>→</div>
        <div>
          <div style={{color: theme.muted, font: `9px ${theme.fontMono}`}}>LOOKUP</div>
          <div style={{marginTop: 7, color: theme.text, font: `700 11px ${theme.fontMono}`}}>
            noise.ks.chicago.edu. / A
          </div>
        </div>
      </div>
    </div>
  );
};
