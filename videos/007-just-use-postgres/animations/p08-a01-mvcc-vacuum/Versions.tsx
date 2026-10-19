import React from 'react';
import {cues, reveal, type SceneProps} from './timing';
import {accent, Caption, CodeSnippet, Heading, Note, Rule, theme} from './ui';
import {snapshot, vacuum, vacuumLog} from './data';

const Row: React.FC<{readonly version: string; readonly value: string; readonly dead?: boolean; readonly opacity?: number}> = ({version, value, dead = false, opacity = 1}) =>
  <div style={{display: 'flex', gap: 30, alignItems: 'center', padding: '25px 0', borderBottom: `2px solid ${theme.line}`, opacity,
    fontFamily: theme.fontMono, fontSize: 32, color: dead ? theme.muted : theme.text}}>
    <span style={{width: 90}}>{version}</span><span style={{width: 160}}>id = 42</span><span>{value}</span>
    {dead ? <span style={{marginLeft: 'auto', fontSize: 22, color: theme.signal}}>старая версия</span> : null}
  </div>;

export const Versions: React.FC<SceneProps> = ({timeMs}) => {
  const updated = reveal(timeMs, cues.update + 2800);
  const deleted = reveal(timeMs, cues.delete + 500);
  const cleaning = reveal(timeMs, cues.vacuum + 400);
  const horizon = reveal(timeMs, cues.horizon);
  return <>
    <Heading title={timeMs < cues.horizon ? 'Изменяются данные. Сохраняются версии.' : 'Снимок удерживает горизонт очистки.'} />
    {timeMs < cues.horizon ? <>
      <div style={{display: 'grid', gridTemplateColumns: '440px 1fr', gap: 65}}>
        <div>
          <Caption>ЧИТАТЕЛЬ / СНИМОК ДО UPDATE</Caption>
          <div style={{marginTop: 40, fontSize: 42, color: accent}}>state = ready</div>
          <div style={{marginTop: 24}}><Note>Продолжает видеть v1,<br />пока использует этот снимок.</Note></div>
          <div style={{marginTop: 42, opacity: updated}}><Caption>ПИСАТЕЛЬ</Caption>
            <div style={{fontSize: 33, marginTop: 20}}>Создаёт v2</div>
            <Note>Чтение его не блокирует.</Note>
          </div>
        </div>
        <div><Caption>ВЕРСИИ СТРОКИ В ТАБЛИЦЕ</Caption>
          <Row version="v1" value="ready" dead={updated > 0.5} />
          <div style={{transform: `translateY(${(1 - updated) * -30}px)`}}>
            <Row version="v2" value="running" dead={deleted > 0.5} opacity={updated} />
          </div>
          <div style={{opacity: deleted, marginTop: 28}}><Note color={theme.signal}>DELETE помечает v2 удалённой.</Note></div>
          <div style={{opacity: cleaning, marginTop: 35, paddingLeft: 24, borderLeft: `3px solid ${accent}`}}>
            <Note>VACUUM удаляет версии,<br />которые уже не нужны снимкам.</Note>
          </div>
        </div>
      </div>
      <svg width={1400} height={180} viewBox="0 0 1400 180" style={{display: 'block', marginTop: 60, fontFamily: theme.fontSans}}>
        <text x={0} y={26} fill={theme.muted} fontSize={22}>ВРЕМЯ →</text>
        <line x1={0} y1={82} x2={1360} y2={82} stroke={theme.line} strokeWidth={3} />
        {[
          {x: 20, title: 'Снимок читателя', state: 1},
          {x: 440, title: 'UPDATE → v2', state: updated},
          {x: 820, title: 'DELETE v2', state: deleted},
          {x: 1160, title: 'VACUUM', state: cleaning},
        ].map(event => <g key={event.title} opacity={event.state}>
          <circle cx={event.x + 8} cy={82} r={7} fill={accent} />
          <text x={event.x} y={129} fill={theme.text} fontSize={25}>{event.title}</text>
        </g>)}
        <path d="M28 64 V48 H1080" fill="none" stroke={accent} strokeWidth={2} pathLength={1}
          strokeDasharray="1" strokeDashoffset={1 - reveal(timeMs, cues.update, 4000)} />
        <text x={600} y={30} textAnchor="middle" fill={accent} fontSize={24} opacity={updated}>Читателю по-прежнему нужна v1</text>
      </svg>
    </> : <div style={{opacity: horizon}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34}}>
        <div><Caption>СЕССИЯ 1 / УДЕРЖИВАЕТ СНИМОК</Caption><div style={{marginTop: 18}}><CodeSnippet text={snapshot} size={25} /></div></div>
        <div><Caption>СЕССИЯ 2 / ПЫТАЕТСЯ ОЧИСТИТЬ</Caption><div style={{marginTop: 18}}><CodeSnippet text={vacuum} size={27} /></div></div>
      </div>
      <div style={{position: 'relative', height: 170, marginTop: 36}}>
        <div style={{position: 'absolute', top: 60, left: 0, right: 0, borderTop: `3px solid ${theme.line}`}} />
        <div style={{position: 'absolute', top: 10, left: 280, height: 125, borderLeft: `4px solid ${accent}`}} />
        <div style={{position: 'absolute', left: 0, top: 10, fontSize: 25}}>Можно очистить</div>
        <div style={{position: 'absolute', left: 330, top: 10, fontSize: 25, color: theme.signal}}>Эти версии ещё могут понадобиться</div>
        {[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{position: 'absolute', left: 380 + i * 150, top: 44,
          width: 76, height: 33, background: theme.muted, opacity: .45}} />)}
        <div style={{position: 'absolute', left: 280, top: 140, fontSize: 23, color: accent}}>горизонт очистки</div>
      </div>
      <div style={{marginTop: 22}}><CodeSnippet label="VACUUM OUTPUT" text={vacuumLog} size={26} active="not yet removable" /></div>
    </div>}
  </>;
};

