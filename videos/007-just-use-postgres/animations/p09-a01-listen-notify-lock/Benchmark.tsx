import React from 'react';
import {activityQuery, measurements, notifyTransaction, plainTransaction} from './data';
import {cues, reveal, type SceneProps} from './timing';
import {accent, CodeSnippet, graph, Label, Note, theme, Title} from './ui';

export const ExperimentSetup: React.FC<SceneProps> = ({timeMs}) => <>
  <Title kicker="ЛОКАЛЬНЫЙ ЭКСПЕРИМЕНТ / PGBENCH">Одна вставка. Одно отличие.</Title>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28}}>
    <div><Label color={graph.plain}>БЕЗ NOTIFY</Label><div style={{marginTop: 16}}><CodeSnippet text={plainTransaction} label="SQL · plain.sql" size={25} /></div></div>
    <div style={{opacity: reveal(timeMs, cues.benchmarkSetup + 5000)}}><Label color={graph.notify}>С NOTIFY</Label><div style={{marginTop: 16}}><CodeSnippet text={notifyTransaction} label="SQL · notify.sql" size={25} active="pg_notify" /></div></div>
  </div>
  <div style={{marginTop: 30, opacity: reveal(timeMs, cues.benchmarkSetup + 8700)}}>
    <CodeSnippet text="wal_sync_method = fsync_writethrough" label="POSTGRESQL.CONF" size={29} />
    <div style={{marginTop: 20}}><Note>Реальный сброс WAL на диск · 10 секунд на замер · 1 / 16 / 64 клиента</Note></div>
  </div>
</>;

type Metric = {readonly id: string; readonly title: string; readonly unit: string; readonly max: number;
  readonly plainKey: 'plainTps' | 'plainMs'; readonly notifyKey: 'notifyTps' | 'notifyMs'};
const metrics = [
  {id: 'throughput', title: 'Пропускная способность', unit: 'транзакции/с', max: 10000, plainKey: 'plainTps', notifyKey: 'notifyTps'},
  {id: 'latency', title: 'Средняя задержка', unit: 'мс', max: 250, plainKey: 'plainMs', notifyKey: 'notifyMs'},
] satisfies readonly Metric[];

const MetricGraph: React.FC<{readonly metric: Metric; readonly plain: number; readonly notify: number}> = ({metric, plain, notify}) => {
  const x = (clients: number): number => 82 + (clients - 1) / 63 * 536;
  const y = (value: number): number => 300 - value / metric.max * 230;
  const series = (key: Metric['plainKey'] | Metric['notifyKey'], color: string, progress: number) => {
    const values = measurements.map(row => `${x(row.clients)},${y(row[key])}`).join(' ');
    return <g clipPath={`url(#${metric.id}-${key})`}>
      <polyline points={values} stroke={color} strokeWidth={3} fill="none" />
      {measurements.map(row => <circle key={row.clients} cx={x(row.clients)} cy={y(row[key])} r={5} fill={color} />)}
      <defs><clipPath id={`${metric.id}-${key}`}><rect x={74} y={20} width={16 + progress * 540} height={310} /></clipPath></defs>
    </g>;
  };
  return <div style={{background: graph.panel, border: `1px solid ${graph.line}`, padding: '20px 8px 12px'}}>
    <div style={{fontSize: 27, paddingLeft: 22, color: graph.text}}>{metric.title}</div>
    <svg viewBox="0 0 680 360" width="100%" height={360} style={{display: 'block', fontFamily: theme.fontMono}}>
      <text x={28} y={35} fill={graph.muted} fontSize={18}>{metric.unit}</text>
      {[0, 1, 2, 3, 4].map(i => <g key={i}>
        <line x1={82} x2={618} y1={70 + i * 57.5} y2={70 + i * 57.5} stroke={graph.grid} />
        <text x={66} y={76 + i * 57.5} fill={graph.muted} fontSize={17} textAnchor="end">{metric.max * (4 - i) / 4}</text>
      </g>)}
      {measurements.map(row => <g key={row.clients}>
        <line x1={x(row.clients)} x2={x(row.clients)} y1={70} y2={300} stroke={graph.grid} opacity={.5} />
        <text x={x(row.clients)} y={328} fill={graph.muted} fontSize={20} textAnchor="middle">{row.clients}</text>
      </g>)}
      {series(metric.plainKey, graph.plain, plain)}
      {series(metric.notifyKey, graph.notify, notify)}
      <text x={350} y={355} textAnchor="middle" fill={graph.muted} fontSize={18}>Клиентов</text>
    </svg>
  </div>;
};

