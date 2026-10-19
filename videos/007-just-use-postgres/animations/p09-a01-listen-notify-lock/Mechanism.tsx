import React from 'react';
import {notifyTransaction, schema, sourceComment} from './data';
import {cues, reveal, type SceneProps} from './timing';
import {accent, CodeSnippet, graph, Label, Note, Rule, theme, Title} from './ui';

export const Transaction: React.FC<SceneProps> = ({timeMs}) => <>
  <Title>Событие о заказе — и уведомление</Title>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 34}}>
    <div>
      <Label>EVENTS · СОБЫТИЯ</Label>
      <div style={{marginTop: 18}}><CodeSnippet text={schema} size={26} /></div>
      <div style={{marginTop: 24}}><Note>id — идентификатор записи<br />payload — данные события</Note></div>
      <Rule />
      <div style={{fontFamily: theme.fontMono, fontSize: 31}}>1 <span style={{color: accent, marginLeft: 40}}>order:42</span></div>
    </div>
    <div style={{opacity: reveal(timeMs, 1300, 450)}}>
      <Label>ОДНА ТРАНЗАКЦИЯ</Label>
      <div style={{marginTop: 18}}><CodeSnippet text={notifyTransaction} size={27} active={timeMs < 4500 ? 'INSERT' : 'pg_notify'} /></div>
      <div style={{marginTop: 24}}><Note>Канал: events · сообщение: order:42</Note></div>
    </div>
  </div>
</>;

const Box: React.FC<React.PropsWithChildren<{readonly x: number; readonly y: number; readonly width: number; readonly color?: string}>> = ({children, x, y, width, color = theme.text}) =>
  <div style={{position: 'absolute', left: x, top: y, width, minHeight: 105, boxSizing: 'border-box',
    padding: '20px 24px', border: `2px solid ${color}`, background: theme.background, color, fontSize: 29, lineHeight: 1.4}}>{children}</div>;

export const QueueOrder: React.FC<SceneProps> = ({timeMs}) => {
  const queue = reveal(timeMs, cues.queue, 1100);
  const ordering = reveal(timeMs, cues.ordering, 750);
  return <>
    <Title>{timeMs < cues.queue ? 'NOTIFY пока остаётся в транзакции' : 'Общая очередь. Порядок коммитов.'}</Title>
    <div style={{position: 'relative', height: 410, marginTop: 54}}>
      <svg width={1400} height={410} style={{position: 'absolute', inset: 0}}>
        <path d="M 360 130 H 530 M 900 130 H 1040" stroke={theme.line} strokeWidth={3} fill="none" />
        <path d="M 360 300 H 500 V 170 H 530" stroke={theme.line} strokeWidth={3} fill="none" opacity={ordering} />
        <path d="M 515 120 L 530 130 L 515 140 M 1025 120 L 1040 130 L 1025 140" stroke={accent} fill="none" strokeWidth={3} />
      </svg>
      <Box x={0} y={70} width={360}>T1 <span style={{color: accent}}>NOTIFY</span><div style={{fontSize: 21}}>{queue < 1 ? 'pending · ещё не доставлено' : 'COMMIT завершён'}</div></Box>
      <Box x={530} y={70} width={370}>Очередь уведомлений<div style={{fontSize: 21}}>одна на инстанс PostgreSQL</div></Box>
      <Box x={1040} y={70} width={350} color={queue === 1 ? graph.plain : theme.muted}>Подписчики<div style={{fontSize: 21}}>этой базы и канала</div></Box>
      <div style={{position: 'absolute', left: 78 + 535 * queue, top: 205, background: theme.background,
        color: accent, fontFamily: theme.fontMono, fontSize: 30}}>order:42</div>
      <div style={{position: 'absolute', left: 382, top: 24, fontFamily: theme.fontMono, fontSize: 23, opacity: queue}}>COMMIT</div>
      <div style={{opacity: ordering}}><Box x={0} y={260} width={360}>T2 → COMMIT позже</Box></div>
      <div style={{position: 'absolute', left: 568, top: 290, opacity: ordering, fontSize: 31}}><span style={{color: accent}}>T1</span> → T2</div>
    </div>
    <Rule /><Note>Уведомления разных транзакций доставляются в порядке коммитов.<br />Незавершённая транзакция не должна задерживать уже готовые уведомления.</Note>
  </>;
};

export const GlobalLock: React.FC<SceneProps> = ({timeMs}) => {
  const busy = timeMs >= cues.contention;
  const progress = reveal(timeMs, busy ? cues.contention : cues.lock, 1500);
  return <>
    <Title>{busy ? 'Больше соединений. Тот же общий замок.' : 'Один писатель удерживает блокировку'}</Title>
    <div style={{position: 'relative', height: 440, marginTop: 32}}>
      <Label>ТРАНЗАКЦИИ С NOTIFY</Label>
      {[0, 1, 2, 3].map(i => <div key={i} style={{position: 'absolute', left: 0, top: 60 + i * 86,
        width: 355, borderBottom: `2px solid ${i ? theme.line : accent}`, padding: '12px 0',
        color: i ? theme.muted : accent, fontFamily: theme.fontMono, fontSize: 28,
        opacity: i === 0 ? 1 : progress}}>{busy && i === 3 && progress === 1 ? 'T4…T64' : `T${i + 1}`} <span style={{float: 'right'}}>{i ? 'ждёт' : 'COMMIT'}</span></div>)}
      <svg width={1400} height={420} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1, 2, 3].map(i => <path key={i} d={`M 380 ${91 + i * 86} H ${430 + i * 20} V 190 H 590`}
          fill="none" stroke={i ? theme.line : accent} strokeWidth={i ? 2 : 3} opacity={i ? progress : 1} />)}
        <path d="M 830 190 H 1000" stroke={accent} strokeWidth={3} />
        <path d="M 985 180 L 1000 190 L 985 200" stroke={accent} fill="none" strokeWidth={3} />
      </svg>
      <Box x={590} y={126} width={240} color={accent}>T1 владеет<div style={{fontSize: 21}}>общим lock</div></Box>
      <Box x={1000} y={126} width={380}>WAL → диск<div style={{fontSize: 21}}>завершение COMMIT</div></Box>
      <div style={{position: 'absolute', top: 295, left: 590, width: 790}}><Note>Блокировка удерживается до конца коммита.<br />Следующий писатель ждёт её освобождения.</Note></div>
    </div>
    <Rule />
    <div style={{fontSize: 32, color: busy ? accent : theme.text}}>{busy ? 'Ядра и подключения не расширяют этот участок.' : 'Общий объект инстанса — не строка и не таблица.'}</div>
  </>;
};

export const SourceCode: React.FC<SceneProps> = ({timeMs}) => <>
  <Title kicker="POSTGRESQL 17 / SRC/BACKEND/COMMANDS/ASYNC.C">«Serialize writers…»</Title>
  <div style={{transform: `scale(${1 + .018 * reveal(timeMs, cues.source + 1700, 1400)})`, transformOrigin: 'top left', width: 1350}}>
    <CodeSnippet text={sourceComment} label="C · async.c" size={27} active={timeMs < cues.source + 3400 ? 'Serialize writers' : 'AccessExclusiveLock'} />
  </div>
  <div style={{marginTop: 30}}><Note>Писатели сериализуются, чтобы записи очереди соответствовали порядку коммитов.</Note></div>
</>;
