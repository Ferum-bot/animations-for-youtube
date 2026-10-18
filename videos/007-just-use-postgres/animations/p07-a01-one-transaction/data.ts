/** Supplied demo: a fresh orders table assigns the first order id 1. */
export const transactionSql = `BEGIN;

INSERT INTO orders (user_id, total)
VALUES (7, 1990);

INSERT INTO jobs (queue, payload)
VALUES ('emails', '{"order_id": 1}');

DELETE FROM cache
WHERE key = 'user:7:orders';

COMMIT;`;

export const tables = [
  {id: 'orders', label: 'ЗАКАЗЫ', value: 'id: 1 · user_id: 7 · total: 1990', before: 'Заказа ещё нет', after: 'Заказ создан', rollback: 'Нового заказа нет'},
  {id: 'jobs', label: 'ЗАДАЧИ НА ПИСЬМО', value: 'emails · {"order_id": 1}', before: 'Задачи ещё нет', after: 'Задача сохранена', rollback: 'Новой задачи нет'},
  {id: 'cache', label: 'КЭШ ЗАКАЗОВ', value: 'user:7:orders', before: 'Запись есть', after: 'Запись удалена', rollback: 'Запись осталась'},
] as const;
