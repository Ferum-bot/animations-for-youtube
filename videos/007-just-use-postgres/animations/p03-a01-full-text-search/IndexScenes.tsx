import React from 'react';
import {articles, words} from './data';
import {reveal} from './timing';
import {accent, Appear, Caption, theme, type ShotProps} from './ui';

export const InvertedIndex: React.FC<ShotProps> = ({timeMs}) => {
  const selected = reveal(timeMs, 1600, 650);
  return <div style={{position: 'relative', height: 570}}>
    <div style={{position: 'absolute', left: 0}}><Caption>ТЕРМ</Caption></div>
    <div style={{position: 'absolute', left: 800}}><Caption>ДОКУМЕНТЫ</Caption></div>
    <svg width="1400" height="540" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {[105, 275, 445].map(y => <path key={y} d={`M 430 115 C 620 115, 610 ${y}, 765 ${y}`}
        fill="none" stroke={accent} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - selected} />)}
    </svg>
    {['очеред', 'воркер', 'postgr'].map((term, index) => <div key={term} style={{position: 'absolute', left: 0, top: 65 + index * 170, width: 420,
      borderBottom: `2px solid ${index === 0 && selected > 0 ? accent : theme.line}`, paddingBottom: 28,
      color: index === 0 ? accent : theme.muted, fontFamily: theme.fontMono, fontSize: 53}}>
      {term}<span style={{fontSize: 23, display: 'block', marginTop: 18, opacity: index === 0 ? selected : 0}}>01 · 02 · 03</span>
    </div>)}
    {articles.map((article, index) => <Appear key={article.id} timeMs={timeMs} at={index * 150} style={{position: 'absolute', top: 58 + index * 170, left: 800, width: 590}}>
      <div style={{borderLeft: `3px solid ${selected > 0.4 ? accent : theme.line}`, paddingLeft: 26}}>
        <div style={{fontSize: 31, lineHeight: 1.25}}><span style={{color: theme.muted, fontFamily: theme.fontMono, marginRight: 20, fontSize: 22}}>{article.id}</span>{article.title}</div>
        <div style={{fontSize: 24, color: theme.muted, marginTop: 18, lineHeight: 1.4}}>{index === 0 ? 'Воркеры забирают задачи…' : article.body}</div>
      </div>
    </Appear>)}
    <div style={{position: 'absolute', top: 535, fontSize: 27, color: theme.muted, opacity: selected}}>Один терм хранит ссылки на несколько документов</div>
  </div>;
};

export const Analyzer: React.FC<ShotProps> = ({timeMs}) => {
  const lower = timeMs >= 1800;
  const stem = timeMs >= 3800;
  return <>
    <Caption>ПРИМЕР ЯЗЫКОВОГО АНАЛИЗАТОРА / RUSSIAN</Caption>
    <div style={{fontSize: 44, marginTop: 35, color: theme.muted}}>Воркеры забирали задачи из очереди</div>
    <div style={{display: 'flex', gap: 35, marginTop: 85}}>
      {words.map((word, index) => <Appear key={word.position} timeMs={timeMs} at={400 + index * 100} style={{width: 245, opacity: 1}}>
        <div style={{borderTop: `2px solid ${theme.line}`, paddingTop: 30, fontFamily: theme.fontMono, fontSize: 42, color: stem ? accent : theme.text,
          opacity: stem && !word.stem ? 0.18 : 1}}>{stem ? word.stem || 'из' : lower ? word.word.toLowerCase() : word.word}</div>
      </Appear>)}
    </div>
    <div style={{display: 'flex', gap: 65, marginTop: 105, fontSize: 29}}>
      <span style={{color: accent}}>01 / Разделить</span>
      <span style={{color: lower ? accent : theme.muted}}>02 / Нижний регистр</span>
      <span style={{color: stem ? accent : theme.muted}}>03 / Стемминг</span>
    </div>
  </>;
};

export const Elk: React.FC<ShotProps> = ({timeMs}) => {
  const expanded = reveal(timeMs, 2200, 700);
  const initials = reveal(timeMs, 8100);
  const nodes = [
    {name: 'Logstash', role: 'Собирает данные', at: 2500},
    {name: 'Elasticsearch', role: 'Индексирует и ищет', at: 0},
    {name: 'Kibana', role: 'Графики и дашборды', at: 5100},
  ] as const;
  return <>
    <div style={{display: 'flex', gap: 55, fontSize: 29, color: theme.muted, marginBottom: 100}}>
      <span>Распределённость</span><span>Агрегации</span><span style={{color: accent}}>Из коробки</span>
    </div>
    <div style={{position: 'relative', height: 220}}>
      <svg width="1400" height="180" style={{position: 'absolute', opacity: expanded}}>
        {[420, 910].map((x, index) => <g key={x} style={{opacity: reveal(timeMs, index === 0 ? 3300 : 5800)}}>
          <path d={`M${x} 38 h55 m-12 -8 l12 8 -12 8`} stroke={theme.muted} strokeWidth={2} fill="none" />
        </g>)}
      </svg>
      {nodes.map((node, index) => <Appear key={node.name} timeMs={timeMs} at={node.at} style={{position: 'absolute', left: index * 490, top: 0, width: 410}}>
        <div style={{fontSize: 49, fontWeight: 600, letterSpacing: -1.5}}><span style={{color: initials > 0 ? accent : theme.text}}>{node.name[0]}</span>{node.name.slice(1)}</div>
        <div style={{fontSize: 27, color: theme.muted, marginTop: 30, lineHeight: 1.5}}>{node.role}</div>
      </Appear>)}
    </div>
    <Appear timeMs={timeMs} at={8100} style={{marginTop: 45, borderTop: `2px solid ${theme.line}`, paddingTop: 35}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 45}}><span style={{fontSize: 76, color: accent, fontWeight: 600, letterSpacing: 10}}>ELK</span><span style={{fontSize: 30, color: theme.muted}}>Elasticsearch · Logstash · Kibana</span></div>
    </Appear>
  </>;
};
