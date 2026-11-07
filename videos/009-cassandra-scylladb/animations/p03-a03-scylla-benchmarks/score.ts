import {articlePages, type PageShot} from '../../shared/source-reading/article';
import type {SourceCaptionText} from '../../shared/source-reading/SourceCaption';
import documents from './documents.json';

type Page = keyof typeof documents;
type FigureShot = {readonly kind: 'figure'; readonly at: number; readonly id: 'discord-figure' | 'bench-figure'; readonly caption: SourceCaptionText};
export type Shot = PageShot<Page> | FigureShot;

const page = articlePages(documents);

const note = (credit: string, line: string, original?: string): SourceCaptionText => ({credit, lines: [line], original});
const first = 'OCTO · Первый тест, декабрь 2015';
const overload = 'OCTO · Второй тест, 17 генераторов нагрузки';
const discord = 'Discord Engineering · Хранилище сообщений';
const bench = 'benchANT · YCSB CRUD, 9 узлов';

export const score: readonly Shot[] = [
  page(0, 'octo-cover'),
  page(3800, 'octo-test', [
    {at: 0, mark: 'setup', caption: note(first, 'Два кластера по три узла. ScyllaDB 0.10.')},
    {at: 3500, mark: 'machines', caption: note(first, 'Инстансы одинаковые: m3.xlarge. Образы ОС разные.')},
    {at: 5700, mark: 'writes', caption: note(first, 'ScyllaDB — 215 000 записей/с. Cassandra — 113 000.')},
  ]),
  page(18300, 'octo-load', [
    {at: 0, mark: 'clients'},
    {at: 1350, mark: 'timeout', caption: note(overload, 'ScyllaDB 0.10 отвечала тайм-аутами.')},
    {at: 4200, mark: 'pressure', caption: note(overload, 'У клиентов Cassandra упала скорость запросов.')},
  ]),
  page(25400, 'discord-cover'),
  page(28900, 'discord-trouble', [
    {at: 0, mark: 'gc', caption: note(discord, 'Паузы сборщика мусора давали скачки задержки.')},
    {at: 2050, mark: 'hot'},
    {at: 3850, mark: 'compact', caption: note(discord, 'Компактация не поспевала за записью.')},
  ]),
  page(34700, 'discord-report', [
    {at: 0, mark: 'moved', caption: note(discord, 'Май 2022: Discord переключает хранилище сообщений.')},
    {at: 3850, mark: 'read', caption: note('Discord · p99 чтения истории', '40–125 мс → 15 мс')},
    {at: 9800, mark: 'write', caption: note('Discord · p99 записи сообщений', '5–70 мс → 5 мс')},
    {at: 13800, mark: 'nodes', caption: note('Discord · Размер кластера', '177 узлов Cassandra → 72 узла ScyllaDB')},
    {at: 17800, mark: 'disk', caption: note('Discord · Дисковая ёмкость на узел', 'В среднем 4 ТБ на Cassandra → 9 ТБ на ScyllaDB')},
  ]),
  {at: 56600, kind: 'figure', id: 'discord-figure', caption: note('Discord · Схема из инженерного блога',
    'Четыре запроса одного сообщения — одно чтение из базы.')},
  page(64500, 'discord-reverse', [
    {at: 0, mark: 'reverse', caption: note(discord, 'Чтение в обратном порядке было слишком медленным.')},
    {at: 5500, mark: 'fixed', caption: note(discord, 'Команда ScyllaDB ускорила обратное чтение.')},
  ]),
  page(73750, 'discord-report', [
    {at: 0, mark: 'calm', caption: note('Discord · После миграции', 'Дежурные перестали проводить выходные на авариях.',
      'We’re not having weekend-long firefights')},
  ]),
  page(80500, 'bench-cover'),
  page(84100, 'bench-method', [
    {at: 0, mark: 'jvm', caption: note('benchANT · Версии на стенде', 'Cassandra 4.0.0 / Java 8 и Cassandra 5.0.6 / Java 17')},
    {at: 5000, mark: 'mix', caption: note('benchANT · Нагрузка YCSB', 'Половина операций — чтение, половина — вставка.')},
  ]),
  page(92600, 'bench-table', [
    {at: 0, mark: 'scale'},
    {at: 900, mark: 'base', caption: note(bench, '139 171 операций/с на v4; 150 323 на v5 по умолчанию.')},
    {at: 3275, mark: 'tuned', caption: note(bench, '171 527 операций/с: +23% к v4 после базовой настройки.')},
  ]),
  {at: 100100, kind: 'figure', id: 'bench-figure',
    caption: note('benchANT · Результаты на AWS, апрель 2026', 'Здесь сравнивают две версии Cassandra. ScyllaDB в тесте нет.')},
];
