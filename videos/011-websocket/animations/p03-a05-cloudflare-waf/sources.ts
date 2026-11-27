export type Source = {
  readonly id: string;
  readonly publisher: string;
  readonly title: string;
  readonly date: string;
  readonly url: string;
  readonly quote: string;
  readonly translation: string;
  readonly mentionMs: number;
};

export const clouds: readonly Source[] = [
  {
    id: 'cloudflare', publisher: 'Cloudflare', title: 'WebSockets', date: '14.08.2026',
    url: 'https://developers.cloudflare.com/network/websockets/#compatibility-notes',
    quote: 'WAF managed rules, custom rules, rate limiting rules',
    translation: 'Правила WAF применяются к запросу на Upgrade.', mentionMs: 2040,
  },
  {
    id: 'google', publisher: 'Google Cloud Armor', title: 'Security policy overview', date: '18.11.2026',
    url: 'https://docs.cloud.google.com/armor/docs/security-policy-overview',
    quote: "Cloud Armor doesn't evaluate any messages after the first request",
    translation: 'После первого запроса сообщения не проверяются.', mentionMs: 2850,
  },
  {
    id: 'akamai', publisher: 'Akamai', title: 'WebSockets', date: '10.11.2026',
    url: 'https://techdocs.akamai.com/property-mgr/docs/websockets-support',
    quote: 'the proxy is not aware of WebSocket frames',
    translation: 'Прокси Akamai не разбирает кадры WebSocket.', mentionMs: 4500,
  },
  {
    id: 'azure', publisher: 'Azure Application Gateway', title: 'WebSocket support in Azure Application Gateway', date: '22.06.2026',
    url: 'https://learn.microsoft.com/en-us/azure/application-gateway/application-gateway-websocket',
    quote: "doesn't perform any inspections on such data",
    translation: 'После Upgrade шлюз передаёт данные без проверки WAF.', mentionMs: 5300,
  },
  {
    id: 'aws', publisher: 'AWS WAF', title: 'How AWS WAF works', date: 'просмотрено 27.11.2026',
    url: 'https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works.html',
    quote: 'respond to HTTP(S) web requests',
    translation: 'AWS описывает HTTP(S)-запросы. Проверка кадров не указана.', mentionMs: 5860,
  },
];

export const inspectors: readonly Source[] = [
  {
    id: 'f5', publisher: 'F5 BIG-IP', title: 'Securing Applications That Use WebSocket', date: '07.07.2026',
    url: 'https://techdocs.f5.com/en-us/bigip-17-5-0/big-ip-asm-implementations/securing-applications-that-use-websocket.html',
    quote: 'more frames than the WebSocket URL allows',
    translation: 'Можно ограничить число кадров в сообщении.', mentionMs: 10380,
  },
  {
    id: 'fortiweb', publisher: 'Fortinet · FortiWeb', title: 'FortiWeb 7.6.1 CLI Reference · с. 703', date: '28.12.2024',
    url: 'https://fortinetweb.s3.amazonaws.com/docs.fortinet.com/v2/attachments/77ddc324-a3b6-11ef-a705-1222899fa4e9/fortiweb-v7.6.1-cli-reference.pdf#page=703',
    quote: 'detect attack in WebSocket message body',
    translation: 'Можно включить поиск сигнатур в теле сообщения.', mentionMs: 10780,
  },
  {
    id: 'kong', publisher: 'Kong Enterprise', title: 'WebSocket Validator', date: 'просмотрено 27.11.2026',
    url: 'https://developer.konghq.com/plugins/websocket-validator/',
    quote: 'Validate individual WebSocket messages against a user-specified schema',
    translation: 'Плагин проверяет отдельные сообщения по заданной схеме.', mentionMs: 11400,
  },
];
