import React from 'react';
import {measurements, recovery} from './data';
import {RecoveryGraphs} from './RecoveryGraphs';
import {cues, reveal, type SceneProps} from './timing';
import {chart, CodeSnippet, Heading, Note} from './ui';

type Metric = {readonly title: string; readonly unit: string; readonly max: number; readonly healthyKey: 'healthyMs' | 'healthyKb'; readonly blockedKey: 'blockedMs' | 'blockedKb'};
const metrics: readonly Metric[] = [
  {title: 'Время захвата · медиана', unit: 'мс', max: 10, healthyKey: 'healthyMs', blockedKey: 'blockedMs'},
  {title: 'Размер jobs_run_at_idx', unit: 'КБ', max: 2500, healthyKey: 'healthyKb', blockedKey: 'blockedKb'},
];
const Graph: React.FC<{readonly metric: Metric; readonly baseline: number; readonly blocked: number}> = ({metric, baseline, blocked}) => {
  const x = (index: number): number => 70 + index * 112;
  const y = (value: number): number => 310 - value / metric.max * 240;
  const line = (key: Metric['healthyKey'] | Metric['blockedKey']): string => measurements.map((row, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(row[key])}`).join(' ');
  return <div style={{background: chart.surface, border: `1px solid ${chart.border}`, height: 350}}>
    <div style={{fontSize: 24, color: chart.text, padding: '18px 20px 0', fontWeight: 500}}>{metric.title}</div>
    <svg width="100%" height={280} viewBox="0 0 680 354" style={{display: 'block'}}>
      {[0, 1, 2, 3, 4].map(i => <g key={i}>
        <line x1={70} x2={630} y1={70 + i * 60} y2={70 + i * 60} stroke={chart.grid} strokeWidth={1} />
        <text x={58} y={76 + i * 60} textAnchor="end" fontSize={17} fill={chart.muted}>{metric.max * (4 - i) / 4}</text>
      </g>)}
      <text x={15} y={36} fontSize={17} fill={chart.muted}>{metric.unit}</text>
      {measurements.map((row, i) => <g key={row.jobs}>
        <line x1={x(i)} x2={x(i)} y1={70} y2={310} stroke={chart.grid} strokeWidth={1} opacity={.4} />
        <text x={x(i)} y={338} textAnchor="middle" fontSize={17} fill={chart.muted}>{i * 20}k</text>
      </g>)}
      <defs>
        <clipPath id={`baseline-${metric.unit}`}><rect x={64} y={50} width={12 + baseline * 560} height={270} /></clipPath>
        <clipPath id={`blocked-${metric.unit}`}><rect x={64} y={50} width={12 + blocked * 560} height={270} /></clipPath>
      </defs>
      <g clipPath={`url(#baseline-${metric.unit})`}>
        <path d={line(metric.healthyKey)} stroke={chart.healthy} strokeWidth={3} fill="none" />
        {measurements.map((row, i) => <circle key={row.jobs} cx={x(i)} cy={y(row[metric.healthyKey])} r={4} fill={chart.healthy} />)}
      </g>
      {blocked > 0 ? <g clipPath={`url(#blocked-${metric.unit})`}>
        <path d={line(metric.blockedKey)} stroke={chart.blocked} strokeWidth={3} fill="none" />
        {measurements.map((row, i) => <circle key={row.jobs} cx={x(i)} cy={y(row[metric.blockedKey])} r={4} fill={chart.blocked} />)}
      </g> : null}
    </svg>
    <div style={{textAlign: 'center', color: chart.muted, fontSize: 17}}>Выполнено задач</div>
  </div>;
};
const Stat: React.FC<{readonly label: string; readonly value: string; readonly color?: string}> = ({label, value, color = chart.text}) => <div style={{background: chart.surface, border: `1px solid ${chart.border}`, padding: '18px 24px'}}>
  <div style={{fontSize: 20, color: chart.muted}}>{label}</div>
  <div style={{fontSize: 45, fontWeight: 500, marginTop: 8, color}}>{value}</div>
</div>;
export const Benchmark: React.FC<SceneProps> = ({timeMs}) => {
  const healthy = reveal(timeMs, cues.healthyBench, 4000);
  const blocked = reveal(timeMs, cues.blockedBench + 1200, 12500);
  const reset = timeMs >= cues.reset;
  const reached = Math.min(5, Math.floor(blocked * 5));
  const sample = measurements[reached] ?? measurements[0];
  const healthySample = measurements[Math.min(5, Math.floor(healthy * 5))] ?? measurements[0];
  return <>
    <Heading title={reset ? "VACUUM убирает мусор. Захват снова быстрый." : "Живых задач столько же. Захват всё медленнее."} kicker="ЛОКАЛЬНЫЙ ЭКСПЕРИМЕНТ / ДАННЫЕ ИЗ ЗАМЕРОВ" />
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 18}}>
      <Stat label="Живые задачи · постоянно" value="10 000" />
      <Stat label={reset ? 'Захват после VACUUM' : blocked === 0 ? 'Захват без долгой транзакции' : 'Захват при удерживаемом снимке'} value={reset ? `${recovery.afterMs.toFixed(3).replace('.', ',')} мс` : blocked === 0 ? '≈ 0,04 мс' : `${sample.blockedMs.toString().replace('.', ',')} мс`} color={reset ? chart.healthy : chart.blocked} />
      <Stat label={reset ? 'Индекс после VACUUM · файл не сжат' : blocked === 0 ? 'Индекс без долгой транзакции' : 'Индекс при удерживаемом снимке'} value={`${(reset ? recovery.indexKb : blocked === 0 ? healthySample.healthyKb : sample.blockedKb).toLocaleString('ru-RU')} КБ`} color={chart.blue} />
    </div>
    <div style={{position: 'relative', height: 350}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, opacity: 1 - reveal(timeMs, cues.reset, 350)}}>
        {metrics.map(metric => <Graph key={metric.title} metric={metric} baseline={healthy} blocked={blocked} />)}
      </div>
      {reset ? <div style={{position: 'absolute', inset: 0, opacity: reveal(timeMs, cues.reset, 350)}}>
        <RecoveryGraphs timeMs={timeMs} />
      </div> : null}
    </div>
    <div style={{display: 'flex', gap: 40, marginTop: 16, fontSize: 21}}>
      <span style={{color: chart.healthy}}>{reset ? '━ После COMMIT и VACUUM' : '━ Без долгой транзакции'}</span>
      <span style={{color: chart.blocked}}>{reset ? '● До очистки' : '━ Со снимком долгой транзакции'}</span>
      {blocked === 1 && !reset ? <span style={{color: chart.blocked}}>≈ 200× медленнее</span> : null}
    </div>
    <div style={{marginTop: 14, fontSize: 19, color: chart.muted}}>
      {reset ? 'COMMIT → VACUUM · обращения к страницам: 40 039 → 23 · освобождённые страницы используются повторно'
        : '1 воркер · VACUUM каждые 20 000 задач · медиана 5 замеров · PostgreSQL 17.9'}
    </div>
  </>;
};

export const ExperimentSetup: React.FC<SceneProps> = ({timeMs}) => <>
  <Heading title="10 000 задач. Продюсер добавляет, воркер удаляет." kicker="КАК УСТРОЕН ЭКСПЕРИМЕНТ" />
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '60px 0'}}>
    <div style={{fontSize: 36}}>Продюсер <span style={{color: chart.healthy}}>+10 →</span></div>
    <Stat label="jobs · живые строки" value="10 000" />
    <div style={{fontSize: 36}}><span style={{color: chart.blocked}}>→ −10</span> Воркер</div>
  </div>
  <div style={{opacity: reveal(timeMs, cues.bench + 4500)}}>
    <CodeSnippet text={`SELECT pg_size_pretty(pg_relation_size('jobs_run_at_idx')) AS index_size,
       count(*) AS jobs
FROM jobs;`} size={28} />
    <div style={{marginTop: 28}}><Note>Сравниваем одинаковый цикл: без долгой транзакции и с удерживаемым снимком.</Note></div>
  </div>
</>;
