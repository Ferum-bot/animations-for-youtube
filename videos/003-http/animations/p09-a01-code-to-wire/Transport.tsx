import React from 'react';
import {
  ByteCells,
  DeliveryGate,
  FooterNote,
  Label,
  Line,
  Plate,
} from '../../shared/journey/Diagram';
import {palette as p} from '../../shared/journey/theme';
import {cue, lerp, progress, range} from '../../shared/journey/timing';
import {reveal} from '../../shared/timing';
import type {SceneProps} from '../../shared/journey/types';

const exchanges = [
  {label: 'JSON', id: 1, color: p.primary},
  {label: 'Картинка', id: 3, color: p.blue},
  {label: 'Стили', id: 5, color: p.violet},
] as const;

export const Multiplex: React.FC<SceneProps> = ({time}) => {
  const advance = range(time, cue('p09-journey-mixed'), cue('p09-journey-tcp-underneath') - 600);
  const ids = [0, 1, 2, 0, 2, 1, 0, 1, 2];
  return (
    <>
      <Label x={200} y={430} mono size={27} color={p.muted}>
        СЕРВЕР
      </Label>
      <Label x={2350} y={430} mono size={27} color={p.muted} anchor="end">
        КЛИЕНТ
      </Label>
      <Line x1={2340} y1={490} x2={210} y2={490} active={1} />
      <Label x={1260} y={471} mono size={22} color={p.primary} anchor="middle">
        ← POST /api/events · Stream 1
      </Label>
      <Plate x={230} y={676} w={231} h={144} accent={p.primary}>
        <Label x={252} y={738} mono size={34}>
          200
        </Label>
        <Label x={252} y={782} mono size={24} color={p.primary}>
          JSON
        </Label>
      </Plate>
      <Line x1={480} y1={747} x2={1640} y2={747} width={3} />
      <Label x={1020} y={612} size={34} anchor="middle">
        Один TCP · ответы сервера →
      </Label>
      {ids.map((n, i) => {
        const exchange = exchanges[n];
        if (!exchange) return null;
        const f = range(advance * 13 - i, 0, 3.7),
          a = reveal(advance * 13 - i, 0, 0.2) * (1 - reveal(advance * 13 - i, 3.4, 0.3));
        return (
          <g key={i} opacity={a}>
            <Plate x={lerp(510, 1550, f)} y={704} w={111} h={80} depth={9} accent={exchange.color}>
              <Label
                x={lerp(510, 1550, f) + 55}
                y={755}
                anchor="middle"
                mono
                size={25}
                color={exchange.color}
              >
                {exchange.id}
              </Label>
            </Plate>
          </g>
        );
      })}
      {exchanges.map((exchange, i) => {
        const y = 620 + i * 173,
          done = advance * 13 >= 9.7 + i;
        return (
          <g key={exchange.id}>
            <path
              d={`M1640 747 C1745 747 1710 ${y} 1840 ${y}`}
              stroke={exchange.color}
              strokeWidth={2}
              fill="none"
            />
            <Plate x={1840} y={y - 54} w={455} h={120} accent={exchange.color}>
              <Label x={1870} y={y - 7} mono size={26} color={exchange.color}>
                Stream {exchange.id} / {exchange.label}
              </Label>
              <Label x={1870} y={y + 38} size={24} color={p.muted}>
                {done ? 'Ответ собран' : 'Получение данных'}
              </Label>
            </Plate>
          </g>
        );
      })}
      <Label x={680} y={924} mono size={25} color={p.muted}>
        Номер на блоке — Stream ID
      </Label>
      <FooterNote
        title="Кадры чередуются в соединении и собираются по потокам."
        detail="Запрос и ответы показаны в разных направлениях одного двустороннего соединения."
      />
    </>
  );
};

