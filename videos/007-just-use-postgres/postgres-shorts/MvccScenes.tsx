import React from 'react';
import {
  Area,
  Caption,
  Code,
  Down,
  Heading,
  Note,
  Record,
  ink,
  motion,
  type SceneProps,
} from './ui';
import {queueMeasurements as measurements} from '../benchmark-measurements';

function Versions({t}: {readonly t: number}) {
  const update = motion(t, 834.2),
    deleted = motion(t, 838.5);
  return (
    <>
      <Heading>
        MVCC: DELETE не стирает
        <br />
        строку сразу
      </Heading>
      <Area>
        <Caption>Старый снимок данных</Caption>
        <Record accent>Видит версию 1 · ready</Record>
        <div
          style={{
            height: 70,
            borderLeft: `3px solid ${ink.signal}`,
            marginLeft: 45,
          }}
        />
        <Record>Версия 1 · ready</Record>
        <div
          style={{
            marginTop: 32,
            transform: `translateY(${30 * (1 - update)}px)`,
            opacity: update,
          }}
        >
          <Record opacity={1 - deleted * 0.45}>
            Версия 2 · running {deleted === 1 ? '×' : ''}
          </Record>
        </div>
        <div style={{marginTop: 75, opacity: motion(t, 841.9)}}>
          <Record accent>VACUUM</Record>
          <div style={{fontSize: 40, marginTop: 25}}>
            Нельзя убрать версии,
            <br />
            нужные старому снимку.
          </div>
        </div>
      </Area>
      <Note>Новая версия строки не меняет данные, видимые старому снимку.</Note>
    </>
  );
}

function IndexWalk({t}: {readonly t: number}) {
  if (t < 913.9)
    return (
      <>
        <Heading>
          Живых задач мало.
          <br />
          Почему поиск долгий?
        </Heading>
        <Area>
          <Code
            size={35}
            active="run_at"
            text={
              "SELECT id FROM jobs\nWHERE state = 'ready'\nORDER BY run_at\nLIMIT 10\nFOR UPDATE SKIP LOCKED;"
            }
          />
          <Down amount={motion(t, 891.9)} />
          <Code
            size={34}
            active="Index Scan"
            label="EXPLAIN"
            text={
              'Limit\n  → LockRows\n    → Index Scan\n      jobs_run_at_idx\n      Filter: state = ready'
            }
          />
        </Area>
      </>
    );
  const blocked = t >= 935.3;
  const scan = motion(t, blocked ? 943.3 : 919.7, blocked ? 7 : 6);
  return (
    <>
      <Heading>
        {blocked ? 'Старые версии\nна пути воркера' : 'Индекс ведёт к строке'}
      </Heading>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <g fill="none" stroke={ink.line} strokeWidth="4">
          <path d="M480 620 L230 820 M480 620 L730 820" />
          <path d="M230 900 V1040 M730 900 V1040" />
        </g>
        <rect
          x="340"
          y="520"
          width="280"
          height="100"
          fill={ink.background}
          stroke={ink.text}
          strokeWidth="3"
        />
        <text x="480" y="584" textAnchor="middle" fill={ink.text} fontSize="39">
          B-tree
        </text>
        {[0, 1].map((i) => (
          <g key={i}>
            <rect
              x={95 + i * 500}
              y="820"
              width="270"
              height="100"
              fill={ink.background}
              stroke={ink.text}
              strokeWidth="3"
            />
            <text
              x={230 + i * 500}
              y="883"
              textAnchor="middle"
              fill={ink.text}
              fontSize="33"
            >
              {i ? 'новее' : 'старее'}
            </text>
          </g>
        ))}
        {Array.from({length: 6}, (_, i) => (
          <g key={i} opacity={blocked && i < 4 ? 0.55 : 1}>
            <rect
              x={83 + i * 138}
              y="1040"
              width="120"
              height="105"
              fill={Math.floor(scan * 5) === i ? ink.line : ink.background}
              stroke={blocked && i < 4 ? ink.muted : ink.signal}
              strokeWidth="3"
            />
            <text
              x={143 + i * 138}
              y="1103"
              textAnchor="middle"
              fill={ink.text}
              fontSize="30"
            >
              {blocked && i < 4 ? '×' : 101 + i}
            </text>
          </g>
        ))}
        <path
          d={`M${143 + Math.floor(scan * 5) * 138} 1145 V1250 H480 V1310`}
          stroke={ink.signal}
          strokeWidth="4"
          fill="none"
        />
        <text
          x="480"
          y="1375"
          textAnchor="middle"
          fill={ink.text}
          fontSize="39"
        >
          Проверить строку в таблице
        </text>
      </svg>
      <Note>
        {blocked
          ? 'Спуск по дереву быстрый. Долго обходить листья и проверять версии.'
          : 'Берём первые 10 подходящих задач, остальные пропускаем.'}
        <br />
        Схема индекса из конкретного эксперимента выпуска.
      </Note>
    </>
  );
}

