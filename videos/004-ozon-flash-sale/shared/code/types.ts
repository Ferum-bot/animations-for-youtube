import type {OzonTheme} from '../theme';

export type CodeToken = {readonly text: string; readonly kind: 'plain' | 'comment' | keyof OzonTheme['syntax']};
export type LineRange = readonly [first: number, last: number];
export type CodeCue = {
  readonly startMs: number;
  readonly ranges: readonly LineRange[];
  readonly label: string;
  readonly title: readonly string[];
  readonly body: readonly string[];
  readonly detail: string;
};
