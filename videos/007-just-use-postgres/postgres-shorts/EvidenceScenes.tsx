import React from 'react';
import {Img, staticFile} from 'remotion';
import {mix} from '@channel/motion-v2';
import {ArchivePage, type PageSpec} from '../intro-shorts/ArchivePage';
import {asset} from '../intro-shorts/palette';
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

const solid: PageSpec = {
  file: 'solid-queue.png',
  assetDirectory: 'mvcc',
  sourceWidth: 1440,
  sourceHeight: 4589,
  paper: '#000000',
  color: '#F3EEE4',
  sourceLabel: '37signals · HEY · Solid Queue',
  initialY: 250,
  passages: [
    {
      atMs: 1800,
      rect: {x: 477, y: 1421, width: 222, height: 28},
      lines: ['20 million jobs', 'per day'],
      note: 'В этом примере используется MySQL.',
    },
  ],
};
const trigger: PageSpec = {
  file: 'trigger-headline-3x.png',
  assetDirectory: 'mvcc',
  sourceWidth: 1440,
  sourceHeight: 1200,
  paper: '#101216',
  color: '#F3EEE4',
  sourceLabel: 'Trigger.dev · август 2024',
  initialY: 250,
  passages: [
    {
      atMs: 1300,
      rect: {x: 328, y: 228, width: 650, height: 148},
      lines: [
        'How we stopped',
        'xmin horizon blocking',
        'Postgres vacuuming:',
        'a deepdive',
      ],
      fontSize: 54,
    },
  ],
};
const triggerLog: PageSpec = {
  file: 'trigger-vacuum-log-3x.png',
  assetDirectory: 'mvcc',
  sourceWidth: 1440,
  sourceHeight: 1200,
  paper: '#101216',
  color: '#F3EEE4',
  sourceLabel: 'Trigger.dev · вывод VACUUM',
  initialY: 250,
  passages: [
    {
      atMs: 500,
      rect: {x: 410, y: 549, width: 405, height: 22},
      lines: ['662319 dead row versions', 'cannot be removed yet'],
      fontSize: 49,
      note: 'Около 660 тысяч старых версий не удаётся убрать.',
    },
  ],
};
const recall: PageSpec = {
  file: 'headline-3x.png',
  assetDirectory: 'notify-lock',
  sourceWidth: 1440,
  sourceHeight: 1100,
  paper: '#FFFFFF',
  color: '#172331',
  sourceLabel: 'Recall.ai · инцидент марта 2025',
  initialY: 250,
  passages: [
    {
      atMs: 1800,
      rect: {x: 285, y: 225, width: 770, height: 65},
      lines: ['Postgres LISTEN/NOTIFY', 'does not scale'],
      fontSize: 56,
      note: 'Исторический разбор. Статья позже получила обновление об оптимизации PostgreSQL.',
    },
  ],
};
const recallLog: PageSpec = {
  file: 'log-3x.png',
  assetDirectory: 'notify-lock',
  sourceWidth: 1440,
  sourceHeight: 1100,
  paper: '#FFFFFF',
  color: '#172331',
  sourceLabel: 'Recall.ai · log_lock_waits',
  initialY: 250,
  passages: [
    {
      atMs: 700,
      rect: {x: 380, y: 459, width: 182, height: 24},
      lines: ['AccessExclusiveLock'],
      fontSize: 58,
      note: 'object 0 · class 1262 · database 0\nОбщий служебный объект, а не строка или таблица.',
    },
  ],
};
const quo: PageSpec = {
  file: 'article-heading.png',
  assetDirectory: 'quo',
  sourceWidth: 1200,
  sourceHeight: 1150,
  paper: '#FFFFFF',
  color: '#171717',
  sourceLabel: 'Quo · июль 2026',
  initialY: 250,
  passages: [
    {
      atMs: 2200,
      rect: {x: 45, y: 490, width: 325, height: 235},
      lines: ['Outgrowing Postgres', 'and moving', 'to Cassandra'],
      fontSize: 63,
    },
  ],
};
const quoLimit: PageSpec = {
  file: 'article-limits.png',
  assetDirectory: 'quo',
  sourceWidth: 1200,
  sourceHeight: 1150,
  paper: '#FFFFFF',
  color: '#171717',
  sourceLabel: 'Quo · конфигурация Aurora из статьи',
  initialY: 250,
  passages: [
    {
      atMs: 1200,
      rect: {x: 452, y: 432, width: 237, height: 25},
      lines: ['only absorb', 'so many writes'],
      fontSize: 61,
      note: 'Масштабирование одного writer имеет предел.',
    },
  ],
};
const quoEnding: PageSpec = {
  file: 'article-ending.png',
  assetDirectory: 'quo',
  sourceWidth: 1200,
  sourceHeight: 850,
  paper: '#FFFFFF',
  color: '#171717',
  sourceLabel: 'Quo · итоги миграции',
  initialY: 250,
  passages: [
    {
      atMs: 500,
      rect: {x: 87, y: 342, width: 463, height: 26},
      lines: ['Postgres bought us time;', 'Cassandra bought us', 'a curve.'],
      fontSize: 55,
    },
  ],
};

type SourceRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};
/** Keep the original image visible while the camera locates its relevant chart. */
function SourceFocus({
  file,
  label,
  sourceWidth,
  rect,
  height,
  elapsed,
}: {
  readonly file: string;
  readonly label: string;
  readonly sourceWidth: number;
  readonly rect: SourceRect;
  readonly height: number;
  readonly elapsed: number;
}) {
  const p = motion(elapsed, 0.5, 1.4);
  const scale = mix(
    828 / sourceWidth,
    Math.min(828 / rect.width, height / rect.height),
    p,
  );
  const left = mix(0, 414 - (rect.x + rect.width / 2) * scale, p);
  const top = mix(0, height / 2 - (rect.y + rect.height / 2) * scale, p);
  return (
    <div style={{position: 'relative', width: 828, height, overflow: 'hidden'}}>
      <Img
        src={staticFile(asset(file))}
        alt={label}
        style={{position: 'absolute', width: sourceWidth * scale, left, top}}
      />
    </div>
  );
}

function Tasks({t}: {readonly t: number}) {
  if (t < 788) return <ArchivePage page={solid} timeMs={(t - 779.94) * 1000} />;
  if (t < 793.7)
    return (
      <>
        <Heading>20 млн задач в сутки</Heading>
        <Area top={630}>
          <div style={{fontSize: 66}}>20 000 000 / 86 400</div>
          <Down amount={motion(t, 788)} />
          <div style={{fontSize: 108, fontWeight: 760, color: ink.signal}}>
            ≈ 231
          </div>
          <div style={{fontSize: 47}}>задача в секунду</div>
        </Area>
        <Note>Среднее, не пик. HEY / 37signals · MySQL.</Note>
      </>
    );
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#fff',
        color: '#111',
      }}
    >
      <Heading>
        Redpanda:
        <br />
        объём данных компаний
      </Heading>
      <Area top={510}>
        <SourceFocus
          file="mvcc/redpanda-page-12.png"
          label="Оригинал отчёта Redpanda, страница 12"
          sourceWidth={2319}
          height={780}
          elapsed={t - 793.7}
          rect={{x: 1620, y: 470, width: 450, height: 660}}
        />
      </Area>
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 1370,
          width: 828,
          fontSize: 43,
        }}
      >
        Меньше 100 ГБ/сутки: 57–58%.
        <br />
        Это примерно 1 МБ/с в среднем.
      </div>
      <Note top={1530}>The State of Streaming Data 2023–24 · с. 12</Note>
    </div>
  );
}

function Trigger({t}: {readonly t: number}) {
  if (t < 1057.1)
    return <ArchivePage page={trigger} timeMs={(t - 1051.94) * 1000} />;
  if (t < 1063.3)
    return (
      <>
        <Heading>Trigger.dev · CPU</Heading>
        <Area>
          <SourceFocus
            file="mvcc/trigger-cpu-graph-3x.png"
            label="Оригинальный график CPU Trigger.dev"
            sourceWidth={1440}
            height={570}
            elapsed={t - 1057.1}
            rect={{x: 328, y: 405, width: 682, height: 355}}
          />
          <div style={{fontSize: 98, marginTop: 55, color: ink.signal}}>
            99%
          </div>
          <Caption>Вместо обычных 5–30%</Caption>
        </Area>
        <Note>
          Август 2024 · высокая нагрузка продолжалась несколько часов.
        </Note>
      </>
    );
  if (t < 1070.7)
    return (
      <>
        <Heading>Внутренняя очередь</Heading>
        <Area>
          <Record accent>Graphile Worker</Record>
          <Down />
          <Record>
            Последовательный
            <br />
            просмотр таблицы
          </Record>
          <div style={{marginTop: 70, fontSize: 43}}>
            Основная очередь v3 — Redis.
            <br />
            Здесь проблема в другой очереди.
          </div>
        </Area>
      </>
    );
  if (t < 1077.2)
    return <ArchivePage page={triggerLog} timeMs={(t - 1070.7) * 1000} />;
  return (
    <>
      <Heading>
        {t < 1090.1 ? 'Кто держал горизонт?' : 'Помог failover'}
      </Heading>
      <Area>
        <Record>Транзакции · слоты репликации</Record>
        <div style={{marginTop: 28}}>
          <Record>PREPARED · feedback с реплик</Record>
        </div>
        <Down />
        <Record accent>
          {t < 1090.1
            ? 'Причину так и не нашли'
            : 'Переключились на свежую реплику'}
        </Record>
        <div style={{fontSize: 43, marginTop: 80}}>
          Это результат расследования,
          <br />а не установленная причина.
        </div>
      </Area>
      <Note>Источник: постмортем Trigger.dev.</Note>
    </>
  );
}

