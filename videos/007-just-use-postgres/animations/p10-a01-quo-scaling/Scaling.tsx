import React from 'react';
import {cues, reveal, type SceneProps} from './timing';
import {accent, Caption, Content, Heading, success, theme} from './ui';

type NodeProps = {
  readonly x: number; readonly y: number; readonly width: number; readonly title: string;
  readonly subtitle: string; readonly color?: string; readonly scale?: number;
};
const Node: React.FC<NodeProps> = ({x, y, width, title, subtitle, color = theme.line, scale = 1}) => <div
  style={{position: 'absolute', left: x, top: y, width, height: 124, boxSizing: 'border-box',
    border: `2px solid ${color}`, padding: '23px 27px', background: theme.background,
    transform: `scale(${scale})`, transformOrigin: 'center'}}>
  <div style={{fontSize: 31, fontWeight: 600}}>{title}</div>
  <div style={{fontSize: 21, color: theme.muted, marginTop: 10}}>{subtitle}</div>
</div>;

/** Topology of the Aurora configuration in Quo's report, not all Aurora products. */
export const Aurora: React.FC<SceneProps> = ({timeMs}) => {
  const scaleUp = reveal(timeMs, cues.instance, 1100);
  const tune = reveal(timeMs, cues.vacuum, 500);
  const separate = reveal(timeMs, cues.separate, 700);
  const title = timeMs < cues.scaling ? 'Один узел принимает записи' : separate > .5
    ? 'Чувствительные workflow — отдельно' : 'Сначала — больше ресурсов';
  return <Content>
    <Heading title={title} label="QUO / AURORA POSTGRESQL" />
    <div style={{position: 'absolute', top: 180, width: 1408, height: 510}}>
      <svg width="1408" height="510" style={{position: 'absolute', inset: 0}}>
        {[104,234,364].map((y, i) => <g key={y} opacity={i === 2 ? 1 - separate : 1}>
          <path d={`M320 ${y} H430 V200 H570`} stroke={theme.line} strokeWidth="3" fill="none" />

        </g>)}
        <path d="M900 200 H1010 V90 H1090 M1010 200 V310 H1090" stroke={theme.line} strokeWidth="3" fill="none" />
        <path d="M320 434 H440 V420 H570" stroke={success} strokeWidth="3" fill="none" pathLength="1"
          strokeDasharray="1" strokeDashoffset={1 - separate} />
      </svg>
      {['Workflow A', 'Workflow B', 'Realtime'].map((title, i) => <div key={title}
        style={{position: 'absolute', left: 0, top: i === 2 ? 296 + 70 * separate : 36 + i * 130,
          width: 320, height: 68, borderBottom: `2px solid ${i === 2 && separate > .5 ? success : theme.line}`,
          fontSize: 29, display: 'flex', alignItems: 'center'}}>{title}</div>)}
      <Node x={570} y={138} width={330} title="Aurora writer" subtitle="Записи от workflow" color={accent} scale={1 + .13 * scaleUp} />
      <Node x={1090} y={28} width={318} title="Reader" subtitle="Чтение" />
      <Node x={1090} y={248} width={318} title="Reader" subtitle="Чтение" />
      <div style={{position: 'absolute', left: 520, top: 50, width: 430, textAlign: 'center', opacity: scaleUp,
        fontFamily: theme.fontMono, fontSize: 24, color: accent}}>CPU ↑ · RAM ↑ · IOPS ↑</div>
      <div style={{position: 'absolute', left: 560, top: 300, opacity: tune, fontSize: 24, color: success}}>autovacuum настроен</div>
      <div style={{opacity: separate}}><Node x={570} y={358} width={440} title="Отдельный кластер" subtitle="Temporal + своя Aurora" color={success} /></div>
    </div>
    <div style={{position: 'absolute', top: 722}}><Caption>Конфигурация Quo из статьи · До Aurora Limitless</Caption></div>
  </Content>;
};

export const WriterLimit: React.FC<SceneProps> = ({timeMs}) => {
  const progress = reveal(timeMs, cues.symptoms + 2200, 2400);
  return <Content>
    <Heading title="Предел — скорость записи одного узла" label="QUO / ПРЕДЕЛ ВЕРТИКАЛЬНОГО МАСШТАБИРОВАНИЯ" />
    <div style={{position: 'absolute', top: 230, left: 0, fontSize: 28}}>Ожидающие записи</div>
    <div style={{position: 'absolute', left: 0, top: 296, width: 700, height: 260}}>
      {Array.from({length: 60}, (_, i) => <div key={i} style={{position: 'absolute',
        left: (i % 12) * 55, top: Math.floor(i / 12) * 45, width: 39, height: 24,
        background: accent, opacity: reveal(progress, i / 90, .12)}} />)}
    </div>
    <svg width="1408" height="330" style={{position: 'absolute', top: 240}}>
      <path d="M690 160 H900" stroke={theme.line} strokeWidth="3" />
      <path d="M886 152 L900 160 L886 168" stroke={accent} strokeWidth="3" fill="none" />
    </svg>
    <Node x={920} y={310} width={460} title="Один writer" subtitle="Ограниченная скорость приёма" color={theme.signal} />
    <div style={{position: 'absolute', left: 0, top: 620, display: 'flex', width: '100%', justifyContent: 'space-between',
      paddingTop: 30, borderTop: `2px solid ${theme.line}`, fontSize: 31, color: theme.signal}}>
      <span>Задержки растут</span><span>Vacuum отстаёт</span><span>Таблицы раздуваются</span>
    </div>
    <div style={{position: 'absolute', top: 726}}><Caption>Схема механизма · Без числовой оценки пропускной способности</Caption></div>
  </Content>;
};
