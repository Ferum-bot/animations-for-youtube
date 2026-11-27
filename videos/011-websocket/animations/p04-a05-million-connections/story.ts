import type {captures} from './captures';

export const publications = {
  whatsapp: {
    publisher: 'WhatsApp Blog', date: '6 января 2012', thumb: 'wa',
    title: '1 million is so 2011', condition: 'TCP-соединения на одном сервере',
    url: 'https://blog.whatsapp.com/1-million-is-so-2011',
  },
  phoenix: {
    publisher: 'Phoenix Framework', date: '3 ноября 2015', thumb: 'ph-title',
    title: 'The Road to 2 Million Websocket Connections in Phoenix',
    condition: 'Клиент входит в канал и ждёт',
    url: 'https://phoenixframework.org/blog/the-road-to-2-million-websocket-connections',
  },
  hive: {
    publisher: 'HiveMQ', date: '15 февраля 2023', thumb: 'hive',
    title: 'Achieving 200 Million Concurrent Connections with HiveMQ',
    condition: 'Кластер MQTT · одно сообщение за 40 с на издателя',
    url: 'https://www.hivemq.com/resources/achieving-200-mil-concurrent-connections-with-hivemq/',
  },
  centrifugo: {
    publisher: 'Centrifugo', date: '17 августа 2026', thumb: 'cf-title',
    title: 'Tuning Centrifugo PRO for large number of idle WebSocket connections',
    condition: 'Один узел · клиенты только отвечают на ping',
    url: 'https://centrifugal.dev/blog/2026/08/17/tuning-idle-connections',
  },
} as const;

export const publicationOrder = ['whatsapp', 'phoenix', 'hive', 'centrifugo'] as const;
export type Publication = typeof publicationOrder[number];

export type Passage = {
  at: number;
  capture: keyof typeof captures;
  marks: readonly number[];
  original: string;
  translation: string;
};

export type Reading = {
  source: 'phoenix' | 'centrifugo';
  start: number;
  end: number;
  passages: readonly Passage[];
};

// Local milliseconds from the CapCut in-point. The corresponding WAV starts at 16:31.820.
export const readings: readonly Reading[] = [
  {source: 'phoenix', start: 16420, end: 30860, passages: [
    {at: 16420, capture: 'capacity', marks: [], original: 'the 16GB box',
      translation: 'Phoenix начал с машины с 16 ГБ памяти.'},
    {at: 18680, capture: 'capacity', marks: [0, 1], original: 'around 450k connections · 16GB',
      translation: 'Примерно на 450 тысячах соединений у машины с 16 ГБ закончилась память.'},
    {at: 22800, capture: 'clients', marks: [0], original: 'sleeps for 30000 seconds',
      translation: 'Клиент входил в канал и ждал 30 000 секунд.'},
    {at: 25800, capture: 'broadcast', marks: [], original: 'broadcast time',
      translation: 'Затем замерили время рассылки одного сообщения всем подписчикам.'},
    {at: 27520, capture: 'broadcast', marks: [0, 1], original: '1.3M subscribers · over 5s',
      translation: 'До оптимизации рассылка на 1,3 млн подписчиков занимала больше 5 секунд.'},
  ]},
  {source: 'centrifugo', start: 34240, end: 57480, passages: [
    {at: 34240, capture: 'baseline', marks: [0], original: '200,000 idle connections',
      translation: 'Один узел, 200 тысяч клиентов. Каждые 25 секунд они отвечают на ping.'},
    {at: 37100, capture: 'baseline', marks: [0, 1], original: 'Memory (RSS) · ~5.4 GB',
      translation: 'С настройками по умолчанию процесс занимал около 5,4 ГБ.'},
    {at: 39380, capture: 'million', marks: [0, 1], original: '1,000,000 · Memory (RSS) · ~11.3 GB',
      translation: 'После настройки миллион молчащих соединений занял около 11,3 ГБ памяти процесса.'},
    {at: 43200, capture: 'million', marks: [2], original: 'roughly 4.2 GB',
      translation: 'Ещё около 4,2 ГБ занимали структуры сокетов в ядре. В RSS процесса они не входят.'},
    {at: 45480, capture: 'cpu', marks: [0], original: 'between 2% and 7% CPU',
      translation: 'Первые три настройки экономии памяти по отдельности добавляли от 2 до 7% к нагрузке на CPU.'},
    {at: 49320, capture: 'cpu', marks: [0, 1], original: 'together around 12%',
      translation: 'Вместе эти три настройки добавляли около 12% к нагрузке на CPU.'},
    {at: 51040, capture: 'traffic', marks: [0], original: 'message fan-out and socket writes',
      translation: 'Когда сообщения идут постоянно, нагрузку создают рассылка и запись в сокеты.'},
  ]},
];

export const listedSource = (ms: number): Publication | undefined => {
  if (ms >= 32780) return 'centrifugo';
  if (ms >= 30860) return 'hive';
  if (ms >= 16420) return 'phoenix';
  if (ms >= 12980) return 'whatsapp';
  if (ms >= 9180) return 'hive';
  if (ms >= 5020) return 'phoenix';
  if (ms >= 3950) return 'whatsapp';
};
