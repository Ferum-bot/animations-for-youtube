export const dnsRecordStoreTiming = {
  recordSetMs: 9_060,
  ipIsOneTypeMs: 12_660,
  distributedStoreMs: 16_500,
  catalogueGrowsMs: 21_260,
  operationalDataMs: 24_960,
  thesisMs: 30_180,
} as const;

export type ResourceRecord = {
  readonly type: 'A' | 'AAAA' | 'MX' | 'TXT';
  readonly value: string;
  readonly role: 'АДРЕС' | 'ПОЧТОВЫЙ МАРШРУТ' | 'ПОЛИТИКА' | 'КЛЮЧ';
  readonly accent: 'primary' | 'signal' | 'success';
};

export const resourceRecords = [
  {type: 'A', value: '203.0.113.42', role: 'АДРЕС', accent: 'primary'},
  {type: 'AAAA', value: '2001:db8::42', role: 'АДРЕС', accent: 'primary'},
  {type: 'MX', value: '10 mail.example.com.', role: 'ПОЧТОВЫЙ МАРШРУТ', accent: 'signal'},
  {type: 'TXT', value: 'v=DKIM1; p=MIIB…', role: 'КЛЮЧ', accent: 'success'},
] as const satisfies readonly ResourceRecord[];

export const authorityNodes = [
  {id: 'NS-01', location: 'EU', address: '192.0.2.10'},
  {id: 'NS-02', location: 'US', address: '198.51.100.8'},
  {id: 'NS-03', location: 'APAC', address: '203.0.113.4'},
] as const;
