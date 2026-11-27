import type {captures} from './captures';
import type {DocumentationCue} from '../../shared/DocumentationScene';

export const pages = {
  chrome: {
    publisher: 'Chrome for Developers', date: '27 марта 2020',
    title: 'WebSocketStream',
    url: 'https://developer.chrome.com/docs/capabilities/web-apis/websocketstream#backpressure',
  },
  mdn: {
    publisher: 'MDN Web Docs', date: '9 мая 2026',
    title: 'WebSocketStream',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocketStream',
  },
  whatwg: {
    publisher: 'WHATWG · GitHub API', date: '14 июля 2023',
    title: 'The WebSocketStream Interface #48',
    url: 'https://github.com/whatwg/websockets/pull/48',
  },
} as const;

type Cue = DocumentationCue<keyof typeof captures>;

// CapCut 18:13.060 = source WAV 17:57.060 + the four chapter dividers.
export const cues: readonly [Cue, ...Cue[]] = [
  {at: 0, page: 'chrome', marks: [], original: 'Backpressure',
    translation: 'WebSocketStream даёт приложению поток для чтения и поток для записи.'},
  {at: 3820, page: 'chrome', marks: [0, 1, 2], original: 'the pipeline is ready · WritableStreamDefaultWriter.write()',
    translation: 'Чтение ждёт готовности обработчика, запись — готовности исходящего потока.'},
  {at: 7000, page: 'mdn', marks: [], original: 'Experimental · Non-standard',
    translation: 'MDN помечает API как экспериментальный и нестандартный.'},
  {at: 8040, page: 'mdn', marks: [0, 1], original: 'Experimental · Non-standard',
    translation: 'MDN помечает API как экспериментальный и нестандартный.'},
  {at: 11220, page: 'whatwg', marks: [0, 1], original: '"state": "open"',
    translation: 'Предложение открыли 14 июля 2023 года. Оно всё ещё на рассмотрении.'},
];
