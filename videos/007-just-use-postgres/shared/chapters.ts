import type {TechnologyMark} from './technology-marks';

type Chapter = {
  readonly number: number;
  readonly lead: string;
  readonly title: string;
  readonly description?: string;
  readonly tone?: 'problem';
  readonly technology?: TechnologyMark;
};

// Copy follows the ten existing CapCut transitions, including the user's
// explicit names for the three problems. These are standalone inserts.
export const chapters = [
  {number: 1, lead: 'Postgres вместо', title: 'MongoDB', technology: 'mongodb',
    description: 'Гибкие документы внутри реляционной базы.'},
  {number: 2, lead: 'Postgres вместо', title: 'Elasticsearch', technology: 'elasticsearch',
    description: 'Что умеет встроенный полнотекстовый поиск.'},
  {number: 3, lead: 'Postgres вместо', title: 'Redis', technology: 'redis',
    description: 'Цена кэша в обычной таблице.'},
  {number: 4, lead: 'Postgres вместо', title: 'RabbitMQ', technology: 'rabbitmq',
    description: 'Задачи, блокировки и повторная обработка.'},
  {number: 5, lead: 'Postgres вместо', title: 'Pub/Sub', technology: 'pubsub',
    description: 'Уведомления, связанные с транзакцией.'},
  {number: 6, lead: 'Одна транзакция', title: 'на всё',
    description: 'Заказ, задача и кэш — всё или ничего.'},
  {number: 7, lead: 'Проблема:', tone: 'problem', title: 'MVCC и VACUUM',
    description: 'Почему очередь со временем замедляется.'},
  {number: 8, lead: 'Проблема:', tone: 'problem', title: 'LISTEN/NOTIFY',
    description: 'Цена порядка уведомлений — общий замок.'},
  {number: 9, lead: 'Проблема:', tone: 'problem', title: 'Единственный кластер',
    description: 'Общая точка отказа и предел записи.'},
  {number: 10, lead: '', title: 'Выводы'},
] as const satisfies readonly Chapter[];

export const getChapter = (number: number): Chapter => {
  const chapter = chapters.find((candidate) => candidate.number === number);
  if (!chapter) throw new Error(`Unknown Postgres chapter: ${number}`);
  return chapter;
};
