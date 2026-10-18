import React from 'react';
import {sql} from './data';
import {reveal} from './timing';
import {accent, Appear, Caption, Sql, theme, Underline, type ShotProps} from './ui';

const Morphology: React.FC<{readonly timeMs: number}> = ({timeMs}) => <>
  <Caption color={theme.signal}>01 / СТЕММИНГ</Caption>
  <div style={{fontSize: 32, color: theme.muted, marginBottom: 65}}>Стандартная конфигурация russian</div>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 70}}>
    {[['бегу', 'бег'], ['бежать', 'бежа']].map(([word, stem]) => <div key={word}>
      <div style={{fontSize: 63}}>{word}</div>
      <Appear timeMs={timeMs} at={2100} style={{marginTop: 42, borderTop: `2px solid ${theme.line}`, paddingTop: 35}}>
        <div style={{fontFamily: theme.fontMono, fontSize: 60, color: theme.signal}}>{stem}</div>
      </Appear>
    </div>)}
  </div>
  <Appear timeMs={timeMs} at={3100} style={{marginTop: 80, fontSize: 35}}>Разные лексемы → <Underline warning>нет совпадения</Underline></Appear>
</>;

const Typo: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const trigram = timeMs >= 2200;
  return <>
    <Caption color={theme.signal}>02 / ОПЕЧАТКИ</Caption>
    <div style={{fontSize: 60, fontFamily: theme.fontMono, marginTop: 45}}>{trigram ? <>Екатер<span style={{color: theme.signal}}>е</span>нбург</> : <>очер<span style={{color: theme.signal}}>и</span>ди</>}</div>
    <div style={{fontSize: 32, color: theme.muted, marginTop: 35}}>{trigram ? 'Отдельный поиск по сходству' : 'Полнотекстовый запрос: 0 совпадений'}</div>
    <Appear timeMs={timeMs} at={2200} style={{marginTop: 80}}>
      <Caption color={accent}>PG_TRGM</Caption>
      <Sql text={sql.trigram} size={37} active="%" />
      <div style={{fontSize: 44, marginTop: 55, color: accent}}>→ Екатеринбург</div>
    </Appear>
  </>;
};

const Ranking: React.FC<{readonly timeMs: number}> = ({timeMs}) => <>
  <Caption color={theme.signal}>03 / РАНЖИРОВАНИЕ</Caption>
  <div style={{fontFamily: theme.fontMono, fontSize: 55, marginTop: 50}}>ts_rank / ts_rank_cd</div>
  <div style={{fontSize: 36, lineHeight: 1.65, marginTop: 55}}>
    Частота совпадений<br />Вес заголовка и текста<br />Близость слов <span style={{fontSize: 26, color: theme.muted}}>— ts_rank_cd</span>
  </div>
  <Appear timeMs={timeMs} at={900} style={{marginTop: 55, fontSize: 33, color: theme.signal}}>Без статистики по всему корпусу</Appear>
  <Appear timeMs={timeMs} at={3100} style={{marginTop: 55, borderTop: `2px solid ${theme.line}`, paddingTop: 35, fontSize: 31, color: theme.muted}}>
    Встроенный FTS решает более узкую задачу
  </Appear>
</>;

const limitationStages = [
  {startMs: 0, endMs: 6400, Component: Morphology},
  {startMs: 6400, endMs: 12200, Component: Typo},
  {startMs: 12200, endMs: 18960, Component: Ranking},
] as const;

export const Limits: React.FC<ShotProps> = ({timeMs}) => <>
  {limitationStages.map(({startMs, endMs, Component}) => timeMs >= startMs && timeMs < endMs
    ? <div key={startMs} style={{opacity: reveal(timeMs, startMs, 250) * (1 - reveal(timeMs, endMs - 160, 160))}}><Component timeMs={timeMs - startMs} /></div>
    : null)}
</>;

export const Dictionary: React.FC<ShotProps> = ({timeMs}) => {
  const query = reveal(timeMs, 4400, 700);
  const found = reveal(timeMs, 5600);
  return <>
    <Caption>ПОИСК В АДМИНКЕ</Caption>
    <div style={{borderBottom: `2px solid ${accent}`, padding: '25px 0', fontFamily: theme.fontMono, fontSize: 49}}>
      {query > 0 ? 'новосиб'.slice(0, Math.ceil(query * 7)) : <span style={{color: theme.muted}}>Город</span>}
    </div>
    <div style={{marginTop: 45}}>
      {['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург'].map((city, index) => <div key={city}
        style={{padding: '27px 0', borderBottom: `1px solid ${theme.line}`, fontSize: 40,
          color: index === 2 && found > 0 ? accent : theme.text, opacity: index === 2 ? 1 : 1 - 0.8 * found}}>
        {city}
      </div>)}
    </div>
    <Appear timeMs={timeMs} at={4400} style={{marginTop: 50, fontSize: 31, color: theme.muted}}>Простой поиск по небольшому словарю</Appear>
  </>;
};
