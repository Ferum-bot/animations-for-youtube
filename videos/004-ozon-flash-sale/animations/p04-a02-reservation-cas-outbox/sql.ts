import {highlightSql} from '../../shared/code/highlightSql';

export const sql = `UPDATE reservations
SET status = 'EXPIRED',
    released_at = now()
WHERE id = :reservation_id
  AND status = 'HELD'
  AND expires_at <= now();

-- Событие в Outbox — в той же транзакции`;

export const sqlLines = highlightSql(sql, {columns: ['id', 'status', 'expires_at', 'released_at'], functions: ['now']});
