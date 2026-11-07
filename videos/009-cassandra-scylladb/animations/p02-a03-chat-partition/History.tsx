import React from 'react';
import {Sheet, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {NotebookCover} from '../../shared/architecture/NotebookCover';
import {Title} from '../../shared/architecture/Title';
import {cue, history, type ShotProps} from './scene';

const firstY = 495;
const rowStep = 170;
const Page: React.FC = () => <svg x={150} y={240} width={1400} height={1000}
  viewBox="0 0 535 276" preserveAspectRatio="none"><NotebookCover /></svg>;

const Bracket: React.FC<{readonly row: number}> = ({row}) =>
  <path d={`M1452 ${firstY-70+row*rowStep} h26 v${rowStep+100} h-26`}
    stroke={ink.primary} strokeWidth={10} fill="none" />;

export const History: React.FC<ShotProps> = ({timeMs}) => {
  const clustering = timeMs >= cue.clustering;
  const showTime = timeMs >= cue.time;
  const showId = timeMs >= cue.tie;
  const reading = timeMs >= cue.latest && (!clustering || timeMs >= cue.range);
  const older = progress(timeMs, cue.previous, cue.previous+550);
  return <g>
    <Title>{clustering ? 'Clustering key' : 'История чата 42'}</Title>
    <Page />
    <text x={345} y={370} fontSize={50} fontWeight={650}>Чат 42</text>
    {history.map((m,i) => <g key={m.id} transform={`translate(355 ${firstY+i*rowStep})`}>
      <text fontSize={57} fontWeight={600}>{m.body}</text>
      {showTime && <text x={568} fontSize={47} fill={ink.muted}>{m.clock}</text>}
      {showId && <text x={900} fontSize={48}>{m.id}</text>}
      {showId && i < 2 && timeMs < cue.range &&
        <path d="M896 18 h90" stroke={ink.primary} strokeWidth={8} />}
    </g>)}
    {reading && <Bracket row={clustering ? 0 : mix(0,2,older)} />}
    <g transform="translate(1660 555)">
      {!clustering && reading && <text fontSize={60} fontWeight={600}>
        <tspan x={0}>{timeMs < cue.previous ? 'Последние два' : 'Предыдущие два'}</tspan>
        <tspan x={0} dy={83}>сообщения</tspan>
      </text>}
      {clustering && <g>
        <text fontSize={48} fill={ink.muted}>Порядок внутри чата</text>
        {showTime && <text y={115} fontSize={62} fontWeight={650}>sent_at ↓</text>}
        {showId && <text y={211} fontSize={62} fontWeight={650}>message_id ↓</text>}
        {timeMs >= cue.range && <text y={365} fontSize={49}>Прочитаны две строки</text>}
      </g>}
    </g>
  </g>;
};

export const IndexComparison: React.FC<ShotProps> = ({timeMs}) => {
  const cassandra = timeMs >= cue.secondary;
  const primary = timeMs >= cue.primary;
  const secondary = cassandra && !primary;
  return <g>
    <Title>{cassandra ? 'Cassandra' : 'PostgreSQL'}</Title>
    <g transform="translate(240 485)">
      <text fontSize={59} fontWeight={650}>{primary ? 'Clustering key' : secondary ? 'Дополнительный индекс' : 'Индекс истории'}</text>
      {secondary ? <g>
        <text y={145} fontSize={57}>CREATE INDEX by_sender</text>
        <text y={225} fontSize={57}>ON messages (sender_id);</text>
      </g> : <g>
        {!primary && <text y={128} fontSize={57}>chat_id = 42</text>}
        <text y={primary ? 137 : 227} fontSize={64}>sent_at ↓</text>
        <text y={primary ? 241 : 331} fontSize={64}>message_id ↓</text>
      </g>}
    </g>
    <g transform="translate(1345 455)">
      <text y={-28} fontSize={50}>Чат 42</text>
      {history.map((m,i) => <g key={m.id} opacity={secondary ? 0.55 : 1}>
        <Sheet x={0} y={i*117} width={945} height={101}>
          <text x={29} y={67} fontSize={44} fill={ink.muted}>{m.clock}</text>
          <text x={255} y={67} fontSize={45}>{m.id}</text>
          <text x={419} y={68} fontSize={51} fontWeight={600}>{m.body}</text>
        </Sheet>
      </g>)}
    </g>
  </g>;
};
