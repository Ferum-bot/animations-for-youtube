import React from 'react';
import {PostgresChapterDivider, type ChapterDividerProps} from '../../shared/PostgresChapterDivider';

const Composition: React.FC<ChapterDividerProps> = (props) => (
  <PostgresChapterDivider {...props} chapterNumber={9} />
);

export default Composition;
