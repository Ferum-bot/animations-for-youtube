import React from 'react';
import {cues, reveal, type SceneProps} from './timing';
import {accent, Caption, CodeSnippet, Heading, Note, theme} from './ui';
import {snapshot} from './data';

export const Blockers: React.FC<SceneProps> = ({timeMs}) => {
  const replica = timeMs >= cues.replica;
  const idle = timeMs >= cues.idle;
  const external = timeMs >= cues.external;
  const title = replica ? 'Запрос на реплике — версии на primary.' : idle ? 'Снимок остался. Работа остановилась.' : external ? 'Внешний сервис ждёт. Транзакция открыта.' : 'Кто удерживает горизонт?';
  return <>
    <Heading title={title} />
    {!replica ? <>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60}}>
        <div>
          <Caption>{idle ? 'ЗАБЫТАЯ СЕССИЯ' : external ? 'ПРИЛОЖЕНИЕ' : 'СОГЛАСОВАННЫЙ БЭКАП'}</Caption>
          <div style={{fontSize: 58, fontWeight: 600, margin: '25px 0 30px', color: accent}}>{idle ? 'idle in transaction' : external ? 'BEGIN … HTTP …' : 'pg_dump'}</div>
          <Note>{idle ? 'Открытая транзакция сохраняет снимок.' : external ? 'Ожидание ответа внутри транзакции, которая уже удерживает снимок.' : 'Снимок живёт, пока читается дамп.'}</Note>
        </div>
        <div style={{paddingTop: 45}}><CodeSnippet label={external ? 'TRANSACTION' : 'SQL'} size={25}
          text={external ? 'BEGIN;\n-- чтение / изменение данных\n-- ожидание внешнего сервиса\n-- COMMIT пока не выполнен' : snapshot} />
          <div style={{marginTop: 22}}><Note>Важен удерживаемый снимок,<br />а не сам факт открытого соединения.</Note></div>
        </div>
      </div>
      <div style={{marginTop: 70}}><Horizon progress={reveal(timeMs, cues.blockers, 1800)} /></div>
    </> : <>
      <svg width={1400} height={330} viewBox="0 0 1400 330" style={{fontFamily: theme.fontMono}}>
        <rect x={60} y={40} width={430} height={160} fill="none" stroke={theme.line} strokeWidth={2} />
        <rect x={910} y={40} width={430} height={160} fill="none" stroke={theme.line} strokeWidth={2} />
        <text x={275} y={100} textAnchor="middle" fill={theme.text} fontSize={36}>PRIMARY</text>
        <text x={275} y={150} textAnchor="middle" fill={theme.signal} fontSize={23}>сохраняет старые версии</text>
        <text x={1125} y={100} textAnchor="middle" fill={theme.text} fontSize={36}>REPLICA</text>
        <text x={1125} y={150} textAnchor="middle" fill={theme.muted} fontSize={23}>долгий запрос / снимок</text>
        <path d="M910 120 H500 m12 -9 l-12 9 12 9" fill="none" stroke={accent} strokeWidth={3}
          pathLength={1} strokeDasharray="1" strokeDashoffset={1 - reveal(timeMs, cues.replica + 1800, 900)} />
        <text x={700} y={245} textAnchor="middle" fill={accent} fontSize={29}>Обратная связь о нужном снимке</text>
      </svg>
      <CodeSnippet label="POSTGRESQL.CONF" text="hot_standby_feedback = on" size={27} />
      <div style={{marginTop: 25}}><Horizon progress={1} /></div>
    </>}
  </>;
};
const Horizon: React.FC<{readonly progress: number}> = ({progress}) => <div style={{position: 'relative', height: 160, opacity: progress}}>
  <Caption>VACUUM</Caption>
  <div style={{height: 5, width: 240, background: accent, marginTop: 40}} />
  <div style={{position: 'absolute', left: 240, top: 20, height: 100, borderLeft: `4px solid ${theme.signal}`}} />
  <div style={{position: 'absolute', left: 285, top: 45, fontSize: 33}}>Горизонт не двигается</div>
  <div style={{position: 'absolute', left: 285, top: 100}}><Note>Ненужные новым запросам версии пока нельзя удалить.</Note></div>
</div>;
