import anchors from '../../anchors.json';
import type {Column, Table} from './schema';

type Focus<T extends Table> = {
  readonly at: number;
  readonly table: T;
  readonly fields: readonly Column<T>[];
};
type Cue = {[T in Table]: Focus<T>}[Table];

const focus = <T extends Table>(at: number, table: T, fields: readonly Column<NoInfer<T>>[] = []): Focus<T> =>
  ({at, table, fields});

export const sourceStart = anchors['p01-a01-broker-schema-start'];
// Absolute WAV milliseconds. Studio frame zero is the first word of this excerpt.
const beats: readonly [Cue, ...Cue[]] = [
  focus(sourceStart, 'users'),
  focus(1_403_680, 'users', ['id', 'email', 'created_at']),
  focus(1_407_260, 'accounts'),
  focus(1_411_840, 'accounts', ['user_id']),
  focus(1_419_740, 'accounts', ['id']),
  focus(1_421_420, 'accounts', ['cash_cents']),
  focus(1_426_520, 'accounts', ['updated_at']),
  focus(1_429_240, 'symbols'),
  focus(1_432_360, 'symbols', ['ticker', 'name', 'exchange']),
  focus(1_435_720, 'symbols', ['exchange']),
  focus(1_442_040, 'orders'),
  focus(1_449_220, 'orders', ['id', 'account_id', 'ticker']),
  focus(1_450_620, 'orders', ['side', 'type']),
  focus(1_456_420, 'orders', ['quantity', 'filled_quantity']),
  focus(1_457_750, 'orders', ['limit_price_cents']),
  focus(1_458_950, 'orders', ['status']),
  focus(1_460_000, 'orders', ['external_order_id']),
  focus(1_462_580, 'orders', ['created_at']),
  focus(1_465_120, 'executions'),
  focus(1_471_340, 'executions', ['id', 'order_id']),
  focus(1_472_600, 'executions', ['quantity', 'price_cents']),
  focus(1_474_480, 'executions', ['executed_at']),
  focus(1_476_840, 'positions'),
  focus(1_478_200, 'positions', ['account_id', 'ticker']),
  focus(1_481_280, 'positions', ['quantity']),
  focus(1_482_980, 'positions', ['account_id', 'ticker']),
];

export const beatsAt = (sourceMs: number) => {
  let current: Cue = beats[0];
  let previous: Cue = current;
  for (const beat of beats) {
    if (beat.at > sourceMs) break;
    previous = current;
    current = beat;
  }
  return {current, previous};
};
