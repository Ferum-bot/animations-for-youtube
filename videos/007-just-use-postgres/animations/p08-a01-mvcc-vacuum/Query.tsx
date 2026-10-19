import React from 'react';
import {schema, claim, plan} from './data';
import {cues, reveal, type SceneProps} from './timing';
import {Caption, CodeSnippet, Heading, Note} from './ui';

export const Query: React.FC<SceneProps> = ({timeMs}) => {
  const explained = reveal(timeMs, cues.explain);
  return <>
    <Heading title="Забрать 10 самых ранних готовых задач." kicker="JOBS / ЗАХВАТ ВОРКЕРОМ" />
    <div style={{display: 'grid', gridTemplateColumns: '560px 1fr', gap: 34}}>
      <div><Caption>ТАБЛИЦА JOBS</Caption><div style={{marginTop: 16}}><CodeSnippet text={schema} size={23} /></div>
        <div style={{marginTop: 24}}><Note>run_at — когда запускать<br />state — готова или выполняется<br />locked_until — срок аренды</Note></div>
      </div>
      <div><CodeSnippet text={claim} size={26} active={timeMs < cues.explain ? 'ORDER BY' : 'CREATE INDEX'} />
        <div style={{opacity: explained, marginTop: 20}}><CodeSnippet label="QUERY PLAN" text={plan} size={20} active="Index Scan" /></div>
      </div>
    </div>
  </>;
};
