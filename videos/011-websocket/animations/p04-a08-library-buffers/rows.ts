// Episode materials §5.5, with the scope corrections in §1.5 of the fact-check.
// These are outbound queue limits, watermarks or blocking-write timeouts.
export type LibraryRow = {
  name: string;
  limit: string;
  behavior: string;
  unbounded?: boolean;
  detail?: {
    top: number; cue: number; summary: string; instruction: readonly string[];
    code?: string; note: string; url: string;
  };
};

export const rows: readonly LibraryRow[] = [
  {name: 'ws (Node.js)', limit: 'Без лимита', behavior: 'Накапливает сообщения', unbounded: true},
  {name: 'Socket.IO', limit: 'Без лимита', behavior: 'Обычный emit() не ждёт', unbounded: true},
  {name: 'Rails Action Cable', limit: 'Без лимита', behavior: 'Накапливает сообщения', unbounded: true},
  {name: 'Netty', limit: 'Порог 64 КиБ', behavior: 'Подаёт сигнал приложению',
    detail: {top: 229, cue: 9520, summary: '64 КиБ / 32 КиБ',
      instruction: ['Проверяйте channel.isWritable().', 'При false остановите отправку, при true — возобновите.'],
      note: 'Выше 64 КиБ канал сообщает false, ниже 32 КиБ — снова true.',
      url: 'https://netty.io/4.1/api/io/netty/channel/WriteBufferWaterMark.html'}},
  {name: 'gorilla/websocket', limit: 'Своей очереди нет', behavior: 'Запись блокируется'},
  {name: 'Tomcat', limit: 'Тайм-аут 20 с', behavior: 'Блокирующая запись ждёт'},
  {name: 'Jetty 9.4', limit: 'Порог задаётся', behavior: 'Сверх порога — ошибка записи'},
  {name: 'Spring WebSocket', limit: 'Через обёртку', behavior: 'Закрыть или отбросить старое',
    detail: {top: 760, cue: 9940, summary: 'Обычный WebSocketHandler',
      instruction: ['Оберните сессию и ограничьте', 'время отправки и размер буфера.'],
      code: 'ConcurrentWebSocketSessionDecorator',
      note: 'В транспорте Spring STOMP эти лимиты включены по умолчанию.',
      url: 'https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/socket/handler/ConcurrentWebSocketSessionDecorator.html'}},
  {name: 'uWebSockets.js', limit: '64 КиБ', behavior: 'Пропускает отправку'},
  {name: 'python-websockets', limit: 'Порог 32 КиБ', behavior: 'send() ждёт, broadcast() — нет'},
  {name: 'ASP.NET Core SignalR', limit: '64 КиБ', behavior: 'Ждёт отправку до 10 с'},
  {name: 'Centrifugo', limit: '1 МиБ', behavior: 'Отключает клиента · 3008'},
  {name: 'NATS', limit: '64 МиБ или 10 с', behavior: 'Отключает клиента'},
  {name: 'Redis Pub/Sub', limit: '32 МиБ сразу', behavior: 'Или 8 МиБ в течение 60 с'},
];
