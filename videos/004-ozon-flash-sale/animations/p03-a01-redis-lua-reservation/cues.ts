import anchors from '../../anchors.json';
import metadata from './animation.json';
import type {CodeCue} from '../../shared/code/types';

export const scene = {startMs: anchors['lua-start'], durationMs: metadata.durationMs};
type LuaCue = Omit<CodeCue, 'startMs'> & {readonly anchor: Extract<keyof typeof anchors, `lua-${string}`>};

export const cues = [
  {anchor: 'lua-start', ranges: [], label: 'Redis + Lua', title: ['Резервация', 'одним скриптом'], body: ['Проверить пользователя.', 'Проверить остаток.', 'Зарезервировать единицу.'], detail: 'Один вызов Redis'},
  {anchor: 'lua-overview', ranges: [[6, 12], [14, 16]], label: 'Проверки и запись', title: ['Без повторной', 'брони'], body: ['Проверки предшествуют', 'уменьшению остатка', 'и записи пользователя.'], detail: 'Проверить → изменить'},
  {anchor: 'lua-keys', ranges: [[1, 2]], label: 'Входные ключи', title: ['Остаток', 'и держатели'], body: ['Два ключа Redis', 'для одного товара.'], detail: 'KEYS[1] / KEYS[2]'},
  {anchor: 'lua-stock-key', ranges: [[1, 1]], label: 'Остаток', title: ['stock:42'], body: ['Количество доступных', 'единиц товара 42.'], detail: 'KEYS[1]'},
  {anchor: 'lua-holders-key', ranges: [[2, 2]], label: 'Держатели брони', title: ['holders:42'], body: ['Set пользователей,', 'уже получивших бронь.'], detail: 'KEYS[2]'},
  {anchor: 'lua-user', ranges: [[3, 3]], label: 'Аргумент', title: ['Кто бронирует'], body: ['Идентификатор', 'текущего пользователя.'], detail: 'ARGV[1] = user_id'},
  {anchor: 'lua-ttl', ranges: [[4, 4]], label: 'TTL', title: ['Передан,', 'но не применён'], body: ['В этом фрагменте', 'ARGV[2] не используется.', 'Срок брони здесь', 'не устанавливается.'], detail: 'ARGV[2] = ttl'},
  {anchor: 'lua-duplicate', ranges: [[6, 8]], label: 'Проверка брони', title: ['Уже есть', 'в holders?'], body: ['SISMEMBER проверяет', 'наличие пользователя', 'в Redis Set.'], detail: 'SISMEMBER → 1'},
  {anchor: 'lua-duplicate-result', ranges: [[7, 7]], label: 'Повторная заявка', title: ['Вернуть −1', 'и завершить'], body: ['Повторно остаток', 'не уменьшаем.'], detail: 'return -1'},
  {anchor: 'lua-read-stock', ranges: [[9, 9]], label: 'Чтение остатка', title: ['Прочитать', 'число единиц'], body: ['GET получает значение.', 'tonumber преобразует', 'его в число.'], detail: 'GET → tonumber'},
  {anchor: 'lua-stock-check', ranges: [[10, 12]], label: 'Нет товара', title: ['Отклонить', 'заявку'], body: ['Нет числа или s ≤ 0:', 'вернуть 0 и завершить', 'скрипт до изменений.'], detail: 'return 0'},
  {anchor: 'lua-decrement', ranges: [[14, 14]], label: 'Списание', title: ['Одна единица', 'в бронь'], body: ['DECR уменьшает', 'остаток на единицу.'], detail: 'stock = stock − 1'},
  {anchor: 'lua-holder-add', ranges: [[15, 15]], label: 'Защита от повтора', title: ['Запомнить', 'пользователя'], body: ['SADD добавляет user_id', 'в множество holders.'], detail: 'SADD holders user_id'},
  {anchor: 'lua-success', ranges: [[16, 16]], label: 'Успех', title: ['Вернуть 1'], body: ['Остаток уменьшен.', 'Пользователь добавлен', 'в держатели брони.'], detail: 'return 1'},
  {anchor: 'lua-atomic', ranges: [[6, 16]], label: 'Атомарное выполнение', title: ['Без вклинивания', 'других команд'], body: ['Проверки и изменения', 'выполняются внутри', 'одного Lua-скрипта.'], detail: 'SISMEMBER → DECR → SADD'},
  {anchor: 'lua-roundtrip', ranges: [[6, 16]], label: 'Один вызов', title: ['Один round trip'], body: ['Клиент вызывает скрипт', 'и получает результат:', '−1 — повтор, 0 — нет товара,', '1 — успешная резервация.'], detail: 'Лимит на пользователя'},
] as const satisfies readonly LuaCue[];

export const cueTime = (cue: LuaCue): number => anchors[cue.anchor] - scene.startMs;
