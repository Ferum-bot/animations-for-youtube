import React from 'react';
import {fields, sql} from './data';
import {reveal} from './timing';
import {accent, Appear, Caption, Code, Columns, Explanation, JobRow, secondWorker, theme, type ShotProps} from './ui';

export const Table: React.FC<ShotProps> = () => <Columns wide>
  <div><Code text={sql.create} size={28} /><div style={{marginTop: 20}}><Code text={sql.index} size={25} /></div></div>
  <div>{fields.map(([field, meaning]) => <div key={field} style={{marginBottom: 25}}>
    <div style={{fontSize: 27, fontFamily: theme.fontMono, color: accent, marginBottom: 6}}>{field}</div>
    <div style={{fontSize: 25, lineHeight: 1.3}}>{meaning}</div>
  </div>)}</div>
</Columns>;

export const Locks: React.FC<ShotProps> = ({timeMs}) => {
  const a = timeMs >= 2940;
  const b = timeMs >= 7800;
  return <Columns>
    <div><Code text={sql.lock} size={31} active="FOR UPDATE" />
      <Explanation>Демо: по две задачи на воркера.<br />Транзакция A пока открыта.</Explanation>
      <Appear timeMs={timeMs} at={7800}><Explanation>Воркер B пропускает занятые строки.</Explanation></Appear>
    </div>
    <div><Caption>JOBS / ГОТОВЫЕ ЗАДАЧИ</Caption>
      {[1, 2, 3, 4].map(id => <JobRow key={id} id={id} status={id <= 2 && a ? 'lock: A' : id > 2 && b ? 'lock: B' : 'ready'} color={id <= 2 && a ? accent : id > 2 && b ? secondWorker : theme.muted} />)}
      <Appear timeMs={timeMs} at={2940}><div style={{fontSize: 30, color: accent, marginTop: 28}}>A получает: 1, 2</div></Appear>
      <Appear timeMs={timeMs} at={7800}><div style={{fontSize: 30, color: secondWorker, marginTop: 22}}>B получает: 3, 4 — без ожидания</div></Appear>
    </div>
  </Columns>;
};

export const Lease: React.FC<ShotProps> = ({timeMs}) => {
  const crashed = timeMs >= 7320;
  const reassigned = timeMs >= 9780;
  return <Columns wide>
    <Code text={sql.lease} size={26} active={reassigned ? "state = 'running' AND" : 'locked_until ='} />
    <div>
      <Caption>ЗАДАЧА #1 / EMAILS</Caption>
      <div style={{fontSize: 34, color: reassigned ? secondWorker : crashed ? theme.signal : accent}}>Воркер {reassigned ? 'B' : 'A'}{crashed && !reassigned ? ' недоступен' : ''}</div>
      <div style={{fontFamily: theme.fontMono, fontSize: 29, marginTop: 30}}>state: running</div>
      <Appear timeMs={timeMs} at={3020}>
        <Explanation>Аренда на 5 минут</Explanation>
        <div style={{height: 6, background: theme.line, marginTop: 20}}><div style={{height: '100%', width: `${reassigned ? 100 : 100 * (1 - reveal(timeMs, 7320, 2200))}%`, background: reassigned ? secondWorker : accent}} /></div>
        <div style={{fontSize: 21, color: theme.muted, marginTop: 12}}>Условная шкала времени</div>
        <Explanation>После COMMIT:<br />блокировка снята,<br />аренда действует.</Explanation>
      </Appear>
      <Appear timeMs={timeMs} at={9780}><Explanation>Срок истёк →<br />B получает новую аренду.</Explanation></Appear>
    </div>
  </Columns>;
};

export const Transaction: React.FC<ShotProps> = ({timeMs, compact}) => {
  const rollback = timeMs >= 11760;
  const settled = rollback ? timeMs >= 13700 : timeMs >= 8500;
  const codeOpacity = 1 - reveal(timeMs, 11500, 200) + reveal(timeMs, 11760, 250);
  return <>
    <div style={{opacity: codeOpacity}}><Code text={rollback ? sql.rollback : sql.commit} size={31 - compact * 3} active={rollback ? 'ROLLBACK' : 'COMMIT'} /></div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44, marginTop: 30}}>
      {[
        {name: 'orders / заказ', value: rollback ? '#2 · user 8 · 590 ₽' : '#1 · user 7 · 1990 ₽'},
        {name: 'jobs / задача', value: rollback ? 'emails · order_id: 2' : 'emails · order_id: 1'},
      ].map(row => <div key={row.name} style={{borderLeft: `3px solid ${rollback ? theme.signal : accent}`, paddingLeft: 24}}>
        <Caption>{row.name}</Caption><div style={{fontSize: 30, fontFamily: theme.fontMono, opacity: rollback && settled ? 0.35 : 1, textDecoration: rollback && settled ? 'line-through' : 'none'}}>{row.value}</div>
        <div style={{fontSize: 27, marginTop: 18, color: rollback ? theme.signal : accent}}>{settled ? rollback ? 'Откатили' : 'Сохранено' : 'Внутри транзакции'}</div>
      </div>)}
    </div>
    <Explanation>{!settled ? 'Оба INSERT выполняются внутри одной транзакции.' : rollback ? 'После обоих примеров: 1 заказ и 1 задача — от первого COMMIT.' : 'COMMIT сохраняет задачу. Письмо отправит воркер после коммита.'}</Explanation>
  </>;
};
