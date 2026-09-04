import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {msToFrames, smoothProgress} from '@channel/motion-core';
import {whiteboardTheme as color} from '../../shared/whiteboardTheme';
import {
  afterGetOrder,
  afterSetOrder,
  cacheEntries,
  initialOrder,
  timing,
} from './content';
import type {CacheKey} from './content';

const BOARD_WIDTH = 1920;
const BOARD_HEIGHT = 1080;
const MAP_LEFT = 92;
const MAP_TOP = 292;
const MAP_WIDTH = 438;
const MAP_HEADER_HEIGHT = 66;
const MAP_ROW_HEIGHT = 66;
const LIST_LEFT = 660;
const LIST_TOP = 620;
const NODE_WIDTH = 176;
const NODE_HEIGHT = 112;
const NODE_STEP = 205;

type ProgressAt = (startMs: number, endMs: number) => number;
type Point = {readonly x: number; readonly y: number};

const clampOpacity = (value: number): number => Math.max(0, Math.min(1, value));

const windowOpacity = (
  at: ProgressAt,
  startMs: number,
  endMs: number,
  fadeMs = 650,
): number =>
  clampOpacity(at(startMs, startMs + fadeMs) * (1 - at(endMs - fadeMs, endMs)));

const PaperBackground: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: color.paper}}>
    <svg width={BOARD_WIDTH} height={BOARD_HEIGHT} aria-hidden="true">
      <defs>
        <pattern id="paper-dots" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.45" fill={color.gridDot} opacity="0.52" />
        </pattern>
      </defs>
      <rect width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="url(#paper-dots)" />
    </svg>
  </div>
);

const Highlighter: React.FC<{width: number; colorValue: string; progress: number}> = ({
  width,
  colorValue,
  progress,
}) => (
  <span
    style={{
      position: 'absolute',
      left: -7,
      bottom: 2,
      width,
      height: 18,
      background: colorValue,
      opacity: 0.32,
      transform: `scaleX(${progress}) rotate(-1.2deg)`,
      transformOrigin: 'left center',
      zIndex: -1,
    }}
  />
);

