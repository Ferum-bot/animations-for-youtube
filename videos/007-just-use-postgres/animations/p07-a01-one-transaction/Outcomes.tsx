import React from 'react';
import {tables} from './data';
import {cues, reveal} from './timing';
import {accent, Caption, CodeSnippet, theme} from './ui';

export const Outcomes: React.FC<{readonly timeMs: number}> = ({timeMs}) => <>
  <Caption>ДВА АЛЬТЕРНАТИВНЫХ ИСХОДА ОДНОЙ ТРАНЗАКЦИИ</Caption>
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 25}}>
    {(['commit', 'rollback'] as const).map(outcome => {
      const commit = outcome === 'commit';
      const color = commit ? accent : theme.muted;
      return <div key={outcome}>
        <CodeSnippet text={commit ? 'COMMIT;' : 'ROLLBACK;'} size={34} active={commit ? 'COMMIT' : undefined} />
        <div style={{fontSize: 48, color, margin: '30px 0 20px'}}>{commit ? 'Всё' : 'Ничего'}</div>
        {tables.map(table => <div key={table.id} style={{display: 'grid', gridTemplateColumns: '145px 1fr', borderBottom: `2px solid ${theme.line}`, padding: '22px 0',
          opacity: .4 + .6 * reveal(timeMs, cues.outcomesMs + 100), fontSize: 28}}>
          <span style={{fontFamily: theme.fontMono, color: theme.muted}}>{table.id}</span>
          <span style={{color}}>{commit ? table.after : table.rollback}</span>
        </div>)}
      </div>;
    })}
  </div>
  <div style={{fontSize: 25, color: theme.muted, marginTop: 34}}>Сохранить задачу на письмо ≠ отправить письмо.</div>
</>;
