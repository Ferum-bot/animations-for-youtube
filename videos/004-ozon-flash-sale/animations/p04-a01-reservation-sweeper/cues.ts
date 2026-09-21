import anchors from '../../anchors.json';
import metadata from './animation.json';
import type {CodeCue} from '../../shared/code/types';

export const scene = {startMs: anchors['sweeper-start'], durationMs: metadata.durationMs};
type Anchor = Extract<keyof typeof anchors, `sweeper-${string}`>;
export const relativeTime = (anchor: Anchor): number => anchors[anchor] - scene.startMs;

export const cues = [
  {
    startMs: 0,
    ranges: [],
    label: "Периодический sweeper",
    title: ["Проверить", "просроченные брони"],
    body: ["Запуск по расписанию:", "каждые N секунд."],
    detail: "Cron → PostgreSQL",
  },
  {
    startMs: relativeTime('sweeper-update'),
    ranges: [[1, 1]],
    label: "Таблица резерваций",
    title: ["Обновить", "подходящие строки"],
    body: ["Один запрос выбирает", "брони по условиям", "в WHERE."],
    detail: "UPDATE reservations",
  },
  {
    startMs: relativeTime('sweeper-status'),
    ranges: [[2, 2]],
    label: "Новый статус",
    title: ["Бронь истекла"],
    body: ["Перевести найденные", "резервации в EXPIRED."],
    detail: "SET status = EXPIRED",
  },
  {
    startMs: relativeTime('sweeper-held'),
    ranges: [[3, 3]],
    label: "Условие перехода",
    title: ["Только из HELD"],
    body: ["Оплаченные и уже", "истёкшие брони", "не проходят условие."],
    detail: "WHERE status = HELD",
  },
  {
    startMs: relativeTime('sweeper-deadline'),
    ranges: [[4, 4]],
    label: "Проверка срока",
    title: ["Время вышло"],
    body: ["expires_at не позже", "текущего времени БД."],
    detail: "expires_at ≤ now()",
  },
  {
    startMs: relativeTime('sweeper-redis'),
    ranges: [[2, 4]],
    label: "Возврат остатка",
    title: ["Вернуть единицы", "в Redis"],
    body: ["Только для броней,", "переведённых в EXPIRED.", "Возврат — отдельный", "идемпотентный шаг."],
    detail: "SQL сам Redis не меняет",
  },
] as const satisfies readonly CodeCue[];
