import React from 'react';
import {Label} from '../../shared/HttpDiagram';
import {Caption, DepthPlate, httpDetailTheme as theme, type TimeProps} from '../../shared/HttpElements';
import {Channel, Completion, DataBlock, EndpointLabels, resources} from '../../shared/evolution/Elements';
import {cue, evolutionScenes} from '../../shared/evolution/timing';
import {flightOpacity, reveal, shotOpacity} from '../../shared/timing';

const binary = cue('multiplexing', 'p08-evolution-binary');
const frames = cue('multiplexing', 'p08-evolution-frames');
const streamId = cue('multiplexing', 'p08-evolution-stream-id');
const multiplex = cue('multiplexing', 'p08-evolution-multiplex');

export const BinaryFrames: React.FC<TimeProps> = ({timeMs}) => {
  const split = reveal(timeMs, frames, 950);
  const detail = reveal(timeMs, streamId + 70, 480);
  const depth = .12 + .7 * reveal(timeMs, binary, 850) * (1 - detail);
  return <g opacity={shotOpacity(timeMs, 0, multiplex)}>
    <Label x={212} y={490}>СМЫСЛ HTTP СОХРАНЯЕТСЯ. ФОРМАТ МЕНЯЕТСЯ</Label>
    <g opacity={1 - reveal(timeMs, streamId - 260, 240)}>
      <DepthPlate x={270} y={590 - split * 40} width={810} height={125} depth={depth} selected={split > .5}>
        <text x={32} y={52} fontFamily={theme.fontMono} fontSize={36} fill={theme.primary}>{split > .5 ? 'HEADERS' : '200 OK'}</text>
        <text x={32} y={94} fontFamily={theme.fontMono} fontSize={26} fill={theme.muted}>{split > .5 ? 'Закодированные поля заголовков' : 'Content-Type: image/jpeg'}</text>
      </DepthPlate>
      {[0, 1, 2].map(i => <DepthPlate key={i} x={270 + i * (265 + split * 8)} y={747 + split * (20 + i * 31)} width={265} height={130} depth={depth}>
        <text x={132} y={77} textAnchor="middle" fontFamily={theme.fontMono} fontSize={34} fill={theme.text}>{split > .5 ? `DATA ${i + 1}` : i === 1 ? 'Тело ответа' : '· · ·'}</text>
      </DepthPlate>)}
      <text x={270} y={1000} fontSize={31} fill={theme.muted} opacity={reveal(timeMs, cue('multiplexing', 'p08-evolution-data'))}>Тело может занимать несколько кадров</text>
    </g>
    <g opacity={detail} transform={`translate(0 ${22 * (1 - detail)})`}>
      <Label x={270} y={595}>ОДИН КАДР HTTP/2</Label>
      <DepthPlate x={270} y={678} width={825} height={206} depth={.6}>
        <path d="M 246 0 V 206 M 497 0 V 206" stroke={theme.line} strokeWidth={2} />
        {[
          {x: 28, title: 'Тип', value: 'DATA'}, {x: 274, title: 'Stream ID', value: '3'}, {x: 525, title: 'Полезная нагрузка', value: 'Данные картинки'},
        ].map(({x, title, value}, i) => <g key={title}>
          <text x={x} y={58} fontFamily={theme.fontMono} fontSize={i === 2 ? 23 : 27} fill={theme.muted}>{title}</text>
          <text x={x} y={135} fontFamily={theme.fontMono} fontSize={i === 2 ? 27 : 44} fill={i === 1 ? theme.primary : theme.text}>{value}</text>
        </g>)}
      </DepthPlate>
      <path d="M 649 924 V 958 H 938" stroke={theme.primary} strokeWidth={2} fill="none" />
      <text x={670} y={1008} fontSize={30} fill={theme.primary}>К какому потоку относится кадр</text>
    </g>
    <Caption opacity={reveal(timeMs, cue('multiplexing', 'p08-evolution-format'))} detail="Показаны поля, нужные для объяснения; не полный заголовок кадра">
      {timeMs < streamId ? 'Заголовки и данные передаются кадрами' : 'Stream ID связывает кадры одного ответа'}
    </Caption>
  </g>;
};