const Headline: React.FC<{
  eyebrow: string;
  children: React.ReactNode;
  opacity: number;
  accent: string;
  width: number;
}> = ({eyebrow, children, opacity, accent, width}) => (
  <div
    style={{
      position: 'absolute',
      left: 92,
      top: 58,
      opacity,
      transform: `translateY(${(1 - opacity) * 12}px)`,
      color: color.ink,
    }}
  >
    <div
      style={{
        color: accent,
        fontFamily: color.monoFont,
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: 2.1,
      }}
    >
      {eyebrow}
    </div>
    <div
      style={{
        position: 'relative',
        marginTop: 7,
        fontFamily: color.handFont,
        fontSize: 50,
        fontWeight: 700,
        lineHeight: 1.04,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      <Highlighter width={width} colorValue={accent} progress={opacity} />
    </div>
  </div>
);

const Caption: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  opacity: number;
  colorValue?: string;
}> = ({children, x, y, opacity, colorValue = color.ink}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      color: colorValue,
      fontFamily: color.handFont,
      fontSize: 29,
      fontWeight: 700,
      lineHeight: 1.12,
      opacity,
      transform: `translateY(${(1 - opacity) * 10}px) rotate(-0.4deg)`,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

type ArrowTone = 'ink' | 'redis' | 'cobalt' | 'green';

const markerId = (tone: ArrowTone): string => `arrow-${tone}`;

const DiagramDefs: React.FC = () => (
  <defs>
    {(
      [
        ['ink', color.ink],
        ['redis', color.redis],
        ['cobalt', color.cobalt],
        ['green', color.green],
      ] as const
    ).map(([tone, fill]) => (
      <marker
        key={tone}
        id={markerId(tone)}
        viewBox="0 0 10 10"
        refX="8.2"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto-start-reverse"
      >
        <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke={fill} strokeWidth="1.55" />
      </marker>
    ))}
  </defs>
);

const MarkerPath: React.FC<{
  d: string;
  tone?: ArrowTone;
  opacity?: number;
  progress?: number;
  width?: number;
  bidirectional?: boolean;
  dashed?: boolean;
}> = ({
  d,
  tone = 'ink',
  opacity = 1,
  progress = 1,
  width = 4,
  bidirectional = false,
  dashed = false,
}) => {
  const stroke = color[tone];
  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={width + 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.11"
        transform="translate(1.4 1.2)"
      />
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={dashed ? '0.045 0.035' : 1}
        strokeDashoffset={dashed ? 0 : 1 - progress}
        markerStart={bidirectional ? `url(#${markerId(tone)})` : undefined}
        markerEnd={`url(#${markerId(tone)})`}
      />
    </g>
  );
};

const CacheBoundary: React.FC<{progress: number}> = ({progress}) => (
  <svg
    width={BOARD_WIDTH}
    height={BOARD_HEIGHT}
    style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
    aria-hidden="true"
  >
    <rect
      x="55"
      y="196"
      width="1810"
      height="782"
      rx="34"
      fill={color.paperRaised}
      fillOpacity={0.56 * progress}
      opacity={progress}
      stroke={color.ink}
      strokeWidth="3.5"
      pathLength={1}
      strokeDasharray="1"
      strokeDashoffset={1 - progress}
      strokeLinecap="round"
    />
    <path
      d="M 870 194 C 935 184, 1004 188, 1075 194"
      fill="none"
      stroke={color.redisDark}
      strokeWidth="5"
      pathLength={1}
      strokeDasharray="1"
      strokeDashoffset={1 - progress}
      strokeLinecap="round"
      opacity={progress}
    />
  </svg>
);

const StructureLabels: React.FC<{opacity: number; underlineProgress: number}> = ({
  opacity,
  underlineProgress,
}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: MAP_LEFT + 15,
        top: 225,
        opacity,
        fontFamily: color.handFont,
        fontSize: 38,
        fontWeight: 700,
        transform: 'rotate(-1deg)',
      }}
    >
      HashMap
    </div>
    <div
      style={{
        position: 'absolute',
        left: LIST_LEFT + 305,
        top: 530,
        opacity,
        fontFamily: color.handFont,
        fontSize: 38,
        fontWeight: 700,
        transform: 'rotate(0.5deg)',
      }}
    >
      Doubly Linked List
    </div>
    <svg width={BOARD_WIDTH} height={BOARD_HEIGHT} style={{position: 'absolute', inset: 0, opacity}} aria-hidden="true">
      <path
        d={`M ${MAP_LEFT + 13} 273 C ${MAP_LEFT + 122} 278, ${MAP_LEFT + 240} 267, ${MAP_LEFT + 354} 274`}
        fill="none"
        stroke={color.redis}
        strokeWidth="7"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - underlineProgress}
        opacity="0.72"
      />
      <path
        d={`M ${LIST_LEFT + 292} 574 C ${LIST_LEFT + 494} 581, ${LIST_LEFT + 713} 568, ${LIST_LEFT + 933} 575`}
        fill="none"
        stroke={color.cobalt}
        strokeWidth="7"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - underlineProgress}
        opacity="0.68"
      />
    </svg>
  </>
);

