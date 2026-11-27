import React, {useId} from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {arrive, easing, PresenterPreview, presence, progress, SceneStage, useSceneTime, v2Theme, type PreviewProps} from '@channel/motion-v2';
import {chapterColors} from '../../shared/chapterColors';

const media = {
  photoSrc: 'assets/011-websocket/reconnect/presenter.jpg',
  audioSrc: 'generated/011-websocket/proxy-comparison.m4a',
};

type Row = {
  readonly name: string;
  readonly proxy: readonly string[];
  readonly forwarding: readonly string[];
  readonly cue?: {
    readonly topic: number;
    readonly proxy: number;
    readonly forwarding: number;
    readonly end: number;
  };
};

// Cue times are relative to WAV 07:23.500. The client-address row is present
// in the author's table but is not called out in the recorded comparison.
const rows: readonly Row[] = [
  {name: 'Таймер простоя', proxy: ['У каждого участка', 'свой таймер.'],
    forwarding: ['Если звено отслеживает поток,', 'у записи один таймер.'], cue: {topic: 6520, proxy: 6960, forwarding: 9080, end: 11300}},
  {name: 'TCP keepalive', proxy: ['Проба доходит до прокси.', 'У второго участка своя.'],
    forwarding: ['Пакет проходит через звено', 'до другого конца соединения.'], cue: {topic: 11800, proxy: 12730, forwarding: 15820, end: 18380}},
  {name: 'Адрес клиента', proxy: ['IP клиента можно передать', 'через X-Forwarded-For', 'или PROXY protocol.'],
    forwarding: ['Сервер видит IP клиента,', 'если адрес не подменяется.']},
  {name: 'Перезапуск звена', proxy: ['При остановке прокси', 'обрываются оба соединения.'],
    forwarding: ['Важен выбор того же сервера.', 'Потеря записи о потоке', 'может оборвать связь.'], cue: {topic: 19040, proxy: 19840, forwarding: 22080, end: 25440}},
];

const tableLeft = 100;
const tableRight = 2460;
const rowHeight = 220;
const bodyTop = 454;
const proxyX = 760;
const forwardingX = 1600;

type CellProps = {
  x: number;
  lines: readonly string[];
  amount: number;
  onHighlight: boolean;
  heading?: boolean;
};

const Cell: React.FC<CellProps> = ({x, lines, amount, onHighlight, heading = false}) => {
  const scale = 1 + 0.15 * amount;
  const fill = onHighlight
    ? interpolateColors(amount, [0, 1], [chapterColors.background, v2Theme.primary])
    : chapterColors.text;
  return <g transform={`translate(${x} ${rowHeight/2}) scale(${scale})`}>
    <text fill={fill} fontSize={heading ? 54 : 48} fontWeight={heading ? 675 : 540}>
      {lines.map((line, i) => <tspan key={line} x={0}
        y={(heading ? 17 : 16) + (i - (lines.length-1)/2)*58}>{line}</tspan>)}
    </text>
  </g>;
};

const ComparisonRow: React.FC<{row: Row; index: number; ms: number}> = ({row, index, ms}) => {
  const clip = useId();
  const {cue} = row;
  const nextCue = rows.slice(index+1).find(next => next.cue)?.cue;
  const reveal = cue ? arrive(ms, cue.topic, 230) : 0;
  const release = nextCue ? arrive(ms, nextCue.topic, 230) : 0;
  const height = (rowHeight-6) * reveal * (1-release);
  const cells = (onHighlight: boolean) => <>
    <Cell heading x={138} lines={[row.name]} onHighlight={onHighlight}
      amount={cue ? presence(ms, cue.topic, cue.proxy, 175) : 0}/>
    <Cell x={proxyX} lines={row.proxy} onHighlight={onHighlight}
      amount={cue ? presence(ms, cue.proxy, cue.forwarding, 220) : 0}/>
    <Cell x={forwardingX} lines={row.forwarding} onHighlight={onHighlight}
      amount={cue ? presence(ms, cue.forwarding, cue.end, 220) : 0}/>
  </>;
  return <g transform={`translate(0 ${bodyTop+index*rowHeight})`}>
    <path d={`M${tableLeft} 0 H${tableRight}`} stroke={chapterColors.text} strokeWidth={2} opacity={0.38}/>
    {cells(false)}
    {height > 0 && <g aria-hidden="true">
      <defs><clipPath id={clip}><rect x={tableLeft} y={(rowHeight-height)/2} width={tableRight-tableLeft} height={height}/></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        <rect x={tableLeft} width={tableRight-tableLeft} height={rowHeight} fill={chapterColors.text}/>
        {cells(true)}
      </g>
    </g>}
  </g>;
};

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs, endMs} = useSceneTime();
  // «вот» starts the reveal; the last syllable of «журнала» starts the fade.
  const enter = progress(timeMs, 3380, 3840, easing.transform);
  const exit = progress(timeMs, 25440, endMs, easing.transform);
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Сравнение прокси и сквозной пересылки">
      <g fill={chapterColors.text} opacity={enter * (1 - exit)}>
        <rect width={2560} height={1440} fill={chapterColors.background}/>
        <text x={126} y={184} fontSize={108} fontWeight={720} letterSpacing={-3}>Прокси и сквозная пересылка</text>
        <g fontSize={60} fontWeight={670}>
          <text x={138} y={346}>Вопрос</text>
          <text x={proxyX} y={346}>Прокси</text>
          <text x={forwardingX} y={346}>Сквозная пересылка</text>
        </g>
        <g fontSize={39} fontWeight={540} opacity={0.85}>
          <text x={proxyX} y={410}>Два TCP-соединения</text>
          <text x={forwardingX} y={410}>Одно TCP-соединение</text>
        </g>
        {rows.map((row, index) => <ComparisonRow key={row.name} row={row} index={index} ms={timeMs}/>)}
        <path d={`M${tableLeft} ${bodyTop+rows.length*rowHeight} H${tableRight}`} stroke={chapterColors.text} strokeWidth={2} opacity={0.38}/>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};
export default Composition;
