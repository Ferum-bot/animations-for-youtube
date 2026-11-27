// «WebSocket_в_проде_все_материалы.md», тема 2, §5. Original order;
// long qualifications are shortened for the three on-screen columns.
export type TimerRow = readonly [service: string, idle: string, lifetime: string];
export const timers: readonly TimerRow[] = [
  ['nginx · proxy_read_timeout', '60 с', 'нет'],
  ['nginx stream (L4)', '10 мин', 'нет'],
  ['HAProxy', 'timeout tunnel', 'нет'],
  ['Envoy', '1 ч соединение\n5 мин поток', 'по умолчанию\nвыключен'],
  ['Traefik', '60 с на чтение', 'нет'],
  ['AWS ALB', '60 с', 'для WebSocket\nне указан'],
  ['AWS NLB, TCP', '350 с', 'нет'],
  ['AWS NLB, TLS', '350 с', 'нет'],
  ['AWS NAT Gateway', '350 с', 'нет'],
  ['AWS Global Accelerator', '340 с', 'нет'],
  ['AWS CloudFront', '10 мин', 'нет'],
  ['AWS API Gateway WebSocket', '10 мин', '2 ч'],
  ['EC2 Nitro v6 · таблица\nсоединений сетевой карты', '350 с', 'нет'],
  ['Google Cloud Application LB', '30 с', '24 ч у глобального'],
  ['Google Cloud NAT', '20 мин', 'нет'],
  ['Google Cloud Run', '—', '5–60 мин\nтаймаут запроса'],
  ['Azure Load Balancer', '4 мин', 'нет'],
  ['Azure Application Gateway', '20 с', 'нет'],
  ['Azure Front Door', '5 мин', '2 ч'],
  ['Cloudflare', 'число не указано', 'обрыв при\nвыкладках'],
  ['Heroku', '55 с', 'нет'],
  ['Vercel Functions', '—', '300 с Hobby\n800 с Pro'],
  ['Ядро Linux, conntrack', '5 суток', 'нет'],
  ['kube-proxy, conntrack', '24 ч', 'нет'],
  ['Стандарт NAT (RFC 5382)', 'не менее 2 ч 4 мин', 'нет'],
  ['NAT мобильных операторов', '2–30 мин', 'нет'],
];

// Тема 2, §10 «Найти звено по числу секунд». Тема 8 explicitly
// advises against showing 100 seconds as a documented Cloudflare timeout.
export type Clue = readonly [interval: string, candidate: string];
export const clues: readonly Clue[] = [
  ['15 с', 'Таймер маршрута Envoy и Envoy Gateway'],
  ['20 с', 'Azure Application Gateway'],
  ['30 с', 'Google Cloud LB (для простаивающих),\nClassic LB — для любых'],
  ['55 с', 'Heroku'],
  ['60 с', 'nginx и всё на нём (ingress-nginx, Kong),\nAWS ALB, Traefik, Phoenix'],
  ['240 с', 'Перезагрузка ingress-nginx'],
  ['4 мин', 'Azure Load Balancer'],
  ['5 мин', 'Azure Front Door, поток в Envoy,\nCloud Run по умолчанию'],
  ['340–350 с', 'AWS Global Accelerator, NLB, NAT Gateway,\nEC2 Nitro v6'],
  ['10 мин', 'AWS API Gateway, CloudFront, nginx stream'],
  ['около 15 мин', 'Повторы отправки в ядре Linux'],
  ['20 мин', 'Google Cloud NAT'],
  ['1 ч', 'Envoy'],
  ['2 ч', 'AWS API Gateway, Azure Front Door —\nтаймер жизни'],
  ['2 ч 11 мин', 'TCP keepalive Linux по умолчанию'],
  ['24 ч', 'Google Global LB — таймер жизни'],
];