const HashMap: React.FC<{
  opacity: number;
  rowProgress: number;
  setRowProgress: number;
  evictProgress: number;
  activeKey: CacheKey | null;
}> = ({opacity, rowProgress, setRowProgress, evictProgress, activeKey}) => (
  <div
    style={{
      position: 'absolute',
      left: MAP_LEFT,
      top: MAP_TOP,
      width: MAP_WIDTH,
      height: MAP_HEADER_HEIGHT + MAP_ROW_HEIGHT * (6 - evictProgress),
      overflow: 'hidden',
      opacity,
      background: color.paperRaised,
      border: `3px solid ${color.ink}`,
      boxShadow: `5px 6px 0 ${color.ink}14`,
      transform: `translateX(${(1 - opacity) * -24}px) rotate(-0.25deg)`,
    }}
  >
    <div
      style={{
        height: MAP_HEADER_HEIGHT,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        borderBottom: `3px solid ${color.ink}`,
        color: color.redisDark,
        fontFamily: color.monoFont,
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: 1.3,
      }}
    >
      <div style={{paddingLeft: 24}}>KEY</div>
      <div style={{paddingLeft: 24, borderLeft: `2px solid ${color.ink}`}}>VALUE</div>
    </div>
    {cacheEntries.map((entry, index) => {
      const isSetEntry = entry.key === 'key-88';
      const isEvicted = entry.key === 'key-99';
      const reveal = isSetEntry
        ? setRowProgress
        : smoothProgress(rowProgress, index / 6, Math.min(1, index / 6 + 0.22));
      const rowOpacity = reveal * (isEvicted ? 1 - evictProgress : 1);
      const active = entry.key === activeKey;
      const activeColor = entry.key === 'key-88' ? color.redis : color.cobalt;
      return (
        <div
          key={entry.key}
          style={{
            position: 'relative',
            height: MAP_ROW_HEIGHT,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            borderBottom: index === cacheEntries.length - 1 ? undefined : `2px solid ${color.ink}`,
            background: active ? `${activeColor}18` : 'transparent',
            fontFamily: color.monoFont,
            fontSize: 18,
            opacity: rowOpacity,
            transform: `translate(${(1 - reveal) * -18}px, ${isSetEntry ? -MAP_ROW_HEIGHT * evictProgress : 0}px)`,
          }}
        >
          <div style={{paddingLeft: 22, fontWeight: 750}}>{entry.key}</div>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 22,
              borderLeft: `2px solid ${color.ink}`,
              color: active ? activeColor : color.mutedInk,
              fontWeight: active ? 800 : 600,
            }}
          >
            Node*
          </div>
          {isEvicted ? (
            <div
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                top: '50%',
                height: 5,
                background: color.redis,
                transform: `scaleX(${evictProgress}) rotate(-1deg)`,
                transformOrigin: 'left center',
              }}
            />
          ) : null}
        </div>
      );
    })}
  </div>
);

const NodeCard: React.FC<{
  cacheKey: CacheKey;
  position: Point;
  opacity: number;
  activeTone: 'none' | 'redis' | 'cobalt';
}> = ({cacheKey, position, opacity, activeTone}) => {
  const accent = activeTone === 'redis' ? color.redis : activeTone === 'cobalt' ? color.cobalt : color.ink;
  const value = cacheEntries.find((entry) => entry.key === cacheKey)?.value ?? '';
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        boxSizing: 'border-box',
        opacity,
        background: color.paperRaised,
        border: `4px solid ${accent}`,
        boxShadow: `6px 7px 0 ${accent}18`,
        transform: `rotate(${cacheKey === 'key-42' ? -0.55 : 0.35}deg) scale(${0.94 + opacity * 0.06})`,
        transformOrigin: 'center center',
        color: color.ink,
      }}
    >
      <div
        style={{
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `2px solid ${accent}`,
          color: accent,
          fontFamily: color.monoFont,
          fontSize: 19,
          fontWeight: 850,
        }}
      >
        {cacheKey}
      </div>
      <div
        style={{
          height: 58,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color.mutedInk,
          fontFamily: color.monoFont,
          fontSize: 15,
          fontWeight: 650,
        }}
      >
        {value}
      </div>
    </div>
  );
};

const PositionTag: React.FC<{
  label: 'HEAD' | 'TAIL';
  position: Point;
  opacity: number;
}> = ({label, position, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: position.x + 30,
      top: label === 'HEAD' ? position.y - 35 : position.y + NODE_HEIGHT + 5,
      width: NODE_WIDTH - 60,
      color: label === 'HEAD' ? color.cobalt : color.redisDark,
      fontFamily: color.handFont,
      fontSize: 24,
      fontWeight: 700,
      textAlign: 'center',
      opacity,
    }}
  >
    {label}
  </div>
);

