import React from 'react';
import {sql} from './data';
import {poolTiming, reveal} from './timing';
import {FixedSessionDiagram, PoolDiagram} from './PoolDiagram';
import {accent, Appear, Caption, Code, Fanout, Note, theme, type ShotProps} from './ui';

export const Offline: React.FC<ShotProps> = ({timeMs}) => <>
  <Fanout channel="new_job" sender="INSERT jobs" lastOnline={timeMs < 2520 || timeMs >= 7800} progress={reveal(timeMs, 5100, 1800)} />
  <div style={{fontSize: 34, color: theme.signal, marginTop: 30, minHeight: 82, lineHeight: 1.4}}>
    {timeMs < 2520 ? 'Доставка только активным подписчикам.' : timeMs < 7800 ? 'Сервис 3 отключён. Сигнал проходит мимо.' : 'Подключился снова — старый сигнал не пришёл.'}
  </div>
  <Appear timeMs={timeMs} at={8520} style={{marginTop: 35}}>
    <Caption>JOBS / ДАННЫЕ ОСТАЛИСЬ В ТАБЛИЦЕ</Caption>
    <div style={{borderTop: `2px solid ${theme.line}`, borderBottom: `2px solid ${theme.line}`, padding: '28px 0', fontFamily: theme.fontMono, fontSize: 29, lineHeight: 1.6}}>
      id: 1 · queue: emails<br />payload: {'{"order_id": 1}'}
    </div>
    <Note>Данные — в таблицу. NOTIFY — чтобы разбудить.<br />После подключения: LISTEN → проверить таблицу.</Note>
  </Appear>
</>;

export const Payload: React.FC<ShotProps> = ({timeMs}) => <>
  <Caption>PAYLOAD / В КОНФИГУРАЦИИ ПО УМОЛЧАНИЮ</Caption>
  <div style={{display: 'flex', gap: 70, alignItems: 'baseline', margin: '40px 0', fontFamily: theme.fontMono}}>
    <div><div style={{fontSize: 57, color: accent}}>7999</div><Note>байт — допустимо</Note></div>
    <div><div style={{fontSize: 57, color: theme.signal}}>8000</div><Note warning>байт — ошибка</Note></div>
  </div>
  <Code text={sql.oversize} size={30} active="8000" />
  <Appear timeMs={timeMs} at={2400} style={{marginTop: 24}}><Code text="ERROR: payload string too long" label="POSTGRES / ERROR" size={31} /></Appear>
  <Note>Считаются байты, а не символы.</Note>
</>;

export const Pool: React.FC<ShotProps> = ({timeMs}) => <>
  <Caption>PGBOUNCER / TRANSACTION POOLING</Caption>
  <PoolDiagram timeMs={timeMs} />
  <Appear timeMs={timeMs} at={poolTiming.explanationMs}>
    <div style={{fontSize: 34, color: theme.signal, margin: '30px 0'}}>LISTEN здесь не поддерживается.</div>
  </Appear>
  <Appear timeMs={timeMs} at={poolTiming.fixedSessionMs} style={{borderTop: `2px solid ${theme.line}`, paddingTop: 28}}>
    <Caption>ДЛЯ LISTEN / ПРЯМОЕ СОЕДИНЕНИЕ ИЛИ SESSION POOLING</Caption>
    <FixedSessionDiagram />
    <Note>NOTIFY работает и в transaction pooling.</Note>
  </Appear>
</>;
