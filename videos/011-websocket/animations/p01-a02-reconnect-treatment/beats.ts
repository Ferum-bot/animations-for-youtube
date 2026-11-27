// Local milliseconds from «Проблему нужно лечить…», 02:51.800 on the WAV.
export const beats = [
  {at: 0, kind: 'intro', title: ['Как избежать лавины', 'переподключений']},
  {at: 5200, kind: 'retry', title: ['Сделайте паузу', 'перед новой попыткой']},
  {at: 19380, kind: 'resume', title: ['После обрыва получите', 'только пропущенное']},
  {at: 28300, kind: 'budget', title: ['Ограничьте подключения', 'и частоту повторов']},
  {at: 33180, kind: 'batch', title: ['Закрывайте соединения', 'небольшими группами']},
  {at: 42380, kind: 'lifetime', title: ['Разнесите по времени', 'окончание сессий']},
  {at: 53400, kind: 'admission', title: ['При перегрузке сохраните', 'активные соединения']},
  {at: 61500, kind: 'notice', title: ['Сообщайте клиентам', 'об обслуживании']},
  {at: 70240, kind: 'deploy', title: ['Отделите сокеты', 'от прикладной логики']},
  {at: 85020, kind: 'handoff', title: ['Передайте открытый сокет', 'новому процессу']},
  {at: 92840, kind: 'cache', title: ['Вынесите кэш', 'из процесса соединений']},
] as const;

export type BeatKind = (typeof beats)[number]['kind'];
export const levels = [
  {label: 'Клиент', at: 2080, x: 0, width: 202},
  {label: 'Сервер', at: 33180, x: 264, width: 202},
  {label: 'Архитектура', at: 70240, x: 532, width: 314},
] as const;
