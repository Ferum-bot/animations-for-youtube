import React from 'react';
import {ink} from '../intro-shorts/palette';

type CoverSpec = {
  readonly title: readonly string[];
  readonly example: readonly string[];
  readonly note: string;
};
const covers: Readonly<Record<number, CoverSpec>> = {
  2: {
    title: ['Разные товары.', 'Одна таблица.'],
    example: ['JSONB', 'size: M', 'color: black'],
    note: 'Postgres вместо MongoDB?',
  },
  3: {
    title: ['Цена удобства', 'JSONB'],
    example: ['Читаем поля быстро.', 'Обновляем документ целиком.'],
    note: 'GIN · TOAST · стоимость записи',
  },
  4: {
    title: ['Поиск по тексту', 'прямо в Postgres'],
    example: ['Статья → tsvector', 'Запрос → tsquery'],
    note: 'Лексемы · индекс · ранжирование',
  },
  5: {
    title: ['Postgres вместо', 'Elasticsearch?'],
    example: ['Задачи → задач', 'А что с опечатками?'],
    note: 'Где заканчивается встроенный поиск',
  },
  6: {
    title: ['Кэш —', 'обычная таблица?'],
    example: ['key', 'value', 'expires_at'],
    note: 'UNLOGGED в Postgres',
  },
  7: {
    title: ['Чего не хватает', 'кэшу в Postgres'],
    example: ['TTL?', 'Реплика?', 'После сбоя?'],
    note: 'Почему это не совсем Redis',
  },
  8: {
    title: ['Не жди', 'занятую строку'],
    example: ['Воркер A → 101, 102', 'Воркер B → 103'],
    note: 'FOR UPDATE SKIP LOCKED',
  },
  9: {
    title: ['Одна задача.', 'Два выполнения.'],
    example: ['Сбой → повтор', 'send-order-email:42'],
    note: 'At-least-once и идемпотентность',
  },
  10: {
    title: ['NOTIFY', 'ждёт COMMIT'],
    example: ['BEGIN', 'NOTIFY', 'COMMIT → сообщение'],
    note: 'А после ROLLBACK?',
  },
  11: {
    title: ['NOTIFY —', 'не очередь'],
    example: ['Отключился.', 'Пропустил сообщение.'],
    note: 'Истории доставки здесь нет',
  },
  12: {
    title: ['Одна транзакция', 'на всё'],
    example: ['Заказ + задача + кэш', 'COMMIT'],
    note: 'Главное удобство одной базы',
  },
  13: {
    title: ['20 миллионов', 'задач в день'],
    example: ['≈ 231', 'задача в секунду'],
    note: 'Средняя нагрузка — не пиковая',
  },
  14: {
    title: ['DELETE', 'не стирает сразу'],
    example: ['Версия 1 → старый снимок', 'Версия 2 → удалена'],
    note: 'Как работает MVCC',
  },
  15: {
    title: ['Задач мало.', 'Очередь тормозит.'],
    example: ['Индекс → старая версия', 'Проверить → пропустить'],
    note: 'Postgres и цена обхода индекса',
  },
  16: {
    title: ['Кто мешает', 'VACUUM?'],
    example: ['Старый снимок', '↓', 'Старые версии остаются'],
    note: 'Долгие транзакции и реплики',
  },
  17: {
    title: ['Те же задачи.', 'В 200 раз дольше.'],
    example: ['0,041 → 8,5 мс'],
    note: 'Конкретный эксперимент с очередью',
  },
  18: {
    title: ['CPU — 99%.', 'Что случилось?'],
    example: ['Trigger.dev', 'xmin horizon'],
    note: 'Разбор реального инцидента',
  },
  19: {
    title: ['Один замок', 'для NOTIFY'],
    example: ['TX 1 → COMMIT', 'TX 2 → ждёт', 'TX 3 → ждёт'],
    note: 'Почему запись теряет параллелизм',
  },
  20: {
    title: ['Добавили NOTIFY.', 'Что стало с TPS?'],
    example: ['8 936 → 278'],
    note: '64 клиента · эксперимент из выпуска',
  },
  21: {
    title: ['Запросы стоят.', 'CPU свободен.'],
    example: ['Recall.ai', 'AccessExclusiveLock'],
    note: 'Инцидент с LISTEN/NOTIFY',
  },
  22: {
    title: ['Одна база', 'на всё?'],
    example: ['Заказы · кэш · очередь', 'Общие ресурсы'],
    note: 'Удобство и общая граница отказа',
  },
  23: {
    title: ['Реплика', 'не ускоряет запись'],
    example: ['Запись → primary', 'WAL → реплика'],
    note: 'Второго writer не появилось',
  },
  24: {
    title: ['Почему Quo', 'уходит в Cassandra'],
    example: ['Temporal → Aurora', 'Один writer'],
    note: 'Когда Postgres стало мало',
  },
  25: {
    title: ['Переросли базу.', 'Выбор был ошибкой?'],
    example: ['Новые требования', '↓', 'Новое решение'],
    note: 'Just Use Postgres и контекст',
  },
};

export function Cover({number}: {readonly number: number}) {
  const spec = covers[number];
  if (!spec) throw new Error(`No cover for short ${number}`);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: ink.background,
        color: ink.text,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 350,
          width: 828,
          fontSize: 86,
          lineHeight: 1.08,
          fontWeight: 800,
          letterSpacing: -2.8,
        }}
      >
        {spec.title.map((line, i) => (
          <div
            key={line}
            style={{
              color: i === spec.title.length - 1 ? ink.signal : ink.text,
            }}
          >
            {line}
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 930,
          width: 828,
          borderTop: `4px solid ${ink.signal}`,
          paddingTop: 55,
          fontSize: spec.example.length === 1 ? 74 : 48,
          lineHeight: 1.5,
          fontFamily: ink.fontMono,
          letterSpacing: -1,
        }}
      >
        {spec.example.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 1480,
          width: 828,
          fontSize: 35,
          lineHeight: 1.3,
          color: ink.muted,
        }}
      >
        {spec.note}
      </div>
    </div>
  );
}
