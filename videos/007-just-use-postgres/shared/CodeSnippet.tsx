import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from './theme';

const theme = getPostgresTheme('graphite');
const accent = getTheme('signal').primary;

type CodeProps = {readonly text: string; readonly size?: number; readonly active?: string};

export const CodeLines: React.FC<CodeProps> = ({text, size = 30, active}) =>
  <pre style={{margin: 0, whiteSpace: 'pre-wrap', fontFamily: theme.fontMono, fontSize: size, lineHeight: 1.5, letterSpacing: -0.7}}>
    {text.split('\n').map((line, index) => <div key={index} style={{color: active && line.includes(active) ? accent : theme.text}}>{line || ' '}</div>)}
  </pre>;

/** A code surface, separate from the explanatory labels and query results. */
export const CodeSnippet: React.FC<React.PropsWithChildren<CodeProps & {
  readonly label?: string;
  readonly viewportHeight?: number;
  readonly scrollY?: number;
}>> = ({children, label = 'SQL', viewportHeight, scrollY = 0, ...props}) =>
  <div style={{position: 'relative', boxSizing: 'border-box', width: '100%',
    background: getTheme('graphite').background, border: `2px solid ${theme.line}`, padding: '50px 26px 22px'}}>
    <div style={{position: 'absolute', top: 13, right: 20, fontFamily: theme.fontMono,
      color: theme.muted, fontSize: 19, letterSpacing: 2}}>{label}</div>
    {viewportHeight === undefined ? <CodeLines {...props} /> :
      <div style={{height: viewportHeight, overflow: 'hidden'}}>
        <div style={{transform: `translateY(${-scrollY}px)`}}><CodeLines {...props} /></div>
      </div>}
    {children}
  </div>;

