import React from 'react';
import {benchmarks, cache, sql} from './data';
import {reveal} from './timing';
import {accent, CacheEntry, Code, Label, Note, Reveal, theme, type ShotProps} from './ui';

const Columns: React.FC<React.PropsWithChildren> = ({children}) =>
  <div style={{display: 'grid', gridTemplateColumns: '850px 1fr', gap: 48, alignItems: 'start'}}>{children}</div>;

export const Unlogged: React.FC<ShotProps> = ({timeMs}) => {
  const unlogged = timeMs >= 5480;
  return <>
    <Columns>
      <Code text={unlogged ? sql.create : sql.create.replace('UNLOGGED ', '')} size={31} active={unlogged ? 'UNLOGGED' : undefined} />
      <div style={{paddingTop: 24}}>
        <Label>ТАБЛИЦА НА ДИСКЕ</Label>
        <div style={{fontSize: 42, fontFamily: theme.fontMono}}>cache</div>
        <Reveal timeMs={timeMs} at={7600}>
          <div style={{borderTop: `2px solid ${theme.line}`, marginTop: 32, paddingTop: 28, fontSize: 31, lineHeight: 1.4}}>
            Изменения этой таблицы<br /><span style={{color: accent}}>не записываются в WAL</span>
          </div>
        </Reveal>
      </div>
    </Columns>
    <Reveal timeMs={timeMs} at={12640} style={{marginTop: 40}}>
      <Label>СРЕДНЯЯ ЗАДЕРЖКА ТРАНЗАКЦИИ / PGBENCH</Label>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 48, fontFamily: theme.fontMono, fontSize: 34}}>
        <span style={{color: theme.muted}}>LOGGED {benchmarks.write.loggedMs} мс</span>
        <span style={{color: accent}}>UNLOGGED {benchmarks.write.unloggedMs} мс</span>
      </div>
      <div style={{marginTop: 18, color: theme.muted, fontSize: 22}}>{benchmarks.write.source} · результат конкретного теста</div>
    </Reveal>
  </>;
};

export const Table: React.FC<ShotProps> = ({timeMs}) => <Columns>
  <div>
    <Code text={sql.create} size={31} />
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 20, marginTop: 28, fontSize: 25, lineHeight: 1.4}}>
      <div><Label color={accent}>key</Label>Уникальный ключ</div>
      <div><Label color={accent}>value</Label>Значение JSONB</div>
      <div><Label color={accent}>expires_at</Label>Когда истекает срок</div>
    </div>
  </div>
  <Reveal timeMs={timeMs} at={650} style={{paddingTop: 28}}><CacheEntry /></Reveal>
</Columns>;

export const Write: React.FC<ShotProps> = ({timeMs}) => <Columns>
  <Code text={sql.write} size={30} active={timeMs >= 1100 ? 'EXCLUDED' : 'INSERT'} />
  <div style={{paddingTop: 25}}>
    <CacheEntry />
    <Reveal timeMs={timeMs} at={1100}><Note>Ключ уже есть?<br /><span style={{color: accent}}>Обновляем значение и срок.</span></Note></Reveal>
  </div>
</Columns>;

export const Read: React.FC<ShotProps> = ({timeMs}) => <>
  <Code text={sql.read} size={36} active={timeMs >= 850 ? 'expires_at' : 'key ='} />
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, marginTop: 42}}>
    <div><Label>УСЛОВИЯ</Label><div style={{fontSize: 32, lineHeight: 1.5}}>Ключ совпадает.<br />Срок ещё не истёк.</div></div>
    <Reveal timeMs={timeMs} at={1000}><Label color={accent}>РЕЗУЛЬТАТ / value</Label><div style={{fontSize: 38, fontFamily: theme.fontMono}}>{cache.value}</div></Reveal>
  </div>
</>;

export const Cleanup: React.FC<ShotProps> = ({timeMs, compact}) => {
  const removed = reveal(timeMs, 2400, 250);
  const deleted = reveal(timeMs, 2690, 300);
  return <>
    <div style={{display: 'flex', gap: 50, alignItems: 'baseline', marginBottom: 30, fontFamily: theme.fontMono, fontSize: 32}}>
      <span>expires_at 12:05:00</span><span style={{color: theme.signal}}>Сейчас 12:05:01</span>
    </div>
    <div style={{position: 'relative', borderLeft: `3px solid ${theme.signal}`, padding: '20px 28px', marginBottom: 32}}>
      <div style={{opacity: 1 - removed, fontSize: 31, fontFamily: theme.fontMono}}>{cache.key} → {cache.value}</div>
      <div style={{position: 'absolute', inset: '20px 28px', opacity: deleted, color: theme.muted, fontSize: 30}}>Запись удалена. Место ещё не очищено.</div>
    </div>
    <Code text={sql.cleanup} size={34 - compact * 2} active="expires_at" />
    <Note>SELECT уже не возвращает запись.<br />Фоновая задача удаляет просроченное — раз в минуту.</Note>
  </>;
};
