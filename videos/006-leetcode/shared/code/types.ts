import type {LeetcodeTheme} from '../theme';

export type CodeToken = {
  readonly text: string;
  readonly kind: keyof LeetcodeTheme['syntax'];
  readonly focus?: string;
};

export type CodeCue = {
  readonly startMs: number;
  readonly focus: readonly string[];
  readonly label: string;
  readonly description: string;
};
