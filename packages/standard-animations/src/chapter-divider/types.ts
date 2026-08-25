import type {StageTransitionMode, ThemeId} from '@channel/design-system';

export type ChapterDividerVariant = 'delegation' | 'route';

export type ChapterDividerProps = {
  chapterNumber: number;
  titleLines: readonly [string] | readonly [string, string];
  eyebrow: string;
  detail: string;
  variant: ChapterDividerVariant;
  themeId: ThemeId;
  transparent: boolean;
  transitionMode?: StageTransitionMode;
};
