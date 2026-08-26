export type PacketStackLayer = 'application' | 'socket' | 'transport' | 'network' | 'link' | 'wire';

export type PacketStackPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly activeLayer: PacketStackLayer;
  readonly envelopeDepth: 0 | 1 | 2 | 3;
};

export const packetStackPhases = [
  {
    id: 'setup',
    startMs: 120,
    eyebrow: 'SAME QUERY / DIFFERENT PROJECTION',
    title: 'ТОТ ЖЕ ЗАПРОС — ВНИЗ ПО СТЕКУ',
    status: 'APPLICATION → WIRE',
    accent: 'primary',
    activeLayer: 'application',
    envelopeDepth: 0,
  },
  {
    id: 'dns-message',
    startMs: 7_100,
    eyebrow: 'APPLICATION LAYER / DNS',
    title: 'СНАЧАЛА ЭТО DNS-СООБЩЕНИЕ',
    status: 'DNS MESSAGE / CREATED',
    accent: 'primary',
    activeLayer: 'application',
    envelopeDepth: 0,
  },
  {
    id: 'header',
    startMs: 11_060,
    eyebrow: 'DNS HEADER / CORRELATION',
    title: 'HEADER СВЯЗЫВАЕТ ВОПРОС И ОТВЕТ',
    status: 'TXID 0x4A31 / FLAGS 0x0100',
    accent: 'primary',
    activeLayer: 'application',
    envelopeDepth: 0,
  },
  {
    id: 'question',
    startMs: 14_000,
    eyebrow: 'QUESTION SECTION / QNAME + QTYPE',
    title: 'ВНУТРИ — ИМЯ И ТИП ЗАПИСИ',
    status: 'NOISE.KS.CHICAGO.EDU. / A / IN',
    accent: 'primary',
    activeLayer: 'application',
    envelopeDepth: 0,
  },
  {
    id: 'socket',
    startMs: 17_400,
    eyebrow: 'SOCKET / API BOUNDARY',
    title: 'ПРОЦЕСС ПЕРЕДАЁТ БАЙТЫ ОС',
    status: 'SENDTO() / UDP SOCKET',
    accent: 'signal',
    activeLayer: 'socket',
    envelopeDepth: 0,
  },
  {
    id: 'udp',
    startMs: 19_240,
    eyebrow: 'TRANSPORT / UDP',
    title: 'UDP ДОБАВЛЯЕТ ПОРТЫ И 8 БАЙТ',
    status: 'SRC 49152 → DST 53 / HEADER 8 B',
    accent: 'signal',
    activeLayer: 'transport',
    envelopeDepth: 1,
  },
  {
    id: 'ip',
    startMs: 24_840,
    eyebrow: 'NETWORK / IPv4',
    title: 'IP ДОБАВЛЯЕТ АДРЕСА И 20 БАЙТ',
    status: 'IPv4 MIN HEADER / 20 B',
    accent: 'success',
    activeLayer: 'network',
    envelopeDepth: 2,
  },
  {
    id: 'wire',
    startMs: 30_820,
    eyebrow: 'LINK → WIRE',
    title: 'ОДИН ПАКЕТ УХОДИТ. ОДИН ВОЗВРАЩАЕТСЯ.',
    status: 'FRAME / OUTBOUND + INBOUND',
    accent: 'success',
    activeLayer: 'wire',
    envelopeDepth: 3,
  },
] as const satisfies readonly PacketStackPhase[];

export const packetStackLayers = [
  {id: 'application', short: 'L7', label: 'APPLICATION', detail: 'DNS MESSAGE'},
  {id: 'socket', short: 'API', label: 'SOCKET', detail: 'PROCESS → KERNEL'},
  {id: 'transport', short: 'L4', label: 'TRANSPORT', detail: 'UDP / 8 B'},
  {id: 'network', short: 'L3', label: 'NETWORK', detail: 'IPv4 / 20 B'},
  {id: 'link', short: 'L2', label: 'LINK', detail: 'ETHERNET FRAME'},
  {id: 'wire', short: 'PHY', label: 'WIRE', detail: 'BITS ON MEDIUM'},
] as const satisfies readonly {
  readonly id: PacketStackLayer;
  readonly short: string;
  readonly label: string;
  readonly detail: string;
}[];
