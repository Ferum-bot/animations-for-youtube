import React from 'react';
import {libraries, sql} from './data';
import {reveal} from './timing';
import {accent, Appear, Caption, Code, Explanation, secondWorker, theme, type ShotProps} from './ui';

export const Libraries: React.FC<ShotProps> = ({timeMs}) => <>
  <Caption>ЯЗЫК → БИБЛИОТЕКА</Caption>
  {libraries.map(([language, names], index) => <Appear key={language} timeMs={timeMs} at={2700 + index * 100}>
    <div style={{display: 'grid', gridTemplateColumns: '300px 1fr', columnGap: 24, padding: '24px 0', borderBottom: `2px solid ${theme.line}`, alignItems: 'baseline'}}>
      <div style={{fontSize: language.startsWith('SQL') ? 25 : 31, fontFamily: theme.fontMono, color: theme.muted}}>{language}</div>
      <div style={{fontSize: 32, color: accent}}>{names}</div>
    </div>
  </Appear>)}
</>;

export const Retry: React.FC<ShotProps> = ({timeMs}) => {
  const attempt = timeMs >= 8500 ? 2 : 1;
  return <>
    <Caption>ЗАДАЧА #1 / ОТПРАВИТЬ ПИСЬМО</Caption>
    <div style={{fontSize: 45, margin: '30px 0', color: accent}}>Попытка {attempt}</div>
    <Appear timeMs={timeMs} at={1300}>
      <div style={{borderLeft: `3px solid ${accent}`, padding: '10px 25px', fontSize: 34, lineHeight: 1.5}}>Работа сделана.<br />Результат уже во внешнем мире.</div>
    </Appear>
    <Appear timeMs={timeMs} at={3880} style={{marginTop: 36}}>
      <Code text={sql.done} size={29} />
      <div style={{fontSize: 24, color: theme.muted, marginTop: 18}}>$1 — массив ID выполненных задач</div>
      <Explanation warning>Воркер упал до отметки о завершении.<br />DELETE не выполнен; задача осталась.</Explanation>
    </Appear>
    <Appear timeMs={timeMs} at={6500}><Explanation>Аренда истекает → задачу забирают снова.</Explanation></Appear>
    <Appear timeMs={timeMs} at={10760}>
      <div style={{borderTop: `2px solid ${theme.line}`, marginTop: 40, paddingTop: 28}}>
        <div style={{fontSize: 39, color: accent}}>Идемпотентный обработчик</div>
        <Explanation>Повторная попытка не должна<br />повторять бизнес-эффект.</Explanation>
      </div>
    </Appear>
  </>;
};

export const Journal: React.FC<ShotProps> = ({timeMs}) => <>
  <Caption>ПОКАЗАННАЯ ОЧЕРЕДЬ JOBS</Caption>
  <div style={{display: 'flex', gap: 25, alignItems: 'baseline', fontSize: 34, margin: '35px 0'}}>
    <span style={{opacity: 1 - 0.6 * reveal(timeMs, 1000)}}>Задача #1</span><span style={{color: theme.muted}}>→</span><span>Обработана</span><span style={{color: theme.muted}}>→</span><span style={{color: theme.signal}}>Удалена</span>
  </div>
  <Explanation>Нет встроенного перечитывания истории<br />и независимых позиций потребителей.</Explanation>
  <Appear timeMs={timeMs} at={2620} style={{marginTop: 60}}>
    <Caption>ЖУРНАЛ KAFKA / ОДНА ПАРТИЦИЯ</Caption>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', border: `2px solid ${theme.line}`, marginTop: 30}}>
      {[0, 1, 2, 3, 4].map(id => <div key={id} style={{fontSize: 32, fontFamily: theme.fontMono, padding: '25px 0', textAlign: 'center', borderRight: id < 4 ? `2px solid ${theme.line}` : undefined}}>{id}</div>)}
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', marginTop: 15, fontSize: 25, textAlign: 'center'}}>
      <div style={{gridColumn: 2, color: accent}}>↑<br />Группа A</div>
      <div style={{gridColumn: 4, color: secondWorker}}>↑<br />Группа B</div>
    </div>
    <Explanation>События хранятся по политике retention.<br />Группы читают независимо.</Explanation>
  </Appear>
</>;

export const Versions: React.FC<ShotProps> = ({timeMs}) => {
  const updated = reveal(timeMs, 1600);
  const removed = reveal(timeMs, 4800, 300);
  return <>
    <Caption>JOBS / ВЕРСИИ ОДНОЙ СТРОКИ</Caption>
    <div style={{marginTop: 32, border: `2px solid ${theme.line}`, padding: 30}}>
      <div style={{opacity: 1 - removed, fontFamily: theme.fontMono, fontSize: 35, color: updated > 0 ? theme.muted : theme.text}}>#1 · state: ready</div>
      <div style={{opacity: updated * (1 - removed), fontSize: 28, color: theme.signal, marginTop: 20}}>Старая версия после UPDATE</div>
      <div style={{borderTop: `2px solid ${theme.line}`, marginTop: 30, paddingTop: 30, opacity: updated}}>
        <div style={{fontFamily: theme.fontMono, fontSize: 35, color: accent}}>#1 · state: running</div>
        <div style={{fontSize: 28, marginTop: 20}}>Текущая версия</div>
      </div>
    </div>
    <Appear timeMs={timeMs} at={3100}>
      <div style={{fontFamily: theme.fontMono, color: accent, fontSize: 45, marginTop: 40}}>VACUUM</div>
      <Explanation>Удаляет старую версию, когда она<br />больше не нужна другим транзакциям.</Explanation>
    </Appear>
    <Appear timeMs={timeMs} at={5200}><Explanation>Место снова можно использовать.</Explanation></Appear>
  </>;
};

const FlowStep: React.FC<React.PropsWithChildren<{readonly label: string}>> = ({label, children}) =>
  <div style={{borderLeft: `3px solid ${accent}`, padding: '14px 24px'}}>
    <Caption>{label}</Caption><div style={{fontSize: 32, lineHeight: 1.4}}>{children}</div>
  </div>;
const Down: React.FC = () => <div style={{fontSize: 30, color: theme.muted, margin: '15px 24px'}}>↓</div>;

export const Outbox: React.FC<ShotProps> = ({timeMs}) => <>
  <FlowStep label="ОДНА ТРАНЗАКЦИЯ В POSTGRES">Заказ + событие в таблице outbox</FlowStep>
  <Appear timeMs={timeMs} at={2880}>
    <Down /><FlowStep label="ОТДЕЛЬНЫЙ ОТПРАВИТЕЛЬ">Читает outbox → публикует в брокер</FlowStep>
    <Down /><FlowStep label="ПОЛУЧАТЕЛЬ / INBOX">ID сообщения + бизнес-изменение<br />в одной транзакции.<br />Повторный ID → пропускает эффект.</FlowStep>
  </Appear>
  <Appear timeMs={timeMs} at={7200}>
    <div style={{borderTop: `2px solid ${theme.line}`, marginTop: 45, paddingTop: 8}}>
      <Explanation>Обработанные записи нужно очищать,<br />а рост таблиц — контролировать.</Explanation>
    </div>
  </Appear>
</>;
