import React from 'react';
import {Img, staticFile} from 'remotion';
import {getTheme} from '@channel/theme';
import {smoothProgress} from '@channel/motion-core';
import {cues, scene, searchTiming} from './scene';
import {asset, inboxSource} from './sources';
import {SceneSurface} from './SceneSurface';

const messages = [
  {sender: 'Анна', before: 'Завтра ', after: ' в 10:00.'},
  {sender: 'Михаил', before: 'Наша ', after: ' у офиса.'},
  {sender: 'Ольга', before: 'Когда следующая ', after: '?'},
] as const;

/** Fictional Russian examples remain visibly distinct from the archival image. */
export const InboxScene: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const theme = getTheme('paper');
  // Clear the archival text before introducing the fictional example: avoid
  // superimposed headings or Russian text appearing inside the historical UI.
  const archive = 1 - smoothProgress(timeMs, searchTiming.demonstrationMs, searchTiming.demonstrationMs + 200);
  const demo = smoothProgress(timeMs, searchTiming.demonstrationMs + 200, searchTiming.demonstrationMs + 420);
  const count = Math.floor(7 * Math.max(0, Math.min(1,
    (timeMs - searchTiming.typeStartMs) / (searchTiming.typeEndMs - searchTiming.typeStartMs))));
  const query = 'встреча'.slice(0, count);
  const results = smoothProgress(timeMs, searchTiming.resultsMs, searchTiming.resultsMs + 320);
  return <SceneSurface cue={cues.inbox} timeMs={timeMs} top={350} height={700}
    background={theme.surface} label={timeMs < searchTiming.demonstrationMs + 200 ? inboxSource.label : 'INBOX SEARCH · ПРИМЕР ПОИСКА'}>
    <div style={{position: 'absolute', inset: 0, opacity: archive, padding: '58px 28px'}}>
      <div style={{fontSize: 54, fontWeight: 700, color: theme.text, marginBottom: 40}}>Facebook Inbox Search</div>
      <Img src={staticFile(asset(inboxSource.image))} alt="Реальный Inbox Search, июнь 2008"
        style={{width: scene.width - 56, display: 'block'}} />
      <div style={{fontSize: 25, color: theme.muted, marginTop: 28}}>Интерфейс Facebook · июнь 2008</div>
    </div>
    <div style={{position: 'absolute', inset: 0, padding: '42px 42px', opacity: demo,
      transform: `translateY(${18 * (1 - demo)}px)`, color: theme.text}}>
      <div style={{fontSize: 34, fontWeight: 650, marginBottom: 24}}>Поиск по сообщениям</div>
      <div style={{height: 104, display: 'flex', alignItems: 'center', gap: 24,
        border: `2px solid ${theme.primary}`, padding: '0 28px', background: theme.background}}>
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
          <circle cx="14" cy="14" r="10" stroke={theme.primary} strokeWidth="3" />
          <path d="M22 22L31 31" stroke={theme.primary} strokeWidth="3" />
        </svg>
        <span style={{fontSize: 56, fontWeight: 650}}>{query || <span style={{color: theme.muted, fontWeight: 400}}>Слово в сообщении</span>}</span>
        {timeMs >= searchTiming.typeStartMs && timeMs < searchTiming.resultsMs ?
          <span style={{width: 3, height: 54, background: theme.primary, marginLeft: -16}} /> : null}
      </div>
      <div style={{opacity: results, transform: `translateY(${12 * (1 - results)}px)`}}>
        <div style={{fontSize: 25, color: theme.muted, padding: '20px 0 14px'}}>Найденные сообщения</div>
        {messages.map((message) => <div key={message.sender}
          style={{padding: '16px 0', borderTop: `1px solid ${theme.line}`}}>
          <div style={{fontSize: 24, color: theme.muted, marginBottom: 7}}>{message.sender}</div>
          <div style={{fontSize: 37, lineHeight: 1.3}}>{message.before}
            <span style={{fontWeight: 750, color: theme.primary,
              borderBottom: `3px solid ${theme.primary}`}}>встреча</span>{message.after}</div>
        </div>)}
      </div>
    </div>
  </SceneSurface>;
};
