import anchors from '../../anchors.json';
import metadata from './animation.json';
import type {CodeCue} from '../../shared/code/types';

export const scene = {startMs: anchors['cas-start'], durationMs: metadata.durationMs};
type Anchor = Extract<keyof typeof anchors, `cas-${string}`>;
export const relativeTime = (anchor: Anchor): number => anchors[anchor] - scene.startMs;

export const cues = [
  {
    startMs: 0,
    ranges: [[1, 6]],
    label: "Условное обновление",
    title: ["Одна бронь,", "несколько попыток"],
    body: ["Каждый процесс", "пытается изменить", "одну и ту же строку."],
    detail: "Пример: истечение брони",
  },
  {
    startMs: relativeTime('cas-condition'),
    ranges: [[4, 6]],
    label: "Compare-and-set",
    title: ["Проверка и запись", "вместе"],
    body: ["Обновить строку,", "только если она HELD", "и её срок уже истёк."],
    detail: "HELD → EXPIRED",
  },
  {
    startMs: relativeTime('cas-outbox-intro'),
    ranges: [[8, 8]],
    label: "Надёжное продолжение",
    title: ["Событие", "в той же транзакции"],
    body: ["Смена статуса и запись", "в Outbox коммитятся", "вместе. Redis обновится", "отдельным воркером."],
    detail: "COMMIT ≠ доставка",
  },
  {
    startMs: relativeTime('cas-database'),
    ranges: [[4, 6]],
    label: "PostgreSQL",
    title: ["Одна точка", "смены статуса"],
    body: ["Конкурирующие попытки", "проверяют условие", "на одной строке."],
    detail: "WHERE status = HELD",
  },
  {
    startMs: relativeTime('cas-winner'),
    ranges: [[2, 6]],
    label: "Победитель",
    title: ["Один процесс", "меняет статус"],
    body: ["Первая успешная попытка", "переводит эту бронь", "из HELD в EXPIRED."],
    detail: "Условие ещё истинно",
  },
  {
    startMs: relativeTime('cas-one'),
    ranges: [[2, 6]],
    label: "Результат обновления",
    title: ["Изменена", "одна строка"],
    body: ["Эта попытка выполнила", "переход. Событие возврата", "записывается в Outbox."],
    detail: "rows affected = 1",
  },
  {
    startMs: relativeTime('cas-zero'),
    ranges: [[5, 5]],
    label: "Остальные попытки",
    title: ["Изменено", "ноль строк"],
    body: ["Статус уже EXPIRED.", "Условие HELD ложно.", "Повторный переход", "не выполняется."],
    detail: "rows affected = 0",
  },
  {
    startMs: relativeTime('cas-outbox'),
    ranges: [[8, 8]],
    label: "Одна транзакция",
    title: ["Статус + событие"],
    body: ["Событие возврата", "фиксируется вместе", "со сменой статуса."],
    detail: "Запись → COMMIT",
  },
  {
    startMs: relativeTime('cas-worker'),
    ranges: [[8, 8]],
    label: "После коммита",
    title: ["Воркер читает", "Outbox"],
    body: ["Доставку события", "можно повторить", "после сбоя."],
    detail: "Повторы возможны",
  },
  {
    startMs: relativeTime('cas-redis'),
    ranges: [[8, 8]],
    label: "Идемпотентный возврат",
    title: ["Один эффект", "при повторах"],
    body: ["Возврат в Redis", "дедуплицируется", "по reservation_id."],
    detail: "Повтор ≠ второй INCR",
  },
  {
    startMs: relativeTime('cas-door'),
    ranges: [[5, 5], [8, 8]],
    label: "Принцип одной двери",
    title: ["Один переход,", "один возврат"],
    body: ["CAS защищает статус.", "Outbox сохраняет событие.", "Дедупликация защищает", "остаток в Redis."],
    detail: "БД → Outbox → Redis",
  },
] as const satisfies readonly CodeCue[];
