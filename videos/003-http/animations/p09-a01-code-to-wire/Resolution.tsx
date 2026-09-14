import React from 'react';
import {ByteCells, FooterNote, Label, Line, Plate} from '../../shared/journey/Diagram';
import {palette as p} from '../../shared/journey/theme';
import {contentLength, headersHex} from '../../shared/journey/request';
import {cue, lerp, progress} from '../../shared/journey/timing';
import type {SceneProps} from '../../shared/journey/types';

export const Comparison: React.FC<SceneProps> = ({time}) => {
  const focus =
    time < cue('p09-journey-summary-http2') ? 0 : time < cue('p09-journey-summary-http3') ? 1 : 2;
  const titles = ['HTTP/1.1', 'HTTP/2', 'HTTP/3'];
  return (
    <>
      {titles.map((name, i) => {
        const x = 190 + i * 765,
          active = i === focus;
        return (
          <g key={name} opacity={active ? 1 : 0.53}>
            <Plate x={x} y={454} w={683} h={624} accent={active ? p.primary : p.edge} depth={23}>
              <Label x={x + 35} y={535} size={54} mono color={active ? p.primary : p.text}>
                {name}
              </Label>
              <Line x1={x + 35} y1={572} x2={x + 644} y2={572} />
              <Label x={x + 35} y={627} mono size={21} color={p.muted}>
                ПРИЛОЖЕНИЕ
              </Label>
              {i === 0 ? (
                <>
                  <Label x={x + 35} y={695} mono size={29}>
                    POST /api/events
                  </Label>
                  <Label x={x + 35} y={745} mono size={24} color={p.muted}>
                    Content-Length: {contentLength}
                  </Label>
                  <path d={`M${x + 35} 773 H${x + 639}`} stroke={p.primary} strokeWidth={2} />
                  <Label x={x + 35} y={814} mono size={27}>
                    {'{"events":[…]}'}
                  </Label>
                </>
              ) : (
                <>
                  {[0, 1, 2].map((n) => (
                    <Plate
                      key={n}
                      x={x + 38 + n * 207}
                      y={675}
                      w={185}
                      h={91}
                      depth={8}
                      accent={n === 0 ? p.primary : p.edge}
                    >
                      <Label x={x + 52 + n * 207} y={730} mono size={n === 0 ? 21 : 25}>
                        {n === 0 ? 'HEADERS' : 'DATA'}
                      </Label>
                    </Plate>
                  ))}
                </>
              )}
              <Label x={x + 35} y={893} mono size={21} color={p.muted}>
                {i < 2 ? 'ТРАНСПОРТ / TCP' : 'ТРАНСПОРТ / QUIC'}
              </Label>
              {[0, 1, 2].map((n) => (
                <Line
                  key={n}
                  x1={x + 35}
                  y1={935 + n * 25}
                  x2={x + 640}
                  y2={935 + n * 25}
                  active={i === 2 ? 1 : 0}
                />
              ))}
              {i < 2 ? (
                <line
                  x1={x + 380}
                  x2={x + 380}
                  y1={915}
                  y2={1001}
                  stroke={p.muted}
                  strokeWidth={3}
                />
              ) : (
                <line
                  x1={x + 545}
                  x2={x + 545}
                  y1={969}
                  y2={1000}
                  stroke={p.primary}
                  strokeWidth={5}
                />
              )}
              {i === 2 ? (
                <>
                  <line
                    x1={x + 245}
                    x2={x + 245}
                    y1={916}
                    y2={945}
                    stroke={p.primary}
                    strokeWidth={5}
                  />
                  <line
                    x1={x + 420}
                    x2={x + 420}
                    y1={944}
                    y2={975}
                    stroke={p.primary}
                    strokeWidth={5}
                  />
                </>
              ) : null}
            </Plate>
            <Label
              x={x + 341}
              y={1126}
              size={30}
              anchor="middle"
              color={active ? p.primary : p.muted}
            >
              {['Границы сообщения', 'Структура кадров', 'Независимая выдача'][i]}
            </Label>
          </g>
        );
      })}
      <FooterNote
        title="Разные проблемы решаются на разных уровнях."
        detail="HTTP описывает сообщения. Транспорт определяет, как данные становятся доступными."
      />
    </>
  );
};

export const Readability: React.FC<SceneProps> = ({time}) => {
  const binary = progress(time, 'p09-journey-binary', 1000),
    tools = progress(time, 'p09-journey-tools', 1300),
    leave = progress(time, 'p09-journey-return', 2600);
  return (
    <>
      <g transform={`translate(${-leave * 35} 0) scale(${1 - leave * 0.12})`}>
        <Plate x={185} y={451} w={1050} h={641} accent={p.primary}>
          <Label x={225} y={514} mono size={26} color={p.primary}>
            МОЖНО ПРОЧИТАТЬ РУКАМИ
          </Label>
          <Line x1={225} y1={545} x2={1188} y2={545} />
          {[
            'POST /api/events HTTP/1.1',
            'Host: example.com',
            'Content-Type: application/json',
            `Content-Length: ${contentLength}`,
            '',
            '{"events":[…]}',
          ].map((s, i) => (
            <Label
              key={i}
              x={225}
              y={616 + i * 61}
              mono
              size={32}
              color={i === 0 ? p.primary : p.text}
            >
              {s}
            </Label>
          ))}
          <Label x={225} y={1030} mono size={23} color={p.muted}>
            Тело показано сокращённо
          </Label>
        </Plate>
      </g>
      <g opacity={binary * (1 - leave)}>
        <Plate x={1410} y={451} w={942} h={641}>
          <Label x={1450} y={514} mono size={26} color={p.muted}>
            НУЖЕН ПРОТОКОЛЬНЫЙ АНАЛИЗАТОР
          </Label>
          <Line x1={1450} y1={545} x2={2305} y2={545} />
          <g opacity={1 - tools}>
            {Array.from({length: 5}, (_, row) => (
              <ByteCells
                key={row}
                x={1450}
                y={585 + row * 77}
                count={10}
                width={85}
                h={54}
                labels={headersHex.slice(row * 10, row * 10 + 10)}
                color={p.muted}
              />
            ))}
            <Label x={1450} y={1030} size={23} color={p.muted}>
              HTTP/2 · первые 50 байт HEADERS
            </Label>
          </g>
          <g opacity={tools}>
            <Label x={1450} y={619} mono color={p.primary} size={27}>
              РАЗОБРАНО / HEADERS
            </Label>
            {[
              'method    POST',
              'path      /api/events',
              'type      application/json',
              `body      ${contentLength} bytes`,
            ].map((s, i) => (
              <Label key={s} x={1450} y={700 + i * 63} mono size={28}>
                {s}
              </Label>
            ))}
            <Label x={1450} y={1024} size={23} color={p.muted}>
              Представление после расшифровки
            </Label>
          </g>
        </Plate>
        <path
          d={`M1395 438 H2368 V${lerp(570, 1108, tools)} H1395 Z`}
          fill="none"
          stroke={p.primary}
          strokeWidth={2}
          opacity={tools > 0 && tools < 1 ? 1 : 0.3}
        />
      </g>
      <g opacity={1 - leave}>
        <FooterNote
          title="Запрос тот же. Читать его стало сложнее."
          detail="Бинарный формат и сжатие — отдельные вещи от шифрования."
        />
      </g>
    </>
  );
};
