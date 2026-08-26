export type RecordTypePhaseId = 'address' | 'authority' | 'alias' | 'mail' | 'text' | 'catalog';

export type RecordTypePhase = {
  readonly id: RecordTypePhaseId;
  readonly startMs: number;
  readonly typeLabel: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly definition: string;
  readonly record: string;
  readonly recordExplanation: string;
  readonly accent: 'primary' | 'signal' | 'success';
};

export const recordTypePhases = [
  {
    id: 'address',
    startMs: 120,
    typeLabel: 'A / AAAA',
    eyebrow: 'ADDRESS RECORDS / IPv4 + IPv6',
    title: 'ИМЯ ПОЛУЧАЕТ СЕТЕВОЙ АДРЕС',
    definition: 'A — IPv4  ·  AAAA — IPv6',
    record: 'noise.ks.chicago.edu.  300  IN  A  192.0.2.42',
    recordExplanation: 'Имя noise.ks.chicago.edu. получает IPv4-адрес 192.0.2.42. TTL записи — 300 секунд.',
    accent: 'primary',
  },
  {
    id: 'authority',
    startMs: 7_000,
    typeLabel: 'NS',
    eyebrow: 'NAME SERVER / DELEGATION',
    title: 'NS УКАЗЫВАЕТ, КТО АВТОРИТЕТЕН',
    definition: 'ЗОНА → АВТОРИТЕТНЫЙ СЕРВЕР',
    record: 'ks.chicago.edu.  300  IN  NS  ns1.ks.chicago.edu.',
    recordExplanation: 'Зона ks.chicago.edu. указывает на свой авторитетный сервер ns1.ks.chicago.edu.',
    accent: 'signal',
  },
  {
    id: 'alias',
    startMs: 11_620,
    typeLabel: 'CNAME',
    eyebrow: 'CANONICAL NAME / ALIAS',
    title: 'ПСЕВДОНИМ ВЕДЁТ К ДРУГОМУ ИМЕНИ',
    definition: 'АЛИАС → КАНОНИЧЕСКОЕ ИМЯ',
    record: 'www.example.com.  300  IN  CNAME  edge.example.net.',
    recordExplanation: 'www.example.com. становится псевдонимом. Адрес нужно искать уже для edge.example.net.',
    accent: 'success',
  },
  {
    id: 'mail',
    startMs: 17_340,
    typeLabel: 'MX',
    eyebrow: 'MAIL EXCHANGE / PRIORITY',
    title: 'MX НАПРАВЛЯЕТ ПОЧТУ ДОМЕНА',
    definition: 'ПРИОРИТЕТ 10 → MAIL SERVER',
    record: 'example.com.  300  IN  MX  10 mail.example.com.',
    recordExplanation: 'Чем меньше число, тем выше приоритет. Здесь почту домена принимает mail.example.com.',
    accent: 'signal',
  },
  {
    id: 'text',
    startMs: 19_540,
    typeLabel: 'TXT',
    eyebrow: 'TEXT / MACHINE READABLE DATA',
    title: 'TXT ХРАНИТ ПОЛИТИКИ И ПРОВЕРКИ',
    definition: 'SPF · DKIM · DOMAIN VERIFICATION',
    record: 'example.com.  300  IN  TXT  "v=spf1 include:_spf…"',
    recordExplanation: 'Текстовое значение публикует SPF-политику домена; DNS возвращает его без интерпретации.',
    accent: 'success',
  },
  {
    id: 'catalog',
    startMs: 28_500,
    typeLabel: '40+',
    eyebrow: 'RECORD TYPE CATALOG / EXTENSIBLE',
    title: 'ЭТО ТОЛЬКО БАЗОВЫЕ ТИПЫ',
    definition: 'SRV · CAA · NAPTR · TLSA · SVCB · HTTPS',
    record: 'example.com.  300  IN  HTTPS  1 . alpn="h2,h3"',
    recordExplanation: 'Новые типы расширяют контракт DNS: здесь HTTPS-запись сообщает параметры подключения.',
    accent: 'primary',
  },
] as const satisfies readonly RecordTypePhase[];
