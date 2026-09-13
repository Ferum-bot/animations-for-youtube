import React from 'react';
import {Label, Message, Route, TimedCopy} from '../../shared/HttpDiagram';
import {Caption, DepthPlate, HeaderField, httpDetailTheme as theme, type TimeProps} from '../../shared/HttpElements';
import {bodyChunks, displayWire} from '../../shared/framing/content';
import {cue} from '../../shared/framing/timing';
import {flightOpacity, reveal, shotOpacity} from '../../shared/timing';

const database = cue('chunked', 'p06-database');
const chunked = cue('chunked', 'p06-chunked');
const size = cue('chunked', 'p06-size');
const receive = cue('chunked', 'p06-receive');
const buffer = cue('chunked', 'p06-buffer');
const zero = cue('chunked', 'p06-zero');
const complete = cue('chunked', 'p06-complete');

export const UnknownSize: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, 0, chunked)}>
  <Label x={212} y={495}>ОТВЕТ ЕЩЁ СОЗДАЁТСЯ</Label>
  <text x={212} y={650} fontSize={48} fill={theme.text}>Общий размер</text>
  <text x={980} y={665} fontFamily={theme.fontMono} fontSize={120} fill={theme.primary}>?</text>
  <path d="M 212 704 H 1168" stroke={theme.line} strokeWidth={2} />
  <g opacity={1 - reveal(timeMs, database - 350)}>
    <text x={212} y={853} fontSize={43} fill={theme.text}>Новые данные появляются</text>
    <text x={212} y={923} fontSize={43} fill={theme.text}>по мере выполнения запроса</text>
  </g>
  <g opacity={reveal(timeMs, database)}>
    <DepthPlate x={212} y={818} width={230} height={166} depth={0.6}>
      <text x={28} y={56} fontSize={36} fill={theme.text}>БД</text>
      {[0, 1, 2].map((row) => <path key={row} d={`M 28 ${86 + row * 28} H 200`} stroke={theme.line} strokeWidth={3} />)}
    </DepthPlate>
    <DepthPlate x={594} y={818} width={230} height={166} depth={0.6}>
      <text x={25} y={65} fontSize={35} fill={theme.text}>Сервер</text>
      <text x={25} y={123} fontSize={25} fill={theme.muted}>Часть готова</text>
    </DepthPlate>
    <text x={991} y={911} fontSize={34} fill={theme.text}>Клиент</text>
    <Route from={470} to={565} y={907} />
    <Route from={855} to={950} y={907} />
    <Message from={475} to={560} y={907} width={82} label="row" progress={reveal(timeMs, database + 350, 700)} opacity={flightOpacity(timeMs, database + 350, 850)} />
    <Message from={860} to={945} y={907} width={82} label="data" progress={reveal(timeMs, database + 1700, 700)} opacity={flightOpacity(timeMs, database + 1700, 850)} />
  </g>
  <Caption opacity={reveal(timeMs, 1700)}>Итоговая длина ещё неизвестна</Caption>
</g>;

