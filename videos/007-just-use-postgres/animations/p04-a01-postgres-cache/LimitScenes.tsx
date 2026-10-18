import React from 'react';
import {benchmarks, cache, sql} from './data';
import {reveal} from './timing';
import {accent, CacheEntry, Code, Label, Note, Reveal, theme, type ShotProps} from './ui';

const Rule: React.FC<React.PropsWithChildren<{readonly title: string; readonly color?: string}>> = ({title, color = accent, children}) =>
  <div style={{borderTop: `2px solid ${theme.line}`, padding: '28px 0', marginTop: 20}}>
    <Label color={color}>{title}</Label><div style={{fontSize: 34, lineHeight: 1.4}}>{children}</div>
  </div>;

export const Storage: React.FC<ShotProps> = ({timeMs}) => <>
  <Rule title="ДИСК / ФАЙЛЫ ТАБЛИЦЫ"><span style={{fontFamily: theme.fontMono}}>cache</span> хранится на диске</Rule>
  <Reveal timeMs={timeMs} at={2300}>
    <div style={{fontSize: 38, color: theme.muted, padding: '15px 0'}}>↕</div>
    <Rule title="RAM / БУФЕРЫ POSTGRES">Горячие страницы — в памяти</Rule>
  </Reveal>
  <Note>UNLOGGED убирает запись изменений в WAL.<br />Таблица от этого не становится in-memory.</Note>
</>;

export const Benchmark: React.FC = () => <>
  <Label>ЧТЕНИЕ ПО КЛЮЧУ / ОПУБЛИКОВАННЫЙ ТЕСТ</Label>
  <div style={{borderTop: `2px solid ${theme.line}`, marginTop: 30}}>
    {[
      {name: 'Redis', value: benchmarks.read.redisP50Ms, metric: 'p50 · медиана'},
      {name: 'Postgres UNLOGGED', value: benchmarks.read.postgresMeanMs, metric: 'mean · среднее'},
    ].map(row => <div key={row.name} style={{padding: '34px 0', borderBottom: `2px solid ${theme.line}`}}>
      <div style={{fontSize: 33, marginBottom: 15}}>{row.name}</div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{fontFamily: theme.fontMono, fontSize: 60, color: accent}}>{row.value} мс</span>
        <span style={{fontSize: 27, color: theme.muted}}>{row.metric}</span>
      </div>
    </div>)}
  </div>
  <Note>Разные статистики: это не универсальное «в 7 раз».</Note>
  <div style={{fontSize: 23, color: theme.muted, marginTop: 30, lineHeight: 1.5}}>Источник: {benchmarks.read.source}<br />Can Postgres replace Redis as a cache?</div>
</>;

export const RequestPath: React.FC<ShotProps> = ({timeMs}) => <>
  <Rule title="ОБА МОГУТ ЧИТАТЬ ИЗ ПАМЯТИ">Но путь запроса отличается.</Rule>
  <Reveal timeMs={timeMs} at={8440}>
    <Label>POSTGRES / SQL</Label>
    <div style={{display: 'flex', alignItems: 'center', gap: 24, fontSize: 31, margin: '30px 0 18px'}}>
      {['Разбор', 'План', 'Выполнение'].map((text, index) => <React.Fragment key={text}>
        {index ? <span style={{color: theme.muted}}>→</span> : null}<span>{text}</span>
      </React.Fragment>)}
    </div>
    <div style={{borderTop: `3px solid ${accent}`, paddingTop: 18, fontSize: 25, color: theme.muted}}>В контексте транзакции · разбор и план могут переиспользоваться</div>
  </Reveal>
  <Reveal timeMs={timeMs} at={13000} style={{marginTop: 60}}>
    <Code text={sql.redisGet} label="REDIS" size={35} />
    <Note>Команда → поиск по ключу → значение</Note>
  </Reveal>
</>;

export const Crash: React.FC<ShotProps> = ({timeMs}) => {
  const lost = reveal(timeMs, 1600, 250);
  const recovered = reveal(timeMs, 1890, 300);
  return <>
    <Label color={theme.signal}>{timeMs < 1600 ? 'АВАРИЙНАЯ ОСТАНОВКА' : 'ПОСЛЕ ВОССТАНОВЛЕНИЯ'}</Label>
    <div style={{height: 280, position: 'relative', marginTop: 40}}>
      <CacheEntry opacity={1 - lost} />
      <div style={{position: 'absolute', top: 25, opacity: recovered}}>
        <div style={{fontFamily: theme.fontMono, fontSize: 52, color: theme.signal}}>cache: 0 строк</div>
        <Note>UNLOGGED-таблица очищена.</Note>
      </div>
    </div>
    <Reveal timeMs={timeMs} at={4260}><Rule title="STANDBY / РЕПЛИКА" color={theme.signal}>Содержимое UNLOGGED-таблицы<br />не реплицируется.</Rule></Reveal>
    <Reveal timeMs={timeMs} at={6800}><Note>Для кэша потеря допустима:<br />значения можно получить заново.</Note></Reveal>
  </>;
};

export const Ttl: React.FC<ShotProps> = ({timeMs}) => <>
  <Code text={sql.redisSet} label="REDIS" size={31} active="EX 300" />
  <div style={{fontSize: 27, color: theme.muted, margin: '22px 0 45px'}}>EX 300 — срок жизни 5 минут</div>
  <Reveal timeMs={timeMs} at={650}><Rule title="POSTGRES / СРОК ЖИЗНИ">Проверить expires_at при чтении.<br />Удалить истёкшее фоновой задачей.</Rule></Reveal>
  <Reveal timeMs={timeMs} at={3480}><Rule title="POSTGRES / ЛИМИТ РАЗМЕРА" color={theme.signal}>Решить, какие записи вытеснять,<br />и реализовать свою политику.</Rule></Reveal>
</>;

export const Vacuum: React.FC<ShotProps> = ({timeMs}) => {
  const removed = reveal(timeMs, 4800, 250);
  const vacuumed = reveal(timeMs, 5090, 300);
  return <>
    <Code text={sql.cleanup} size={34} active="DELETE" />
    <div style={{marginTop: 45}}>
      <Label>СТРАНИЦА ТАБЛИЦЫ / ОДНА ВЕРСИЯ СТРОКИ</Label>
      <div style={{position: 'relative', height: 190, border: `2px solid ${theme.line}`, padding: 25, boxSizing: 'border-box'}}>
        <div style={{opacity: 1 - removed, borderLeft: `5px solid ${theme.signal}`, paddingLeft: 24}}>
          <div style={{fontFamily: theme.fontMono, fontSize: 34}}>{cache.key}</div>
          <div style={{color: theme.signal, fontSize: 30, marginTop: 24}}>Мёртвая версия после DELETE</div>
        </div>
        <div style={{position: 'absolute', left: 30, top: 34, opacity: vacuumed, color: accent, fontSize: 35, lineHeight: 1.5}}>Место снова доступно<br />для новых записей</div>
      </div>
    </div>
    <Reveal timeMs={timeMs} at={2600}>
      <div style={{fontSize: 43, color: accent, marginTop: 35, fontFamily: theme.fontMono}}>VACUUM</div>
      <Note>Убирает версии, которые больше<br />не нужны ни одной транзакции.</Note>
    </Reveal>
    <Reveal timeMs={timeMs} at={6960}><div style={{fontSize: 25, color: theme.muted, marginTop: 38}}>Подробнее — в главе про MVCC и VACUUM.</div></Reveal>
  </>;
};
