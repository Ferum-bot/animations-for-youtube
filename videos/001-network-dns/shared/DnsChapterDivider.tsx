import React from 'react';
import {
  ChapterDivider,
  type ChapterDividerProps,
} from '@channel/standard-animations';

export type DnsChapterDividerProps = Pick<
  ChapterDividerProps,
  'chapterNumber' | 'detail' | 'eyebrow' | 'titleLines'
>;

/**
 * Video-local chapter card that pins the approved Network DNS art direction.
 * Chapter compositions only provide content; theme and visual treatment stay
 * consistent in one place.
 */
export const DnsChapterDivider: React.FC<DnsChapterDividerProps> = (props) => (
  <ChapterDivider
    {...props}
    variant="route"
    themeId="graphite"
    transparent={false}
    transitionMode="cut"
  />
);