function Recall({t}: {readonly t: number}) {
  if (t < 1218.9)
    return <ArchivePage page={recall} timeMs={(t - 1205.04) * 1000} />;
  if (t < 1233.5)
    return (
      <>
        <Heading>
          Сессии ждут.
          <br />
          CPU, диск и сеть — вниз.
        </Heading>
        <Area>
          <Caption>Recall.ai · 19–22 марта 2025</Caption>
          <SourceFocus
            file="notify-lock/with-notify.png"
            label="Оригинальные метрики RDS из Recall.ai"
            sourceWidth={2568}
            height={600}
            elapsed={t - 1218.9}
            rect={{x: 0, y: 0, width: 890, height: 1022}}
          />
          <div style={{marginTop: 70}}>
            <Record accent>Ожидание общей блокировки</Record>
          </div>
        </Area>
        <Note>
          Три периода недоступности за четыре дня. Исторический инцидент.
        </Note>
      </>
    );
  if (t < 1244.3)
    return <ArchivePage page={recallLog} timeMs={(t - 1233.5) * 1000} />;
  return (
    <>
      <Heading>
        Уведомления вынесли
        <br />в приложение
      </Heading>
      <Area>
        <Caption>Часто вызываемый endpoint</Caption>
        <Code
          text={'UPDATE …;\n-- NOTIFY удалён'}
          label="Изменение пути"
          size={42}
        />
        <Down amount={motion(t, 1248.2)} />
        <Record accent>
          Приложение отправляет
          <br />
          уведомление
        </Record>
        <div style={{marginTop: 85, fontSize: 66}}>Меньше дня</div>
      </Area>
      <Note>Решение команды Recall.ai для своего инцидента.</Note>
    </>
  );
}

function Quo({t}: {readonly t: number}) {
  if (t < 1388.9)
    return <ArchivePage page={quo} timeMs={(t - 1352.78) * 1000} />;
  if (t < 1409.6)
    return (
      <>
        <Heading>Temporal → Aurora</Heading>
        <Area>
          <Caption>История событий workflow</Caption>
          <Record>Начат → шаг выполнен → таймер</Record>
          <Down />
          <Record accent>Aurora · один writer</Record>
          <div
            style={{marginTop: 60, opacity: motion(t, 1400.4), fontSize: 46}}
          >
            CPU ↑ · RAM ↑ · IOPS ↑
          </div>
          <div style={{marginTop: 50, opacity: motion(t, 1404.2)}}>
            <Record>Настройка autovacuum</Record>
          </div>
          <div style={{marginTop: 30, opacity: motion(t, 1406.2)}}>
            <Record>
              Отдельный кластер
              <br />
              для чувствительного пути
            </Record>
          </div>
        </Area>
        <Note>Топология из публикации Quo, а не всех вариантов Aurora.</Note>
      </>
    );
  if (t < 1422.8)
    return <ArchivePage page={quoLimit} timeMs={(t - 1409.6) * 1000} />;
  if (t < 1429.7)
    return (
      <>
        <Heading>Добавляем узлы Cassandra</Heading>
        <Area>
          <Img
            src={staticFile(asset('quo/aurora-cassandra.svg'))}
            alt="Оригинальная схема Quo: Aurora и Cassandra"
            style={{
              width: 828,
              background: '#FFFFFF',
              padding: 28,
              boxSizing: 'border-box',
            }}
          />
          <div style={{marginTop: 70, fontSize: 48}}>
            Запись распределяется
            <br />
            по узлам кластера
          </div>
        </Area>
        <Note>На момент статьи миграция ещё продолжалась.</Note>
      </>
    );
  return <ArchivePage page={quoEnding} timeMs={(t - 1429.7) * 1000} />;
}

export function EvidenceScenes({number, t}: SceneProps) {
  switch (number) {
    case 13:
      return <Tasks t={t} />;
    case 18:
      return <Trigger t={t} />;
    case 21:
      return <Recall t={t} />;
    case 24:
      return <Quo t={t} />;
    default:
      throw new Error(`Unsupported evidence scene ${number}`);
  }
}
