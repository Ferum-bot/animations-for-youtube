// Milliseconds from the start of the clip (06:15.000 WAV / 06:23.000 CapCut).
export type LinkType = {
  readonly name: string;
  readonly topology: 'split' | 'through';
  readonly start: number;
  readonly draw: number;
  readonly secondLeg?: number;
  readonly countAt: number;
  readonly middle: string;
  readonly explanation: string;
  readonly detail?: {readonly at: number; readonly text: string};
  readonly examplesAt: number;
  readonly examples: string;
};

export const linkTypes: readonly LinkType[] = [
  {
    name: 'L7-прокси', topology: 'split', start: 6980, draw: 11120, secondLeg: 13900,
    countAt: 16300, middle: 'Прокси', explanation: 'Читает HTTP при рукопожатии.',
    examplesAt: 20300, examples: 'NGINX · Envoy · HAProxy в режиме HTTP',
  },
  {
    name: 'L4-прокси', topology: 'split', start: 24200, draw: 28240, secondLeg: 30600,
    countAt: 34060, middle: 'Прокси', explanation: 'Передаёт байты между двумя сокетами.',
    examplesAt: 36780, examples: 'HAProxy в режиме TCP · NGINX Stream · Google Proxy NLB',
  },
  {
    name: 'Сквозная L4-пересылка', topology: 'through', start: 42180, draw: 45340,
    countAt: 48580, middle: 'Балансировщик', explanation: 'Пересылает пакеты к серверу.',
    detail: {at: 46700, text: 'При DSR ответ идёт напрямую к клиенту.'},
    examplesAt: 50900, examples: 'Google Maglev · Meta Katran · GitHub GLB',
  },
  {
    name: 'NAT и conntrack', topology: 'through', start: 54500, draw: 57240,
    countAt: 62120, middle: 'NAT', explanation: 'NAT меняет адрес в пакете.',
    detail: {at: 59300, text: 'conntrack хранит запись о потоке.'},
    examplesAt: 64840, examples: 'Домашний роутер · CGNAT оператора',
  },
];
