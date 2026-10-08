import anchors from '../../anchors.json';
import metadata from './animation.json';
import type {CodeCue} from '../../shared/code/types';
import type {RunscFocus} from './command';

export const scene = {startMs: anchors['gvisor-runsc'], durationMs: metadata.durationMs};

type RunscCue = Omit<CodeCue, 'startMs' | 'focus'> & {
  readonly anchor: keyof typeof anchors;
  readonly focus: readonly RunscFocus[];
};

const cueData = [
  {anchor: 'gvisor-runsc', focus: [], label: 'Docker + gVisor', description: 'Сокращённый пример запуска контейнера'},
  {anchor: 'gvisor-runtime', focus: ['runtime'], label: 'Runtime', description: 'runsc — среда исполнения gVisor'},
  {anchor: 'gvisor-one-option', focus: ['runtime'], label: 'Одна новая опция', description: 'Выбираем runsc для запуска контейнера'},
  {anchor: 'gvisor-example', focus: [], label: 'Пример запуска', description: '... — остальные параметры и команда опущены'},
] as const satisfies readonly RunscCue[];

export const cues: readonly CodeCue[] = cueData.map(({anchor, ...cue}) =>
  ({...cue, startMs: anchors[anchor] - scene.startMs}));
