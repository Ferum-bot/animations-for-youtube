import React from 'react';
import {retainedLock} from './data';
import {SourceViewport} from './SourceViewport';
import {cues, reveal, type SceneProps} from './timing';
import {accent, CodeSnippet, Label, Note, theme} from './ui';

export const Documentation: React.FC<SceneProps> = ({timeMs, compact}) => <>
  <div style={{position: 'absolute', left: 40 + 40 * compact, top: 32 + 50 * compact, fontSize: 30, fontWeight: 600}}>PostgreSQL / документация NOTIFY</div>
  <div style={{position: 'absolute', left: 24 + 56 * compact, top: 100 + 80 * compact}}>
    <SourceViewport file="docs-narrow-4x.png" sourceWidth={800} originY={328} width={1552 - 420 * compact} height={620 + 180 * compact}
      description="Официальная документация PostgreSQL NOTIFY"
      from={{x: 40, y: 340, width: 720}} to={{x: 40, y: 550, width: 720}}
      progress={reveal(timeMs, cues.docs + 1500, 2200)} />
  </div>
  <div style={{position: 'absolute', left: 80, top: 765 + 290 * compact, width: 1080}}>
    <Note>Гарантии доставки описаны.<br />Общий lock на коммите — деталь реализации.</Note>
  </div>
</>;

export const Postgres19: React.FC<SceneProps> = ({timeMs}) => <>
  <Label>УТОЧНЕНИЕ / POSTGRESQL 19</Label>
  <h1 style={{fontSize: 55, fontWeight: 600, lineHeight: 1.12, margin: '25px 0 32px'}}>Меньше пробуждений.<br />Тот же общий lock.</h1>
  <SourceViewport file="release-narrow-4x.png" sourceWidth={800} originY={4826} width={1110} height={175}
    description="Release notes PostgreSQL 19: NOTIFY wakes only interested backends"
    from={{x: 120, y: 4842, width: 640}} />
  <div style={{margin: '28px 0 34px'}}><Note>NOTIFY будит только подписчиков<br />нужного канала.</Note></div>
  <div style={{opacity: reveal(timeMs, cues.retainedLock, 400)}}>
    <CodeSnippet text={retainedLock} label="C · async.c · PG19" size={29} active="AccessExclusiveLock" />
    <div style={{fontSize: 33, marginTop: 26, color: accent}}>Общая блокировка на коммите осталась.</div>
  </div>
  <div style={{fontSize: 21, color: theme.muted, marginTop: 30}}>Изменение пробуждений не означает разделение блокировки.</div>
</>;
