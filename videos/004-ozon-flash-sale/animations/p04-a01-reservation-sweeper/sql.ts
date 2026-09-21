import {highlightSql} from '../../shared/code/highlightSql';

export const sql = `UPDATE reservations
SET status = 'EXPIRED'
WHERE status = 'HELD'
  AND expires_at <= now();`;

export const sqlLines = highlightSql(sql, {columns: ['id', 'status', 'expires_at', 'released_at'], functions: ['now']});
