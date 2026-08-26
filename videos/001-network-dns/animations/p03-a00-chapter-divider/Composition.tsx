import React from 'react';
import {DnsChapterDivider} from '../../shared/DnsChapterDivider';

const Composition: React.FC = () => (
  <DnsChapterDivider
    chapterNumber={3}
    eyebrow="DNS / TRUST MODEL"
    titleLines={['БЕЗОПАСНОСТЬ,', 'ПРИВАТНОСТЬ и МИФЫ']}
    detail="CACHE POISONING / DNSSEC / DoH"
  />
);

export default Composition;
