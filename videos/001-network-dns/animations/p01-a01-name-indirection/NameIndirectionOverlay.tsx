import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp, clamp01, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {nameIndirectionTiming, regionNodes, stableDomain} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const mix = (from: number, to: number, progress: number): number =>
  from + (to - from) * progress;

const MythStatement: React.FC<{opacity: number; shift: number}> = ({opacity, shift}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 286,
        width: contentWidth,
        opacity,
        transform: `translateY(${shift}px)`,
      }}
    >
      <div style={{color: theme.muted, font: `15px ${theme.fontMono}`, letterSpacing: 1.8}}>
        ПОПУЛЯРНОЕ ОБЪЯСНЕНИЕ
      </div>
      <div
        style={{
          marginTop: 22,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 82,
          fontWeight: 800,
          letterSpacing: -4.5,
          lineHeight: 0.92,
        }}
      >
        НЕ ЧТОБЫ
        <br />
        <span style={{color: theme.primary}}>ПОМНИТЬ ЧИСЛА</span>
      </div>

      <div style={{position: 'relative', marginTop: 58, width: 600}}>
        <div style={{color: theme.muted, font: `29px ${theme.fontMono}`, letterSpacing: 0.8}}>
          203.0.113.10
        </div>
        <div
          style={{
            position: 'absolute',
            left: -8,
            top: 17,
            width: 306,
            height: 4,
            background: theme.signal,
            transform: 'rotate(-3deg)',
            transformOrigin: 'left center',
          }}
        />
      </div>

      <div style={{marginTop: 52, display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{width: 10, height: 10, background: theme.signal, transform: 'rotate(45deg)'}} />
        <div style={{color: theme.text, font: `700 18px ${theme.fontMono}`, letterSpacing: 1.3}}>
          УДОБСТВО — ТОЛЬКО БОНУС
        </div>
      </div>
    </div>
  );
};

const NameLayer: React.FC<{reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 214,
        width: contentWidth,
        opacity: reveal,
        clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
      }}
    >
      <div style={{color: theme.primary, font: `700 15px ${theme.fontMono}`, letterSpacing: 1.8}}>
        ИМЯ / СТАБИЛЬНАЯ ИДЕНТИЧНОСТЬ
      </div>
      <div
        style={{
          marginTop: 14,
          paddingBottom: 24,
          borderBottom: `3px solid ${theme.primary}`,
          color: theme.text,
          font: `700 52px ${theme.fontMono}`,
          letterSpacing: -2.4,
        }}
      >
        {stableDomain}
      </div>
    </div>
  );
};

const AddressNode: React.FC<{
  address: string;
  active: boolean;
  opacity: number;
  region: string;
  x: number;
}> = ({address, active, opacity, region, x}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 598,
        width: 214,
        opacity,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          boxSizing: 'border-box',
          background: active ? theme.success : theme.background,
          border: `3px solid ${active ? theme.success : theme.line}`,
          transform: 'rotate(45deg)',
        }}
      />
      <div style={{marginTop: 18, color: active ? theme.text : theme.muted, font: `700 17px ${theme.fontMono}`, letterSpacing: 1.8}}>
        {region}
      </div>
      <div style={{marginTop: 10, color: active ? theme.success : theme.muted, font: `15px ${theme.fontMono}`}}>
        {address}
      </div>
      <div style={{marginTop: 12, width: 88, height: 2, background: active ? theme.success : theme.line}} />
    </div>
  );
};

const RoutingLines: React.FC<{
  activeNodeIndex: number;
  clusterProgress: number;
  packetProgress: number;
  reveal: number;
}> = ({activeNodeIndex, clusterProgress, packetProgress, reveal}) => {
  const theme = useChannelTheme();
  const nodeCenters = regionNodes.map((node) => node.x - contentLeft + 9);
  const activeX = nodeCenters[activeNodeIndex] ?? nodeCenters[0];
  const packetY = mix(344, 589, packetProgress);
  const packetX = mix(contentWidth / 2, activeX ?? 0, packetProgress);

  return (
    <svg
      width={contentWidth}
      height={360}
      viewBox={`0 0 ${contentWidth} 360`}
      style={{position: 'absolute', left: contentLeft, top: 344, overflow: 'visible', opacity: reveal}}
    >
      <path d="M430 0 V122" stroke={theme.primary} strokeWidth="3" fill="none" />
      <path
        d={`M430 122 H${nodeCenters[0]} V245`}
        stroke={activeNodeIndex === 0 ? theme.success : theme.line}
        strokeWidth={activeNodeIndex === 0 ? 4 : 2}
        fill="none"
      />
      <path
        d={`M430 122 H${nodeCenters[1]} V245`}
        stroke={activeNodeIndex === 1 ? theme.success : theme.line}
        strokeWidth={activeNodeIndex === 1 ? 4 : 2}
        fill="none"
        opacity={clusterProgress}
      />
      <path
        d={`M430 122 H${nodeCenters[2]} V245`}
        stroke={activeNodeIndex === 2 ? theme.success : theme.line}
        strokeWidth={activeNodeIndex === 2 ? 4 : 2}
        fill="none"
        opacity={clusterProgress}
      />
      <rect
        x={packetX - 7}
        y={packetY - 344 - 7}
        width="14"
        height="14"
        fill={theme.signal}
        transform={`rotate(45 ${packetX} ${packetY - 344})`}
      />
    </svg>
  );
};

