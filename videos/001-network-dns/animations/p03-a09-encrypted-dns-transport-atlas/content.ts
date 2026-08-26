export type EncryptedDnsTransportFocus = 'dns' | 'dot' | 'doh' | 'doq' | 'compare';

export type EncryptedDnsTransportPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: EncryptedDnsTransportFocus;
};

export const encryptedDnsTransportPhases = [
  {
    id: 'dns',
    startMs: 120,
    eyebrow: 'SAME APPLICATION MESSAGE / NEW OUTER LAYER',
    title: 'DNS-СООБЩЕНИЕ ПОМЕЩАЮТ В ЗАШИФРОВАННЫЙ ТРАНСПОРТ',
    status: 'DNS MESSAGE / READY TO WRAP',
    accent: 'signal',
    focus: 'dns',
  },
  {
    id: 'dot',
    startMs: 2_400,
    eyebrow: 'DoT / DNS OVER TLS',
    title: 'DoT ПОМЕЩАЕТ DNS В ОТДЕЛЬНЫЙ TLS-КАНАЛ',
    status: 'DNS → TLS → TCP / PORT 853',
    accent: 'primary',
    focus: 'dot',
  },
  {
    id: 'doh',
    startMs: 5_200,
    eyebrow: 'DoH / DNS OVER HTTPS',
    title: 'DoH ДЕЛАЕТ DNS ОБЫЧНЫМ HTTPS-ОБМЕНОМ',
    status: 'DNS → HTTP → TLS / HTTPS',
    accent: 'signal',
    focus: 'doh',
  },
  {
    id: 'doq',
    startMs: 8_500,
    eyebrow: 'DoQ / DNS OVER QUIC',
    title: 'DoQ НЕСЁТ DNS ПРЯМО В ПОТОКЕ QUIC',
    status: 'DNS → QUIC STREAM → UDP / PORT 853',
    accent: 'success',
    focus: 'doq',
  },
  {
    id: 'compare',
    startMs: 11_700,
    eyebrow: 'ONE PURPOSE / THREE TRANSPORTS',
    title: 'ОБОЛОЧКИ РАЗНЫЕ — СМЫСЛ ОДИН: СКРЫТЬ DNS НА ПУТИ',
    status: 'DoT / DoH / DoQ / ENCRYPTED HOP',
    accent: 'success',
    focus: 'compare',
  },
] as const satisfies readonly [EncryptedDnsTransportPhase, ...EncryptedDnsTransportPhase[]];

export const encryptedDnsTransportStage = {
  dns: 0,
  dot: 1,
  doh: 2,
  doq: 3,
  compare: 4,
} as const satisfies Record<EncryptedDnsTransportFocus, number>;

export type DnsTransportLane = {
  readonly id: 'dot' | 'doh' | 'doq';
  readonly shortLabel: 'DoT' | 'DoH' | 'DoQ';
  readonly layers: readonly string[];
  readonly endpoint: string;
  readonly note: string;
  readonly accent: 'primary' | 'signal' | 'success';
};

export const dnsTransportLanes = [
  {id: 'dot', shortLabel: 'DoT', layers: ['DNS', 'TLS', 'TCP'], endpoint: '853', note: 'DEDICATED TLS CHANNEL', accent: 'primary'},
  {id: 'doh', shortLabel: 'DoH', layers: ['DNS', 'HTTP', 'TLS'], endpoint: 'HTTPS', note: 'ONE HTTP EXCHANGE', accent: 'signal'},
  {id: 'doq', shortLabel: 'DoQ', layers: ['DNS', 'QUIC STREAM', 'UDP'], endpoint: '853', note: 'DIRECT QUIC MAPPING', accent: 'success'},
] as const satisfies readonly DnsTransportLane[];
