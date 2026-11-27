import type {captures} from './captures';

export const publications = {
  jetty: {
    source: 'Jetty · GitHub #6696', date: '5 сентября 2021', thumb: 'results',
    title: 'High WebSocket memory usage in Jetty 10',
    url: 'https://github.com/jetty/jetty.project/issues/6696',
  },
  socket: {
    source: 'Socket.IO · документация 4.x', date: '9 октября 2026', thumb: 'socket',
    title: 'Memory usage', url: 'https://socket.io/docs/v4/memory-usage/',
  },
  go: {
    source: 'Go · GitHub #42035', date: '17 октября 2020', thumb: 'go',
    title: 'crypto/tls: outBuf of Conn costs too much memory for large number of idle connections',
    url: 'https://github.com/golang/go/issues/42035',
  },
  mail: {
    source: 'Сергей Камардин · Mail.Ru / freeCodeCamp', date: '2 августа 2017', thumb: 'cost',
    title: 'A Million WebSockets and Go',
    url: 'https://www.freecodecamp.org/news/million-websockets-and-go-cc58418460bb/',
  },
} as const;

type Passage = {
  at: number; publication: keyof typeof publications; capture: keyof typeof captures;
  mark: number; original: string; translation: string;
};

// Local milliseconds from the CapCut in-point 16:03.840 (source WAV 15:47.840).
export const passages: readonly Passage[] = [
  {at: 3800, publication: 'jetty', capture: 'request', mark: 0,
    original: 'the biggest memory consumer is the baseRequest',
    translation: 'Больше всего памяти занимал исходный запрос baseRequest.'},
  {at: 9300, publication: 'jetty', capture: 'results', mark: 0,
    original: 'Xmx1G · 10k connections',
    translation: 'Куча 1 ГБ. Цель теста — 10 000 соединений.'},
  {at: 10720, publication: 'jetty', capture: 'results', mark: 1,
    original: 'out of memory error after reaching ~9k connections',
    translation: 'Примерно на 9 000 соединений у Jetty 10 закончилась память.'},
  {at: 13200, publication: 'jetty', capture: 'results', mark: 2,
    original: 'the memory usage does not increase much',
    translation: 'В том же тесте у Jetty 9 потребление памяти почти не росло.'},
  {at: 15960, publication: 'socket', capture: 'socket', mark: 0,
    original: 'the first HTTP request of each session is kept in memory',
    translation: 'Socket.IO сохраняет в памяти ссылку на первый HTTP-запрос каждой сессии.'},
  {at: 19280, publication: 'socket', capture: 'socket', mark: 1,
    original: 'This reference is needed when working with express-session',
    translation: 'Эта ссылка нужна при работе с express-session.'},
  {at: 21160, publication: 'go', capture: 'go', mark: 0,
    original: 'tlsConn.outBuf(16KB + some extra bytes)',
    translation: 'Буфер отправки TLS занимал 16 КБ с небольшим на соединение.'},
  {at: 26620, publication: 'go', capture: 'go', mark: 1,
    original: 'Most of the connections are idle',
    translation: 'Большинство соединений простаивало.'},
  {at: 28480, publication: 'go', capture: 'go', mark: 2,
    original: '≈ 1.6 GB',
    translation: 'По расчёту автора, на 100 000 соединений выходило около 1,6 ГБ.'},
  {at: 30660, publication: 'go', capture: 'go', mark: 3,
    original: 'which can cause the process to OOM',
    translation: 'Из-за этого процесс мог исчерпать память.'},
  {at: 32780, publication: 'mail', capture: 'cost', mark: 1,
    original: 'a total of 72 GB of memory',
    translation: 'В расчёте для трёх миллионов соединений суммарно выходило 72 ГБ.'},
  {at: 37280, publication: 'mail', capture: 'cost', mark: 0,
    original: 'another 24 GB of memory for 3 million connections',
    translation: 'Из них 24 ГБ приходилось на буферы HTTP.'},
  {at: 38920, publication: 'mail', capture: 'upgrade', mark: 2,
    original: 'I/O buffers together with the TCP connection',
    translation: 'После Upgrade сервер получал TCP-соединение вместе с буферами ввода-вывода.'},
];
