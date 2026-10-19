import React from 'react';
import {cues, reveal, type SceneProps} from './timing';
import {accent, Caption, Content, Heading, success, theme} from './ui';

const events = ['WorkflowStarted', 'ActivityScheduled', 'ActivityCompleted', 'TimerFired'] as const;

export const History: React.FC<SceneProps> = ({timeMs}) => {
  const elapsed = timeMs - cues.history;
  const restart = reveal(elapsed, 4500, 550);
  const replay = reveal(elapsed, 4900, 1200);
  const recovered = reveal(elapsed, 6200, 450);
  const traffic = reveal(timeMs, cues.writes, 650);
  return <Content>
    <Heading title={traffic > .5 ? 'Каждое событие — запись' : 'История переживает сбой'} />
    <div style={{position: 'absolute', top: 166, left: 0, width: 430}}>
      <Caption>Процесс, выполняющий workflow</Caption>
      <div style={{marginTop: 24, height: 235, border: `2px solid ${elapsed > 3900 && elapsed < 4800 ? theme.signal : theme.line}`,
        padding: '32px', boxSizing: 'border-box'}}>
        <div style={{fontSize: 37, fontWeight: 600}}>Temporal worker</div>
        <div style={{fontSize: 29, color: elapsed > 3900 && elapsed < 4800 ? theme.signal : success, marginTop: 25}}>
          {elapsed < 3900 ? 'Выполняет шаги' : elapsed < 4800 ? 'Сбой процесса' : elapsed < 6200 ? 'Восстанавливается' : 'Продолжает работу'}
        </div>
        <div style={{fontFamily: theme.fontMono, color: theme.muted, marginTop: 20, fontSize: 20}}>workflow / звонок</div>
      </div>
      <div style={{opacity: restart * (1 - traffic), marginTop: 28, fontSize: 27, lineHeight: 1.35}}>
        История остаётся в базе.<br /><span style={{color: success}}>Replay восстанавливает ход workflow.</span>
      </div>
    </div>
    <svg width="1408" height="470" style={{position: 'absolute', top: 170, left: 0, pointerEvents: 'none'}}>
      <path d="M430 130 H670" stroke={theme.line} strokeWidth="3" fill="none" />
      {events.map((_, i) => {
        const p = reveal(elapsed, 500 + i * 700, 550);
        return p > 0 && p < 1 ? <rect key={i} x={430 + p * 230} y={123} width="15" height="15" fill={accent} /> : null;
      })}
      <path d="M670 340 H550 V225 H430" stroke={success} strokeWidth="3" fill="none" pathLength="1"
        strokeDasharray="1" strokeDashoffset={1 - replay} opacity={(1 - traffic) * restart} />
      <path d="M440 218 L430 225 L440 232" fill="none" stroke={success} strokeWidth="3" opacity={recovered * (1 - traffic)} />
    </svg>
    <div style={{position: 'absolute', left: 670, top: 166, width: 738}}>
      <Caption>Сохранённая история в базе</Caption>
      <div style={{marginTop: 24, borderTop: `2px solid ${theme.line}`}}>
        {events.map((event, i) => <div key={event} style={{height: 75, display: 'flex', alignItems: 'center',
          borderBottom: `1px solid ${theme.line}`, opacity: reveal(elapsed, 1050 + i * 700, 200)}}>
          <span style={{width: 56, fontFamily: theme.fontMono, fontSize: 22, color: theme.muted}}>0{i + 1}</span>
          <span style={{fontFamily: theme.fontMono, fontSize: 25}}>{event}</span>
          <span style={{marginLeft: 'auto', fontSize: 22, color: success}}>записано</span>
        </div>)}
      </div>
    </div>
    <div style={{position: 'absolute', top: 595, width: '100%', borderTop: `2px solid ${theme.line}`, paddingTop: 30}}>
      <div style={{opacity: 1 - traffic, fontSize: 31}}>Сохраняются события — по ним восстанавливается состояние процесса.</div>
      <div style={{position: 'absolute', top: 28, display: 'flex', gap: 70, alignItems: 'center', opacity: traffic}}>
        <div style={{fontSize: 28, lineHeight: 1.4}}>Много параллельных<br />workflow</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(16, 19px)', gap: 10}}>
          {Array.from({length: 48}, (_, i) => <div key={i} style={{height: 12, background: accent,
            opacity: reveal(timeMs, cues.writes + i * 18, 150)}} />)}
        </div>
        <div style={{fontSize: 32, color: accent}}>Поток записей в базу</div>
      </div>
    </div>
  </Content>;
};
