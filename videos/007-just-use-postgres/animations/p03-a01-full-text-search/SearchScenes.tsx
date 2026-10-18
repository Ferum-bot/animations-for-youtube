import React from 'react';
import {articles, sql, words} from './data';
import {reveal} from './timing';
import {accent, Appear, Caption, Sql, SqlLines, theme, type ShotProps} from './ui';

export const Vector: React.FC<ShotProps> = ({timeMs}) => {
  const parsed = reveal(timeMs, 13520, 800);
  const removed = reveal(timeMs, 18520, 500);
  return <>
    <Sql text={sql.vector} size={33} active="to_tsvector" />
    <div style={{marginTop: 65}}><Caption>{parsed > 0 ? 'ЛЕКСЕМЫ И ПОЗИЦИИ' : 'ИСХОДНЫЙ ТЕКСТ'}</Caption></div>
    <div style={{display: 'flex', gap: 30, marginTop: 35}}>
      {words.map(word => <div key={word.position} style={{width: word.position === 4 ? 140 : 275, fontFamily: theme.fontMono,
        borderBottom: `2px solid ${word.stem ? theme.line : theme.signal}`, paddingBottom: 28}}>
        <div style={{fontSize: 42, color: parsed > 0 && word.stem ? accent : theme.text, whiteSpace: 'nowrap', opacity: word.stem ? 1 : 1 - removed}}>
          {word.stem && parsed > 0.5 ? word.stem : word.word}
          {word.stem && parsed > 0.5 ? <span style={{opacity: 1 - parsed}}>{word.ending}</span> : null}
        </div>
        <div style={{marginTop: 28, fontSize: 25, color: theme.muted, opacity: word.stem ? 1 : 1 - removed}}>{word.position}</div>
      </div>)}
    </div>
    <Appear timeMs={timeMs} at={18520} style={{marginTop: 55, fontSize: 30, color: theme.muted}}>
      «из» — стоп-слово. Позиции остальных слов сохраняются.
    </Appear>
    <Appear timeMs={timeMs} at={3200} style={{marginTop: 45, fontSize: 24, color: theme.muted}}>Встроено в PostgreSQL · конфигурация russian</Appear>
  </>;
};

export const ArticleTable: React.FC<ShotProps> = ({timeMs}) => {
  const generated = reveal(timeMs, 3960, 650);
  const gin = reveal(timeMs, 10280, 550);
  const codeSize = 27;
  const lineHeight = codeSize * 1.5;
  const generatedColumn = sql.generated.split('\n').map(line => `  ${line}`).join('\n');
  return <div style={{display: 'grid', gridTemplateColumns: '930px 415px', gap: 55, alignItems: 'start'}}>
    <Sql text={`${sql.table}${generated > 0 ? ',' : ''}`} size={codeSize} active={generated === 0 ? 'CREATE TABLE' : undefined}>
      <div style={{height: lineHeight * 4 * generated, opacity: generated, overflow: 'hidden'}}>
        <SqlLines text={generatedColumn} size={codeSize} active={timeMs < 8200 ? 'GENERATED' : "'A'"} />
      </div>
      <SqlLines text=");" size={codeSize} />
      <div style={{height: (18 + lineHeight * 2) * gin, opacity: gin, overflow: 'hidden'}}>
        <div style={{paddingTop: 18}}><SqlLines text={sql.gin} size={codeSize} active="gin" /></div>
      </div>
    </Sql>
    <div>
      <Caption>ТАБЛИЦА ARTICLES</Caption>
      <div style={{fontSize: 29, lineHeight: 1.35, marginBottom: 32}}>Одна строка — одна статья</div>
      <div style={{fontFamily: theme.fontMono, fontSize: 26, color: accent}}>title <span style={{opacity: generated}}>· вес A</span></div>
      <div style={{fontSize: 23, color: theme.muted, marginTop: 8}}>Заголовок статьи</div>
      <div style={{fontSize: 28, lineHeight: 1.35, marginTop: 18, marginBottom: 30}}>{articles[0].title}</div>
      <div style={{fontFamily: theme.fontMono, fontSize: 26, color: accent}}>body <span style={{opacity: generated}}>· вес B</span></div>
      <div style={{fontSize: 23, color: theme.muted, marginTop: 8}}>Текст статьи</div>
      <div style={{fontSize: 25, lineHeight: 1.4, marginTop: 18}}>{articles[0].body}</div>
      <Appear timeMs={timeMs} at={3960} style={{borderTop: `2px solid ${theme.line}`, marginTop: 30, paddingTop: 22}}>
        <div style={{fontFamily: theme.fontMono, fontSize: 26, color: accent}}>search · tsvector</div>
        <div style={{fontSize: 24, color: theme.muted, lineHeight: 1.4, marginTop: 12}}>Postgres вычисляет из title и body</div>
      </Appear>
    </div>
  </div>;
};

