import anchors from '../../anchors.json';
import metadata from './animation.json';
import type {CodeCue} from '../../shared/code/types';

export const scene = {startMs: anchors['skip-start'], durationMs: metadata.durationMs};
type SkipAnchor = Extract<keyof typeof anchors, `skip-${string}`>;
export const relativeTime = (anchor: SkipAnchor): number => anchors[anchor] - scene.startMs;

export const cues = [
  {startMs: 0, ranges: [], label: 'Единицы товара', title: ['Одна строка —', 'одна единица'], body: ['Отдельная строка', 'для каждой доступной', 'единицы товара.'], detail: 'reservation_units'},
  {startMs: relativeTime('skip-table'), ranges: [[1, 1]], label: 'Таблица', title: ['Пул доступных', 'единиц'], body: ['Берём строку', 'из reservation_units.'], detail: 'Одна строка на единицу'},
  {startMs: relativeTime('skip-select'), ranges: [[1, 1]], label: 'Выборка', title: ['Получить id', 'единицы'], body: ['Этот id понадобится', 'для удаления выбранной', 'строки в транзакции.'], detail: 'SELECT id'},
  {startMs: relativeTime('skip-item'), ranges: [[2, 2]], label: 'Нужный товар', title: ['Только товар 42'], body: ['Фильтруем единицы', 'по item_id.'], detail: 'WHERE item_id = 42'},
  {startMs: relativeTime('skip-lock'), ranges: [[3, 3]], label: 'Блокировка строки', title: ['Взять свободную', 'строку'], body: ['FOR UPDATE блокирует', 'выбранную строку', 'до конца транзакции.'], detail: 'FOR UPDATE'},
  {startMs: relativeTime('skip-limit'), ranges: [[3, 3]], label: 'Одна единица', title: ['Пропустить', 'занятую строку'], body: ['SKIP LOCKED пропускает', 'строки под блокировкой.', 'LIMIT 1 — взять одну.'], detail: 'SKIP LOCKED · LIMIT 1'},
  {startMs: relativeTime('skip-rows'), ranges: [[3, 3]], label: 'Конкурентные запросы', title: ['Разные строки', 'для транзакций'], body: ['Занятая строка', 'не задерживает выбор', 'свободной единицы.'], detail: 'Без ожидания этой строки'},
] as const satisfies readonly CodeCue[];
