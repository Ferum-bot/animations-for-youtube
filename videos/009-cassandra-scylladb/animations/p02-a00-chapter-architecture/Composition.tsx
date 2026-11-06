import React from 'react';
import type {ChapterDividerProps} from '../../shared/ChapterStage';
import {GeometryChapterDivider} from '../../shared/GeometryChapterDivider';

const Composition: React.FC<ChapterDividerProps> = (props) => (
  <GeometryChapterDivider {...props} chapterId="architecture" />
);

export default Composition;
