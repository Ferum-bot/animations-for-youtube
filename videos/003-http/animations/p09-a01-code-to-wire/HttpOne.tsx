import React from 'react';
import {
  Bracket,
  ByteCells,
  DeliveryGate,
  FooterNote,
  Label,
  Line,
  Plate,
  Reveal,
} from '../../shared/journey/Diagram';
import {bodyExcerpt, contentLength, requestLines} from '../../shared/journey/request';
import {palette as p} from '../../shared/journey/theme';
import {cue, lerp, progress, range} from '../../shared/journey/timing';
import {reveal} from '../../shared/timing';

import type {SceneProps} from '../../shared/journey/types';

export const Invitation: React.FC<SceneProps> = ({time}) => {
  const open = progress(time, 'p09-journey-takeover', 2300);
  return (
    <>
      <g
        transform={`translate(${lerp(175, 290, open)} ${lerp(445, 408, open)}) scale(${lerp(1, 1.3, open)})`}
      >
        <Plate x={0} y={0} w={830} h={385} accent={p.primary}>
          <Label x={36} y={64} mono color={p.primary} size={39}>
            POST /api/events
          </Label>
          <Line x1={36} y1={94} x2={790} y2={94} />
          {bodyExcerpt.slice(0, 3).map((text, i) => (
            <Label key={i} x={36} y={151 + i * 55} mono size={30}>
              {text}
            </Label>
          ))}
          <Label x={36} y={330} mono size={23} color={p.muted}>
            JSON / фрагмент тела
          </Label>
        </Plate>
      </g>
      <g opacity={open} transform={`translate(${(1 - open) * 240} 0)`}>
        {['ПРИЛОЖЕНИЕ', 'ТРАНСПОРТ', 'СЕТЬ', 'КАНАЛ'].map((name, i) => (
          <g key={name} opacity={reveal(time, cue('p09-journey-takeover') + i * 300, 600)}>
            <Plate x={1740 - i * 75} y={450 + i * 142} w={430} h={68} depth={35}>
              <Label
                x={1760 - i * 75}
                y={494 + i * 142}
                mono
                size={24}
                color={i === 0 ? p.primary : p.muted}
              >
                {name}
              </Label>
            </Plate>
          </g>
        ))}
        <path d="M1600 980 H1080 L790 890" fill="none" stroke={p.primary} strokeWidth={3} />
      </g>
      <g opacity={1 - open}>
        <Label x={180} y={980} size={40}>
          Проследим его путь до провода.
        </Label>
      </g>
    </>
  );
};

export const Assembly: React.FC<SceneProps> = ({time}) => {
  const measure = progress(time, 'p09-journey-measure', 1900),
    length = progress(time, 'p09-journey-content-length');
  return (
    <>
      <Plate x={170} y={399} w={1390} h={689} depth={22} accent={p.rim}>
        <Label x={212} y={448} mono size={23} color={p.muted}>
          БИБЛИОТЕКА / СЕРИАЛИЗАЦИЯ
        </Label>
        <g opacity={1 - reveal(time, cue('p09-journey-start-line') - 650, 650)}>
          <Label x={235} y={651} mono size={38} color={p.primary}>
            client.post('/api/events', body)
          </Label>
          <Label x={235} y={732} size={29} color={p.muted}>
            Библиотека подготавливает сообщение
          </Label>
        </g>
        {requestLines.map((text, i) => {
          const at =
            i === 0
              ? cue('p09-journey-start-line')
              : i < 4
                ? cue('p09-journey-headers') + (i - 1) * 280
                : cue('p09-journey-empty-line') + (i - 4) * 160;
          if (i === 4)
            return (
              <Reveal key={i} time={time} at={at}>
                <rect x={214} y={720} width={1278} height={42} fill={p.primary} opacity={0.06} />
                <Label x={1260} y={750} size={22} color={p.primary} mono>
                  CRLF CRLF
                </Label>
              </Reveal>
            );
          return (
            <g key={i} opacity={i === 3 ? length : reveal(time, at, 500)}>
              <Label
                x={214}
                y={514 + i * 62}
                mono
                size={34}
                color={i === 0 ? p.primary : i < 4 ? p.text : p.muted}
              >
                {text}
              </Label>
            </g>
          );
        })}
        <Label
          x={214}
          y={1054}
          mono
          size={23}
          color={p.muted}
          opacity={reveal(time, cue('p09-journey-start-line'), 500)}
        >
          … остальные события · тело показано сокращённо
        </Label>
      </Plate>
      <Reveal time={time} at={cue('p09-journey-measure')}>
        <Bracket x={1640} y={801} w={53} h={lerp(1, 240, measure)} />
        <Line x1={1694} y1={922} x2={1800} y2={922} active={measure} />
        <Label x={1860} y={704} size={26} color={p.muted} mono>
          ДЛИНА ТЕЛА / UTF-8
        </Label>
        <Label x={1848} y={814} size={94} mono color={p.primary}>
          {Math.round(contentLength * measure).toLocaleString('en-US')}
        </Label>
        <Label x={1860} y={867} size={29} color={p.muted}>
          байт
        </Label>
        <path d="M1810 902 V960 H2195" stroke={p.edge} strokeWidth={2} fill="none" />
        <Label x={1860} y={1011} size={25} mono color={p.primary} opacity={length}>
          Content-Length
        </Label>
      </Reveal>
      <FooterNote
        title="Стартовая строка · заголовки · пустая строка · тело"
        detail="В этом примере библиотека заранее знает размер JSON."
      />
    </>
  );
};