function Horizon({t}: {readonly t: number}) {
  const phase = t < 975.5 ? 0 : t < 982.5 ? 1 : 2;
  const names = ['pg_dump', 'Долгая транзакция', 'Запрос на реплике'];
  const examples = [
    'pg_dump app > backup.sql',
    'BEGIN ISOLATION LEVEL\n  REPEATABLE READ;\nSELECT count(*) FROM jobs;\n-- снимок остаётся нужен',
    'hot_standby_feedback = on',
  ];
  return (
    <>
      <Heading>
        Кто удерживает
        <br />
        старые версии?
      </Heading>
      <Area>
        <Caption>{names[phase]}</Caption>
        <Code
          label={phase === 0 ? 'SHELL' : phase === 1 ? 'SQL' : 'CONFIG'}
          text={examples[phase] ?? ''}
          size={37}
        />
        <Down />
        <Record accent>Старый снимок ещё нужен</Record>
        <div
          style={{
            margin: '55px 0',
            borderTop: `4px solid ${ink.signal}`,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 18,
              height: 50,
              background: ink.signal,
              position: 'absolute',
              top: -25,
              left: 80,
            }}
          />
        </div>
        <Record>VACUUM ждёт</Record>
        <div style={{marginTop: 40, fontSize: 39}}>Старые версии остаются</div>
      </Area>
      <Note>
        {phase === 2
          ? 'Обратная связь с реплики может задерживать очистку на primary.'
          : 'Важен удерживаемый снимок. Сам по себе BEGIN ещё не означает блокировку очистки.'}
      </Note>
    </>
  );
}

function Experiment({t}: {readonly t: number}) {
  const growth = motion(t, 1011.1, 11.2),
    recovered = t >= 1026.2;
  const points = measurements
    .map(
      (m) =>
        `${120 + (m.jobs / 100000) * 700},${1240 - (m.blockedMs / 9) * 500}`,
    )
    .join(' ');
  const index = t < 1011.1 ? '240 КБ' : '2,2 МБ';
  return (
    <>
      <Heading>
        10 000 живых задач.
        <br />
        До и после нагрузки.
      </Heading>
      <Area top={490}>
        <Caption>Эксперимент из выпуска · время захвата</Caption>
        <div style={{fontSize: 91, fontWeight: 750, color: ink.signal}}>
          {recovered ? '0,060' : t >= 1022 ? '8,5' : '0,041'}{' '}
          <span style={{fontSize: 43}}>мс</span>
        </div>
      </Area>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <path
          d="M120 710 V1240 H850"
          fill="none"
          stroke={ink.muted}
          strokeWidth="3"
        />
        {[0, 4, 8].map((v) => (
          <g key={v}>
            <path d={`M120 ${1240 - (v / 9) * 500} H850`} stroke={ink.line} />
            <text
              x="80"
              y={1250 - (v / 9) * 500}
              fill={ink.muted}
              fontSize="30"
            >
              {v}
            </text>
          </g>
        ))}
        <clipPath id="queue-growth">
          <rect x="115" y="700" width={710 * growth} height="550" />
        </clipPath>
        <polyline
          points={points}
          clipPath="url(#queue-growth)"
          fill="none"
          stroke={ink.signal}
          strokeWidth="7"
        />
        <text x="120" y="1290" fill={ink.muted} fontSize="30">
          0
        </text>
        <text x="665" y="1290" fill={ink.muted} fontSize="30">
          100 000 задач
        </text>
        {recovered && (
          <g>
            <path
              d="M820 767 V1237"
              stroke={ink.text}
              strokeWidth="4"
              strokeDasharray="10 10"
            />
            <circle cx="820" cy="1237" r="10" fill={ink.text} />
          </g>
        )}
      </svg>
      <Area top={1360}>
        <Record>Индекс: {index}</Record>
      </Area>
      <Note top={1510}>
        {recovered
          ? 'После завершения старого снимка и VACUUM. Файл индекса не уменьшился.'
          : t >= 1007.1
            ? 'Удерживаем снимок REPEATABLE READ и обрабатываем 100 000 задач.'
            : 'Число живых задач постоянно. Измеряем цену их захвата.'}
      </Note>
    </>
  );
}

export function MvccScenes({number, t}: SceneProps) {
  switch (number) {
    case 14:
      return <Versions t={t} />;
    case 15:
      return <IndexWalk t={t} />;
    case 16:
      return <Horizon t={t} />;
    case 17:
      return <Experiment t={t} />;
    default:
      throw new Error(`Unsupported MVCC scene ${number}`);
  }
}
