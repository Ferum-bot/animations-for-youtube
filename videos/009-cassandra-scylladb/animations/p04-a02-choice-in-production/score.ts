import {articlePages, type PageShot} from '../../shared/source-reading/article';
import type {SourceCaptionText} from '../../shared/source-reading/SourceCaption';
import documents from './documents.json';

type Exhibit = 'author' | 'docstore-architecture' | 'netflix-abstraction' | 'netflix-namespace';
export type Shot = PageShot<keyof typeof documents> | {kind: 'exhibit'; at: number; id: Exhibit};

const page = articlePages(documents);
const note = (credit: string, line: string, original?: string): SourceCaptionText => ({credit, original, lines: [line]});
const ingram = 'Бо Ингрэм · ScyllaDB in Action';
const workload = 'Uber Engineering · Workloads, 2023';
const spectrum = note(workload, 'Чтение, смешанная нагрузка, запись.', 'The workloads vary from read-skewed to mixed to write-skewed.');
const docstore = 'Uber Engineering · Зачем понадобился Docstore, 2021';
const netflix = 'Netflix TechBlog · С чем столкнулись разработчики';

const accessPatterns = note(netflix, 'Широкие партиции, большие значения, медленная пагинация.');

// Shot starts are relative to the camera cut. Reading beats are relative to the shot.
export const score: readonly Shot[] = [
  {at: 0, kind: 'exhibit', id: 'author'},
  page(4950, 'bo-cover'),
  page(8020, 'bo-advice', [
    {at: 0, mark: 'section'},
    {at: 3930, mark: 'scale', caption: note(ingram, 'Насколько важны масштабирование и доступность при отказах?',
      'horizontal scalability and nuanced availability')},
    {at: 7150, mark: 'cost', caption: note(ingram, 'Дополнительные затраты на эксплуатацию могут не окупиться.',
      'the increased operational overhead might not be worth it')},
  ]),
  page(19900, 'uber-cover'),
  page(25800, 'uber-workloads', [
    {at: 0, mark: 'scope', caption: spectrum},
    {at: 5270, mark: 'read', caption: spectrum},
    {at: 7220, mark: 'mixed', caption: spectrum},
    {at: 8140, mark: 'write', caption: spectrum},
    {at: 10030, mark: 'unique', caption: note(workload, 'Для всех этих сервисов нет единого профиля нагрузки.')},
  ]),
  page(40100, 'uber-replace', [
    {at: 0, mark: 'heading'},
    {at: 1380, mark: 'stuck', caption: note('Uber · Замена узла', 'Вывод старого узла иногда зависал.', 'Node decommission stuck forever')},
    {at: 4420, mark: 'add', caption: note('Uber · Замена узла', 'Добавление нового узла тоже иногда срывалось.')},
  ]),
  page(47350, 'doc-cover'),
  page(52900, 'doc-motivation', [
    {at: 0, mark: 'architecture', caption: note(docstore, 'Разработчикам приходилось учитывать согласованность в приложении.')},
    {at: 3550, mark: 'dev', caption: note(docstore, 'Это усложняло разработку.', 'impeding developer productivity')},
    {at: 7200, mark: 'operations', caption: note(docstore, 'На масштабе Uber проявились и эксплуатационные ограничения.')},
    {at: 10900, mark: 'engine', caption: note(docstore, 'Команда развила Schemaless в транзакционную базу.')},
  ]),
  {at: 66600, kind: 'exhibit', id: 'docstore-architecture'},
  page(72300, 'netflix-cover'),
  page(76300, 'netflix-friction', [
    {at: 0, mark: 'consistency', caption: note(netflix, 'Какую гарантию получает приложение?')},
    {at: 3490, mark: 'wide', caption: accessPatterns},
    {at: 5000, mark: 'items', caption: accessPatterns},
    {at: 6360, mark: 'pages', caption: accessPatterns},
  ]),
  {at: 85100, kind: 'exhibit', id: 'netflix-abstraction'},
  {at: 88700, kind: 'exhibit', id: 'netflix-namespace'},
  page(91300, 'netflix-conclusion', [
    {at: 0, mark: 'heading'},
    {at: 1200, mark: 'solve', caption: note('Netflix TechBlog · Conclusion', 'Инженер приложения решает задачу продукта.', 'focus on solving business problems')},
    {at: 4700, mark: 'expert', caption: note('Netflix TechBlog · Conclusion', 'Детали каждого хранилища берёт на себя общий слой доступа.')},
  ]),
];