export const Socket: React.FC<SceneProps> = ({time}) => {
  const transformed = progress(time, 'p09-journey-bytes', 1900),
    blind = progress(time, 'p09-journey-blind', 1200);
  const travel = range(time, cue('p09-journey-socket'), cue('p09-journey-tcp') - 1000);
  return (
    <>
      <Label x={190} y={450} mono color={p.primary} size={28}>
        ПРИЛОЖЕНИЕ
      </Label>
      <Label x={1510} y={450} mono color={p.muted} size={28}>
        ТРАНСПОРТ
      </Label>
      <Plate x={185} y={510} w={650} h={360} accent={p.primary}>
        <g opacity={1 - transformed}>
          <Label x={220} y={605} mono size={35}>
            POST /api/events
          </Label>
          <Label x={220} y={682} mono size={28}>
            Content-Length: {contentLength}
          </Label>
          <Label x={220} y={789} mono size={29}>
            {'{"events":[…]}'}
          </Label>
        </g>
        <g opacity={transformed}>
          <Label x={220} y={579} mono size={25} color={p.muted}>
            ПОСЛЕДОВАТЕЛЬНОСТЬ БАЙТОВ
          </Label>
          <ByteCells
            x={215}
            y={625}
            count={6}
            width={97}
            labels={['50', '4F', '53', '54', '20', '2F']}
          />
          <Label x={246} y={762} mono color={p.primary}>
            P O S T
          </Label>
          <Label x={220} y={831} size={23} mono color={p.muted}>
            заголовки → пустая строка → JSON
          </Label>
        </g>
      </Plate>
      <g opacity={transformed}>
        <Line x1={850} y1={687} x2={2270} y2={687} />
        <path d="M2248 675 L2270 687 L2248 699" stroke={p.line} strokeWidth={3} fill="none" />
        <Plate x={1050} y={520} w={125} h={340} depth={40} accent={p.rim} fill={p.deep} />
        <rect
          x={1030}
          y={656}
          width={185}
          height={67}
          fill={p.deep}
          stroke={p.primary}
          strokeWidth={2}
        />
        <Label x={1112} y={932} anchor="middle" size={35}>
          Сокет
        </Label>
        <Label x={1112} y={977} anchor="middle" size={23} color={p.muted}>
          граница приложения и ОС
        </Label>
        {Array.from({length: 9}, (_, i) => {
          const f = (travel * 3 + i / 9) % 1;
          return (
            <rect
              key={i}
              x={830 + f * 1390}
              y={669}
              width={48}
              height={36}
              fill={p.primary}
              opacity={0.2 + 0.7 * Math.sin(f * Math.PI)}
            />
          );
        })}
        <Label x={1600} y={598} size={37} color={p.text}>
          Поток байтов
        </Label>
        <Label x={1600} y={792} mono size={26} color={p.muted} opacity={blind}>
          HTTP? JSON? Заголовки?
        </Label>
        <path d="M1590 779 H2215" stroke={p.muted} strokeWidth={2} opacity={blind} />
      </g>
      <FooterNote
        title="Сокет принимает байты, а не HTTP-сообщения."
        detail="Логическое представление данных. Защита TLS здесь не раскрывается."
      />
    </>
  );
};

