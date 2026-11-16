import React from 'react';
import {
  Area,
  Caption,
  Code,
  Down,
  Heading,
  Note,
  Record,
  Table,
  ink,
  motion,
  type SceneProps,
} from './ui';
import {notifyMeasurements as measurements} from '../benchmark-measurements';

function Lock({t}: {readonly t: number}) {
  if (t < 1125.9)
    return (
      <>
        <Heading>
          NOTIFY и порядок
          <br />
          коммитов
        </Heading>
        <Area>
          <Code
            size={35}
            active="pg_notify"
            text={
              "BEGIN;\nINSERT INTO events (payload)\nVALUES ('order:42');\nSELECT pg_notify('events', '42');\nCOMMIT;"
            }
          />
          <Down amount={motion(t, 1106.1)} />
          <Record>
            Уведомления —<br />в порядке фиксации
          </Record>
        </Area>
        <Note>
          Разбираем механизм и версию PostgreSQL из исходного выпуска.
        </Note>
      </>
    );
  const locked = t >= 1139.5;
  const passed = motion(t, 1155.3, 1.5);
  return (
    <>
      <Heading>
        {locked ? 'Один общий замок' : 'Одна очередь уведомлений'}
      </Heading>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            transform={`translate(${100 + i * 280},${560 + (i === 0 ? passed * 480 : 0)})`}
          >
            <rect
              width="240"
              height="150"
              fill={ink.background}
              stroke={i === 0 ? ink.signal : ink.text}
              strokeWidth="3"
            />
            <text
              x="120"
              y="58"
              textAnchor="middle"
              fill={ink.text}
              fontSize="37"
            >
              TX {i + 1}
            </text>
            <text
              x="120"
              y="115"
              textAnchor="middle"
              fill={ink.muted}
              fontSize="29"
            >
              NOTIFY
            </text>
          </g>
        ))}
        <path
          d="M220 730 V820 M500 730 V820 M780 730 V820"
          stroke={ink.muted}
          strokeWidth="3"
        />
        <path
          d="M100 850 H900"
          stroke={locked ? ink.signal : ink.line}
          strokeWidth="8"
        />
        <text x="480" y="930" textAnchor="middle" fill={ink.text} fontSize="38">
          {locked ? 'AccessExclusiveLock' : 'Общая очередь'}
        </text>
        <text
          x="480"
          y="1260"
          textAnchor="middle"
          fill={ink.text}
          fontSize="41"
        >
          COMMIT → WAL на диск
        </text>
      </svg>
      <Note>
        {locked
          ? 'Остальные транзакции с NOTIFY ждут. Обычные записи без NOTIFY этот замок не берут.'
          : 'Порядок очереди должен совпадать с порядком успешных коммитов.'}
      </Note>
    </>
  );
}

function NotifyExperiment({t}: {readonly t: number}) {
  if (t < 1180.2)
    return (
      <>
        <Heading>
          Один INSERT.
          <br />С NOTIFY и без.
        </Heading>
        <Area>
          <Code
            size={37}
            active={t >= 1171.5 ? 'NOTIFY' : 'INSERT'}
            text={
              "BEGIN;\nINSERT INTO events (payload)\nVALUES ('order:42');\n" +
              (t >= 1171.5 ? "NOTIFY events, 'order:42';\n" : '') +
              'COMMIT;'
            }
          />
          <div style={{marginTop: 80}}>
            <Record>Реальный сброс WAL на диск</Record>
          </div>
        </Area>
        <Note>
          Эксперимент автора на ноутбуке. Это не универсальный предел
          PostgreSQL.
        </Note>
      </>
    );
  const many = t >= 1184.9;
  const sample = many ? measurements[2] : measurements[0];
  const p = motion(t, many ? 1184.9 : 1180.2, 1.4);
  const plain = many ? 248 + (sample.plainTps - 248) * p : sample.plainTps;
  return (
    <>
      <Heading>
        {many ? '64 клиента' : '1 клиент'}
        <br />
        Транзакций в секунду
      </Heading>
      <Area top={560}>
        <Caption>Без NOTIFY</Caption>
        <div style={{fontSize: 85, fontWeight: 750}}>
          {Math.round(plain).toLocaleString('ru-RU')}
        </div>
        <div
          style={{
            width: Math.max(22, (plain / 9000) * 800),
            height: 55,
            background: ink.text,
            marginTop: 20,
          }}
        />
        <div style={{marginTop: 110}}>
          <Caption>С NOTIFY</Caption>
          <div style={{fontSize: 85, color: ink.signal, fontWeight: 750}}>
            {sample.notifyTps}
          </div>
          <div
            style={{
              width: (sample.notifyTps / 9000) * 800,
              height: 55,
              background: ink.signal,
              marginTop: 20,
            }}
          />
        </div>
        <div style={{marginTop: 40, opacity: motion(t, 1194.6)}}>
          <Table
            headers={['Средняя задержка', 'мс']}
            rows={[
              ['без NOTIFY', '7,2'],
              ['с NOTIFY', '229,9'],
            ]}
          />
        </div>
      </Area>
      <Note top={1560}>
        {t >= 1198.7
          ? '63 сессии ждут блокировку, одна пишет на диск.'
          : 'Один и тот же тест и масштаб. NOTIFY ограничивает параллельную фиксацию.'}
      </Note>
    </>
  );
}

