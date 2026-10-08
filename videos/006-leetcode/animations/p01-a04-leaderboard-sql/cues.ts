import anchors from '../../anchors.json';
import metadata from './animation.json';
import type {CodeCue} from '../../shared/code/types';
import type {SqlFocus} from './sql';

export const scene = {startMs: anchors['leaderboard-sql'], durationMs: metadata.durationMs};

type SqlCue = Omit<CodeCue, 'startMs' | 'focus'> & {
  readonly anchor: keyof typeof anchors;
  readonly focus: readonly SqlFocus[];
};

const cueData = [
  {anchor: 'leaderboard-sql', focus: [], label: 'Лидерборд', description: 'Считаем рейтинг напрямую из submissions'},
  {anchor: 'leaderboard-select', focus: ['user'], label: 'Участник', description: 'Выбираем идентификатор пользователя'},
  {anchor: 'leaderboard-aggregates', focus: ['aggregates'], label: 'Агрегации', description: 'Уникальные задачи и время последнего AC'},
  {anchor: 'leaderboard-source', focus: ['source'], label: 'Источник', description: 'Отправленные решения в таблице submissions'},
  {anchor: 'leaderboard-contest', focus: ['contest'], label: 'Контест', description: 'Оставляем решения выбранного соревнования'},
  {anchor: 'leaderboard-verdict', focus: ['verdict'], label: 'Вердикт', description: 'Учитываем только принятые решения: AC'},
  {anchor: 'leaderboard-group', focus: ['group'], label: 'Группировка', description: 'Одна строка результата на участника'},
  {anchor: 'leaderboard-order', focus: ['order'], label: 'Сортировка', description: 'Больше решённых задач; при равенстве — раньше последний AC'},
  {anchor: 'leaderboard-page', focus: ['limit', 'offset'], label: 'Пагинация', description: 'Возвращаем одну страницу рейтинга'},
  {anchor: 'leaderboard-limit', focus: ['limit'], label: 'Размер страницы', description: 'Не более 50 участников в ответе'},
  {anchor: 'leaderboard-offset', focus: ['offset'], label: 'Смещение', description: 'Пропускаем :page × 50 строк; первая страница — 0'},
] as const satisfies readonly SqlCue[];

export const cues: readonly CodeCue[] = cueData.map(({anchor, ...cue}) =>
  ({...cue, startMs: anchors[anchor] - scene.startMs}));
