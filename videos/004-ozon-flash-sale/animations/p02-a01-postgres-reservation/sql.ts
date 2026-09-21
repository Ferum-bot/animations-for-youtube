import {highlightSql} from '../../shared/code/highlightSql';

/** The supplied SQL; only Markdown/HTML escaping and indentation are normalized. */
export const reservationSql = `-- резервация (PostgreSQL)
BEGIN ISOLATION LEVEL READ COMMITTED;

WITH dec AS (
  UPDATE items
     SET stock = stock - 1
   WHERE id = 42
     AND stock > 0
     AND now() >= sale_start
     AND now() <  sale_end
  RETURNING id
)
INSERT INTO reservations (item_id, user_id, status, expires_at)
SELECT id, :user_id, 'HELD', now() + interval '10 minutes'
  FROM dec
RETURNING id, expires_at;

COMMIT;`;

export const sqlLines = highlightSql(reservationSql, {
  columns: ['id', 'stock', 'sale_start', 'sale_end', 'item_id', 'user_id', 'status', 'expires_at'],
  functions: ['now'], ctes: ['dec'],
});
