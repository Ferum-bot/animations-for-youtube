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

function Workers({t}: {readonly t: number}) {
  const first = motion(t, 502.2, 1.2),
    second = motion(t, 506.4, 1.2);
  const leased = t >= 509.6;
  return (
    <>
      <Heading>
        SKIP LOCKED:
        <br />
        не жди занятую строку
      </Heading>
      <Area>
        <Code
          size={36}
          active="SKIP LOCKED"
          text={
            "SELECT id FROM jobs\nWHERE state = 'ready'\nORDER BY run_at\nLIMIT 2\nFOR UPDATE SKIP LOCKED;"
          }
        />
        <div style={{marginTop: 45}}>
          <Table
            headers={['Задача', 'Состояние']}
            rows={[
              ['101', leased ? 'аренда → A' : first ? 'lock A' : 'ready'],
              ['102', leased ? 'аренда → A' : first ? 'lock A' : 'ready'],
              ['103', second ? 'взял B' : 'ready'],
            ]}
            highlight={second ? 2 : 0}
          />
        </div>
        <div style={{display: 'flex', gap: 45, marginTop: 50}}>
          <div style={{width: 390}}>
            <Caption>Воркер A</Caption>
            <Record accent>101 · 102</Record>
          </div>
          <div style={{width: 390, opacity: second}}>
            <Caption>Воркер B</Caption>
            <Record accent>103</Record>
          </div>
        </div>
      </Area>
      <Note>
        {t < 509.6
          ? 'B пропускает блокировки A и берёт следующую задачу.'
          : t < 516.9
            ? 'После аренды — COMMIT. Блокировка строки не держится всё время работы.'
            : 'A упал → срок аренды истёк → задачу можно выдать снова.'}
      </Note>
    </>
  );
}

function Retry({t}: {readonly t: number}) {
  const source = t < 509 ? 0 : t < 516.9 ? 1 : t < 556 ? 2 : t < 563 ? 3 : 4;
  return (
    <>
      <Heading>
        Задача может
        <br />
        выполниться дважды
      </Heading>
      <Area>
        <Caption>jobs · задача 101 · отправить письмо</Caption>
        <Record accent>order_id: 42</Record>
        <Down amount={motion(t, 509.6)} label="аренда" />
        <Record opacity={source >= 2 ? 0.4 : 1}>
          Воркер A {source >= 2 ? '· недоступен' : ''}
        </Record>
        <div
          style={{marginTop: 45, fontSize: 38, opacity: source >= 2 ? 1 : 0}}
        >
          Аренда истекла → повторная выдача
        </div>
        <Down amount={source >= 2 ? 1 : 0} />
        <div style={{opacity: source >= 2 ? 1 : 0}}>
          <Record accent>Воркер B · та же задача 101</Record>
        </div>
        <div style={{marginTop: 55, opacity: motion(t, 566.5)}}>
          <Code
            label="Ключ идемпотентности"
            text={'send-order-email:42'}
            size={40}
          />
        </div>
      </Area>
      <Note>
        {source < 3
          ? 'Повторная выдача возможна после сбоя или истечения аренды.'
          : 'At-least-once: обработчик должен безопасно принимать повтор.'}
      </Note>
    </>
  );
}

function NotifyCommit({t}: {readonly t: number}) {
  const sent = motion(t, 664.6, 1.1);
  const rollback = t >= 667.2 && t < 670.3;
  const merged = t >= 670.3;
  return (
    <>
      <Heading>NOTIFY ждёт COMMIT</Heading>
      <Area>
        <Caption>Подписчик · открытое соединение</Caption>
        <Code text={'LISTEN orders;'} size={43} />
        <div style={{marginTop: 60}}>
          <Caption>Отправитель</Caption>
          <Code
            size={36}
            active={rollback ? 'ROLLBACK' : t >= 664.6 ? 'COMMIT' : 'NOTIFY'}
            text={
              "BEGIN;\nINSERT INTO orders (id) VALUES (42);\nNOTIFY orders, '42';\n" +
              (rollback ? 'ROLLBACK;' : 'COMMIT;')
            }
          />
        </div>
        <Down amount={rollback ? 0 : sent} label="orders: 42" />
        <Record accent={sent === 1 && !rollback}>
          {rollback
            ? 'Уведомления нет'
            : sent === 1
              ? 'Подписчик получил 42'
              : 'Подписчик ждёт'}
        </Record>
      </Area>
      {merged ? (
        <Note>
          Одинаковый канал + payload в одной транзакции → одно уведомление.
        </Note>
      ) : (
        <Note>Уведомление отправляется только после успешной фиксации.</Note>
      )}
    </>
  );
}

