// Materials p. 19, checked against provider error references. These are examples,
// not a universal retry classifier. Twilio 30005 is omitted: its documented
// causes include both transient unavailability and an unknown destination.
export const errorColumns = [
  {
    id: 'retryable', title: 'Повторяемые',
    rows: [
      {provider: 'HTTP / сеть', codes: ['503, 429', 'Сетевой таймаут']},
      {provider: 'FCM', codes: ['UNAVAILABLE', 'QUOTA_EXCEEDED']},
      {provider: 'APNs', codes: ['5xx', 'TooManyRequests']},
      {provider: 'Twilio', codes: ['30003', 'Телефон недоступен']},
    ],
    action: 'Повторяем с задержкой',
    detail: 'Backoff + jitter',
    note: 'Задержка — по правилам провайдера',
  },
  {
    id: 'terminal', title: 'Терминальные',
    rows: [
      {provider: 'APNs', codes: ['410 Unregistered', 'BadDeviceToken']},
      {provider: 'FCM', codes: ['UNREGISTERED', 'INVALID_ARGUMENT']},
      {provider: 'Twilio', codes: ['30007', 'Сообщение отфильтровано']},
      {provider: 'SES', codes: ['Hard bounce', 'Постоянный отказ доставки']},
    ],
    action: 'Не повторяем автоматически',
    detail: 'Исправляем причину / status=failed',
    note: 'Невалидный токен — деактивируем',
  },
] as const satisfies readonly {
  readonly id: 'retryable' | 'terminal';
  readonly title: string;
  readonly rows: readonly {readonly provider: string; readonly codes: readonly [string, string]}[];
  readonly action: string;
  readonly detail: string;
  readonly note: string;
}[];

export type ErrorFocus = typeof errorColumns[number]['id'] | 'backoff';
