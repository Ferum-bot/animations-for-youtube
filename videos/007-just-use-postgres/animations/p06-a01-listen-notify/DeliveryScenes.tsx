import React from 'react';
import {listenerLog, sql} from './data';
import {reveal} from './timing';
import {accent, Appear, Caption, Code, Fanout, Note, type ShotProps} from './ui';

export const Commit: React.FC<ShotProps> = ({timeMs}) => <>
  <Code text={sql.commit} size={30} active={timeMs < 900 ? 'pg_notify' : 'COMMIT'} />
  <Fanout progress={reveal(timeMs, 1100, 1500)} />
  <Appear timeMs={timeMs} at={2600}><Code text={listenerLog.first} size={27} label="ЛОГ СЛУШАТЕЛЯ / ФРАГМЕНТ" /></Appear>
</>;

export const Rollback: React.FC<ShotProps> = ({timeMs}) => <>
  <Code text={sql.rollback} size={30} active="ROLLBACK" />
  <Fanout />
  <Appear timeMs={timeMs} at={500}><Note warning>Новых уведомлений нет. Подписчики ничего не получили.</Note></Appear>
</>;

export const Dedup: React.FC<ShotProps> = ({timeMs}) => <>
  <div style={{display: 'grid', gridTemplateColumns: '800px 1fr', gap: 40}}>
    <Code text={sql.dedup} size={29} active={timeMs < 1000 ? 'NOTIFY' : 'COMMIT'} />
    <div><Caption>ОДИН КАНАЛ + ОДИН PAYLOAD</Caption>
      <div style={{fontFamily: 'inherit', fontSize: 55, color: accent, marginTop: 30}}>2 вызова → 1</div>
      <Note>В пределах одной транзакции.<br />Каждому подписчику.</Note>
    </div>
  </div>
  <Appear timeMs={timeMs} at={1600} style={{marginTop: 35}}><Code text={listenerLog.second} label="ЛОГ СЛУШАТЕЛЯ / ФРАГМЕНТ" size={29} /></Appear>
</>;
