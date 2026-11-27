// Local time from 08:36.000 WAV / 08:44.000 CapCut.
export const cue = {
  get: 1060,
  upgrade: 3560,
  connection: 4470,
  received: 8020,
  hopOnly: 9260,
  remove: 13140,
  unconfigured: 15260,
  plainGet: 17500,
  httpResponse: 20500,
  failed: 24660,
  configured: 26960,
  addHeaders: 29900,
  switching: 32340,
  tunnel: 34940,
  bytes: 36920,
  conclusion: 43900,
} as const;

type Note = {readonly at: number; readonly lines: readonly string[]};
export const notes: readonly Note[] = [
  {at: 0, lines: ['Браузер просит переключиться', 'с HTTP на WebSocket.']},
  {at: cue.received, lines: ['HTTP-прокси получает запрос.']},
  {at: cue.hopOnly, lines: ['Connection и Upgrade действуют', 'только до ближайшего HTTP-прокси.']},
  {at: cue.remove, lines: ['Прокси убирает эти заголовки', 'перед пересылкой запроса.']},
  {at: cue.unconfigured, lines: ['Прокси не настроен на WebSocket.']},
  {at: cue.plainGet, lines: ['К серверу уходит обычный GET', 'без запроса на смену протокола.']},
  {at: cue.httpResponse, lines: ['Сервер может ответить 200 или 400.', 'Браузер ожидает 101.']},
  {at: cue.failed, lines: ['Рукопожатие не удалось.']},
  {at: cue.configured, lines: ['Прокси настроен на WebSocket.', 'Он сам просит сервер сменить протокол.']},
  {at: cue.addHeaders, lines: ['Для второго участка прокси', 'выставляет свои Upgrade и Connection.']},
  {at: cue.switching, lines: ['Сервер подтверждает смену протокола.']},
  {at: cue.tunnel, lines: ['Прокси переходит в режим туннеля.']},
  {at: cue.bytes, lines: ['Теперь байты идут в обе стороны.']},
];

// The spoken conclusion, with the HTTP qualifier from topic 8, §1.12.
type Phrase = {readonly at: number; readonly text: string; readonly accent?: boolean};
export const conclusion: readonly (readonly Phrase[])[] = [
  [
    {at: cue.conclusion, text: 'Каждое звено,'},
    {at: cue.conclusion, text: 'которое читает HTTP,'},
    {at: 45120, text: 'заново решает,'},
    {at: 46200, text: 'делать ли апгрейд.', accent: true},
  ],
  [
    {at: 47980, text: 'Нет никакой'},
    {at: 48370, text: '«сквозной трубы».', accent: true},
  ],
  [
    {at: 49540, text: 'Есть цепочка участков,'},
    {at: 50920, text: 'каждый из которых'},
    {at: 51500, text: 'договаривается сам.', accent: true},
  ],
];
