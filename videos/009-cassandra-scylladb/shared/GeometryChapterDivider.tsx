import React from 'react';
import {GeometryChapterDivider as Divider, type ChapterDividerProps} from '@channel/motion-v2';
import {chapters, type ChapterId} from './chapters';

export const GeometryChapterDivider: React.FC<ChapterDividerProps & {readonly chapterId: ChapterId}> =
  ({chapterId, ...props}) => <Divider {...props} chapter={chapters[chapterId]} />;