const InfrastructureState: React.FC<{opacity: number}> = ({opacity}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const theme = useChannelTheme();
  const nameReveal = smoothProgress(frame, msToFrames(5_100, fps), msToFrames(5_850, fps));
  const moveProgress = smoothProgress(
    frame,
    msToFrames(nameIndirectionTiming.addressMovesMs, fps),
    msToFrames(nameIndirectionTiming.addressMovesMs + 520, fps),
  );
  const clusterProgress = smoothProgress(
    frame,
    msToFrames(nameIndirectionTiming.clustersAppearMs, fps),
    msToFrames(nameIndirectionTiming.clustersAppearMs + 760, fps),
  );
  const rerouteProgress = smoothProgress(
    frame,
    msToFrames(nameIndirectionTiming.routeSwitchesMs, fps),
    msToFrames(nameIndirectionTiming.routeSwitchesMs + 650, fps),
  );
  const activeNodeIndex = rerouteProgress >= 0.5 ? 2 : moveProgress >= 0.5 ? 1 : 0;
  const packetPhase = ((frame - msToFrames(6_000, fps)) % Math.max(1, msToFrames(1_500, fps))) /
    Math.max(1, msToFrames(1_500, fps));
  const packetProgress = clamp01(packetPhase);

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <NameLayer reveal={nameReveal} />
      <RoutingLines
        activeNodeIndex={activeNodeIndex}
        clusterProgress={clusterProgress}
        packetProgress={packetProgress}
        reveal={nameReveal}
      />

      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 478,
          color: theme.muted,
          font: `15px ${theme.fontMono}`,
          letterSpacing: 1.8,
        }}
      >
        АДРЕС / ТЕКУЩЕЕ МЕСТО
      </div>

      {regionNodes.map((node, index) => {
        const nodeOpacity = index === 0 ? 1 - moveProgress * 0.55 : index === 1 ? moveProgress : clusterProgress;
        return (
          <AddressNode
            key={node.region}
            address={node.address}
            active={index === activeNodeIndex}
            opacity={nodeOpacity}
            region={node.region}
            x={node.x}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 804,
          width: contentWidth,
          display: 'flex',
          justifyContent: 'space-between',
          color: theme.muted,
          font: `14px ${theme.fontMono}`,
          letterSpacing: 1.4,
        }}
      >
        <span>{clusterProgress > 0.5 ? 'ОДНО ИМЯ / ТРИ РЕГИОНА' : moveProgress > 0.5 ? 'СЕРВЕР ПЕРЕЕХАЛ / ИМЯ ПРЕЖНЕЕ' : 'ИМЯ УКАЗЫВАЕТ НА АДРЕС'}</span>
        <span style={{color: theme.success}}>{rerouteProgress > 0.5 ? 'ROUTE SWITCH / OK' : 'RESOLVED / OK'}</span>
      </div>
    </div>
  );
};

const FinalThesis: React.FC<{reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 286,
        width: contentWidth,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 28}px)`,
      }}
    >
      <div style={{color: theme.signal, font: `700 16px ${theme.fontMono}`, letterSpacing: 2.2}}>
        УРОВЕНЬ КОСВЕННОСТИ
      </div>
      <div
        style={{
          marginTop: 34,
          paddingBottom: 34,
          borderBottom: `3px solid ${theme.primary}`,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 94,
          fontWeight: 800,
          letterSpacing: -5.8,
          lineHeight: 0.94,
        }}
      >
        ИМЯ = <span style={{color: theme.primary}}>КТО</span>
      </div>
      <div
        style={{
          paddingTop: 34,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 94,
          fontWeight: 800,
          letterSpacing: -5.8,
          lineHeight: 0.94,
        }}
      >
        АДРЕС = <span style={{color: theme.muted}}>ГДЕ</span>
      </div>
      <div style={{marginTop: 74, color: theme.muted, font: `16px ${theme.fontMono}`, letterSpacing: 1.2}}>
        МЕСТО МОЖЕТ МЕНЯТЬСЯ. ИДЕНТИЧНОСТЬ — НЕТ.
      </div>
    </div>
  );
};

export const NameIndirectionOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const theme = useChannelTheme();
  const mythEnter = smoothProgress(frame, 6, 20);
  const mythExit = smoothProgress(
    frame,
    msToFrames(nameIndirectionTiming.mythEndsMs - 320, fps),
    msToFrames(nameIndirectionTiming.mythEndsMs + 180, fps),
  );
  const thesisReveal = smoothProgress(
    frame,
    msToFrames(nameIndirectionTiming.thesisAppearsMs, fps),
    msToFrames(nameIndirectionTiming.thesisAppearsMs + 620, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome
        label="ЗАЧЕМ НУЖНЫ ИМЕНА"
        meta="DNS / IDENTITY"
        progress={runtimeProgress}
      />
      <MythStatement opacity={mythEnter * (1 - mythExit)} shift={(1 - mythEnter) * 24 - mythExit * 18} />
      <InfrastructureState opacity={mythExit * (1 - thesisReveal)} />
      <FinalThesis reveal={thesisReveal} />
    </div>
  );
};
