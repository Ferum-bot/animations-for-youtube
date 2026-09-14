import React from 'react';
import {Bracket, FooterNote, Label, Line, Plate} from '../../shared/journey/Diagram';
import {contentLength, framePayloads, hpackBytes} from '../../shared/journey/request';
import {palette as p} from '../../shared/journey/theme';
import {cue, progress} from '../../shared/journey/timing';
import {reveal} from '../../shared/timing';
import type {SceneProps} from '../../shared/journey/types';

export const Frames: React.FC<SceneProps> = ({time}) => {
  const frames = progress(time, 'p09-journey-frames', 900),
    end = progress(time, 'p09-journey-end-stream');
  return (
    <>
      <Plate x={180} y={433} w={860} h={586} accent={p.primary}>
        <Label x={222} y={495} mono size={29} color={p.primary}>
          ТОТ ЖЕ POST /api/events
        </Label>
        {[
          ':method     POST',
          ':scheme     https',
          ':authority  example.com',
          ':path       /api/events',
          'content-type application/json',
        ].map((line, i) => (
          <Label key={line} x={222} y={573 + i * 58} mono size={28}>
            {line}
          </Label>
        ))}
        <Label x={222} y={928} mono size={24} color={p.muted}>
          Поля перед кодированием
        </Label>
        <Label x={222} y={973} mono size={24} color={p.primary}>
          JSON · {contentLength} байт
        </Label>
      </Plate>
      <g opacity={frames}>
        <Line x1={1060} y1={689} x2={1255} y2={689} active={frames} />
        <Label x={1159} y={638} mono size={24} color={p.primary} anchor="middle">
          HPACK
        </Label>
        <Plate x={1300} y={462} w={955} h={197} depth={24} accent={p.primary}>
          <Label x={1338} y={519} mono size={37} color={p.primary}>
            HEADERS
          </Label>
          <Label x={1338} y={577} mono size={24}>
            Длина: {hpackBytes.length} B / Тип: 01 / Stream: 1
          </Label>
          <Label x={1338} y={627} mono size={25} color={p.muted}>
            Сжатые поля · 83 87 …
          </Label>
        </Plate>
        {framePayloads.map((bytes, i) => (
          <g key={i} opacity={reveal(time, cue('p09-journey-data-frame') + i * 220, 500)}>
            <Plate
              x={1300 + i * 324}
              y={748}
              w={298}
              h={190}
              accent={i === 2 && end > 0 ? p.primary : p.edge}
            >
              <Label x={1324 + i * 324} y={804} mono size={30}>
                DATA
              </Label>
              <Label x={1324 + i * 324} y={858} mono size={28} color={p.primary}>
                {bytes} B
              </Label>
              <Label x={1324 + i * 324} y={908} mono size={22} color={p.muted}>
                Stream ID: 1
              </Label>
            </Plate>
          </g>
        ))}
        <g opacity={end}>
          <path d="M2110 959 V1002 H1830" stroke={p.primary} strokeWidth={3} fill="none" />
          <Label x={1780} y={1012} anchor="end" mono size={28} color={p.primary}>
            END_STREAM = 1
          </Label>
        </g>
      </g>
      <FooterNote
        title="HEADERS описывает сообщение. DATA несёт тело."
        detail="Пример без trailers: последний DATA завершает отправку запроса, но не закрывает соединение."
      />
    </>
  );
};

