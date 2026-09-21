import {highlightSql} from '../../shared/code/highlightSql';

export const unitSql = `SELECT id FROM reservation_units
WHERE item_id = 42
FOR UPDATE SKIP LOCKED LIMIT 1;

-- Затем DELETE выбранной строки + INSERT в reserved_quantities
-- в той же транзакции`;

export const sqlLines = highlightSql(unitSql, {columns: ['id', 'item_id']});
