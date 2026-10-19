import React from 'react';
import {recovery} from './data';
import {cues, reveal, type SceneProps} from './timing';
import {chart} from './ui';

type RecoveryMetric = {
  readonly id: string; readonly title: string; readonly unit: string;
  readonly before: number; readonly after: number; readonly overviewMax: number; readonly detailMax: number;
};
const metrics = [
  {id: 'latency', title: 'Время захвата · медиана', unit: 'мс', before: recovery.beforeMs,
    after: recovery.afterMs, overviewMax: 10, detailMax: 0.1},
  {id: 'buffers', title: 'Обращения к страницам за захват', unit: 'обращений', before: recovery.beforeBuffers,
    after: recovery.afterBuffers, overviewMax: 50000, detailMax: 40},
] satisfies readonly RecoveryMetric[];
const format = (value: number): string => value.toLocaleString('ru-RU', {maximumFractionDigits: 3});

const RecoveryGraph: React.FC<{readonly metric: RecoveryMetric; readonly elapsedMs: number}> = ({metric, elapsedMs}) => {
  const drop = reveal(elapsedMs, 500, 1500);
  const zoom = reveal(elapsedMs, 3200, 1500);
  // Geometric rescaling makes the small post-VACUUM value legible without changing the measurement.
  const max = metric.overviewMax * (metric.detailMax / metric.overviewMax) ** zoom;
  const y = (value: number): number => 310 - value / max * 240;
  const beforeY = y(metric.before);
  const afterY = y(metric.after);
  const clippedBefore = metric.before > max;
  const clipId = `vacuum-recovery-${metric.id}`;
  return <div style={{background: chart.surface, border: `1px solid ${chart.border}`, height: 350}}>
    <div style={{fontSize: 24, color: chart.text, padding: '18px 20px 0', fontWeight: 500}}>{metric.title}</div>
    <svg width="100%" height={280} viewBox="0 0 680 354" style={{display: 'block'}}>
      <defs><clipPath id={clipId}><rect x={90} y={68} width={550} height={248} /></clipPath></defs>
      {[0, 1, 2, 3, 4].map(i => <g key={i}>
        <line x1={90} x2={640} y1={70 + i * 60} y2={70 + i * 60} stroke={chart.grid} />
        <text x={80} y={76 + i * 60} textAnchor="end" fontSize={17} fill={chart.muted}>{format(max * (4 - i) / 4)}</text>
      </g>)}
      <text x={90} y={36} fontSize={17} fill={chart.muted}>{metric.unit}</text>
      <text x={640} y={36} textAnchor="end" fontSize={17} fill={chart.blue} opacity={zoom}>Увеличение шкалы Y</text>
      <g clipPath={`url(#${clipId})`}>
        <circle cx={160} cy={beforeY} r={5} fill={chart.blocked} />
        <path d={`M160 ${beforeY} H345 V${afterY} H550`} fill="none" stroke={chart.healthy}
          strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drop} />
        <circle cx={550} cy={afterY} r={6} fill={chart.healthy} opacity={reveal(elapsedMs, 1800, 200)} />
      </g>
      {clippedBefore ? <g fill={chart.blocked}>
        <path d="M154 82 L160 72 L166 82" fill="none" stroke={chart.blocked} strokeWidth={2} />
        <text x={160} y={105} textAnchor="middle" fontSize={18}>{format(metric.before)}</text>
        <text x={160} y={128} textAnchor="middle" fontSize={15}>выше шкалы</text>
      </g> : <text x={160} y={beforeY - 14} textAnchor="middle" fontSize={21} fill={chart.blocked}>{format(metric.before)}</text>}
      <text x={550} y={afterY - 18} textAnchor="middle" fontSize={25} fill={chart.healthy}
        opacity={reveal(elapsedMs, 1800, 200)}>{format(metric.after)}</text>
      <text x={160} y={341} textAnchor="middle" fontSize={18} fill={chart.muted}>До очистки</text>
      <text x={550} y={341} textAnchor="middle" fontSize={18} fill={chart.text}>После VACUUM</text>
    </svg>
    <div style={{textAlign: 'center', color: chart.muted, fontSize: 17}}>Два замера · COMMIT → VACUUM</div>
  </div>;
};

export const RecoveryGraphs: React.FC<SceneProps> = ({timeMs}) => <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
  {metrics.map(metric => <RecoveryGraph key={metric.id} metric={metric} elapsedMs={timeMs - cues.reset} />)}
</div>;
