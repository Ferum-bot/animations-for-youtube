import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {CacheRoute} from './content';
import {cacheEntries} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const CacheStore: React.FC<{
  readonly entryCount: 0 | 1 | 2 | 3;
  readonly route: CacheRoute;
  readonly ttlProgress: number;
}> = ({entryCount, route, ttlProgress}) => {
  const theme = useChannelTheme();
  const authoritativeContrast = route === 'authority';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 74,
        width: 324,
        height: 308,
        boxSizing: 'border-box',
        padding: '18px 18px 16px',
        borderTop: `6px solid ${route === 'warm' ? theme.success : theme.primary}`,
        background: `${theme.surface}F5`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{color: theme.text, font: `800 19px ${theme.fontSans}`}}>RECURSIVE CACHE</span>
        <span style={{color: theme.primary, font: `700 9px ${theme.fontMono}`}}>LOCAL COPY</span>
      </div>
      <div style={{marginTop: 8, color: authoritativeContrast ? theme.signal : theme.muted, font: `700 9px ${theme.fontMono}`}}>
        {authoritativeContrast ? 'NON-AUTHORITATIVE / MAY BE STALE' : 'NEAREST REUSABLE KNOWLEDGE'}
      </div>

      <div style={{marginTop: 18}}>
        {cacheEntries.map((entry, index) => {
          const visible = index < entryCount;
          const isRecord = index === 2;
          return (
            <div
              key={entry.label}
              style={{
                height: 56,
                marginBottom: 8,
                padding: '10px 11px',
                boxSizing: 'border-box',
                borderLeft: `4px solid ${visible ? (isRecord ? theme.success : theme.primary) : theme.line}`,
                background: `${theme.background}${visible ? 'D8' : '78'}`,
                opacity: visible ? (route === 'ttl' && isRecord ? 0.38 + ttlProgress * 0.62 : 1) : 0.23,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: theme.text, font: `700 10px ${theme.fontMono}`}}>{entry.label}</span>
                <span style={{color: visible ? theme.primary : theme.muted, font: `700 9px ${theme.fontMono}`}}>
                  {entry.type}
                </span>
              </div>
              <div style={{marginTop: 7, color: theme.muted, font: `8px ${theme.fontMono}`}}>{entry.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 18, right: 18, bottom: 13}}>
        <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
          <span>TTL / REMAINING</span>
          <span>{route === 'ttl' ? `${Math.round(ttlProgress * 100)}%` : 'ACTIVE'}</span>
        </div>
        <div style={{height: 4, marginTop: 6, background: theme.line}}>
          <div
            style={{
              width: `${(route === 'ttl' ? ttlProgress : entryCount > 0 ? 1 : 0) * 100}%`,
              height: '100%',
              background: ttlProgress < 0.24 ? theme.signal : theme.success,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AuthorityPath: React.FC<{
  readonly phaseProgress: number;
  readonly route: CacheRoute;
}> = ({phaseProgress, route}) => {
  const theme = useChannelTheme();
  const nodes = [
    {label: 'ROOT', detail: 'REFERRAL'},
    {label: '.EDU', detail: 'TLD'},
    {label: 'CHICAGO', detail: 'ZONE'},
    {label: 'KS / AUTH', detail: 'SOURCE'},
  ] as const;
  const isBypassed = (index: number): boolean =>
    (route === 'skip-root' && index === 0) ||
    (route === 'skip-tld' && index <= 1) ||
    route === 'warm';
  const activeThrough = route === 'cold' || route === 'fill' ? 3 : route === 'skip-root' ? 3 : route === 'skip-tld' ? 3 : -1;

  return (
    <div style={{position: 'absolute', left: 376, top: 50, width: 484, height: 350}}>
      <svg width={484} height={350} style={{position: 'absolute', inset: 0}}>
        <line x1={42} y1={46} x2={42} y2={300} stroke={theme.line} strokeWidth={3} />
        {nodes.map((_, index) => (
          <line
            key={index}
            x1={42}
            y1={46 + index * 84}
            x2={76}
            y2={46 + index * 84}
            stroke={isBypassed(index) ? theme.signal : index <= activeThrough ? theme.success : theme.line}
            strokeWidth={4}
          />
        ))}
        {(route === 'cold' || route === 'fill' || route === 'skip-root' || route === 'skip-tld') && (
          <line
            x1={42}
            y1={route === 'skip-tld' ? 214 : route === 'skip-root' ? 130 : 46}
            x2={42}
            y2={46 + 252 * phaseProgress}
            stroke={theme.success}
            strokeWidth={4}
          />
        )}
      </svg>

      {nodes.map((node, index) => {
        const bypassed = isBypassed(index);
        const source = index === 3;
        const highlighted = route === 'authority' && source;
        return (
          <div
            key={node.label}
            style={{
              position: 'absolute',
              left: 76,
              top: index * 84 + 18,
              width: 280,
              height: 56,
              padding: '11px 14px',
              boxSizing: 'border-box',
              borderLeft: `5px solid ${highlighted ? theme.success : bypassed ? theme.signal : source ? theme.success : theme.line}`,
              background: `${theme.surface}${highlighted ? 'FA' : 'C8'}`,
              opacity: bypassed ? 0.24 : route === 'warm' ? 0.18 : 1,
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: theme.text, font: `800 13px ${theme.fontSans}`}}>{node.label}</span>
              <span style={{color: source ? theme.success : theme.muted, font: `700 8px ${theme.fontMono}`}}>{node.detail}</span>
            </div>
            <div style={{marginTop: 7, color: bypassed ? theme.signal : theme.muted, font: `8px ${theme.fontMono}`}}>
              {bypassed ? 'BYPASSED BY CACHE' : source ? 'AUTHORITATIVE DATA' : 'REFERRAL LAYER'}
            </div>
          </div>
        );
      })}

      {route === 'warm' && (
        <div style={{position: 'absolute', left: 0, top: 126, color: theme.success, font: `800 22px ${theme.fontSans}`}}>
          ← HIT
        </div>
      )}
      {route === 'authority' && (
        <div style={{position: 'absolute', left: 367, top: 270, color: theme.signal, font: `700 9px ${theme.fontMono}`, width: 116}}>
          NO PUSH<br />TO CACHES
        </div>
      )}
    </div>
  );
};

const TtlTradeoff: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();
  const options = [
    {
      label: 'LONG TTL',
      accent: theme.primary,
      meter: 0.92,
      benefit: 'FAST / FEWER QUERIES',
      cost: 'POSSIBLY STALE LONGER',
    },
    {
      label: 'SHORT TTL',
      accent: theme.signal,
      meter: 0.28,
      benefit: 'FRESHER SOONER',
      cost: 'MORE DNS QUERIES',
    },
  ] as const;

  return (
    <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, opacity: reveal}}>
      {options.map((option, index) => (
        <div
          key={option.label}
          style={{
            height: 292,
            marginTop: 58,
            padding: '28px 24px',
            boxSizing: 'border-box',
            borderTop: `7px solid ${option.accent}`,
            background: `${theme.surface}F2`,
            transform: `translateY(${(1 - reveal) * (index === 0 ? -14 : 14)}px)`,
          }}
        >
          <div style={{color: option.accent, font: `700 12px ${theme.fontMono}`}}>0{index + 1} / {option.label}</div>
          <div style={{marginTop: 28, height: 8, background: theme.line}}>
            <div style={{width: `${option.meter * reveal * 100}%`, height: '100%', background: option.accent}} />
          </div>
          <div style={{marginTop: 33, color: theme.text, font: `800 20px ${theme.fontSans}`}}>{option.benefit}</div>
          <div style={{marginTop: 18, color: theme.muted, font: `700 11px ${theme.fontMono}`}}>{option.cost}</div>
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 186,
          width: 30,
          height: 30,
          marginLeft: -15,
          color: theme.text,
          background: theme.background,
          font: `800 21px ${theme.fontSans}`,
          textAlign: 'center',
        }}
      >
        ↔
      </div>
    </div>
  );
};

export const CacheLifecycleDiagram: React.FC<{
  readonly entryCount: 0 | 1 | 2 | 3;
  readonly phaseProgress: number;
  readonly reveal: number;
  readonly route: CacheRoute;
  readonly ttlProgress: number;
}> = ({entryCount, phaseProgress, reveal, route, ttlProgress}) => (
  <div
    style={{
      position: 'absolute',
      left: contentLeft,
      top: 382,
      width: contentWidth,
      height: 580,
      opacity: reveal,
    }}
  >
    {route === 'tradeoff' ? (
      <TtlTradeoff reveal={phaseProgress} />
    ) : (
      <>
        <CacheStore entryCount={entryCount} route={route} ttlProgress={ttlProgress} />
        <AuthorityPath phaseProgress={phaseProgress} route={route} />
      </>
    )}
  </div>
);