type RoutedFrame = {readonly stream: 1 | 3 | 5; readonly kind: 'H' | 'D'; readonly atMs: number};
// Server-to-client wire order: frames are interleaved, never overtaken inside TCP.
const responseFrames = [
  {stream: 1, kind: 'H', atMs: 450}, {stream: 3, kind: 'H', atMs: 1650}, {stream: 5, kind: 'H', atMs: 2850},
  {stream: 3, kind: 'D', atMs: 4050}, {stream: 1, kind: 'D', atMs: 5250}, {stream: 5, kind: 'D', atMs: 6450},
  {stream: 3, kind: 'D', atMs: 7650}, {stream: 1, kind: 'D', atMs: 8850}, {stream: 3, kind: 'D', atMs: 10650},
  {stream: 3, kind: 'D', atMs: 12850}, {stream: 3, kind: 'D', atMs: 15050}, {stream: 3, kind: 'D', atMs: 18850},
] as const satisfies readonly RoutedFrame[];
const rowY = (stream: RoutedFrame['stream']): number => stream === 1 ? 646 : stream === 3 ? 820 : 994;
const transportMs = 3350;

export const MultiplexedResponses: React.FC<TimeProps> = ({timeMs}) => {
  const local = timeMs - multiplex;
  return <g opacity={shotOpacity(timeMs, multiplex, evolutionScenes.multiplexing.durationMs + 330)}>
    <Label x={212} y={490}>НЕСКОЛЬКО ПОТОКОВ В ОДНОМ TCP</Label>
    <EndpointLabels y={530} left="СЕРВЕР" right="КЛИЕНТ" />
    <Channel y={820} from={245} to={744} label="ОДИН TCP →" />
    {resources.map(({stream}) => <path key={stream} d={`M 744 820 C 790 820 820 ${rowY(stream)} 897 ${rowY(stream)}`}
      fill="none" stroke={theme.line} strokeWidth={2} />)}
    {resources.map(resource => {
      const delivered = responseFrames.filter(frame => frame.stream === resource.stream && frame.kind === 'D' && local >= frame.atMs + transportMs).length;
      const total = responseFrames.filter(frame => frame.stream === resource.stream && frame.kind === 'D').length;
      return <Completion key={resource.id} x={955} y={rowY(resource.stream) - 61} label={`${resource.stream} / ${resource.short}`} progress={delivered / total} width={210} />;
    })}
    {responseFrames.map((frame, i) => {
      const route = reveal(local, frame.atMs + 2000, transportMs - 2000);
      const inverse = 1 - route;
      const center = 744 * inverse ** 3 + 3 * 790 * inverse ** 2 * route + 3 * 820 * inverse * route ** 2 + 897 * route ** 3;
      const x = local < frame.atMs + 2000 ? 245 + 452 * reveal(local, frame.atMs, 2000) : center - 47;
      const y = 820 + (rowY(frame.stream) - 820) * (3 * inverse * route ** 2 + route ** 3);
      return <DataBlock key={i} x={x} y={y - 28} width={94} height={56} fontSize={24} label={`${frame.kind}·${frame.stream}`}
        active={frame.stream === 5} opacity={flightOpacity(local, frame.atMs, transportMs)} />;
    })}
    <text x={245} y={1057} fontFamily={theme.fontMono} fontSize={24} fill={theme.muted}>H — HEADERS     D — DATA</text>
    <Caption opacity={reveal(timeMs, multiplex + 500)} detail="Каждый поток собирается в отдельный ответ">
      {timeMs < cue('multiplexing', 'p08-evolution-small') ? 'Кадры чередуются и различаются по ID' : local >= 22200 ? 'Все три ответа собраны' : 'Значок готов. Картинка ещё загружается'}
    </Caption>
  </g>;
};
