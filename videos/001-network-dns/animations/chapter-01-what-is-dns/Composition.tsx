import React from 'react';
import {DnsChapterDivider} from '../../shared/DnsChapterDivider';

const Composition: React.FC = () => (
  <DnsChapterDivider
    chapterNumber={1}
    eyebrow="DNS / ОСНОВЫ"
    titleLines={['ЧТО ТАКОЕ DNS', 'И ЗАЧЕМ ОН НУЖЕН']}
    detail="ИМЯ → РЕСУРС → АДРЕС"
  />
);

export default Composition;