export const Framing: React.FC<SceneProps> = ({time}) => {
  const phase =
    time < cue('p09-journey-length-check') ? 0 : time < cue('p09-journey-boundaries') ? 1 : 2;
  const labels = ['Встроенный framing', 'Проверка длины', 'Завершение сообщения'];
  return (
    <>
      {labels.map((label, i) => (
        <g key={label}>
          <Label x={190 + i * 748} y={460} mono size={24} color={phase === i ? p.primary : p.line}>
            0{i + 1}
          </Label>
          <Label x={246 + i * 748} y={460} size={31} color={phase === i ? p.text : p.muted}>
            {label}
          </Label>
          <path
            d={`M${190 + i * 748} 485 h640`}
            stroke={phase === i ? p.primary : p.edge}
            strokeWidth={phase === i ? 3 : 1}
          />
        </g>
      ))}
      {phase === 0 ? (
        <>
          <g opacity={1 - progress(time, 'p09-journey-framing')}>
            <Label x={265} y={625} mono size={36} color={p.muted}>
              Transfer-Encoding: chunked
            </Label>
            <path d="M250 612 H1120" stroke={p.muted} strokeWidth={3} />
            <Label x={1370} y={625} size={34} color={p.primary}>
              В HTTP/2 не используется
            </Label>
          </g>
          {['HEADERS', 'DATA', 'DATA', 'DATA'].map((type, i) => (
            <Plate
              key={i}
              x={255 + i * 531}
              y={766}
              w={478}
              h={188}
              accent={i === 0 ? p.primary : p.edge}
            >
              <rect x={255 + i * 531} y={766} width={478} height={42} fill={p.edge} opacity={0.5} />
              <Label x={280 + i * 531} y={796} mono size={20} color={p.text}>
                Длина · Тип · Stream ID
              </Label>
              <Label x={288 + i * 531} y={880} mono size={40} color={i === 0 ? p.primary : p.text}>
                {type}
              </Label>
              <Label x={288 + i * 531} y={928} mono size={23} color={p.muted}>
                Граница задаётся форматом
              </Label>
            </Plate>
          ))}
          <Bracket x={240} y={725} w={2140} h={270} />
        </>
      ) : phase === 1 ? (
        <>
          <Plate x={250} y={600} w={810} h={388} accent={p.primary}>
            <Label x={290} y={670} mono size={27} color={p.muted}>
              ЗАЯВЛЕНО / CONTENT-LENGTH
            </Label>
            <Label x={290} y={812} mono size={104} color={p.primary}>
              {contentLength}
            </Label>
            <Label x={290} y={907} size={34}>
              байт тела
            </Label>
          </Plate>
          <Label x={1250} y={813} anchor="middle" mono size={72} color={p.primary}>
            {progress(time, 'p09-journey-length-match', 1400) >= 1 ? '=' : '…'}
          </Label>
          <Plate x={1450} y={600} w={810} h={388} accent={p.primary}>
            <Label x={1490} y={670} mono size={27} color={p.muted}>
              ПОЛУЧЕНО / СУММА DATA
            </Label>
            <Label x={1490} y={812} mono size={104}>
              {Math.round(contentLength * progress(time, 'p09-journey-length-match', 1400))}
            </Label>
            <Label x={1490} y={907} mono size={25} color={p.muted}>
              {framePayloads.join(' + ')}
            </Label>
          </Plate>
        </>
      ) : (
        <>
          {['HEADERS', 'DATA', 'DATA', 'DATA'].map((type, i) => (
            <Plate
              key={i}
              x={260 + i * 525}
              y={664}
              w={460}
              h={218}
              accent={i === 3 ? p.primary : p.edge}
            >
              <Label x={292 + i * 525} y={730} mono size={35}>
                {type}
              </Label>
              <Label x={292 + i * 525} y={798} mono size={25} color={p.muted}>
                Stream ID: 1
              </Label>
              <Label x={292 + i * 525} y={850} mono size={23} color={i === 3 ? p.primary : p.muted}>
                {i === 3 ? 'END_STREAM = 1' : 'END_STREAM = 0'}
              </Label>
            </Plate>
          ))}
          <path d="M260 924 V989 H2295 V924" stroke={p.primary} strokeWidth={3} fill="none" />
          <Label x={1278} y={1045} anchor="middle" size={36} color={p.primary}>
            Одно сообщение → несколько кадров
          </Label>
          <Label x={495} y={598} anchor="middle" size={26} color={p.muted}>
            Своя длина у каждого кадра
          </Label>
        </>
      )}
      <FooterNote
        title={
          phase === 0
            ? 'Тело уже разделено на DATA-кадры.'
            : phase === 1
              ? 'Content-Length проверяет длину тела.'
              : 'Длина ограничивает кадр. END_STREAM завершает сообщение.'
        }
        detail={
          phase === 1
            ? 'Совпадение длины не является проверкой неизменности содержимого.'
            : 'Соединение может продолжать обслуживать другие потоки.'
        }
      />
    </>
  );
};
