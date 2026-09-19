import anchors from '../../anchors.json';
import metadata from './animation.json';

export const scene = {startMs: anchors['reservation-sql-start'], durationMs: metadata.durationMs};
type Anchor = Exclude<keyof typeof anchors, 'reservation-sql-end'>;
export type LineRange = readonly [first: number, last: number];
export type SqlCue = {
  readonly anchor: Anchor;
  readonly ranges: readonly LineRange[];
  readonly label: string;
  readonly title: readonly string[];
  readonly body: readonly string[];
  readonly detail: string;
};

export const cues = [
  {anchor: 'reservation-sql-start', ranges: [], label: 'РЕЗЕРВАЦИЯ', title: ['Один запрос.', 'Два изменения.'], body: ['Уменьшить остаток', 'и создать резервацию.'], detail: 'PostgreSQL'},
  {anchor: 'reservation-transaction', ranges: [[2, 2], [18, 18]], label: 'ГРАНИЦА', title: ['Одна', 'транзакция'], body: ['Изменения фиксируются', 'вместе при COMMIT.'], detail: 'BEGIN → COMMIT'},
  {anchor: 'reservation-isolation', ranges: [[2, 2]], label: 'ИЗОЛЯЦИЯ', title: ['READ', 'COMMITTED'], body: ['Для этого запроса', 'достаточно базового', 'уровня изоляции.'], detail: 'Без SERIALIZABLE'},
  {anchor: 'reservation-atomic', ranges: [[5, 6], [13, 16]], label: 'СВЯЗАННЫЕ ДЕЙСТВИЯ', title: ['Списать.', 'Зарезервировать.'], body: ['UPDATE передаёт результат', 'в INSERT через dec.'], detail: 'UPDATE → INSERT'},
  {anchor: 'reservation-nonnegative', ranges: [[6, 8]], label: 'ИНВАРИАНТ', title: ['Остаток', 'не ниже нуля'], body: ['Списываем единицу,', 'только если stock > 0.'], detail: 'stock ≥ 0'},
  {anchor: 'reservation-predicates', ranges: [[7, 10]], label: 'УСЛОВИЯ UPDATE', title: ['Проверки', 'внутри запроса'], body: ['Нужный товар.', 'Положительный остаток.', 'Окно распродажи.'], detail: 'WHERE … AND …'},
  {anchor: 'reservation-cte', ranges: [[4, 12]], label: 'CTE', title: ['Результат UPDATE', 'получает имя dec'], body: ['Следующая часть запроса', 'использует возвращённые', 'строки.'], detail: 'WITH dec AS (…)'},
  {anchor: 'reservation-decrement', ranges: [[5, 6]], label: 'ОБНОВЛЕНИЕ', title: ['Минус одна', 'единица товара'], body: ['Меняем остаток', 'непосредственно в БД.'], detail: 'stock = stock − 1'},
  {anchor: 'reservation-item', ranges: [[7, 7]], label: 'ТОВАР', title: ['Конкретный', 'item_id'], body: ['В примере — товар 42.'], detail: 'WHERE id = 42'},
  {anchor: 'reservation-stock', ranges: [[8, 8]], label: 'ОСТАТОК', title: ['Есть что', 'резервировать'], body: ['UPDATE сработает,', 'только если stock > 0.'], detail: 'AND stock > 0'},
  {anchor: 'reservation-sale-window', ranges: [[9, 10]], label: 'ОКНО РАСПРОДАЖИ', title: ['Уже началась.', 'Ещё не кончилась.'], body: ['Начало включительно,', 'конец — не включительно.'], detail: '[sale_start, sale_end)'},
  {anchor: 'reservation-returning', ranges: [[11, 11]], label: 'РЕЗУЛЬТАТ UPDATE', title: ['Передать id', 'дальше'], body: ['RETURNING отдаёт id', 'обновлённого товара.'], detail: 'RETURNING id'},
  {anchor: 'reservation-insert', ranges: [[13, 16]], label: 'РЕЗЕРВАЦИЯ', title: ['Создать', 'запись HELD'], body: ['Товар, пользователь,', 'статус и срок действия', 'в одной записи.'], detail: 'expires_at: +10 минут'},
  {anchor: 'reservation-from-cte', ranges: [[11, 11], [14, 15]], label: 'СВЯЗЬ ЧЕРЕЗ dec', title: ['INSERT получает', 'строку из CTE'], body: ['Если UPDATE ничего', 'не вернул — INSERT', 'не создаст резервацию.'], detail: 'RETURNING → FROM dec'},
  {anchor: 'reservation-statement', ranges: [[4, 16]], label: 'АТОМАРНОСТЬ', title: ['Один', 'SQL-оператор'], body: ['Условное списание', 'и создание резервации', 'связаны в одном запросе.'], detail: 'WITH … INSERT …'},
  {anchor: 'reservation-isolation-reprise', ranges: [[2, 2]], label: 'ИЗОЛЯЦИЯ', title: ['READ COMMITTED', 'достаточно'], body: ['Корректность здесь', 'обеспечивает форма', 'самого запроса.'], detail: 'Условный UPDATE'},
  {anchor: 'reservation-check-write', ranges: [[5, 10]], label: 'ПРОВЕРКА + ЗАПИСЬ', title: ['В одном', 'UPDATE'], body: ['При конкурентном UPDATE', 'PostgreSQL перепроверяет', 'WHERE на новой версии', 'обновляемой строки.'], detail: 'stock > 0 → stock − 1'},
  {anchor: 'reservation-conclusion', ranges: [], label: 'ПАТТЕРН', title: ['Условный UPDATE', '+ INSERT из CTE'], body: ['Остаток не ниже нуля.', 'Резервация — только', 'после успешного списания.'], detail: 'Одна транзакция'},
] as const satisfies readonly SqlCue[];

export const cueTime = (cue: SqlCue): number => anchors[cue.anchor] - scene.startMs;