const NodeAnatomy: React.FC<{opacity: number; fieldProgress: number}> = ({opacity, fieldProgress}) => {
  const fields = ['prev', 'key', 'value', 'next', 'expiresAt'] as const;
  return (
    <div
      style={{
        position: 'absolute',
        left: 720,
        top: 292,
        width: 1025,
        height: 154,
        boxSizing: 'border-box',
        padding: 18,
        opacity,
        background: color.paperRaised,
        border: `4px solid ${color.cobalt}`,
        boxShadow: `7px 8px 0 ${color.cobalt}14`,
        transform: `translateY(${(1 - opacity) * 18}px) rotate(0.25deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: -35,
          color: color.cobalt,
          fontFamily: color.handFont,
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        Node хранит всё для O(1) перестановки
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', height: '100%'}}>
        {fields.map((field, index) => {
          const reveal = smoothProgress(
            fieldProgress,
            index / fields.length,
            Math.min(1, index / fields.length + 0.28),
          );
          const important = field === 'prev' || field === 'next';
          return (
            <div
              key={field}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: index === fields.length - 1 ? undefined : `2px solid ${color.ink}`,
                opacity: reveal,
                transform: `translateY(${(1 - reveal) * 12}px)`,
              }}
            >
              <div
                style={{
                  color: important ? color.redis : color.cobalt,
                  fontFamily: color.monoFont,
                  fontSize: 23,
                  fontWeight: 850,
                }}
              >
                {field}
              </div>
              <div style={{marginTop: 10, color: color.mutedInk, fontFamily: color.monoFont, fontSize: 13}}>
                {important ? 'Node*' : field === 'expiresAt' ? 'timestamp' : 'data'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CapacityMeter: React.FC<{
  opacity: number;
  overflowProgress: number;
  evictProgress: number;
  pulse: number;
}> = ({opacity, overflowProgress, evictProgress, pulse}) => {
  const overflowOpacity = overflowProgress * (1 - evictProgress);
  return (
    <div
      style={{
        position: 'absolute',
        right: 76,
        top: 54,
        width: 426,
        boxSizing: 'border-box',
        padding: 18,
        opacity,
        color: color.ink,
        background: overflowOpacity > 0 ? `${color.redis}12` : 'transparent',
        outline: `${overflowOpacity * 6}px solid ${color.redis}`,
        boxShadow: overflowOpacity > 0 ? `9px 10px 0 ${color.redis}1F` : 'none',
        transform: `scale(${1 + overflowOpacity * 0.12 * pulse}) rotate(${-overflowOpacity * 0.7}deg)`,
        transformOrigin: 'right top',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontFamily: color.monoFont,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 1.5,
        }}
      >
        <span>CAPACITY</span>
        <span style={{color: overflowOpacity > 0.1 ? color.redis : color.green}}>
          {overflowOpacity > 0.1 ? '6 / 5' : '5 / 5'}
        </span>
      </div>
      <div style={{display: 'flex', gap: 9, marginTop: 13}}>
        {[0, 1, 2, 3, 4].map((slot) => (
          <div
            key={slot}
            style={{
              width: 52,
              height: 18,
              background: color.green,
              opacity: 0.75,
              transform: `rotate(${slot % 2 === 0 ? -0.7 : 0.8}deg)`,
            }}
          />
        ))}
        <div
          style={{
            width: 52,
            height: 18,
            background: color.redis,
            opacity: overflowOpacity,
            transform: `scaleX(${overflowOpacity}) rotate(-0.7deg)`,
            transformOrigin: 'left center',
          }}
        />
      </div>
    </div>
  );
};

const CapacityAlert: React.FC<{opacity: number; pulse: number}> = ({opacity, pulse}) => (
  <div
    style={{
      position: 'absolute',
      left: 820,
      top: 310,
      width: 920,
      height: 186,
      opacity,
      transform: `scale(${0.96 + 0.04 * pulse}) rotate(-0.5deg)`,
      transformOrigin: 'center center',
      pointerEvents: 'none',
    }}
  >
    <svg
      width="920"
      height="186"
      style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      aria-hidden="true"
    >
      <path
        d="M 28 96 C 115 26, 682 9, 852 55 C 936 78, 864 152, 690 164 C 474 179, 122 168, 38 122"
        fill={`${color.redis}12`}
        stroke={color.redis}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - opacity}
      />
      <path
        d="M 760 34 C 810 8, 849 -20, 884 -52"
        fill="none"
        stroke={color.redis}
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd={`url(#${markerId('redis')})`}
      />
    </svg>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        color: color.redis,
      }}
    >
      <span style={{fontFamily: color.handFont, fontSize: 56, fontWeight: 900}}>
        ЛИМИТ ПРЕВЫШЕН
      </span>
      <span style={{fontFamily: color.monoFont, fontSize: 62, fontWeight: 950}}>6 / 5</span>
    </div>
  </div>
);

const ProofStrip: React.FC<{opacity: number; settle: number}> = ({opacity, settle}) => {
  const items = [
    {label: 'LOOKUP', value: 'O(1)', tone: color.cobalt},
    {label: 'MOVE', value: 'O(1)', tone: color.redis},
    {label: 'EVICT', value: 'O(1)', tone: color.green},
  ] as const;
  return (
    <div
      style={{
        position: 'absolute',
        left: 660,
        top: 824,
        width: 1018,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        opacity,
      }}
    >
      {items.map((item, index) => {
        const itemProgress = smoothProgress(
          settle,
          index / items.length,
          Math.min(1, index / items.length + 0.34),
        );
        return (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 16,
              color: item.tone,
              fontFamily: color.monoFont,
              opacity: itemProgress,
              transform: `translateY(${(1 - itemProgress) * 22}px)`,
            }}
          >
            <span style={{fontSize: 18, fontWeight: 800, letterSpacing: 1.2}}>{item.label}</span>
            <span style={{fontSize: 38, fontWeight: 900}}>{item.value}</span>
          </div>
        );
      })}
    </div>
  );
};