function NotifyLoss({t}: {readonly t: number}) {
  const saved = t >= 690.2;
  return (
    <>
      <Heading>
        NOTIFY — сигнал,
        <br />а не очередь задач
      </Heading>
      <Area>
        <Caption>
          {saved ? 'Надёжное содержимое' : 'Подписчик отключён'}
        </Caption>
        <Record accent={saved}>
          {saved ? 'jobs · задача 101 сохранена' : 'Воркер · нет соединения'}
        </Record>
        <Down amount={saved ? motion(t, 693.2) : 1} />
        <Record opacity={!saved && t > 688.4 ? 0.25 : 1}>
          {saved ? 'NOTIFY будит обработчик' : 'NOTIFY прошёл мимо'}
        </Record>
        <div style={{marginTop: 65, fontSize: 45, color: ink.signal}}>
          {saved
            ? 'Данные читаем из таблицы'
            : 'После подключения\nистории нет'}
        </div>
        {t >= 694.8 && (
          <div style={{marginTop: 55}}>
            <Record>payload &lt; 8000 байт</Record>
          </div>
        )}
        {t >= 700.2 && (
          <div style={{marginTop: 35, fontSize: 36}}>
            LISTEN: session pooling
            <br />
            <span style={{color: ink.muted}}>не transaction pooling</span>
          </div>
        )}
      </Area>
      <Note>Название канала и ID — сигнал. Сама задача остаётся в jobs.</Note>
    </>
  );
}

function Transaction({t}: {readonly t: number}) {
  const items = [
    ['Заказ 42', 739.84],
    ['Задача на письмо', 741.88],
    ['Сброс кэша', 743],
    ['Поисковый индекс', 744.82],
  ] as const;
  const committed = t >= 746.9,
    split = t >= 749.26;
  return (
    <>
      <Heading>
        {split ? 'Между системами\nостаётся разрыв' : 'Одна транзакция'}
      </Heading>
      <Area>
        <div
          style={{
            border: `3px solid ${committed ? ink.signal : ink.line}`,
            padding: 30,
          }}
        >
          <Caption>Postgres · BEGIN</Caption>
          {items.map(([label, at]) => (
            <div
              key={label}
              style={{
                marginBottom: 22,
                opacity: t < 737 ? 1 : 0.25 + 0.75 * motion(t, at),
              }}
            >
              <Record accent={committed}>{label}</Record>
            </div>
          ))}
          <div
            style={{
              fontFamily: ink.fontMono,
              fontSize: 42,
              marginTop: 35,
              color: ink.signal,
            }}
          >
            {committed ? 'COMMIT' : '…'}
          </div>
        </div>
        {split && (
          <div style={{marginTop: 45}}>
            <Record>Заказ сохранён ✓</Record>
            <div style={{marginTop: 25}}>
              <Record accent>Внешний брокер недоступен</Record>
            </div>
          </div>
        )}
      </Area>
      <Note>
        {split
          ? 'Для согласования отдельных систем нужен отдельный механизм.'
          : 'В транзакции фиксируется задача на письмо — не доставка письма.'}
      </Note>
    </>
  );
}

export function QueueScenes({number, t}: SceneProps) {
  switch (number) {
    case 8:
      return <Workers t={t} />;
    case 9:
      return <Retry t={t} />;
    case 10:
      return <NotifyCommit t={t} />;
    case 11:
      return <NotifyLoss t={t} />;
    case 12:
      return <Transaction t={t} />;
    default:
      throw new Error(`Unsupported queue scene ${number}`);
  }
}