export const ChunkAnatomy: React.FC<TimeProps> = ({timeMs}) => {
  const decoded = reveal(timeMs, receive + 700, 600);
  return <g opacity={shotOpacity(timeMs, chunked, buffer)}>
    <Label x={212} y={495}>02 / РАЗМЕР УКАЗАН У КАЖДОЙ ЧАСТИ</Label>
    <HeaderField name="Transfer-Encoding" value="chunked" y={598} fontSize={43} accent />
    <text x={212} y={670} fontSize={28} fill={theme.muted}>Размер в hex · ␍␊ = CRLF</text>
    {bodyChunks.map((data, index) => {
      const at = size + index * 1750;
      const y = 740 + index * 163;
      return <g key={data} opacity={reveal(timeMs, at)}>
        <g opacity={1 - decoded * 0.65}>
          <DepthPlate x={212} y={y} width={86} height={90} depth={reveal(timeMs, at, 600) * 0.5} selected>
            <text x={43} y={63} textAnchor="middle" fontFamily={theme.fontMono} fontSize={54} fill={theme.primary}>{data.length.toString(16)}</text>
          </DepthPlate>
          <text x={341} y={y + 58} fontFamily={theme.fontMono} fontSize={29} fill={theme.muted}>␍␊</text>
          <text x={1010} y={y + 58} fontFamily={theme.fontMono} fontSize={29} fill={theme.muted}>␍␊</text>
        </g>
        <g transform={`translate(${decoded * -42} 0)`} opacity={reveal(timeMs, at + 500)}>
          <DepthPlate x={453} y={y} width={495} height={90} depth={0.5}>
            <text x={35} y={61} fontFamily={theme.fontMono} fontSize={48} fill={theme.text}>{displayWire(data)}</text>
            <text x={347} y={56} fontSize={27} fill={theme.muted}>{data.length} байт</text>
          </DepthPlate>
        </g>
      </g>;
    })}
    <g opacity={decoded}>
      <text x={212} y={1090} fontSize={30} fill={theme.muted}>Данные клиента:</text>
      <text x={546} y={1090} fontFamily={theme.fontMono} fontSize={43} fill={theme.primary}>Hello world</text>
    </g>
    <Caption opacity={reveal(timeMs, size + 750)}>Размер части → данные части</Caption>
  </g>;
};

/** The buffer is reused; completion is a terminal chunk, not a closed TCP line. */
export const StreamingBuffer: React.FC<TimeProps> = ({timeMs}) => {
  const finish = reveal(timeMs, zero + 1900, 300);
  return <g opacity={reveal(timeMs, buffer)}>
    <Label x={212} y={495}>ПОСТЕПЕННАЯ ОБРАБОТКА</Label>
    <HeaderField name="Transfer-Encoding" value="chunked" y={591} fontSize={39} accent />
    <text x={212} y={710} fontSize={34} fill={theme.text}>Сервер</text>
    <text x={973} y={710} fontSize={34} fill={theme.text}>Клиент</text>
    <Route from={320} to={1080} y={929} />
    {bodyChunks.map((data, index) => <Message key={data} from={863} to={1060} y={929} width={160} label={displayWire(data)}
      progress={reveal(timeMs, buffer + 650 + index * 1400, 800)} opacity={flightOpacity(timeMs, buffer + 650 + index * 1400, 1100)} />)}
    <Message from={863} to={1060} y={929} width={80} label="0" progress={reveal(timeMs, zero + 350, 1000)} opacity={flightOpacity(timeMs, zero + 350, 1300)} />
    <DepthPlate x={490} y={782} width={340} height={215} depth={0.7}>
      <text x={29} y={54} fontSize={29} fill={theme.muted}>Рабочий буфер</text>
      <path d="M 29 84 H 309 V 176 H 29 Z" stroke={theme.line} fill={theme.background} strokeWidth={2} />
      {bodyChunks.map((data, index) => <text key={data} x={53} y={144} fontFamily={theme.fontMono} fontSize={39} fill={theme.primary}
        opacity={shotOpacity(timeMs, buffer + 250 + index * 1400, buffer + 1400 + index * 1400)}>{displayWire(data)}</text>)}
      <text x={53} y={144} fontFamily={theme.fontMono} fontSize={28} fill={theme.muted} opacity={reveal(timeMs, buffer + 2800)}>освобождён</text>
    </DepthPlate>
    <g opacity={reveal(timeMs, zero)}>
      <text x={212} y={1067} fontFamily={theme.fontMono} fontSize={68} fill={theme.primary}>0</text>
      <text x={306} y={1067} fontFamily={theme.fontMono} fontSize={34} fill={theme.muted}>␍␊␍␊</text>
      <text x={550} y={1062} fontSize={32} fill={theme.text} opacity={finish}>Тело завершено</text>
    </g>
    <TimedCopy timeMs={timeMs} states={[
      {startMs: buffer + 300, text: 'Буфер освобождается после отправки'},
      {startMs: zero, text: 'Нулевой чанк завершает тело'},
      {startMs: complete, text: 'Соединение может продолжаться'},
    ]} x={212} y={1200} fontSize={38} />
    <text x={212} y={1252} fontSize={26} fill={theme.muted}>Пример без дополнительных трейлеров</text>
  </g>;
};