export const Benchmark: React.FC<SceneProps> = ({timeMs}) => {
  const plain = reveal(timeMs, cues.manyClients, 1300);
  const notify = reveal(timeMs, cues.notifyFlat, 1200);
  const oneClient = timeMs < cues.manyClients;
  const showLatency = timeMs >= cues.latency;
  const groupCommit = reveal(timeMs, cues.groupCommit, 400) * (1 - reveal(timeMs, cues.notifyFlat + 600, 350));
  return <>
    <Title kicker="PGBENCH / ИЗМЕРЕНИЯ ИЗ МАТЕРИАЛОВ">{oneClient ? 'Один клиент: почти одинаково' : '64 клиента: масштабируется только один путь'}</Title>
    <div style={{display: 'flex', gap: 40, fontSize: 26, marginBottom: 22}}>
      <span style={{color: graph.plain}}>━ Без NOTIFY</span><span style={{color: graph.notify}}>━ С NOTIFY</span>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22}}>
      {metrics.map(metric => <MetricGraph key={metric.id} metric={metric} plain={plain} notify={notify} />)}
    </div>
    <div style={{marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
      <div style={{fontSize: 39}}><span style={{color: graph.plain}}>{oneClient ? '248' : '8 936'}</span><span style={{color: theme.muted}}> / </span>
        <span style={{color: graph.notify}}>{oneClient ? '238' : notify > 0 ? '278' : '…'}</span><span style={{fontSize: 24}}> TPS</span></div>
      <div style={{fontSize: 39, opacity: showLatency ? 1 : oneClient ? 1 : 0}}><span style={{color: graph.plain}}>{oneClient ? '4,0' : '7,2'}</span><span style={{color: theme.muted}}> / </span>
        <span style={{color: graph.notify}}>{oneClient ? '4,2' : '229,9'}</span><span style={{fontSize: 24}}> мс</span></div>
    </div>
    <div style={{position: 'relative', marginTop: 22, height: 50}}>
      <div style={{opacity: 1 - groupCommit}}><Label>10 секунд на замер · fsync_writethrough · точки: 1, 16, 64 клиента</Label></div>
      <div style={{position: 'absolute', top: -5, opacity: groupCommit, color: graph.plain, fontSize: 29}}>
        COMMIT + COMMIT + COMMIT → общий сброс WAL на диск
      </div>
    </div>
  </>;
};

export const SessionWaits: React.FC<SceneProps> = ({timeMs}) => <>
  <Title>63 ждут. Один пишет на диск.</Title>
  <div style={{display: 'grid', gridTemplateColumns: '820px 1fr', gap: 48}}>
    <div>
      <Label>PG_STAT_ACTIVITY · ТЕКУЩИЕ СЕССИИ</Label>
      <div style={{marginTop: 18}}><CodeSnippet text={activityQuery} size={25} /></div>
      <div style={{fontFamily: theme.fontMono, fontSize: 25, marginTop: 26}}>
        <div style={{color: theme.muted, paddingBottom: 16}}>wait_event_type · wait_event · count</div>
        <div style={{padding: '14px 0', borderTop: `2px solid ${theme.line}`, color: graph.notify}}>Lock <span style={{marginLeft: 80}}>object</span><span style={{float: 'right'}}>63</span></div>
        <div style={{padding: '14px 0', borderTop: `2px solid ${theme.line}`, color: graph.plain}}>IO <span style={{marginLeft: 110}}>WalSync</span><span style={{float: 'right'}}>1</span></div>
      </div>
    </div>
    <div style={{opacity: reveal(timeMs, cues.sessions + 900)}}>
      <Label>64 СОЕДИНЕНИЯ PGBENCH</Label>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8, margin: '30px 0 26px'}}>
        {Array.from({length: 64}, (_, i) => <div key={i} style={{height: 38, background: i === 0 ? graph.plain : graph.panel,
          border: `2px solid ${i === 0 ? graph.plain : graph.notify}`, opacity: i === 0 ? 1 : .75}} />)}
      </div>
      <Note color={accent}>Ожидание общей блокировки</Note>
    </div>
  </div>
</>;
