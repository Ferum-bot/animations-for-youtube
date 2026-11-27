import type {DocumentationCue} from '../../shared/DocumentationScene';
import type {captures} from './captures';

type Page = keyof typeof captures;

export const pages = {
  overview: {
    publisher: 'Chrome for Developers', date: '27 марта 2020',
    title: 'Backpressure в WebSocket API',
    url: 'https://developer.chrome.com/docs/capabilities/web-apis/websocketstream#the_problem_with_the_current_websocket_api',
  },
  send: {
    publisher: 'MDN Web Docs', date: '23 июня 2025',
    title: 'WebSocket: send() method',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send',
  },
  buffer: {
    publisher: 'WHATWG · WebSockets', date: '12 ноября 2026',
    title: 'socket.bufferedAmount',
    url: 'https://websockets.spec.whatwg.org/#dom-websocket-bufferedamount',
  },
  incoming: {
    publisher: 'WHATWG · WebSockets', date: '12 ноября 2026',
    title: '§ 4. Feedback from the protocol',
    url: 'https://websockets.spec.whatwg.org/#feedback-from-the-protocol',
  },
} as const satisfies Record<Page, {publisher: string; date: string; title: string; url: string}>;

type Cue = DocumentationCue<Page>;

// Local milliseconds from CapCut 17:45.940 (source WAV 17:29.940).
export const cues: readonly [Cue, ...Cue[]] = [
  {at: 0, page: 'overview', marks: [],
    original: 'The Problem with the current WebSocket API',
    translation: 'Как браузерное приложение управляет потоком сообщений?'},
  {at: 2760, page: 'overview', marks: [0],
    original: 'Applying backpressure to received messages is impossible',
    translation: 'В обычном WebSocket API приложение не может попросить браузер замедлить приём.'},
  {at: 8640, page: 'send', marks: [0],
    original: 'enqueues the specified data',
    translation: 'На открытом соединении send() ставит данные в очередь на отправку.'},
  {at: 13100, page: 'buffer', marks: [0, 1],
    original: 'number of bytes of application data',
    translation: 'bufferedAmount показывает, сколько байт из очереди send() ещё ждут отправки в сеть.'},
  {at: 16040, page: 'buffer', marks: [2],
    original: 'buffering done by the operating system',
    translation: 'Буферы операционной системы в bufferedAmount не входят.'},
  {at: 18420, page: 'incoming', marks: [0],
    original: 'a WebSocket message has been received',
    translation: 'На приёме браузер передаёт приложению целое сообщение WebSocket.'},
  {at: 22260, page: 'incoming', marks: [1],
    original: 'queue a task',
    translation: 'Браузер ставит задачу в очередь, чтобы вызвать обработчик события message.'},
];
