import React from 'react';
import {DnsChapterDivider} from '../../shared/DnsChapterDivider';

const Composition: React.FC = () => (
  <DnsChapterDivider
    chapterNumber={4}
    eyebrow="DNS / ВЫВОДЫ"
    titleLines={['ЗАКЛЮЧЕНИЕ']}
    detail="ИЕРАРХИЯ / КЭШ / УПРАВЛЕНИЕ ТРАФИКОМ"
  />
);

export default Composition;
