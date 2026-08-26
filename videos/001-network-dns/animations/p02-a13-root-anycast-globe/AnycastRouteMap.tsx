import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {AnycastPhase} from './content';
import {anycastSites} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const globe = {left: 310, top: 48, width: 540, height: 414} as const;

const ResolverRail: React.FC<{
  readonly active: boolean;
  readonly resolved: boolean;
}> = ({active, resolved}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'absolute', left: 0, top: 118, width: 264}}>
      <div
        style={{
          padding: '18px 16px',
          borderLeft: `6px solid ${active ? theme.signal : theme.primary}`,
          background: `${theme.surface}F5`,
        }}
      >
        <div style={{color: theme.text, font: `800 15px ${theme.fontSans}`}}>RECURSIVE RESOLVER</div>
        <div style={{marginTop: 11, color: theme.muted, font: `700 9px ${theme.fontMono}`}}>QUERY / ROOT ZONE</div>
      </div>
      <div style={{marginTop: 16, padding: '13px 14px', background: `${theme.background}D8`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
          <span>BGP ROUTE</span>
          <span style={{color: resolved ? theme.success : theme.signal}}>{resolved ? 'SELECTED' : active ? 'COMPARING' : 'IDLE'}</span>
        </div>
        <div style={{marginTop: 13, height: 5, background: theme.line}}>
          <div style={{width: active ? '62%' : '18%', height: '100%', background: resolved ? theme.success : theme.signal}} />
        </div>
      </div>
      <div style={{marginTop: 20, color: theme.muted, font: `700 8px ${theme.fontMono}`, lineHeight: 1.7}}>
        ROUTING DISTANCE<br />≠ MAP DISTANCE
      </div>
    </div>
  );
};

const GlobeGrid: React.FC = () => {
  const theme = useChannelTheme();

  return (
    <>
      <ellipse cx={270} cy={207} rx={260} ry={197} fill={`${theme.surface}A8`} stroke={theme.line} strokeWidth={3} />
      {[58, 116, 174].map((radius) => (
        <ellipse key={radius} cx={270} cy={207} rx={radius} ry={197} fill="none" stroke={theme.line} strokeWidth={1.5} />
      ))}
      {[76, 132, 207, 282, 338].map((y) => {
        const normalized = Math.abs(y - 207) / 197;
        const halfWidth = 260 * Math.sqrt(Math.max(0, 1 - normalized * normalized));
        return <line key={y} x1={270 - halfWidth} y1={y} x2={270 + halfWidth} y2={y} stroke={theme.line} strokeWidth={1.5} />;
      })}
    </>
  );
};

const SiteNode: React.FC<{
  readonly active: boolean;
  readonly label: string;
  readonly visible: number;
  readonly x: number;
  readonly y: number;
}> = ({active, label, visible, x, y}) => {
  const theme = useChannelTheme();

  return (
    <g opacity={visible} transform={`translate(${x} ${y})`}>
      <circle r={active ? 15 : 10} fill={active ? theme.success : theme.primary} stroke={theme.text} strokeWidth={active ? 3 : 1.5} />
      <circle r={active ? 25 : 18} fill="none" stroke={active ? theme.success : theme.primary} strokeWidth={2} opacity={0.45} />
      <text x={active ? 22 : 17} y={4} fill={active ? theme.success : theme.muted} fontFamily={theme.fontMono} fontSize={8} fontWeight={700}>
        {label}
      </text>
    </g>
  );
};

export const AnycastRouteMap: React.FC<{
  readonly phase: AnycastPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const showAnnouncements = phase.focus === 'anycast' || phase.focus === 'route' || phase.focus === 'resolved';
  const showRoute = phase.focus === 'route' || phase.focus === 'resolved';
  const resolved = phase.focus === 'resolved';
  const siteReveal = phase.focus === 'replication' ? phaseProgress : 1;
  const selectedSite = anycastSites[2];
  const routeProgress = showRoute ? (phase.focus === 'route' ? phaseProgress : 1) : 0;
  const routeState = resolved
    ? 'QUERY DELIVERED'
    : showRoute
      ? 'ROUTE SELECTION'
      : showAnnouncements
        ? 'ROUTE ANNOUNCEMENTS'
        : 'INSTANCES ONLINE';

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 382, width: contentWidth, height: 570, opacity: reveal}}>
      <div
        style={{
          position: 'absolute',
          left: 330,
          top: 0,
          width: 490,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '11px 14px',
          boxSizing: 'border-box',
          borderTop: `5px solid ${showAnnouncements ? theme.signal : theme.primary}`,
          background: `${theme.surface}F3`,
        }}
      >
        <span style={{color: theme.text, font: `800 11px ${theme.fontMono}`}}>ROOT ID / SAME SERVICE ADDRESS</span>
        <span style={{color: showAnnouncements ? theme.signal : theme.muted, font: `800 10px ${theme.fontMono}`}}>
          {showAnnouncements ? 'ANYCAST' : 'REPLICATED'}
        </span>
      </div>

      <ResolverRail active={showAnnouncements} resolved={resolved} />

      <svg
        width={globe.width}
        height={globe.height}
        style={{position: 'absolute', left: globe.left, top: globe.top, overflow: 'visible'}}
      >
        <GlobeGrid />

        {showAnnouncements && anycastSites.map((site, index) => (
          <line
            key={`announce-${site.id}`}
            x1={270}
            y1={18}
            x2={site.x}
            y2={site.y}
            stroke={index === 2 && showRoute ? theme.success : theme.signal}
            strokeDasharray="5 8"
            strokeWidth={index === 2 && showRoute ? 3 : 1.5}
            opacity={clamp01(phaseProgress + index * 0.08)}
          />
        ))}

        {showRoute && (
          <path
            d={`M -50 220 C 56 220, 118 260, ${selectedSite.x} ${selectedSite.y}`}
            fill="none"
            pathLength={1}
            stroke={theme.success}
            strokeDasharray={1}
            strokeDashoffset={1 - routeProgress}
            strokeWidth={6}
          />
        )}

        {anycastSites.map((site, index) => (
          <SiteNode
            key={site.id}
            active={showRoute && index === 2}
            label={site.label}
            visible={clamp01(siteReveal * 1.7 - index * 0.12)}
            x={site.x}
            y={site.y}
          />
        ))}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 330,
          top: 488,
          width: 490,
          display: 'flex',
          justifyContent: 'space-between',
          color: theme.muted,
          font: `700 8px ${theme.fontMono}`,
        }}
      >
        <span>ONE ADDRESS / MANY SITES</span>
        <span style={{color: resolved ? theme.success : theme.signal}}>{routeState}</span>
      </div>
    </div>
  );
};
