import React from 'react';
import {AbsoluteFill} from 'remotion';
import {easing, PresenterPreview, progress, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {chapterColors as colors} from '../../shared/chapterColors';
import {clues, timers} from './timers';

const media = {
  photoSrc: 'assets/011-websocket/reconnect/presenter.jpg',
  audioSrc: 'generated/011-websocket/timer-reference.m4a',
};

type Column = {readonly x: number; readonly label: string; readonly size: number};
const timerColumns: readonly Column[] = [
  {x: 0, label: 'Звено', size: 33},
  {x: 500, label: 'Простой', size: 32},
  {x: 843, label: 'Таймер жизни', size: 31},
];
const clueColumns: readonly Column[] = [
  {x: 0, label: 'Через сколько рвётся', size: 41},
  {x: 399, label: 'Кого подозревать', size: 36},
];

type TableProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly columns: readonly Column[];
  readonly rows: readonly (readonly string[])[];
  readonly opacity: number;
};

const Table: React.FC<TableProps> = ({title,subtitle,columns,rows,opacity}) => {
  const half = Math.ceil(rows.length / 2);
  const height = 1040 / half;
  return <g opacity={opacity}>
    <text x={110} y={148} fontSize={92} fontWeight={710} letterSpacing={-2}>{title}</text>
    <text x={113} y={221} fontSize={40}>{subtitle}</text>
    {[0,1].map(side => <g key={side} transform={`translate(${110+side*1210} 0)`}>
      {columns.map(col => <text key={col.x} x={col.x} y={297} fontSize={32} fontWeight={660}>{col.label}</text>)}
      {rows.slice(side*half,(side+1)*half).map((row,index) =>
        <g key={row[0]} transform={`translate(0 ${322+index*height})`}>
          <path d="M0 0 H1130" stroke={colors.text} strokeWidth={2} opacity={0.3}/>
          {row.map((cell,i) => {
            const col = columns[i];
            if (!col) throw new Error('Missing column for ' + cell);
            const lines = cell.split('\n');
            return <text key={col.x} fontSize={col.size} fontWeight={i===0 ? 635 : 530}>
              {lines.map((line,j) => <tspan key={line} x={col.x}
                y={height/2 + col.size*0.34 + (j-(lines.length-1)/2)*col.size*1.08}>{line}</tspan>)}
            </text>;
          })}
        </g>)}
    </g>)}
  </g>;
};

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs, endMs} = useSceneTime();
  // «Также я подготовил…» begins at 08:19.440 in the source WAV.
  const changeAt = 11380;
  const overview = 1-progress(timeMs,changeAt,changeAt+220,easing.transform);
  const checklist = progress(timeMs,changeAt+220,changeAt+540,easing.transform);
  const alpha = progress(timeMs,0,380,easing.transform) * (1-progress(timeMs,endMs-520,endMs,easing.transform));
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Таблица таймеров и поиск звена по числу секунд">
      <g fill={colors.text} opacity={alpha}>
        <rect width={2560} height={1440} fill={colors.background}/>
        <Table title="Таблица таймеров" subtitle="Простой по умолчанию и таймер жизни · Ноябрь 2026"
          columns={timerColumns} rows={timers} opacity={overview}/>
        <Table title="Найти звено по числу секунд" subtitle="Чек-лист для разработчиков"
          columns={clueColumns} rows={clues} opacity={checklist}/>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};
export default Composition;
