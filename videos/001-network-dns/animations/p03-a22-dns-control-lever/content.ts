export type DnsControlLeverFocus = 'database' | 'control' | 'engineering' | 'lever';

export type DnsControlLeverPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: DnsControlLeverFocus;
};

export const dnsControlLeverPhases = [
  {
    id: 'database',
    startMs: 80,
    eyebrow: 'DISTRIBUTED DATABASE / GLOBAL SCALE',
    title: 'DNS — ОДНА ИЗ ПЕРВЫХ ГЛОБАЛЬНЫХ РАСПРЕДЕЛЁННЫХ БАЗ',
    status: 'DNS / DISTRIBUTED DATA / MANY AUTHORITIES',
    accent: 'primary',
    focus: 'database',
  },
  {
    id: 'control',
    startMs: 7_340,
    eyebrow: 'TRAFFIC CONTROL / SYSTEM-WIDE EFFECT',
    title: 'ОДНА ЗАПИСЬ МОЖЕТ ИЗМЕНИТЬ ПУТЬ ЦЕЛОГО ПОТОКА',
    status: 'CONTROL / RECORD → TRAFFIC',
    accent: 'success',
    focus: 'control',
  },
  {
    id: 'engineering',
    startMs: 11_880,
    eyebrow: 'SYSTEM DESIGN / THE USEFUL MODEL',
    title: 'ДЛЯ СЕРЬЁЗНОЙ СИСТЕМЫ DNS — НЕ СПРАВОЧНИК',
    status: 'ENGINEERING / NOT JUST LOOKUP',
    accent: 'signal',
    focus: 'engineering',
  },
  {
    id: 'lever',
    startMs: 15_920,
    eyebrow: 'THE LEVER / SMALL CHANGE, LARGE CONSEQUENCE',
    title: 'DNS — ЭТО РЫЧАГ УПРАВЛЕНИЯ СИСТЕМОЙ',
    status: 'DNS / CONTROL LEVER / ACTIVE',
    accent: 'success',
    focus: 'lever',
  },
] as const satisfies readonly [DnsControlLeverPhase, ...DnsControlLeverPhase[]];

export const dnsControlLeverStage = {
  database: 0,
  control: 1,
  engineering: 2,
  lever: 3,
} as const satisfies Record<DnsControlLeverFocus, number>;

export const authorityReplicas = [
  {label: 'AUTH / EU', detail: 'ZONE REPLICA 01'},
  {label: 'AUTH / US', detail: 'ZONE REPLICA 02'},
  {label: 'AUTH / APAC', detail: 'ZONE REPLICA 03'},
] as const;

export const controlledDestinations = [
  {label: 'EDGE / EU', detail: '198.51.100.10'},
  {label: 'EDGE / US', detail: '203.0.113.42'},
  {label: 'API / PRIMARY', detail: 'ACTIVE'},
  {label: 'API / BACKUP', detail: 'STANDBY'},
] as const;
