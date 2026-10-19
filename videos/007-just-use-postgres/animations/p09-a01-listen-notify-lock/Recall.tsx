import React from 'react';
import {Img, staticFile} from 'remotion';
import {demoLog, recallLog} from './data';
import {SourceDissolve, SourceViewport} from './SourceViewport';
import {cues, reveal, type SceneProps} from './timing';
import {accent, CodeSnippet, Label, Note, theme, Title} from './ui';

const NativeGraph: React.FC<{readonly file: string; readonly top: number; readonly width?: number; readonly height?: number}> = ({file, top, width = 1552, height = 650}) =>
  <Img src={staticFile(`assets/007-just-use-postgres/notify-lock/${file}.png`)} alt="Оригинальный график RDS из отчёта Recall.ai"
    style={{position: 'absolute', left: (1600 - width) / 2, top, width, height, objectFit: 'contain'}} />;

/** Full-screen source shots retain the article pixels, not a recreation of its copy. */
export const RecallArticle: React.FC<SceneProps> = ({timeMs}) => <>
  <div style={{position: 'absolute', left: 32, top: 21, fontSize: 31, fontWeight: 600}}>Recall.ai <span style={{fontSize: 22, color: theme.muted, fontWeight: 400}}> / инцидент · март 2025</span></div>
  <div style={{position: 'absolute', left: 24, top: 76}}>
    <SourceDissolve timeMs={timeMs} startMs={cues.recall} endMs={cues.recall + 8000}>
      <SourceViewport file="headline-3x.png" width={1552} height={740} description="Recall.ai: Postgres LISTEN/NOTIFY does not scale"
        from={{x: 200, y: 150, width: 1040}} to={{x: 268, y: 225, width: 880}} progress={reveal(timeMs, cues.recall + 3000, 2200)} />
    </SourceDissolve>
    <SourceDissolve timeMs={timeMs} startMs={cues.recall + 8000} endMs={cues.incidents}>
      <SourceViewport file="headline-3x.png" width={1552} height={800} description="Recall.ai: десятки тысяч одновременно пишущих meeting bots"
        from={{x: 265, y: 320, width: 900}} to={{x: 275, y: 340, width: 860}} progress={reveal(timeMs, cues.recall + 9500, 1800)} />
    </SourceDissolve>
    <SourceDissolve timeMs={timeMs} startMs={cues.incidents} endMs={cues.symptoms}>
      <SourceViewport file="incident-3x.png" originY={950} width={1552} height={800} description="Recall.ai: три сбоя 19–22 марта 2025"
        from={{x: 265, y: 960, width: 900}} to={{x: 280, y: 1000, width: 860}} progress={reveal(timeMs, cues.incidents + 700, 1600)} />
    </SourceDissolve>
  </div>
  <SourceDissolve timeMs={timeMs} startMs={cues.symptoms} endMs={cues.symptoms + 3500}>
    <div style={{position: 'absolute', left: 60, top: 105}}><Label>DATABASE LOAD / ОЖИДАЮЩИЕ СЕССИИ</Label></div>
    <NativeGraph file="comparison" top={170} width={1260} height={410} />
    <div style={{position: 'absolute', left: 170, top: 640, width: 1260}}><Note>Без LISTEN/NOTIFY → с LISTEN/NOTIFY<br />Растёт доля ожиданий блокировок.</Note></div>
  </SourceDissolve>
  <SourceDissolve timeMs={timeMs} startMs={cues.symptoms + 3500} endMs={cues.log}>
    <div style={{position: 'absolute', left: 60, top: 108}}><Label>С NOTIFY / ОРИГИНАЛЬНЫЕ МЕТРИКИ RDS</Label></div>
    <NativeGraph file="with-notify" top={170} />
    <div style={{position: 'absolute', left: 60, top: 820}}><Note>Ожиданий больше, а CPU, сеть и дисковый I/O падают.</Note></div>
  </SourceDissolve>
</>;

export const LockEvidence: React.FC<SceneProps> = ({timeMs}) => {
  const own = timeMs >= cues.ownLog;
  return <>
    <Title kicker={own ? 'RECALL.AI / СРАВНЕНИЕ С ЛОКАЛЬНЫМ ДЕМО' : 'RECALL.AI / LOG_LOCK_WAITS'}>Тот же объект блокировки</Title>
    {!own ? <>
      <SourceViewport file="log-3x.png" originY={1350} width={1400} height={300} description="Абзац Recall.ai с идентификатором блокировки"
        from={{x: 265, y: 1730, width: 900}} to={{x: 280, y: 1780, width: 860}} progress={reveal(timeMs, cues.log + 500, 1000)} />
      <div style={{marginTop: 24}}><CodeSnippet text={recallLog} label="LOG · Recall.ai" size={27} active="AccessExclusiveLock" /></div>
    </> : <>
      <CodeSnippet text={recallLog} label="LOG · Recall.ai" size={27} active="AccessExclusiveLock" />
      <div style={{marginTop: 22}}><CodeSnippet text={demoLog} label="LOG · локальное демо" size={27} active="AccessExclusiveLock" /></div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 28, opacity: reveal(timeMs, cues.identity)}}>
        {[['object 0', 'Общий служебный объект'], ['class 1262', 'Каталог pg_database'], ['database 0', 'Не принадлежит одной БД']].map(([key, text]) => <div key={key}>
          <div style={{fontFamily: theme.fontMono, fontSize: 29, color: accent}}>{key}</div><div style={{fontSize: 23, marginTop: 10, color: theme.muted}}>{text}</div>
        </div>)}
      </div>
    </>}
  </>;
};

export const Remediation: React.FC<SceneProps> = ({timeMs}) => <>
  <div style={{position: 'absolute', left: 32, top: 21, fontSize: 31, fontWeight: 600}}>Recall.ai / решение</div>
  <div style={{position: 'absolute', left: 24, top: 76}}>
    <SourceViewport file="fix-3x.png" originY={3870} width={1552} height={490} description="Recall.ai: уведомления перенесены в приложение менее чем за день"
      from={{x: 265, y: 3940, width: 900}} to={{x: 280, y: 3950, width: 860}} progress={reveal(timeMs, cues.fix + 1600, 1500)} />
  </div>
  <div style={{position: 'absolute', left: 100, top: 620, width: 1400, opacity: reveal(timeMs, cues.application)}}>
    <Label>ИЗМЕНЕНИЕ ГОРЯЧЕГО ПУТИ</Label>
    <div style={{display: 'flex', gap: 44, alignItems: 'center', marginTop: 24, fontSize: 34}}>
      <span>Приложение</span><span style={{color: accent}}>→</span><span>Уведомления в приложении</span>
    </div>
    <div style={{marginTop: 25}}><Note>NOTIFY удалён из частого endpoint · миграция заняла меньше дня</Note></div>
  </div>
</>;
