import {type CodeLine} from '@channel/motion-v2';
import anchors from '../../anchors.json';

export const startMs = anchors['p03-a01-execution-report-sql-start'];

type Step = 'begin' | 'execution' | 'duplicate' | 'order' | 'statusGuard'
  | 'position' | 'quantity' | 'outbox' | 'commit';

const block = (field: Step | null, ...lines: string[]): CodeLine<Step>[] =>
  lines.map(text => ({field, text}));

// Page 26, buy-side fill. The handler branches on the results of RETURNING
// within the same transaction, before issuing the next statement.
export const orderPage = [
  ...block('begin', 'BEGIN;'),
  ...block('execution',
    'INSERT INTO executions',
    '    (exec_id, order_id, quantity, price_cents, executed_at)',
    'VALUES (:exec_id, :order_id, :qty, :px, :ts)'),
  ...block('duplicate',
    'ON CONFLICT (exec_id) DO NOTHING',
    'RETURNING exec_id;',
    '-- Пустой результат — обработчик делает COMMIT и выходит.'),
  ...block(null, ''),
  ...block('order',
    'UPDATE orders',
    'SET filled_quantity = filled_quantity + :qty,',
    '    status = CASE WHEN filled_quantity + :qty = quantity',
    "                  THEN 'FILLED' ELSE 'PARTIALLY_FILLED' END,",
    '    version = version + 1'),
  ...block('statusGuard',
    'WHERE id = :order_id',
    "  AND status NOT IN ('FILLED', 'CANCELED', 'REJECTED')",
    'RETURNING id;',
    '-- Пустой результат — обработчик откатывает транзакцию.'),
];

export const positionPage = [
  ...block('position',
    '-- Исполнение покупки увеличивает позицию на счёте.',
    'INSERT INTO positions (account_id, ticker, quantity)',
    'VALUES (:account_id, :ticker, :qty)'),
  ...block('quantity',
    'ON CONFLICT (account_id, ticker) DO UPDATE',
    'SET quantity = positions.quantity + EXCLUDED.quantity;'),
  ...block(null, ''),
  ...block('outbox',
    'INSERT INTO outbox (aggregate_id, type, payload)',
    "VALUES (:order_id, 'ORDER_FILLED', :json);"),
  ...block(null, ''),
  ...block('commit', 'COMMIT;'),
];

const positionAt = 2_898_600;
export const pageChangeMs = positionAt - startMs;

const cues: readonly (readonly [number, Step])[] = [
  [startMs, 'begin'],
  [2_884_460, 'execution'],
  [2_888_140, 'duplicate'],
  [2_891_480, 'order'],
  [2_895_400, 'statusGuard'],
  [positionAt, 'position'],
  [2_901_700, 'quantity'],
  [2_906_240, 'outbox'],
  [2_917_360, 'commit'],
];

export function activeAt(timeMs: number) {
  let previous: Step = 'begin';
  let active: Step = 'begin';
  let since = 0;
  for (const [at, step] of cues) {
    if (at > startMs + timeMs) break;
    previous = active;
    active = step;
    since = at - startMs;
  }
  return {previous, active, since};
}