function SharedCluster({t}: {readonly t: number}) {
  const separate = (t >= 1298.2 && t < 1306.5) || t >= 1316.2;
  return (
    <>
      <Heading>
        {separate
          ? 'Разные системы —\nразные границы отказа'
          : 'Один кластер на всё'}
      </Heading>
      <Area>
        <div
          style={{
            border: `3px solid ${separate ? ink.line : ink.signal}`,
            padding: 32,
          }}
        >
          <Caption>
            {separate ? 'Postgres' : 'Общие CPU, диск и соединения'}
          </Caption>
          <Record accent>Заказы</Record>
          {!separate && (
            <>
              <div style={{marginTop: 24}}>
                <Record>Кэш</Record>
              </div>
              <div style={{marginTop: 24}}>
                <Record>Очередь</Record>
              </div>
              <div style={{marginTop: 24}}>
                <Record>NOTIFY</Record>
              </div>
            </>
          )}
        </div>
        {separate ? (
          <>
            <Down />
            <Record opacity={0.4}>Redis · недоступен</Record>
            <div style={{marginTop: 50, fontSize: 44}}>
              Читаем заказы из базы,
              <br />
              если она выдержит нагрузку.
            </div>
          </>
        ) : (
          <div
            style={{
              marginTop: 70,
              fontSize: 43,
              color: ink.signal,
              opacity: t >= 1306.5 ? 1 : 0.5,
            }}
          >
            Общие ресурсы →<br />
            связанные последствия сбоя
          </div>
        )}
      </Area>
      <Note>
        Разделение компонентов само по себе не гарантирует независимость
        отказов.
      </Note>
    </>
  );
}

function Replica({t}: {readonly t: number}) {
  const copy = motion(t, 1334, 2.6),
    unlogged = t >= 1338.6;
  return (
    <>
      <Heading>
        Реплика не добавляет
        <br />
        второго writer
      </Heading>
      <Area>
        <Caption>Запросы записи</Caption>
        <Record accent>INSERT · UPDATE · DELETE</Record>
        <Down />
        <Caption>Primary</Caption>
        <Record accent>Заказы: 41 · 42</Record>
        <Down amount={copy} label="WAL" />
        <Caption>Читающая реплика</Caption>
        <Record>Заказы: {copy === 1 ? '41 · 42' : '41'}</Record>
        <div style={{marginTop: 30, opacity: motion(t, 1338.6)}}>
          <Record>UNLOGGED-кэш</Record>
          <div style={{fontSize: 36, color: ink.signal, marginTop: 20}}>
            На реплику не передаётся
          </div>
        </div>
      </Area>
      <Note top={1530}>
        {unlogged
          ? 'Даже чтение этого кэша нельзя вынести на физическую реплику.'
          : 'Схема primary + физическая читающая реплика из выпуска.'}
      </Note>
    </>
  );
}

function Context({t}: {readonly t: number}) {
  const grown = t >= 1469.5,
    migrate = t >= 1481;
  return (
    <>
      <Heading>
        {migrate
          ? 'Новые требования —\nновое решение'
          : grown
            ? 'Нагрузка изменилась'
            : 'Выбор зависит\nот контекста'}
      </Heading>
      <Area>
        <Caption>{grown ? 'На этапе роста' : 'На старте'}</Caption>
        <Record>Задачи · нагрузка · команда</Record>
        <Down />
        <Record accent>
          {migrate ? 'Подходящий новый инструмент' : 'Postgres'}
        </Record>
        <div style={{marginTop: 75, fontSize: 46, lineHeight: 1.35}}>
          {t < 1463
            ? 'Соответствует текущим\nтребованиям и ограничениям'
            : t < 1469.5
              ? 'Проверяем ограничения\nна своей нагрузке'
              : migrate
                ? 'Миграция не делает\nпервый выбор ошибкой'
                : 'Появилось конкретное\nограничение'}
        </div>
        <div
          style={{
            marginTop: 70,
            opacity: motion(t, 1468),
            fontSize: 36,
            color: ink.muted,
          }}
        >
          Trigger.dev · Recall.ai · Quo
        </div>
      </Area>
      <Note>
        Инструмент мог быть правильным на старте, даже если его позже переросли.
      </Note>
    </>
  );
}

export function SystemScenes({number, t}: SceneProps) {
  switch (number) {
    case 19:
      return <Lock t={t} />;
    case 20:
      return <NotifyExperiment t={t} />;
    case 22:
      return <SharedCluster t={t} />;
    case 23:
      return <Replica t={t} />;
    case 25:
      return <Context t={t} />;
    default:
      throw new Error(`Unsupported system scene ${number}`);
  }
}
