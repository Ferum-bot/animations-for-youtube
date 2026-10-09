import anchors from '../../anchors.json';
import metadata from './animation.json';
import type {CodeCue} from '../../shared/code/types';
import type {RedisFocus} from './commands';

export const scene = {startMs: anchors['redis-commands'], durationMs: metadata.durationMs};

type RedisCue = Omit<CodeCue, 'startMs' | 'focus'> & {
  readonly anchor: keyof typeof anchors;
  readonly focus: readonly RedisFocus[];
};

const cueData = [
  {anchor: 'redis-commands', focus: [], label: 'Sorted Set', description: 'Обновить результат → получить страницу → узнать место'},
  {anchor: 'redis-add', focus: ['add'], label: 'После Accepted', description: 'Добавить пользователя или обновить его рассчитанный score'},
  {anchor: 'redis-range', focus: ['range'], label: 'Первая страница', description: 'До 50 участников: score по убыванию, вместе со значениями'},
  {anchor: 'redis-rank', focus: ['rank'], label: 'Моё место', description: 'Для существующего участника: место = ZREVRANK + 1'},
] as const satisfies readonly RedisCue[];

export const cues: readonly CodeCue[] = cueData.map(({anchor, ...cue}) =>
  ({...cue, startMs: anchors[anchor] - scene.startMs}));
