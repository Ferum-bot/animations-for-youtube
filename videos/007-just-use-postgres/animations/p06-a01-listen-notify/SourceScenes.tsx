import React from 'react';
import {listenerSource, producerSource} from './sources';
import {sql} from './data';
import {reveal} from './timing';
import {accent, Appear, Caption, Code, Fanout, Note, theme, type ShotProps} from './ui';

export const Channel: React.FC<ShotProps> = ({timeMs}) => <>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40}}>
    <div><Caption>ПОДПИСЧИК</Caption><Code text={sql.listen} size={31} active={timeMs >= 6060 ? 'LISTEN' : undefined} /></div>
    <div><Caption>ОТПРАВИТЕЛЬ</Caption><Code text={sql.notify} size={31} active={timeMs >= 9240 ? 'NOTIFY' : undefined} /></div>
  </div>
  <div style={{marginTop: 28}}><Fanout connected={timeMs >= 6060} progress={reveal(timeMs, 10100, 1800)} /></div>
  <Appear timeMs={timeMs} at={6060}><Note>LISTEN регистрирует сессию. Соединение остаётся открытым.</Note></Appear>
</>;

const SourceLayout: React.FC<React.PropsWithChildren> = ({children}) =>
  <div style={{display: 'grid', gridTemplateColumns: '1060px 1fr', gap: 40, alignItems: 'start'}}>{children}</div>;

export const Listener: React.FC<ShotProps> = ({timeMs}) => {
  const scroll = 10 * 36 + 9 * 36 * reveal(timeMs, 3000, 1600) + 5 * 36 * reveal(timeMs, 7300, 1000);
  return <SourceLayout>
    <Code text={listenerSource} label="GO / LISTENER.GO" size={24} viewportHeight={468} scrollY={scroll} active={timeMs < 4600 ? 'pgx.Connect' : timeMs < 7600 ? 'LISTEN' : 'WaitForNotification'} />
    <div>
      <Caption>PGX V5</Caption>
      <div style={{fontSize: 34, lineHeight: 1.4}}>3 сервиса.<br />3 постоянных<br />соединения.</div>
      <Appear timeMs={timeMs} at={3000}><Note>Канал<br /><span style={{fontFamily: theme.fontMono, fontSize: 22, color: accent}}>cache_invalidation</span></Note></Appear>
      <Appear timeMs={timeMs} at={7300}><Note>Ожидаем сигнал.<br />Читаем Channel<br />и Payload.</Note></Appear>
    </div>
  </SourceLayout>;
};

export const Producer: React.FC<ShotProps> = ({timeMs}) => {
  const scroll = 9 * 36 * reveal(timeMs, 1800, 1000) + 6 * 36 * reveal(timeMs, 4700, 1200);
  const active = timeMs < 1800 ? 'pool.Begin' : timeMs < 4700 ? 'UPDATE products' : 'pg_notify';
  return <SourceLayout>
    <Code text={producerSource} label="GO / CHANGEPRICE" size={24} viewportHeight={468} scrollY={scroll} active={active} />
    <div><Caption>ПРИМЕР / PRODUCT:1</Caption>
      {['BEGIN', 'UPDATE', 'pg_notify', 'COMMIT'].map((step, index) => <div key={step} style={{padding: '23px 0', borderBottom: `2px solid ${theme.line}`, fontFamily: theme.fontMono, fontSize: 32, color: index === 3 ? theme.muted : accent}}>{step}</div>)}
      <Note>Сигнал пока<br />не доставлен.</Note>
    </div>
  </SourceLayout>;
};

export const Trigger: React.FC<ShotProps> = ({timeMs, compact}) => <div style={{display: 'grid', gridTemplateColumns: `${900 - compact * 280}px 1fr`, gap: 40, alignItems: 'start'}}>
  <Code text={sql.trigger} size={25 - compact * 3} active={timeMs < 2540 ? 'CREATE TRIGGER' : 'pg_notify'} />
  <div>
    <Caption>ТАБЛИЦА JOBS</Caption>
    {[
      ['INSERT', 'Новая задача'], ['TRIGGER', "Канал new_job, payload emails"],
      ['COMMIT', 'Уведомление доставлено'], ['ВОРКЕРЫ', 'Читают задачи из jobs'],
    ].map(([step, detail], index) => <Appear key={step} timeMs={timeMs} at={index * 850 + 2000}>
      <div style={{borderLeft: `3px solid ${accent}`, padding: '10px 20px', marginTop: 24}}>
        <div style={{fontSize: 28, color: accent, fontFamily: theme.fontMono}}>{step}</div>
        <div style={{fontSize: 25, lineHeight: 1.4, marginTop: 8}}>{detail}</div>
      </div>
    </Appear>)}
  </div>
</div>;
