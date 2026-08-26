export const dnsProtocolContractTiming = {
  messagePairMs: 7_460,
  responseMs: 8_980,
  sharedFormatMs: 10_500,
  resourceRecordsMs: 12_100,
  exchangeRuleMs: 16_080,
  ttlMs: 18_300,
  thesisMs: 20_500,
} as const;

export type ContractClauseIndex = 0 | 1 | 2 | 3;

export type ContractClause = {
  readonly number: '01' | '02' | '03' | '04';
  readonly label: 'СООБЩЕНИЯ' | 'ФОРМАТ' | 'СОДЕРЖИМОЕ' | 'ПРАВИЛО';
  readonly summary: string;
};

export const contractClauses = [
  {number: '01', label: 'СООБЩЕНИЯ', summary: 'QUERY / RESPONSE'},
  {number: '02', label: 'ФОРМАТ', summary: 'ОБЩАЯ СТРУКТУРА'},
  {number: '03', label: 'СОДЕРЖИМОЕ', summary: 'RESOURCE RECORDS'},
  {number: '04', label: 'ПРАВИЛО', summary: 'ASK / ANSWER / TTL'},
] as const satisfies readonly ContractClause[];

export const dnsWireSections = [
  'HEADER',
  'QUESTION',
  'ANSWER',
  'AUTHORITY',
  'ADDITIONAL',
] as const;
