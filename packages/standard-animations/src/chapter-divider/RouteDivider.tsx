import React from 'react';
import {interpolate} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp} from '@channel/motion-core';
import {
  ChapterLabel,
  formatChapterNumber,
  KineticTitle,
  TechnicalDetail,
  useDividerProgress,
} from './shared';
import type {ChapterDividerProps} from './types';

const routeNodes = [
  {x: 142, label: 'CLIENT'},
  {x: 524, label: 'RESOLVER'},
  {x: 906, label: 'ROOT'},
  {x: 1288, label: 'TLD'},
  {x: 1670, label: 'AUTH'},
] as const;

const routeStartX = routeNodes[0].x;
const routeEndX = 1670;

export const RouteDividerCanvas: React.FC<ChapterDividerProps> = ({
  chapterNumber,
  titleLines,
  eyebrow,
  detail,
}) => {
  const theme = useChannelTheme();
  const {structure, title, detail: detailProgress, settle, depart} = useDividerProgress();
  const packetProgress = interpolate(structure, [0.12, 0.92], [0, 1], clamp);
  const packetX = interpolate(packetProgress, [0, 1], [routeStartX, routeEndX]);
  const routeWidth = packetX - routeStartX;
  const titleShift = interpolate(depart, [0, 1], [0, 38], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundImage: `linear-gradient(90deg, ${theme.line}42 1px, transparent 1px)`,
        backgroundSize: '160px 100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 70,
          right: 112,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ChapterLabel chapterNumber={chapterNumber} light />
        <div style={{color: theme.muted, font: `15px ${theme.fontMono}`, letterSpacing: 2}}>
          TRACE / NEXT SECTION
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: routeStartX,
          top: 244,
          width: routeEndX - routeStartX,
          height: 2,
          background: theme.line,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: routeStartX,
          top: 242,
          width: routeWidth,
          height: 6,
          background: theme.primary,
        }}
      />

      {routeNodes.map((node, index) => {
        const active = packetProgress >= index / (routeNodes.length - 1);
        return (
          <div key={node.label} style={{position: 'absolute', left: node.x, top: 244}}>
            <div
              style={{
                position: 'absolute',
                width: active ? 20 : 12,
                height: active ? 20 : 12,
                transform: 'translate(-50%, -50%) rotate(45deg)',
                background: active ? theme.signal : theme.line,
                border: `3px solid ${theme.background}`,
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 28,
                transform: 'translateX(-50%)',
                color: active ? theme.text : theme.muted,
                font: `700 14px ${theme.fontMono}`,
                letterSpacing: 1.4,
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: packetX,
          top: 244,
          width: 18,
          height: 18,
          background: theme.text,
          border: `4px solid ${theme.signal}`,
          boxSizing: 'border-box',
          transform: 'translate(-50%, -50%) rotate(45deg)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 394,
          width: 230,
          height: 456,
          borderTop: `2px solid ${theme.line}`,
          borderBottom: `2px solid ${theme.line}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '38px 0',
          boxSizing: 'border-box',
          opacity: settle,
        }}
      >
        <div style={{color: theme.muted, font: `15px ${theme.fontMono}`, letterSpacing: 2}}>
          SECTION
        </div>
        <div
          style={{
            color: theme.signal,
            fontFamily: theme.fontSans,
            fontSize: 164,
            fontWeight: 800,
            letterSpacing: -12,
            lineHeight: 0.82,
          }}
        >
          {formatChapterNumber(chapterNumber)}
        </div>
        <div style={{color: theme.muted, font: `14px ${theme.fontMono}`, lineHeight: 1.5}}>
          STATUS / RESOLVED
          <br />
          HOLD / 02.0S
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 420,
          top: 402,
          width: 1320,
          transform: `translateX(${titleShift}px)`,
        }}
      >
        <KineticTitle lines={titleLines} progress={title} accentLine={titleLines.length - 1} />
      </div>

      <div style={{position: 'absolute', left: 426, bottom: 102}}>
        <TechnicalDetail eyebrow={eyebrow} detail={detail} progress={detailProgress} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 420,
          bottom: 74,
          width: settle * 1320,
          height: 3,
          background: theme.line,
        }}
      />
    </div>
  );
};
