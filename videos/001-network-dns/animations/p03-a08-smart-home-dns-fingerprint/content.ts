export type SmartHomeFingerprintFocus = 'home' | 'queries' | 'identify' | 'activity';

export type SmartHomeFingerprintPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: SmartHomeFingerprintFocus;
};

export const smartHomeFingerprintPhases = [
  {
    id: 'home',
    startMs: 120,
    eyebrow: 'SMART HOME / FAMILIAR DEVICES',
    title: 'КАМЕРА, ТЕЛЕВИЗОР И КОЛОНКА — В ОДНОЙ ДОМАШНЕЙ СЕТИ',
    status: 'CAMERA / TV / SPEAKER',
    accent: 'primary',
    focus: 'home',
  },
  {
    id: 'queries',
    startMs: 2_600,
    eyebrow: 'PASSIVE OBSERVER / DNS METADATA',
    title: 'КАЖДОЕ УСТРОЙСТВО ОСТАВЛЯЕТ СВОЙ DNS-СЛЕД',
    status: 'DEVICE → DOMAIN QUERIES',
    accent: 'signal',
    focus: 'queries',
  },
  {
    id: 'identify',
    startMs: 5_200,
    eyebrow: 'DOMAIN PATTERN / DEVICE CLASS',
    title: 'ПО ИМЕНАМ СЕРВИСОВ МОЖНО УЗНАТЬ ТИП УСТРОЙСТВА',
    status: 'DNS TRACE → DEVICE IDENTITY',
    accent: 'primary',
    focus: 'identify',
  },
  {
    id: 'activity',
    startMs: 7_600,
    eyebrow: 'QUERY RHYTHM / ACTIVITY INFERENCE',
    title: 'А РИТМ ЗАПРОСОВ ВЫДАЁТ АКТИВНОСТЬ ДОМА',
    status: 'PATTERN → PRESENCE LIKELY',
    accent: 'success',
    focus: 'activity',
  },
] as const satisfies readonly [SmartHomeFingerprintPhase, ...SmartHomeFingerprintPhase[]];

export const smartHomeFingerprintStage = {
  home: 0,
  queries: 1,
  identify: 2,
  activity: 3,
} as const satisfies Record<SmartHomeFingerprintFocus, number>;

export type SmartHomeDevice = {
  readonly id: 'camera' | 'television' | 'speaker';
  readonly label: string;
  readonly domain: string;
  readonly x: number;
  readonly y: number;
};

export const smartHomeDevices = [
  {id: 'camera', label: 'КАМЕРА', domain: 'camera-cloud.example', x: 82, y: 88},
  {id: 'television', label: 'ТЕЛЕВИЗОР', domain: 'tv-updates.example', x: 252, y: 208},
  {id: 'speaker', label: 'КОЛОНКА', domain: 'voice-service.example', x: 104, y: 246},
] as const satisfies readonly SmartHomeDevice[];