export const Segments: React.FC<SceneProps> = ({time}) => {
  const cut = progress(time, 'p09-journey-segment', 2100),
    zoom = progress(time, 'p09-journey-inside', 1400);
  const segmentWidth = 265,
    headerEdge = 760;
  return (
    <>
      <Label x={190} y={463} mono size={25} color={p.muted}>
        ЕДИНЫЙ ПОТОК БАЙТОВ
      </Label>
      <rect x={190} y={510} width={2110} height={132} fill={p.surface} stroke={p.edge} />
      <rect x={190} y={510} width={headerEdge - 190} height={132} fill={p.primary} opacity={0.12} />
      <Label x={460} y={589} mono color={p.primary} anchor="middle">
        заголовки
      </Label>
      <Label x={1550} y={589} mono anchor="middle">
        JSON / тело
      </Label>
      <line x1={headerEdge} x2={headerEdge} y1={485} y2={680} stroke={p.primary} strokeWidth={3} />
      <Label x={headerEdge} y={716} size={25} color={p.primary} anchor="middle">
        граница HTTP
      </Label>
      {Array.from({length: 8}, (_, i) => (
        <g key={i} opacity={cut}>
          <path d={`M${190 + i * segmentWidth} 502 V651`} stroke={p.text} strokeWidth={3} />
          <Label
            x={190 + i * segmentWidth + segmentWidth / 2}
            y={482}
            anchor="middle"
            mono
            size={21}
            color={p.muted}
          >
            {i < 3 ? `TCP ${i + 1}` : i === 7 ? 'TCP n' : '·'}
          </Label>
        </g>
      ))}
      <g opacity={zoom}>
        <path
          d="M720 650 L665 824 M985 650 L1910 824"
          fill="none"
          stroke={p.edge}
          strokeWidth={1.5}
        />
        <Plate x={660} y={828} w={1250} h={225} depth={20} accent={p.text}>
          <rect x={660} y={828} width={300} height={225} fill={p.primary} opacity={0.1} />
          <Label x={720} y={912} size={31} color={p.primary}>
            …заголовки
          </Label>
          <Label x={1080} y={912} size={31}>
            начало JSON…
          </Label>
          <line x1={960} x2={960} y1={805} y2={1070} stroke={p.primary} strokeWidth={4} />
          <Label x={1270} y={1008} mono size={26} anchor="middle" color={p.muted}>
            ОДИН TCP-СЕГМЕНТ
          </Label>
        </Plate>
      </g>
      <FooterNote
        title="Граница HTTP может оказаться внутри TCP-сегмента."
        detail="Размеры на схеме условны. TCP выбирает разбиение с учётом сетевого пути."
      />
    </>
  );
};

export const Receiver: React.FC<SceneProps> = ({time}) => {
  const parse = progress(time, 'p09-journey-parse', 2000);
  return (
    <>
      <Label x={190} y={462} mono size={27} color={p.muted}>
        TCP / ВОССТАНОВЛЕННЫЙ ПОРЯДОК БАЙТОВ
      </Label>
      <ByteCells
        x={190}
        y={500}
        count={18}
        width={118}
        h={85}
        labels={[
          '50',
          '4F',
          '53',
          '54',
          '20',
          '2F',
          '61',
          '70',
          '69',
          '0D',
          '0A',
          '0D',
          '0A',
          '7B',
          '22',
          '65',
          '76',
          '…',
        ]}
      />
      <g opacity={parse}>
        <path
          d="M190 612 V677 H1719 V612 M1730 612 V677 H2310 V612"
          fill="none"
          stroke={p.primary}
          strokeWidth={3}
        />
        <Label x={950} y={730} anchor="middle" color={p.primary}>
          Заголовки и пустая строка
        </Label>
        <Label x={2020} y={730} anchor="middle">
          Тело: {contentLength} байт
        </Label>
        <DeliveryGate x={lerp(1730, 2308, parse)} y={500} h={85} />
        <Plate x={575} y={827} w={1405} h={232} accent={p.primary}>
          <Label x={620} y={899} mono color={p.primary} size={29}>
            HTTP-ПАРСЕР
          </Label>
          <Label x={620} y={971} size={43}>
            Сообщение снова имеет границы.
          </Label>
          <Label x={620} y={1023} mono size={26} color={p.muted}>
            {'{"events":[…]}'} / {contentLength} байт тела
          </Label>
        </Plate>
      </g>
      <FooterNote
        title="TCP восстановил поток. HTTP выделил сообщение."
        detail="Здесь показана приёмная сторона; дальше возвращаемся к упаковке при отправке."
      />
    </>
  );
};
