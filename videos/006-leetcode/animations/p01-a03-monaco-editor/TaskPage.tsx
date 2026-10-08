import React from 'react';
import type {LeetcodeTheme} from '../../shared/theme';
import {MonacoEditor} from './MonacoEditor';
import type {EditorState} from './scene';

export const TaskPage: React.FC<{
  readonly theme: LeetcodeTheme;
  readonly dark: boolean;
  readonly focus: number;
  readonly vscode: number;
  readonly state: EditorState;
}> = ({theme, dark, focus, vscode, state}) => <>
  <div style={{position: 'absolute', left: 40, top: 100, right: 40,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
    <div style={{fontSize: 30, fontWeight: 600, color: theme.text}}>
      Пример: <span style={{color: theme.primary}}>Monaco</span> внутри сайта
    </div>
    <div style={{display: 'flex', gap: 16, fontSize: 23, opacity: 1 - focus}}>
      <span style={{padding: '10px 22px', border: `1px solid ${theme.line}`}}>Запустить</span>
      <span style={{padding: '10px 22px', background: theme.primary, color: theme.surface}}>Отправить</span>
    </div>
  </div>
  <div style={{position: 'absolute', top: 177, left: 42, width: 455,
    opacity: 1 - focus * 0.94, filter: `blur(${focus * 4}px)`}}>
    <div style={{fontSize: 22, color: theme.muted, marginBottom: 20}}>Пример задачи · Лёгкая</div>
    <div style={{fontSize: 38, fontWeight: 650, marginBottom: 26}}>Two Sum</div>
    <p style={{fontSize: 27, lineHeight: 1.5, margin: '0 0 30px'}}>
      Найдите индексы двух чисел, сумма которых равна <span style={{fontFamily: theme.fontMono}}>target</span>.
    </p>
    <div style={{borderLeft: `3px solid ${theme.line}`, paddingLeft: 24}}>
      <div style={{fontSize: 23, color: theme.muted, marginBottom: 15}}>Пример</div>
      <div style={{fontSize: 25, lineHeight: 1.8, fontFamily: theme.fontMono}}>
        nums = [2, 7, 11, 15]<br />target = 9<br />ответ = [0, 1]
      </div>
    </div>
    <div style={{fontSize: 24, marginTop: 25, color: theme.muted}}>2 + 7 = 9</div>
  </div>
  <div style={{position: 'absolute', top: 166, left: 570, width: 1290,
    transform: `translateX(${-475 * focus}px) scale(${1 + 0.23 * focus})`,
    transformOrigin: 'top left', background: theme.surface,
    outline: `2px solid ${theme.primary}`}}>
    <div style={{height: 56, borderBottom: `1px solid ${theme.line}`, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', fontSize: 23}}>
      <div style={{padding: '0 18px', fontFamily: theme.fontMono}}>solution.ts
        <span style={{color: theme.muted, marginLeft: 35, fontFamily: theme.fontSans}}>TypeScript</span>
      </div>
      <div style={{fontSize: 20, color: theme.primary, paddingRight: 18}}>MONACO · РЕДАКТОР КОДА</div>
    </div>
    <MonacoEditor state={state} dark={dark} />
  </div>
  <div style={{position: 'absolute', right: 40, top: 100, opacity: vscode,
    fontSize: 25, color: theme.muted, background: theme.surface, padding: '9px 0 9px 24px'}}>
    Редактор из <span style={{fontWeight: 650, color: theme.syntax.command}}>VS Code</span>
  </div>
</>;
