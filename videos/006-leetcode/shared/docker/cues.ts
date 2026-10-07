import anchors from '../../anchors.json';
import type {CodeCue} from '../code/types';
import type {DockerFocus} from './command';

export type DockerCue = Omit<CodeCue, 'startMs' | 'focus'> & {
  readonly anchor: keyof typeof anchors;
  readonly focus: readonly DockerFocus[];
};

export const localDockerCues = (data: readonly DockerCue[], startMs: number): readonly CodeCue[] =>
  data.map(({anchor, ...cue}) => ({...cue, startMs: anchors[anchor] - startMs}));