export const Blocking: React.FC<SceneProps> = ({time}) => {
  const loss = progress(time, 'p09-journey-loss', 500),
    retry = progress(time, 'p09-journey-retry', 1100);
  const waiting = loss > 0.2 && retry < 0.98;
  const gateX = loss < 0.2 ? 820 : lerp(820, 2264, retry);
  return (
    <>
      <Label x={210} y={450} mono size={25} color={p.muted}>
        ПРИЛОЖЕНИЕ / ОТВЕТЫ HTTP
      </Label>
      {exchanges.map((exchange, i) => (
        <g key={exchange.id}>
          <Plate
            x={230 + i * 720}
            y={501}
            w={630}
            h={175}
            depth={20}
            accent={waiting ? p.line : exchange.color}
          >
            <Label x={267 + i * 720} y={567} mono size={30} color={exchange.color}>
              Stream {exchange.id} / {exchange.label}
            </Label>
            <Label x={267 + i * 720} y={625} size={30}>
              {waiting ? 'Ожидание выдачи' : retry > 0.98 ? 'Данные доступны' : 'Получение данных'}
            </Label>
          </Plate>
          <path
            d={`M${545 + i * 720} 694 V746 H1280 V790`}
            stroke={p.edge}
            strokeWidth={2}
            fill="none"
          />
        </g>
      ))}
      <Label x={210} y={807} mono size={25} color={p.muted}>
        TCP / ПОРЯДОК БАЙТОВ ОБЩИЙ ДЛЯ ВСЕХ
      </Label>
      <ByteCells
        x={270}
        y={848}
        count={8}
        width={250}
        h={113}
        gapIndex={waiting ? 2 : -1}
        highlight={retry > 0.1 ? 2 : -1}
      />
      <DeliveryGate x={gateX} y={848} h={113} waiting={waiting} />
      <Label x={520} y={1030} size={27} color={p.primary} anchor="middle">
        Выдано приложению
      </Label>
      <Label x={1560} y={1030} size={27} color={p.muted} anchor="middle">
        {waiting ? 'Прибыло, но остаётся в буфере' : 'Непрерывная последовательность'}
      </Label>
      {waiting ? (
        <g>
          <Label x={898} y={1120} size={27} mono color={p.primary} anchor="middle">
            Пропуск
          </Label>
          <path d="M898 1084 V983" stroke={p.primary} strokeWidth={2} />
        </g>
      ) : null}
      <FooterNote
        title={
          waiting
            ? 'Получено ≠ доступно приложению.'
            : retry > 0.98
              ? 'Пропуск закрыт — выдача продолжается.'
              : 'HTTP-потоки разделены. TCP-очередь остаётся общей.'
        }
        detail="Прямоугольники — условные участки байтов, не HTTP-кадры. Потеря не останавливает поступление поздних данных."
      />
    </>
  );
};

export const Quic: React.FC<SceneProps> = ({time}) => {
  const table = reveal(time, cue('p09-journey-independent') + 2700, 500),
    loss = progress(time, 'p09-journey-quic-loss', 450);
  const other = progress(time, 'p09-journey-quic-others', 900);
  const sculpt = 1 - reveal(time, cue('p09-journey-independent') + 2300, 350);
  return (
    <>
      <g opacity={sculpt}>
        <Label x={210} y={454} mono size={27} color={p.primary}>
          ТОТ ЖЕ ЗАПРОС / HTTP/3
        </Label>
        <Label x={2110} y={454} mono size={27} color={p.muted} anchor="end">
          QUIC → UDP
        </Label>
        <Label x={1280} y={1088} anchor="middle" size={36}>
          Общая граница превращается в независимые.
        </Label>
      </g>
      <g opacity={table}>
        <Label x={225} y={451} mono size={26} color={p.muted}>
          QUIC / ОДНО СОЕДИНЕНИЕ
        </Label>
        <Label x={2310} y={451} mono size={23} color={p.muted} anchor="end">
          HTTP/3: HEADERS / DATA · QPACK
        </Label>
        {exchanges.map((exchange, i) => {
          const y = 507 + i * 195,
            waiting = i === 1 && loss > 0.5;
          const gate = i === 1 ? 2 : lerp(2, 8, other);
          return (
            <g key={exchange.id}>
              <Plate x={225} y={y} w={2085} h={148} depth={13} accent={exchange.color}>
                <Label x={255} y={y + 55} mono size={28} color={exchange.color}>
                  {exchange.label}
                </Label>
                <Label x={255} y={y + 105} mono size={22} color={p.muted}>
                  Stream {i * 4}
                </Label>
                <ByteCells
                  x={710}
                  y={y + 26}
                  count={8}
                  width={172}
                  h={75}
                  gapIndex={waiting ? 2 : -1}
                  color={exchange.color}
                />
                <DeliveryGate x={710 + gate * 172 - 5} y={y + 26} h={75} waiting={waiting} />
              </Plate>
              <Label x={710} y={y + 133} size={22} color={waiting ? p.muted : p.primary}>
                {waiting
                  ? 'Ждёт недостающие данные'
                  : other > 0.95
                    ? 'Данные доступны приложению'
                    : 'Приём по своему потоку'}
              </Label>
            </g>
          );
        })}
        <Label x={230} y={1146} mono size={23} color={p.muted}>
          Потеря в примере затронула данные одного потока.
        </Label>
      </g>
      <FooterNote
        title="У каждого потока своя граница выдачи."
        detail="Порядок сохраняется внутри потока. Общие ограничения соединения и зависимости приложения остаются."
      />
    </>
  );
};
