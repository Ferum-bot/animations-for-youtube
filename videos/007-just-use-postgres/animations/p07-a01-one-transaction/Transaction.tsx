import React from 'react';
import {tables, transactionSql} from './data';
import {cues, reveal} from './timing';
import {accent, Caption, CodeSnippet, theme} from './ui';

export const Transaction: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const active = timeMs < cues.orderMs ? 'BEGIN' : timeMs < cues.jobMs ? 'INSERT INTO orders'
    : timeMs < cues.cacheMs ? 'INSERT INTO jobs' : timeMs < cues.searchMs ? 'DELETE FROM cache' : undefined;
  return <div style={{display: 'grid', gridTemplateColumns: '790px 1fr', gap: 60}}>
    <div>
      <Caption>ПОЛЬЗОВАТЕЛЬ 7 / ЗАКАЗ НА 1990</Caption>
      <CodeSnippet text={transactionSql} size={26} active={active} />
    </div>
    <div>
      <Caption>POSTGRESQL / ВНУТРИ ТРАНЗАКЦИИ</Caption>
      <div style={{borderLeft: `3px solid ${accent}`, paddingLeft: 24}}>
        {tables.map(table => {
          const at = {orders: cues.orderMs, jobs: cues.jobMs, cache: cues.cacheMs}[table.id];
          const changed = reveal(timeMs, at);
          const deleting = table.id === 'cache';
          return <div key={table.id} style={{height: 116, lineHeight: 1.2, borderBottom: `1px solid ${theme.line}`, padding: '8px 0', boxSizing: 'border-box'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <span style={{fontFamily: theme.fontMono, fontSize: 29}}>{table.id}</span>
              <span style={{fontSize: 18, color: theme.muted}}>{table.label}</span>
            </div>
            <div style={{height: 28, marginTop: 6, fontFamily: theme.fontMono, fontSize: 22, color: accent,
              opacity: deleting ? 1 - changed : changed, transform: `translateX(${deleting ? changed * 26 : (1 - changed) * -18}px)`}}>{table.value}</div>
            <div style={{fontSize: 18, color: theme.muted}}>{timeMs < at ? table.before : table.after}</div>
          </div>;
        })}
      </div>
      <div style={{fontSize: 23, color: theme.muted, marginTop: 18}}>Изменения пока не закоммичены.</div>
      <div style={{opacity: reveal(timeMs, cues.searchMs), marginTop: 26, borderTop: `2px solid ${theme.line}`, paddingTop: 20}}>
        <div style={{fontFamily: theme.fontMono, fontSize: 18, color: theme.muted, marginBottom: 16}}>ЕСЛИ ПОИСК НАСТРОЕН ДЛЯ ЭТИХ ДАННЫХ</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 29}}>
          <span>Данные</span><span style={{color: accent}}>→</span><span style={{fontFamily: theme.fontMono}}>search</span><span style={{color: accent}}>→</span><span style={{color: accent}}>GIN</span>
        </div>
        <div style={{fontSize: 23, lineHeight: 1.4, color: theme.muted, marginTop: 14}}>Поле и индекс обновляются автоматически.</div>
      </div>
    </div>
  </div>;
};
