type Report = {
  publisher: string; date: string; title: string; url: string; image: string;
  description: string; at: number;
};

const memory = 'assets/011-websocket/memory/incidents';
const january = 'https://discordstatus.com/incidents/rdzvjlyq54z1';

export const discordEpisodes = [
  {date:'03.2017', title:'Connectivity Issues', url:'https://discordstatus.com/incidents/dj3l6lw926kl'},
  {date:'01.2019', title:'Connection & Sending Messages Impacted', url:january},
  {date:'05.2019', title:'Disconnects/Slow Message Sends', url:'https://discordstatus.com/incidents/kz4ky0cydym1'},
  {date:'03.2026', title:'Behind the Scenes of the 3/25/26 Voice Outage', url:'https://discord.com/blog/behind-the-scenes-of-the-3-25-26-voice-outage'},
] as const;

// Local cues from the company names in the source WAV, starting at 18:38.000.
export const reports: readonly Report[] = [
  {publisher:'Discord Status', date:'02.01.2019', title:'Connection & Sending Messages Impacted',
    url:january, image:'assets/011-websocket/reconnect/discord-page.webp',
    description:'Нехватка памяти на узлах шлюза', at:480},
  {publisher:'Twitch Engineering', date:'05.07.2016', title:'Go’s march to low-latency GC',
    url:'https://blog.twitch.tv/en/2016/07/05/gos-march-to-low-latency-gc-a6fa96f06eb7/', image:memory+'/twitch.webp',
    description:'Сборка мусора останавливала чат на десятки секунд', at:3990},
  {publisher:'Cloudflare · workerd #8477', date:'15.11.2026',
    title:'Outgoing WebSocket queue counted as isolate memory (#8306) breaks high-throughput streaming, and there’s no backpressure API to stay under it',
    url:'https://github.com/cloudflare/workerd/issues/8477', image:memory+'/cloudflare.webp',
    description:'У клиента Workers рвались соединения с кодом 1006', at:4400},
  {publisher:'Apache Pulsar · PIP-434', date:'09.09.2025',
    title:'PIP-434: Expose Netty channel configuration WRITE_BUFFER_WATER_MARK to pulsar conf and pause receive requests when channel is unwritable',
    url:'https://github.com/apache/pulsar/blob/master/pip/pip-434.md', image:memory+'/pulsar.webp',
    description:'Очередь ответов росла, брокеры падали по памяти', at:5520},
];

// «Проблемы были…» introduces four library reports during the same overlay.
export const libraryListStart = 7300;
const publications = 'assets/011-websocket/memory/publications';

export const libraryReports: readonly Report[] = [
  {publisher:'Jetty · #6696', date:'05.09.2021', title:'High WebSocket memory usage in Jetty 10',
    url:'https://github.com/jetty/jetty.project/issues/6696', image:publications+'/results.webp',
    description:'В тесте куча 1 ГБ исчерпалась на ~9 тыс. соединений', at:8320},
  {publisher:'Go · crypto/tls · #42035', date:'17.10.2020',
    title:'crypto/tls: outBuf of Conn costs too much memory for large number of idle connections',
    url:'https://github.com/golang/go/issues/42035', image:publications+'/go.webp',
    description:'Буфер отправки занимал около 16 КБ на соединение', at:8820},
  {publisher:'Apache Tomcat · CVE-2026-66299', date:'28.07.2026', title:'DoS in WebSocket chat example',
    url:'https://tomcat.apache.org/security-9.html#:~:text=DoS%20in%20WebSocket%20chat%20example',
    image:memory+'/tomcat.webp', description:'В примере чата росла очередь недоставленных сообщений', at:10530},
  {publisher:'ws · Node.js', date:'12.11.2026', title:'Memory exhaustion DoS via unbounded automatic pong responses',
    url:'https://github.com/websockets/ws/security/advisories/GHSA-37g9-w4hg-h9qr', image:memory+'/ws.webp',
    description:'Исправлена очередь автоматических ответов pong', at:10900},
];
