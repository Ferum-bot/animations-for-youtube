import anchors from '../../anchors.json';
import type {CodeCue} from '../code/types';
import type {IsolateFocus} from './command';

export type IsolateCue = Omit<CodeCue, 'startMs' | 'focus'> & {
  readonly anchor: keyof typeof anchors;
  readonly focus: readonly IsolateFocus[];
};

export const localIsolateCues = (data: readonly IsolateCue[], startMs: number): readonly CodeCue[] =>
  data.map(({anchor, ...cue}) => ({...cue, startMs: anchors[anchor] - startMs}));