const SuccessStamp: React.FC<{opacity: number; progress: number}> = ({opacity, progress}) => (
  <div
    style={{
      position: 'absolute',
      left: 126,
      top: 812,
      width: 390,
      height: 112,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      color: color.green,
      border: `7px solid ${color.green}`,
      fontFamily: color.handFont,
      fontSize: 31,
      fontWeight: 800,
      opacity,
      transform: `scale(${0.82 + progress * 0.18}) rotate(-2.2deg)`,
    }}
  >
    ТРЕБОВАНИЕ ВЫПОЛНЕНО ✓
  </div>
);

const nodeInitialIndex = (key: Exclude<CacheKey, 'key-88'>): number => {
  switch (key) {
    case 'key-17': return 0;
    case 'key-23': return 1;
    case 'key-42': return 2;
    case 'key-8': return 3;
    case 'key-99': return 4;
  }
};

export const LruWhiteboard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at: ProgressAt = (startMs, endMs) =>
    smoothProgress(frame, msToFrames(startMs, fps), msToFrames(endMs, fps));

  const listReveal = at(timing.lruMeaning - 8_000, timing.lruMeaning + 1_300);
  const questions = windowOpacity(at, timing.twoQuestions, timing.twoStructures + 2_500, 850);
  const structureReveal = at(timing.twoStructures, timing.twoStructures + 2_300);
  const rowProgress = at(timing.twoStructures + 2_000, timing.mapReferences - 1_200);
  const referenceLesson = windowOpacity(at, timing.mapReferences, timing.operationsIntro - 2_200, 800);
  const anatomyOpacity = windowOpacity(at, timing.nodeAnatomy, timing.operationsIntro - 600, 750);
  const anatomyFields = at(timing.nodeAnatomy + 600, timing.nodeAnatomy + 7_300);
  const operationsReady = at(timing.operationsIntro, timing.operationsIntro + 1_500);
  const createNode = at(timing.setStarts, timing.setStarts + 2_700);
  const mapInsert = at(timing.mapInsert, timing.mapInsert + 2_200);
  const headInsert = at(timing.headInsert, timing.headInsert + 2_500);
  const capacityReached = at(timing.capacityReached, timing.capacityReached + 1_100);
  const evict = at(timing.evictTail, timing.evictTail + 3_000);
  const getStart = at(timing.getStarts, timing.getStarts + 1_350);
  const mapLookup = at(timing.mapLookup, timing.mapLookup + 2_000);
  const returnValue = at(timing.returnValue, timing.returnValue + 1_500);
  const lift = at(timing.liftNode, timing.liftNode + 2_450);
  const reconnect = at(timing.reconnect, timing.reconnect + 2_000);
  const moveToHead = at(timing.moveToHead, timing.moveToHead + 2_500);
  const constantTime = at(timing.constantTime, timing.constantTime + 1_500);
  const finalProof = at(timing.finalProof, timing.finalProof + 1_600);
  const requirementDone = at(timing.requirementDone, timing.requirementDone + 1_300);

  const initialPosition = (key: Exclude<CacheKey, 'key-88'>): Point => ({
    x: LIST_LEFT + nodeInitialIndex(key) * NODE_STEP,
    y: LIST_TOP,
  });

  const positionFor = (key: CacheKey): Point => {
    if (key === 'key-88') {
      return {x: LIST_LEFT + NODE_STEP * moveToHead, y: interpolate(headInsert, [0, 1], [430, LIST_TOP])};
    }
    const initial = initialPosition(key);
    const afterHeadInsertX = initial.x + NODE_STEP * headInsert;
    if (key === 'key-42') {
      return {
        x: afterHeadInsertX - NODE_STEP * 3 * moveToHead,
        y: LIST_TOP - 146 * lift * (1 - moveToHead),
      };
    }
    if (key === 'key-17' || key === 'key-23') {
      return {x: afterHeadInsertX + NODE_STEP * moveToHead, y: LIST_TOP};
    }
    return {x: afterHeadInsertX, y: LIST_TOP};
  };

  const activeMapKey: CacheKey | null =
    getStart > 0 ? 'key-42' : mapInsert > 0 ? 'key-88' : referenceLesson > 0 ? 'key-42' : null;

  const nodeOpacity = (key: CacheKey): number => {
    if (key === 'key-88') return createNode;
    if (key === 'key-99') return listReveal * (1 - evict);
    return listReveal;
  };

  const activeTone = (key: CacheKey): 'none' | 'redis' | 'cobalt' => {
    if (key === 'key-88' && createNode > 0 && getStart < 1) return 'redis';
    if (key === 'key-99' && capacityReached > 0 && evict < 1) return 'redis';
    if (key === 'key-42' && getStart > 0) return 'cobalt';
    return 'none';
  };

  const tailKey: CacheKey = evict < 0.5 ? 'key-99' : 'key-8';
  const connectionPath = (leftKey: CacheKey, rightKey: CacheKey): string => {
    const left = positionFor(leftKey);
    const right = positionFor(rightKey);
    const startX = left.x + NODE_WIDTH + 9;
    const startY = left.y + NODE_HEIGHT / 2;
    const endX = right.x - 9;
    const endY = right.y + NODE_HEIGHT / 2;
    return `M ${startX} ${startY} C ${startX + 18} ${startY - 4}, ${endX - 18} ${endY + 4}, ${endX} ${endY}`;
  };

  const drawConnections = (
    order: readonly CacheKey[],
    opacity: number,
    tone: ArrowTone = 'ink',
  ): React.ReactNode =>
    order.slice(0, -1).map((key, index) => {
      const nextKey = order[index + 1];
      return nextKey ? (
        <MarkerPath
          key={`${key}-${nextKey}`}
          d={connectionPath(key, nextKey)}
          tone={tone}
          opacity={opacity}
          progress={opacity}
          width={3.5}
          bidirectional
        />
      ) : null;
    });

  const referenceTarget = activeMapKey ? positionFor(activeMapKey) : positionFor('key-42');
  const referenceRow = activeMapKey === 'key-88' ? 5 : 2;
  const referenceStartY = MAP_TOP + MAP_HEADER_HEIGHT + referenceRow * MAP_ROW_HEIGHT + MAP_ROW_HEIGHT / 2;
  const referenceTone: ArrowTone = activeMapKey === 'key-88' ? 'redis' : 'cobalt';
  const relinkOpacity = reconnect * (1 - moveToHead);
  const structureLabelOpacity =
    structureReveal * (1 - windowOpacity(at, timing.liftNode, timing.constantTime + 2_500, 500));
  const mapInsertCaption = windowOpacity(at, timing.mapInsert, timing.headInsert + 300, 500);
  const headInsertCaption = windowOpacity(at, timing.headInsert, timing.capacityReached + 150, 450);
  const capacityCaption = windowOpacity(at, timing.capacityReached, timing.evictTail + 250, 350);
  const evictCaption = windowOpacity(at, timing.evictTail, timing.getStarts - 450, 550);
  const lookupCaption = windowOpacity(at, timing.mapLookup, timing.returnValue + 300, 500);
  const returnCaption = windowOpacity(at, timing.returnValue, timing.liftNode + 350, 450);
  const liftCaption = windowOpacity(at, timing.liftNode, timing.reconnect + 300, 450);
  const reconnectCaption = windowOpacity(at, timing.reconnect, timing.moveToHead + 250, 450);
  const moveCaption = windowOpacity(at, timing.moveToHead, timing.constantTime + 650, 450);
  const writeReference = windowOpacity(at, timing.mapInsert, timing.capacityReached, 500);
  const readReference = windowOpacity(at, timing.mapLookup, timing.constantTime + 1_100, 500);
  const cleanReferenceOpacity = Math.max(referenceLesson * (1 - operationsReady), writeReference, readReference);
  const headKey: CacheKey = headInsert < 0.5 ? 'key-17' : moveToHead < 0.5 ? 'key-88' : 'key-42';
  const overflowPulse = 0.5 + 0.5 * Math.sin((frame - msToFrames(timing.capacityReached, fps)) * 0.55);

  return (
    <div style={{position: 'absolute', inset: 0, color: color.ink}}>
      <PaperBackground />
      <CacheBoundary progress={structureReveal} />

      <Headline eyebrow="ТРЕБОВАНИЕ 3" opacity={windowOpacity(at, timing.requirement, timing.twoQuestions + 1_500)} accent={color.redis} width={930}>
        LRU: удаляем то, чем давно не пользовались
      </Headline>
      <Headline eyebrow="ЗАДАЧА" opacity={windowOpacity(at, timing.twoQuestions, timing.twoStructures + 6_500)} accent={color.amber} width={755}>
        Быстро найти ключ и сохранить порядок
      </Headline>
      <Headline eyebrow="РЕШЕНИЕ" opacity={windowOpacity(at, timing.twoStructures, timing.operationsIntro)} accent={color.cobalt} width={835}>
        Две структуры — две разные роли
      </Headline>
      <Headline eyebrow="ЗАПИСЬ" opacity={windowOpacity(at, timing.operationsIntro, timing.getStarts)} accent={color.redis} width={510}>
        SET key-88 → новая нода в HEAD
      </Headline>
      <Headline eyebrow="ЧТЕНИЕ" opacity={windowOpacity(at, timing.getStarts, timing.finalProof)} accent={color.cobalt} width={510}>
        GET key-42 → вернуть и поднять
      </Headline>
      <Headline eyebrow="ИТОГ" opacity={at(timing.finalProof, timing.finalProof + 750)} accent={color.green} width={745}>
        Все операции остаются за O(1)
      </Headline>

      <CapacityMeter
        opacity={Math.max(listReveal, operationsReady)}
        overflowProgress={capacityReached}
        evictProgress={evict}
        pulse={overflowPulse}
      />
      <StructureLabels opacity={structureLabelOpacity} underlineProgress={at(timing.twoStructures + 700, timing.twoStructures + 2_700)} />
      <HashMap
        opacity={structureReveal}
        rowProgress={rowProgress}
        setRowProgress={mapInsert}
        evictProgress={evict}
        activeKey={activeMapKey}
      />
      <NodeAnatomy opacity={anatomyOpacity} fieldProgress={anatomyFields} />

      <svg width={BOARD_WIDTH} height={BOARD_HEIGHT} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}} aria-hidden="true">
        <DiagramDefs />
        {drawConnections(initialOrder, listReveal * (1 - headInsert))}
        {drawConnections(
          ['key-88', 'key-17', 'key-23', 'key-42', 'key-8', 'key-99'],
          headInsert * (1 - evict) * (1 - lift),
          'redis',
        )}
        {drawConnections(afterSetOrder, evict * (1 - lift), 'ink')}
        <MarkerPath d={connectionPath('key-23', 'key-8')} tone="cobalt" opacity={relinkOpacity} progress={reconnect} width={5} bidirectional />
        {drawConnections(afterGetOrder, moveToHead, 'cobalt')}
        <MarkerPath
          d={
            activeMapKey === 'key-88'
              ? `M ${MAP_LEFT + MAP_WIDTH + 8} ${referenceStartY} C 595 ${referenceStartY}, 590 ${referenceTarget.y + 56}, ${referenceTarget.x - 16} ${referenceTarget.y + 56}`
              : `M ${MAP_LEFT + MAP_WIDTH + 8} ${referenceStartY} C 625 ${referenceStartY}, 690 ${referenceTarget.y - 90}, ${referenceTarget.x + NODE_WIDTH / 2} ${referenceTarget.y - 13}`
          }
          tone={referenceTone}
          opacity={cleanReferenceOpacity}
          progress={Math.max(referenceLesson, mapInsert, mapLookup)}
          width={4.5}
        />
        <MarkerPath
          d={`M ${LIST_LEFT + NODE_STEP * 3 + NODE_WIDTH / 2} ${LIST_TOP - 14} C 1090 390, 795 390, ${LIST_LEFT + NODE_WIDTH / 2} ${LIST_TOP - 14}`}
          tone="cobalt"
          opacity={moveToHead * (1 - Math.max(0, (moveToHead - 0.88) / 0.12))}
          progress={moveToHead}
          width={5}
          dashed
        />
      </svg>

      {cacheEntries.map((entry) => (
        <NodeCard
          key={entry.key}
          cacheKey={entry.key}
          position={positionFor(entry.key)}
          opacity={nodeOpacity(entry.key)}
          activeTone={activeTone(entry.key)}
        />
      ))}
      <PositionTag label="HEAD" position={positionFor(headKey)} opacity={listReveal} />
      <PositionTag label="TAIL" position={positionFor(tailKey)} opacity={listReveal} />
      <CapacityAlert opacity={capacityCaption} pulse={overflowPulse} />

      <Caption x={746} y={760} opacity={questions} colorValue={color.redisDark}>① где лежит value?</Caption>
      <Caption x={1240} y={760} opacity={questions} colorValue={color.cobalt}>② кто использовался раньше?</Caption>
      <Caption x={125} y={806} opacity={referenceLesson} colorValue={color.redisDark}>key → прямая ссылка на Node</Caption>
      <Caption x={730} y={787} opacity={referenceLesson} colorValue={color.cobalt}>HEAD = недавно</Caption>
      <Caption x={1440} y={787} opacity={referenceLesson} colorValue={color.redisDark}>TAIL = давно</Caption>

      <Caption x={990} y={443} opacity={mapInsertCaption} colorValue={color.redis}>1. HashMap: key-88 → Node*</Caption>
      <Caption x={960} y={443} opacity={headInsertCaption} colorValue={color.redis}>2. вставляем ноду в HEAD</Caption>
      <Caption x={1390} y={448} opacity={evictCaption} colorValue={color.redisDark}>EVICT TAIL + DELETE key-99</Caption>

      <Caption x={710} y={430} opacity={lookupCaption} colorValue={color.cobalt}>HashMap: key-42 → Node*</Caption>
      <Caption x={1480} y={390} opacity={returnCaption} colorValue={color.cobalt}>return value-42</Caption>
      <Caption x={1130} y={390} opacity={liftCaption} colorValue={color.cobalt}>отсоединяем Node</Caption>
      <Caption x={1070} y={760} opacity={reconnectCaption} colorValue={color.cobalt}>prev.next = next · next.prev = prev</Caption>
      <Caption x={720} y={420} opacity={moveCaption} colorValue={color.cobalt}>Node становится HEAD</Caption>

      <ProofStrip opacity={constantTime} settle={finalProof} />
      <SuccessStamp opacity={requirementDone} progress={requirementDone} />
    </div>
  );
};
