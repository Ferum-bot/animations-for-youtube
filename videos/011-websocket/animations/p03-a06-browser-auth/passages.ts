export type Passage = {
  start: number; title: string; tab: string; code: readonly string[];
  cues: ReadonlyArray<{at: number; rows: readonly number[]}>;
  source: string; date: string; url: string; asset: string;
  note: readonly string[];
};

export const passages: readonly Passage[] = [
  {
    start: 0, title: 'Конструктор WebSocket', tab: 'JavaScript · браузер',
    code: ['const socket = new WebSocket(', '  "wss://api.example/socket",', '  ["graphql-transport-ws"]', ');'],
    cues: [{at: 0, rows: [0]}, {at: 3200, rows: [1,2]}],
    source: 'WHATWG · WebSockets Standard', date: '12.11.2026', url: 'https://websockets.spec.whatwg.org/#the-websocket-interface', asset: 'spec',
    note: ['Конструктор принимает URL и подпротоколы.', 'Параметра для заголовка Authorization нет.'],
  },
  {
    start: 11000, title: 'Cookie сессии', tab: 'HTTP · фрагмент рукопожатия',
    code: ['GET /socket HTTP/1.1', 'Host: api.example', 'Upgrade: websocket', 'Origin: https://app.example', 'Cookie: session=<session-id>'],
    cues: [{at: 11000, rows: [4]}, {at: 13500, rows: [3]}],
    source: 'OWASP · WebSocket Security Cheat Sheet', date: 'просмотрено 27.11.2026',
    url: 'https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html#origin-header-validation', asset: 'cookie',
    note: ['Браузер сам отправляет подходящие cookie.', 'Сервер сверяет Origin со списком разрешённых.'],
  },
  {
    start: 18200, title: 'Токен в URL', tab: 'JavaScript · пример',
    code: ['const url = new URL(', '  "wss://api.example/socket"', ');', 'url.searchParams.set("token", token);', 'const socket = new WebSocket(url);'],
    cues: [{at: 18200, rows: [3]}, {at: 20840, rows: [3,4]}],
    source: 'OWASP · WebSocket Security Cheat Sheet', date: 'просмотрено 27.11.2026',
    url: 'https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html', asset: 'query',
    note: ['URL запроса может попасть в журналы', 'прокси и балансировщика вместе с токеном.'],
  },
  {
    start: 25240, title: 'Список подпротоколов', tab: 'JavaScript · по реализации Kubernetes',
    code: ['const protocols = [', '  "base64.binary.k8s.io",', '  "base64url.bearer.authorization.k8s.io."', '    + encodedToken,', '];', 'new WebSocket(url, protocols);'],
    cues: [{at: 25240, rows: [0,5]}, {at: 28480, rows: [2,3]}, {at: 33700, rows: [5]}],
    source: 'Kubernetes · protocol.go', date: 'просмотрено 27.11.2026',
    url: 'https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/authentication/request/websocket/protocol.go#L31-L33', asset: 'protocol',
    note: ['Браузер формирует Sec-WebSocket-Protocol.', 'Если заголовок записать в лог, туда попадёт токен.'],
  },
  {
    start: 35880, title: 'Первое сообщение', tab: 'JavaScript · пример для graphql-ws',
    code: ['socket.onopen = () => socket.send(', '  JSON.stringify({', '    type: "connection_init",', '    payload: { token }', '  })', ');'],
    cues: [{at: 35880, rows: [2,3]}],
    source: 'graphql-ws · PROTOCOL.md', date: 'просмотрено 27.11.2026',
    url: 'https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md#connectioninit', asset: 'message',
    note: ['Клиент отправляет токен после открытия сокета.', 'Содержимое payload согласуется с сервером.'],
  },
  {
    start: 39340, title: 'Короткоживущий тикет', tab: 'JavaScript · пример клиента',
    code: ['const res = await fetch("/ws-ticket",', '  { method: "POST" });', 'const { ticket } = await res.json();', 'const socket = new WebSocket(url);', 'socket.onopen = () => socket.send(ticket);'],
    cues: [{at: 39340, rows: [0,2]}, {at: 43220, rows: [4]}],
    source: 'Heroku Dev Center · WebSocket Security', date: '12.02.2025',
    url: 'https://devcenter.heroku.com/articles/websocket-security#authentication-authorization', asset: 'ticket',
    note: ['HTTP выдаёт разовый тикет с коротким сроком.', 'Сервер проверяет срок и погашает тикет.'],
  },
];

export const overview = [
  ['Cookie сессии', 'Cookie'],
  ['Параметр в адресе', '?token=…'],
  ['Подпротокол', 'Sec-WebSocket-Protocol'],
  ['Первое сообщение', 'connection_init'],
  ['Разовый тикет', 'HTTP → WebSocket'],
] as const;
