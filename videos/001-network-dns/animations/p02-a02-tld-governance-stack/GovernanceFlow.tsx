import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {governanceRoles} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const RoleRow: React.FC<{
  readonly active: boolean;
  readonly index: number;
  readonly reveal: number;
}> = ({active, index, reveal}) => {
  const theme = useChannelTheme();
  const role = governanceRoles[index];
  if (!role) return null;
  const accent = theme[role.accent];

  return (
    <div
      style={{
        position: 'relative',
        height: 142,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '64px 248px 1fr',
        alignItems: 'center',
        borderTop: `3px solid ${active ? accent : theme.line}`,
        opacity: reveal * (active ? 1 : 0.56),
        transform: `translateX(${(1 - reveal) * 28}px)`,
      }}
    >
      <div style={{color: active ? accent : theme.muted, font: `700 15px ${theme.fontMono}`}}>
        {role.index}
      </div>
      <div>
        <div style={{color: theme.text, font: `800 24px ${theme.fontSans}`, letterSpacing: -0.5}}>
          {role.name}
        </div>
        <div style={{marginTop: 9, color: accent, font: `700 11px ${theme.fontMono}`, letterSpacing: 0.9}}>
          {role.example}
        </div>
      </div>
      <div style={{justifySelf: 'end', color: active ? theme.text : theme.muted, font: `700 13px ${theme.fontMono}`, letterSpacing: 0.9}}>
        {role.action}
      </div>
      {index < governanceRoles.length - 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 27,
            bottom: -10,
            width: 14,
            height: 14,
            background: active ? accent : theme.line,
            transform: 'rotate(45deg)',
            zIndex: 2,
          }}
        />
      ) : null}
    </div>
  );
};

export const GovernanceFlow: React.FC<{
  readonly activeIndex: number;
  readonly domainProgress: number;
  readonly reveal: number;
}> = ({activeIndex, domainProgress, reveal}) => {
  const theme = useChannelTheme();
  const routeTop = 108;
  const routeHeight = 426;
  const markerY = routeTop + routeHeight * domainProgress;

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 188,
        width: contentWidth,
        height: 760,
        opacity: reveal,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 30}}>
        <div style={{color: theme.signal, font: `700 14px ${theme.fontMono}`, letterSpacing: 1.8}}>
          ОДНО ИМЯ / ЧЕТЫРЕ РОЛИ
        </div>
        <div style={{color: theme.muted, font: `12px ${theme.fontMono}`, letterSpacing: 1.1}}>
          .COM → EXAMPLE.COM
        </div>
      </div>

      <div style={{position: 'absolute', left: 27, top: routeTop, width: 2, height: routeHeight, background: theme.line}}>
        <div style={{width: '100%', height: `${domainProgress * 100}%`, background: theme.signal}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 12,
          top: markerY - 15,
          width: 30,
          height: 30,
          background: theme.signal,
          transform: 'rotate(45deg)',
        }}
      />

      <div style={{position: 'absolute', left: 0, top: 52, width: contentWidth}}>
        {governanceRoles.map((role, index) => {
          const rowReveal = clamp01(reveal * 1.6 - index * 0.13);
          return (
            <RoleRow
              key={role.id}
              active={index === activeIndex}
              index={index}
              reveal={rowReveal}
            />
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 650,
          width: contentWidth,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: clamp01(domainProgress * 2 - 0.9),
        }}
      >
        <div style={{width: 14, height: 14, background: theme.success, transform: 'rotate(45deg)'}} />
        <div style={{color: theme.text, font: `800 22px ${theme.fontSans}`, letterSpacing: -0.5}}>
          КООРДИНАЦИЯ ≠ РЕЕСТР ≠ ПРОДАЖА
        </div>
      </div>
    </div>
  );
};
