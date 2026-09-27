import React from 'react';
import {hashingTheme as theme} from '../../shared/theme';
import {
  diagramTransform, geometry as g, mix, nodeBounds, packetProgress, progress, recordPosition, records, timing,
  type ExperimentState,
} from './state';

const nodeIndices = [0, 1, 2, 3] as const;

const Node: React.FC<{readonly index: number; readonly state: ExperimentState}> = ({index, state}) => {
  const {x, width, bottom, opacity} = nodeBounds(index, state);
  const offline = index === 1 ? state.remove : 0;
  const isNew = index === 3;
  const edge = isNew ? theme.signal : theme.line;
  return <g opacity={opacity} transform={`translate(0 ${isNew ? 16 * (1 - state.add) : 0})`}>
    <g opacity={1 - offline * 0.7}>
      <rect x={x} y={g.top} width={width} height={bottom - g.top}
        fill={theme.surface} stroke={edge} strokeWidth={2} />
      <text x={x + 20} y={651} fontFamily={theme.fontMono} fontSize={28} fill={theme.text}>
        wallet-{index + 1}
      </text>
      <path d={`M${x} 678 H${x + width}`} stroke={edge} strokeWidth={1.5} />
      {isNew ? <>
        <path d={`M${x + 22} 721 H${x + width - 22} M${x + 22} 797 H${x + width - 22}`}
          stroke={theme.line} strokeWidth={1.5} strokeDasharray="4 8" />
        <text x={x + width / 2} y={934} textAnchor="middle" fill={theme.signal}
          fontFamily={theme.fontMono} fontSize={26}>новая</text>
      </> : null}
    </g>
    {index === 1 ? <text x={x + width / 2} y={934} textAnchor="middle"
      fontFamily={theme.fontMono} fontSize={26} fill={theme.signal} opacity={offline}>отключена</text> : null}
  </g>;
};

const DataRows: React.FC<{readonly state: ExperimentState}> = ({state}) => <>
  {records.map((record, index) => {
    const position = recordPosition(index, record.owner, record.row, state.timeMs);
    const offline = record.owner === 1 ? state.remove : 0;
    const active = record.key === '042';
    return <g key={record.key} data-record={record.key}
      opacity={progress(state.timeMs, 1000 + index * 100, 500) * (1 - offline * 0.6)}
      transform={`translate(${position.x} ${position.y})`}>
      <path d={`M0 0 V34 M0 42 H${position.width}`} fill="none"
        stroke={active ? theme.primary : theme.line} strokeWidth={active ? 2.5 : 1.5} />
      <text x={16} y={29} fill={theme.muted} fontFamily={theme.fontMono} fontSize={28}
        opacity={position.prefixOpacity}>user:</text>
      <text x={position.labelOffset} y={29} fill={active ? theme.primary : theme.text}
        fontFamily={theme.fontMono} fontSize={30}>{record.key}</text>
      <path d={`M${position.width - 30} 14 h20 M${position.width - 30} 23 h12`}
        fill="none" stroke={theme.muted} strokeWidth={2} opacity={0.55} />
    </g>;
  })}
</>;

type RequestEvent = {readonly start: number; readonly owner: number};
const requestEvents: readonly RequestEvent[] = [
  {start: timing.service + 700, owner: 0},
  {start: timing.service + 2450, owner: 0},
  {start: timing.load, owner: 0},
  {start: timing.load + 650, owner: 1},
  {start: timing.load + 1300, owner: 2},
  {start: timing.load + 1950, owner: 0},
  {start: timing.add + 430, owner: 3},
  {start: timing.remove + 200, owner: 2},
  {start: timing.question + 800, owner: 0},
  {start: timing.question + 2450, owner: 2},
];

/** Arc-length sampling keeps a request moving at a steady speed around corners. */
const requestPoint = (center: number, amount: number) => {
  const vertical = g.busY - g.inletTop;
  const horizontal = Math.abs(center - g.inletX);
  const distance = amount * (vertical + horizontal + g.top - g.busY);
  if (distance <= vertical) return {x: g.inletX, y: g.inletTop + distance, horizontal: false};
  if (distance <= vertical + horizontal) {
    return {x: g.inletX + Math.sign(center - g.inletX) * (distance - vertical), y: g.busY, horizontal: true};
  }
  return {x: center, y: g.busY + distance - vertical - horizontal, horizontal: false};
};

const Requests: React.FC<{readonly state: ExperimentState}> = ({state}) => <>
  {requestEvents.map(({start, owner}) => {
    const elapsed = state.timeMs - start;
    if (elapsed < 0 || elapsed > 1150) return null;
    const bounds = nodeBounds(owner, state);
    const point = requestPoint(bounds.x + bounds.width / 2, packetProgress(state.timeMs, start, 1050));
    const opacity = progress(elapsed, 0, 80) * (1 - progress(elapsed, 990, 160));
    return <path key={start}
      d={point.horizontal ? `M${point.x - 12} ${point.y} h24` : `M${point.x} ${point.y - 12} v24`}
      stroke={theme.primary} strokeWidth={5} strokeLinecap="round" opacity={opacity} />;
  })}
</>;

export const ExperimentDiagram: React.FC<{readonly state: ExperimentState}> = ({state}) => {
  const first = nodeBounds(0, state);
  const left = first.x + first.width / 2;
  const right = mix(g.inletX, g.left + 2 * g.nodeStep + g.nodeWidth / 2, state.partition);
  const busEnd = mix(right, g.left + 3 * g.nodeStep + g.nodeWidth / 2, state.add);
  return <g opacity={state.reveal} transform={diagramTransform}>
    <g opacity={state.live}>
      <path d={`M${g.inletX} ${g.inletTop} V${g.busY} M${left} ${g.busY} H${busEnd}`}
        fill="none" stroke={theme.line} strokeWidth={2.5} />
      {nodeIndices.map((index) => {
        const bounds = nodeBounds(index, state);
        const x = bounds.x + bounds.width / 2;
        return <g key={index} opacity={bounds.opacity}>
          <path d={`M${x} ${g.busY} V${g.top}`} fill="none" stroke={theme.line}
            strokeWidth={2.5} opacity={index === 1 ? 1 - state.remove * 0.8 : 1} />
          {index === 1 ? <g opacity={state.remove}>
            <path d={`M${x} 559 v38`} stroke={theme.background} strokeWidth={6} />
            <path d={`M${x} 559 l12 22 M${x} 586 v12`} fill="none"
              stroke={theme.signal} strokeWidth={2.5} />
          </g> : null}
        </g>;
      })}
      <Requests state={state} />
      <circle cx={g.inletX} cy={g.busY} r={4} fill={theme.line} opacity={state.partition} />
    </g>
    {nodeIndices.map((index) => <Node key={index} index={index} state={state} />)}
    <DataRows state={state} />
  </g>;
};
