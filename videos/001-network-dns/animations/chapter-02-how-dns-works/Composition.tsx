import React from 'react';
import {DnsChapterDivider} from '../../shared/DnsChapterDivider';

const Composition: React.FC = () => (
  <DnsChapterDivider
    chapterNumber={2}
    eyebrow="DNS / МЕХАНИКА"
    titleLines={['ДЕТАЛЬНЫЙ РАЗБОР:', 'КАК DNS РАБОТАЕТ']}
    detail="STUB → RESOLVER → ROOT → TLD → AUTH"
  />
);

export default Composition;
