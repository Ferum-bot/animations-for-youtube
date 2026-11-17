import {arrive, type CodeLine} from '@channel/motion-v2';
import anchors from '../../anchors.json';

const startMs = anchors['p04-a02-create-order-sql-start'];

// One purchase transaction from p. 32. The handler checks the affected row
// count before issuing either INSERT. Cue times are on the original WAV.
const blocks = [
  {at: startMs, field: 'begin', sql: ['BEGIN;']},
  {at: 3_304_040, field: 'hold', sql: [
    'UPDATE accounts',
    'SET available_cents = available_cents - :hold,',
    '    held_cents      = held_cents + :hold',
    'WHERE id = :account_id AND available_cents >= :hold;',
    '-- 0 строк — ROLLBACK, недостаточно средств.',
  ]},
  {at: 3_309_720, field: 'order', sql: [
    '',
    '-- UNIQUE (account_id, client_order_id) защищает от дубля.',
    'INSERT INTO orders',
    '    (id, account_id, client_order_id, ticker, side, type,',
    '     quantity, limit_price_cents, hold_cents, status)',
    'VALUES (:id, :account_id, :client_order_id, :ticker, :side,',
    "        :type, :qty, :limit_price_cents, :hold, 'PENDING_NEW');",
  ]},
  {at: 3_310_980, field: 'outbox', sql: [
    '',
    '-- Задание для шлюза на биржу.',
    'INSERT INTO outbox (aggregate_id, type, payload)',
    "VALUES (:id, 'SUBMIT_ORDER', :json);",
  ]},
  {at: 3_312_980, field: 'commit', sql: ['COMMIT;']},
] as const;

type Field = typeof blocks[number]['field'];

export const lines: readonly CodeLine<Field>[] = blocks.flatMap(({field, sql}) =>
  sql.map(text => ({field: text ? field : null, text})));

export function focusAt(timeMs: number) {
  const sourceMs = startMs + timeMs;
  let previous: Field = 'begin';
  let current: Field = 'begin';
  let since = startMs;
  for (const block of blocks) {
    if (block.at > sourceMs) break;
    previous = current;
    current = block.field;
    since = block.at;
  }
  const mix = arrive(sourceMs, since, 370);
  return (field: Field) => Number(field === previous) * (1 - mix) + Number(field === current) * mix;
}
