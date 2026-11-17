// Initial schema from pp. 11–12 of the episode materials, before the reliability changes.
export const tables = {
  users: {
    columns: [
      ['id', 'BIGSERIAL PRIMARY KEY', 'клиент'],
      ['email', 'TEXT UNIQUE NOT NULL'],
      ['created_at', 'TIMESTAMPTZ NOT NULL DEFAULT now()'],
    ],
  },
  accounts: {
    columns: [
      ['id', 'BIGSERIAL PRIMARY KEY'],
      ['user_id', 'BIGINT NOT NULL REFERENCES users(id)'],
      ['cash_cents', 'BIGINT NOT NULL', 'баланс в центах'],
      ['updated_at', 'TIMESTAMPTZ NOT NULL DEFAULT now()'],
    ],
  },
  symbols: {
    columns: [
      ['ticker', 'TEXT PRIMARY KEY', 'AAPL'],
      ['name', 'TEXT NOT NULL'],
      ['exchange', 'TEXT NOT NULL', 'NASDAQ, NYSE'],
    ],
  },
  orders: {
    columns: [
      ['id', 'BIGSERIAL PRIMARY KEY'],
      ['account_id', 'BIGINT NOT NULL REFERENCES accounts(id)'],
      ['ticker', 'TEXT NOT NULL REFERENCES symbols(ticker)'],
      ['side', 'TEXT NOT NULL', 'BUY, SELL'],
      ['type', 'TEXT NOT NULL', 'MARKET, LIMIT'],
      ['quantity', 'BIGINT NOT NULL'],
      ['limit_price_cents', 'BIGINT', 'NULL для MARKET'],
      ['status', 'TEXT NOT NULL', 'NEW, FILLED, CANCELED, REJECTED'],
      ['external_order_id', 'TEXT', 'ID заявки на бирже'],
      ['filled_quantity', 'BIGINT NOT NULL DEFAULT 0', 'уже исполнено'],
      ['created_at', 'TIMESTAMPTZ NOT NULL DEFAULT now()'],
    ],
  },
  executions: {
    columns: [
      ['id', 'BIGSERIAL PRIMARY KEY'],
      ['order_id', 'BIGINT NOT NULL REFERENCES orders(id)'],
      ['quantity', 'BIGINT NOT NULL', 'объём сделки'],
      ['price_cents', 'BIGINT NOT NULL', 'цена в центах'],
      ['executed_at', 'TIMESTAMPTZ NOT NULL'],
    ],
  },
  positions: {
    columns: [
      ['account_id', 'BIGINT REFERENCES accounts(id)'],
      ['ticker', 'TEXT REFERENCES symbols(ticker)'],
      ['quantity', 'BIGINT NOT NULL', 'бумаг на счёте'],
    ],
  },
} as const;

export type Table = keyof typeof tables;
export type Column<T extends Table> = typeof tables[T]['columns'][number][0];
