// Local milliseconds. CapCut 05:14.000 corresponds to 05:06.000 in the recorded WAV.
export type StationId = 'browser' | 'router' | 'carrier' | 'cdn' | 'balancer' | 'ingress' | 'sidecar' | 'server';
export type Station = {
  readonly id: StationId;
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly title: string;
  readonly incoming?: string;
  readonly examples?: {readonly at: number; readonly lines: readonly string[]};
};

export const networkAt = 41220;
export const stations: readonly Station[] = [
  {id: 'browser', at: 160, x: 161, y: 218, title: 'Браузер'},
  {id: 'router', at: 2640, x: 486, y: 218, title: 'Домашний NAT',
    incoming: 'M207 218 H437', examples: {at: 2980, lines: ['Роутер дома или в кафе']}},
  {id: 'carrier', at: 6320, x: 815, y: 218, title: 'NAT оператора',
    incoming: 'M534 218 H766', examples: {at: 6720, lines: ['CGNAT, если есть']}},
  {id: 'cdn', at: 9680, x: 815, y: 423, title: 'CDN',
    incoming: 'M864 218 H936 Q954 218 954 238 V403 Q954 423 934 423 H870',
    examples: {at: 11140, lines: ['Cloudflare · CloudFront']}},
  {id: 'balancer', at: 16750, x: 264, y: 423, title: 'Балансировщик',
    incoming: 'M757 423 H316',
    examples: {at: 20920, lines: ['AWS ALB / NLB · Google Cloud LB', 'Azure Application Gateway']}},
  {id: 'ingress', at: 28050, x: 223, y: 695, title: 'Ingress-контроллер',
    incoming: 'M213 423 H61 Q43 423 43 443 V675 Q43 695 63 695 H173',
    examples: {at: 32120, lines: ['NGINX · Traefik', 'Envoy Gateway']}},
  {id: 'sidecar', at: 36700, x: 567, y: 695, title: 'Sidecar',
    incoming: 'M273 695 H518', examples: {at: 36860, lines: ['Если есть mesh']}},
  {id: 'server', at: 45780, x: 824, y: 695, title: 'Приложение',
    incoming: 'M615 695 H775', examples: {at: 45780, lines: ['WebSocket-сервер']}},
];

export const notes = [
  {at: 0, text: 'Соединение начинается в браузере.'},
  {at: 2640, text: 'Роутер меняет адрес источника.'},
  {at: 6320, text: 'У оператора может быть ещё один NAT.'},
  {at: 9680, text: 'CDN принимает трафик на краю сети.'},
  {at: 16750, text: 'Балансировщик выбирает, куда пойдёт запрос.'},
  {at: 28050, text: 'Ingress направляет запрос к сервису.'},
  {at: 36700, text: 'Sidecar принимает трафик рядом с приложением.'},
] as const;