export const Query: React.FC<ShotProps> = ({timeMs, compact}) => {
  const phrase = timeMs >= 4500 && timeMs < 6000;
  const ranked = reveal(timeMs, 6000);
  const excluded = reveal(timeMs, 2000);
  const collapseExcluded = reveal(compact, 0, 0.55);
  const resultLeft = 765 * (1 - reveal(compact, 0.65, 0.35));
  const resultTop = 440 * reveal(compact, 0, 0.55) + 64 * reveal(compact, 0.55, 0.2);
  return <div style={{position: 'relative', minHeight: 820}}>
    <div style={{width: 735}}>
      <Caption color={accent}>{phrase ? 'ФРАЗА В КАВЫЧКАХ' : 'ЗАПРОС'}</Caption>
      <div style={{fontFamily: theme.fontMono, fontSize: 37, whiteSpace: 'nowrap', marginBottom: 32}}>
        {phrase ? '"мёртвые строки"' : <>очередь postgres <span style={{color: theme.signal}}>-kafka</span></>}
      </div>
      {phrase ? <Sql text={sql.phrase} size={28} /> : <Sql text={sql.query} size={28} active={ranked > 0 ? 'ORDER BY' : '@@'} />}
    </div>
    <div style={{position: 'absolute', left: resultLeft, top: resultTop, width: 635 + 470 * reveal(compact, 0.65, 0.35)}}>
      <Caption>{phrase ? 'СОВПАДЕНИЕ ФРАЗЫ' : 'РЕЗУЛЬТАТ'}</Caption>
      {articles.map((article, index) => {
        const isExcluded = phrase ? index !== 0 : index === 2;
        const dim = isExcluded ? 1 - 0.78 * (phrase ? 1 : excluded) : 1;
        return <div key={article.id} style={{
          padding: `${index === 2 ? 24 * (1 - collapseExcluded) : 24}px 0`,
          borderBottom: `1px solid ${theme.line}`, opacity: dim * (index === 2 ? 1 - collapseExcluded : 1),
          maxHeight: index === 2 ? 180 * (1 - collapseExcluded) : undefined,
          overflow: 'hidden', boxSizing: 'border-box',
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', gap: 20, fontSize: 29, lineHeight: 1.35}}>
            <span style={{textDecoration: index === 2 && excluded > 0.5 ? 'line-through' : undefined}}>{article.title}</span>
            <span style={{fontFamily: theme.fontMono, fontSize: 25, color: accent, opacity: ranked}}>{article.rank}</span>
          </div>
          {index === 0 && phrase ? <div style={{fontSize: 25, color: accent, marginTop: 16}}>…мёртвые строки убирает vacuum</div> : null}
          {index === 1 && !phrase ? <div style={{fontSize: 23, color: theme.muted, marginTop: 16}}>В тексте: «очередь на удаление»</div> : null}
          {index === 2 ? <div style={{fontSize: 23, color: theme.signal, marginTop: 16, opacity: excluded}}>Исключён: kafka</div> : null}
        </div>;
      })}
      <Appear timeMs={timeMs} at={6000} style={{fontSize: 25, color: theme.muted, marginTop: 25}}>ts_rank ↓</Appear>
    </div>
  </div>;
};
