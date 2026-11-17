import anchors from '../../anchors.json';

export const startMs = anchors['p02-a01-connection-capacity-start'];
export const articlesMs = anchors['connection-articles'] - startMs;

type System = {
  readonly name: string;
  readonly spokenAtMs: number;
  readonly concurrent: string;
  readonly context: readonly string[];
  readonly article: readonly string[];
  readonly url: string;
  readonly publisher?: string;
};

// Spoken cues use the source WAV clock. The articles are the five links on pp. 17–18.
export const systems: readonly System[] = [
  {
    name: 'WhatsApp', spokenAtMs: 2_186_580, concurrent: '> 2 млн',
    context: ['TCP-соединений на сервер'],
    article: ['1 million is so 2011'],
    url: 'https://blog.whatsapp.com/1-million-is-so-2011',
  },
  {
    name: 'Uber RAMEN', spokenAtMs: 2_190_860, concurrent: '> 1,5 млн',
    context: ['Соединений на всю платформу'],
    article: ['Uber’s Real-Time Push Platform'],
    url: 'https://www.uber.com/blog/real-time-push-platform/',
  },
  {
    name: 'Discord', spokenAtMs: 2_192_640, concurrent: 'до 500 тыс.',
    context: ['Сессий на одну Erlang VM'],
    article: ['How Discord Scaled Elixir to 5,000,000 Concurrent Users'],
    url: 'https://discord.com/blog/how-discord-scaled-elixir-to-5-000-000-concurrent-users',
  },
  {
    name: 'Netflix Pushy', spokenAtMs: 2_195_960, concurrent: '200 тыс.',
    context: ['Соединений на узел в среднем', 'Запас до 400 тыс.'],
    article: ['Netflix’s Pushy: Evolution of Scalable WebSocket Platform', 'That Handles 100Ms Concurrent Connections'],
    publisher: 'InfoQ',
    url: 'https://www.infoq.com/news/2024/09/netflix-pushy-websocket/',
  },
  {
    name: 'LinkedIn', spokenAtMs: 2_198_560, concurrent: '100 тыс.',
    context: ['Соединений на узел', '≈ 20 КБ памяти на TLS-соединение'],
    article: ['Instant Messaging at LinkedIn: Scaling to Hundreds of Thousands', 'of Persistent Connections on One Machine'],
    url: 'https://www.linkedin.com/blog/engineering/archive/instant-messaging-at-linkedin-scaling-to-hundreds-of-thousands-',
  },
];