export const Lifecycle: React.FC<SceneProps> = ({timeMs}) => {
  const captured = reveal(timeMs, 82900);
  const deleted = reveal(timeMs, 86600);
  const rate = reveal(timeMs, cues.rate);
  return <>
    <Heading title="Одна задача — две мёртвые версии." kicker="ОЧЕРЕДЬ / INSERT → UPDATE → DELETE" />
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 38}}>
      {[
        {command: 'INSERT', state: 'ready', detail: 'Создали задачу', opacity: 1},
        {command: 'UPDATE', state: 'running', detail: 'Воркер захватил задачу', opacity: captured},
        {command: 'DELETE', state: 'удалена', detail: 'Работа выполнена', opacity: deleted},
      ].map(step => <div key={step.command} style={{opacity: step.opacity}}>
        <Caption>{step.command}</Caption><div style={{fontSize: 43, margin: '24px 0'}}>{step.state}</div><Note>{step.detail}</Note>
      </div>)}
    </div>
    <Rule />
    <Row version="v1" value="ready" dead={captured > .5} />
    <Row version="v2" value="running" dead={deleted > .5} opacity={captured} />
    <div style={{display: 'flex', alignItems: 'baseline', gap: 35, marginTop: 54, opacity: rate}}>
      <div style={{fontSize: 65, fontWeight: 600}}>100 <span style={{fontSize: 28, fontWeight: 400}}>задач/с</span></div>
      <div style={{fontSize: 42, color: theme.muted}}>→</div>
      <div style={{fontSize: 65, fontWeight: 600, color: theme.signal}}>≥ 200 <span style={{fontSize: 28, fontWeight: 400}}>мёртвых версий/с</span></div>
    </div>
    <div style={{marginTop: 25, opacity: rate}}><Note>В этом цикле — один UPDATE и один DELETE. Повторы добавляют версии.</Note></div>
  </>;
};
