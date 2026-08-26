export type TransactionPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly queryCount: 1 | 4;
  readonly responseCount: 0 | 1 | 2 | 3 | 4;
  readonly focus: 'flow' | 'field' | 'copy' | 'matching' | 'security';
};

export const transactionPhases = [
  {
    id: 'setup',
    startMs: 120,
    eyebrow: 'DNS HEADER / CORRELATION',
    title: 'КАК СВЯЗАТЬ ВОПРОС И ОТВЕТ?',
    status: 'QUERY → RESPONSE',
    accent: 'primary',
    queryCount: 1,
    responseCount: 0,
    focus: 'flow',
  },
  {
    id: 'parallel',
    startMs: 2_900,
    eyebrow: 'MANY QUERIES / ONE RESOLVER',
    title: 'ЗАПРОСЫ ЛЕТЯТ ПАРАЛЛЕЛЬНО',
    status: '4 QUERIES / IN FLIGHT',
    accent: 'primary',
    queryCount: 4,
    responseCount: 0,
    focus: 'flow',
  },
  {
    id: 'field',
    startMs: 5_500,
    eyebrow: 'TRANSACTION ID / 16 BIT',
    title: 'КАЖДОМУ ЗАПРОСУ — СВОЙ ID',
    status: '0x0000 … 0xFFFF / 65 536 VALUES',
    accent: 'signal',
    queryCount: 4,
    responseCount: 0,
    focus: 'field',
  },
  {
    id: 'copy',
    startMs: 8_000,
    eyebrow: 'SAME VALUE / COPIED BACK',
    title: 'СЕРВЕР КОПИРУЕТ ID В ОТВЕТ',
    status: 'REQUEST.TXID = RESPONSE.TXID',
    accent: 'signal',
    queryCount: 4,
    responseCount: 1,
    focus: 'copy',
  },
  {
    id: 'returns',
    startMs: 10_200,
    eyebrow: 'OUT OF ORDER / STILL CORRELATED',
    title: 'ОТВЕТЫ МОГУТ ВЕРНУТЬСЯ НЕ ПО ПОРЯДКУ',
    status: 'D842 → 4A31 → 0F27 → 91C0',
    accent: 'primary',
    queryCount: 4,
    responseCount: 3,
    focus: 'matching',
  },
  {
    id: 'matched',
    startMs: 12_000,
    eyebrow: 'MATCH BY TXID',
    title: 'ID ВОЗВРАЩАЕТ ОТВЕТ НУЖНОМУ ЗАПРОСУ',
    status: '4 / 4 MATCHED',
    accent: 'success',
    queryCount: 4,
    responseCount: 4,
    focus: 'matching',
  },
  {
    id: 'security',
    startMs: 13_500,
    eyebrow: 'SMALL FIELD / SECURITY CONSEQUENCE',
    title: '16 БИТ НУЖНО БУДЕТ ЕЩЁ ВСПОМНИТЬ',
    status: 'CORRELATION FIELD / NOT AUTHENTICATION',
    accent: 'signal',
    queryCount: 4,
    responseCount: 4,
    focus: 'security',
  },
] as const satisfies readonly TransactionPhase[];

export const dnsTransactions = [
  {id: '4A31', query: 'A / api.example.com', answer: '192.0.2.18'},
  {id: '91C0', query: 'AAAA / cdn.example.com', answer: '2001:db8::24'},
  {id: '0F27', query: 'MX / example.com', answer: 'mail.example.com'},
  {id: 'D842', query: 'TXT / _verify.example.com', answer: 'token=7f2a'},
] as const;

export const responseOrder = [3, 0, 2, 1] as const;
