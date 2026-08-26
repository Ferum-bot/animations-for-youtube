import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {ResolverRole} from './content';
import {resolverRoles} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const cardWidth = 264;
const cardGap = 34;
const routeLeft = cardWidth / 2;
const routeWidth = (cardWidth + cardGap) * 2;

const InitialProcess: React.FC<{
  readonly reveal: number;
}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: 20,
        right: 20,
        top: 92,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 14}px)`,
      }}
    >
      <div
        style={{
          color: theme.primary,
          font: `700 10px ${theme.fontMono}`,
          letterSpacing: 1.4,
        }}
      >
        ЛОКАЛЬНО НА УСТРОЙСТВЕ
      </div>
      <div
        style={{
          marginTop: 16,
          color: theme.text,
          font: `800 25px ${theme.fontSans}`,
          letterSpacing: -0.8,
        }}
      >
        ТВОЙ ПРОЦЕСС
      </div>
      <div
        style={{
          marginTop: 13,
          color: theme.muted,
          font: `10px ${theme.fontMono}`,
          lineHeight: 1.6,
        }}
      >
        БРАУЗЕР / CLI
        <br />
        ТВОЁ ПРИЛОЖЕНИЕ
      </div>
    </div>
  );
};

const RoleDetail: React.FC<{
  readonly reveal: number;
  readonly role: ResolverRole;
}> = ({reveal, role}) => {
  const theme = useChannelTheme();
  const accent = theme[role.accent];

  if (role.id === 'stub') {
    return (
      <div
        style={{
          marginTop: 22,
          borderTop: `2px solid ${theme.line}`,
          paddingTop: 14,
          opacity: reveal,
        }}
      >
        <div style={{color: theme.primary, font: `700 11px ${theme.fontMono}`}}>
          getaddrinfo()
        </div>
        <div style={{marginTop: 8, color: theme.muted, font: `10px ${theme.fontMono}`}}>
          libc / OS API
        </div>
      </div>
    );
  }

  if (role.id === 'recursive') {
    return (
      <div style={{marginTop: 20, opacity: reveal}}>
        {['8.8.8.8', '1.1.1.1', 'ISP RESOLVER'].map((label, index) => (
          <div
            key={label}
            style={{
              borderTop: `2px solid ${index === 0 ? accent : theme.line}`,
              padding: '8px 0',
              color: index === 0 ? theme.text : theme.muted,
              font: `10px ${theme.fontMono}`,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{marginTop: 20, opacity: reveal}}>
      {['ROOT', '.EDU', 'CHICAGO.EDU'].map((label, index) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: index === 0 ? 0 : 11,
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              background: index === 2 ? accent : theme.line,
              transform: 'rotate(45deg)',
            }}
          />
          <div
            style={{
              color: index === 2 ? theme.text : theme.muted,
              font: `10px ${theme.fontMono}`,
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

const RoleLocationCard: React.FC<{
  readonly active: boolean;
  readonly detailReveal: number;
  readonly entityReveal: number;
  readonly index: number;
  readonly processReveal: number;
  readonly reveal: number;
  readonly role: ResolverRole;
}> = ({active, detailReveal, entityReveal, index, processReveal, reveal, role}) => {
  const theme = useChannelTheme();
  const accent = theme[role.accent];
  const locationReveal = role.id === 'stub' ? entityReveal : reveal;

  return (
    <div
      style={{
        position: 'absolute',
        left: index * (cardWidth + cardGap),
        top: active ? -10 : 0,
        width: cardWidth,
        height: 318,
        boxSizing: 'border-box',
        padding: '18px 18px 0',
        border: `2px solid ${active ? accent : theme.line}`,
        borderTopWidth: 6,
        background: active ? `${theme.surface}F5` : `${theme.surface}D8`,
        opacity: reveal * (active ? 1 : 0.76),
        transform: `translateY(${(1 - reveal) * 28}px)`,
      }}
    >
      {role.id === 'stub' ? (
        <InitialProcess
          reveal={processReveal * Math.max(0, 1 - entityReveal * 2.4)}
        />
      ) : null}

      <div style={{opacity: locationReveal}}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span
            style={{
              color: active ? accent : theme.muted,
              font: `700 10px ${theme.fontMono}`,
              letterSpacing: 0.8,
            }}
          >
            {role.location}
          </span>
          <span style={{color: theme.muted, font: `700 9px ${theme.fontMono}`}}>
            {role.index}
          </span>
        </div>
        <div
          style={{
            marginTop: 8,
            color: theme.muted,
            font: `9px ${theme.fontMono}`,
            letterSpacing: 0.4,
          }}
        >
          {role.locationMeta}
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
          padding: '14px 14px 12px',
          borderLeft: `5px solid ${accent}`,
          background: `${theme.background}B8`,
          opacity: entityReveal,
          transform: `translateY(${(1 - entityReveal) * 18}px)`,
        }}
      >
        <div
          style={{
            color: theme.text,
            font: `800 19px ${theme.fontSans}`,
            letterSpacing: -0.5,
          }}
        >
          {role.title}
        </div>
        <div
          style={{
            marginTop: 9,
            color: accent,
            font: `700 9px ${theme.fontMono}`,
            letterSpacing: 0.5,
            lineHeight: 1.4,
          }}
        >
          {role.subtitle}
        </div>
      </div>

      <RoleDetail reveal={detailReveal} role={role} />
    </div>
  );
};

export const ResolverRoleChain: React.FC<{
  readonly activeIndex: number;
  readonly authorityReveal: number;
  readonly completeReveal: number;
  readonly overviewReveal: number;
  readonly processReveal: number;
  readonly recursiveDetailReveal: number;
  readonly recursiveReveal: number;
  readonly routeProgress: number;
  readonly stubDetailReveal: number;
  readonly stubReveal: number;
}> = ({
  activeIndex,
  authorityReveal,
  completeReveal,
  overviewReveal,
  processReveal,
  recursiveDetailReveal,
  recursiveReveal,
  routeProgress,
  stubDetailReveal,
  stubReveal,
}) => {
  const theme = useChannelTheme();
  const roleReveals = {
    stub: overviewReveal,
    recursive: recursiveReveal,
    authority: authorityReveal,
  } as const;
  const entityReveals = {
    stub: stubReveal,
    recursive: recursiveReveal,
    authority: authorityReveal,
  } as const;
  const detailReveals = {
    stub: stubDetailReveal,
    recursive: recursiveDetailReveal,
    authority: authorityReveal,
  } as const;

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 382,
        width: contentWidth,
        height: 580,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: routeLeft,
          top: 352,
          width: routeWidth,
          height: 3,
          background: theme.line,
          opacity: stubReveal,
        }}
      >
        <div
          style={{
            width: `${routeProgress * 100}%`,
            height: '100%',
            background: theme.primary,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: routeLeft - 9 + routeProgress * routeWidth,
          top: 344,
          width: 18,
          height: 18,
          background:
            activeIndex === 2
              ? theme.success
              : activeIndex === 1
                ? theme.signal
                : theme.primary,
          opacity: stubReveal,
          transform: 'rotate(45deg)',
        }}
      />

      {resolverRoles.map((role, index) => (
        <RoleLocationCard
          key={role.id}
          active={index === activeIndex}
          detailReveal={detailReveals[role.id]}
          entityReveal={entityReveals[role.id]}
          index={index}
          processReveal={processReveal}
          reveal={roleReveals[role.id]}
          role={role}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 418,
          width: contentWidth,
          display: 'grid',
          gridTemplateColumns: '1fr 56px 1fr 56px 1fr',
          alignItems: 'center',
          opacity: completeReveal,
        }}
      >
        {['ASK', '→', 'RESOLVE', '→', 'AUTHORITATIVE DATA'].map((label, index) => (
          <div
            key={`${label}-${index}`}
            style={{
              color:
                index === 0
                  ? theme.primary
                  : index === 2
                    ? theme.signal
                    : index === 4
                      ? theme.success
                      : theme.muted,
              font: `${index % 2 === 0 ? 700 : 400} ${index % 2 === 0 ? 12 : 20}px ${theme.fontMono}`,
              textAlign: 'center',
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 500,
          width: contentWidth,
          color: theme.text,
          font: `800 24px ${theme.fontSans}`,
          letterSpacing: -0.7,
          textAlign: 'center',
          opacity: completeReveal,
        }}
      >
        КЛИЕНТ НЕ ХОДИТ ПО ДЕРЕВУ САМ
      </div>
    </div>
  );
};
