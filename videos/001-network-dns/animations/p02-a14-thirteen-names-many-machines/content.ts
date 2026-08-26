export type RootFleetFocus = 'identity' | 'fanout' | 'fleet' | 'scale' | 'teaser';

export type RootFleetPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: RootFleetFocus;
};

export const rootFleetPhases = [
  {
    id: 'identity',
    startMs: 120,
    eyebrow: 'LOGICAL IDENTITY / PHYSICAL FLEET',
    title: 'ОДНО ИМЯ — НЕ ОДНА МАШИНА',
    status: 'ROOT IDENTITY ≠ PHYSICAL SERVER',
    accent: 'signal',
    focus: 'identity',
  },
  {
    id: 'fanout',
    startMs: 2_180,
    eyebrow: 'REPLICATION / ONE-TO-MANY',
    title: 'ДАННЫЕ КОПИРУЮТСЯ НА МНОЖЕСТВО ИНСТАНСОВ',
    status: 'ONE ID → MANY SERVING LOCATIONS',
    accent: 'primary',
    focus: 'fanout',
  },
  {
    id: 'fleet',
    startMs: 4_520,
    eyebrow: '13 IDENTITIES / DISTRIBUTED FLEET',
    title: 'ЗА A–M СТОИТ ФИЗИЧЕСКАЯ СЕТЬ',
    status: 'A…M / REPLICATED WORLDWIDE',
    accent: 'primary',
    focus: 'fleet',
  },
  {
    id: 'scale',
    startMs: 7_200,
    eyebrow: 'ROOT SERVER SYSTEM / REAL SCALE',
    title: '13 ИМЁН ПРЕВРАЩАЮТСЯ В 2000+ СЕРВЕРОВ',
    status: '13 RSI / 12 OPERATORS / 2000+ INSTANCES',
    accent: 'success',
    focus: 'scale',
  },
  {
    id: 'teaser',
    startMs: 9_760,
    eyebrow: 'MYTH / TO BE CONTINUED',
    title: '«КОРНЕВЫХ СЕРВЕРОВ ВСЕГО 13» — ЭТО МИФ',
    status: 'LOGICAL COUNT ≠ MACHINE COUNT',
    accent: 'signal',
    focus: 'teaser',
  },
] as const satisfies readonly RootFleetPhase[];
