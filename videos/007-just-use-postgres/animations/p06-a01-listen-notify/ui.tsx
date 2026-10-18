import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from '../../shared/theme';
import {reveal} from './timing';
export const theme = getPostgresTheme('graphite');
export const accent = getTheme('signal').primary;
export type ShotProps = {readonly timeMs: number; readonly compact: number};
export {CodeSnippet as Code} from '../../shared/CodeSnippet';
export const Caption: React.FC<React.PropsWithChildren> = ({children}) =>
  <div style={{fontFamily: theme.fontMono, fontSize: 23, color: theme.muted, letterSpacing: 1, marginBottom: 18}}>{children}</div>;
export const Note: React.FC<React.PropsWithChildren<{readonly warning?: boolean}>> = ({children, warning}) =>
  <div style={{fontSize: 29, lineHeight: 1.45, marginTop: 28, color: warning ? theme.signal : theme.muted}}>{children}</div>;
export const Appear: React.FC<React.PropsWithChildren<{readonly timeMs: number; readonly at: number; readonly style?: React.CSSProperties}>> = ({children, timeMs, at, style}) =>
  <div style={{...style, opacity: reveal(timeMs, at), transform: `translateY(${10 * (1 - reveal(timeMs, at))}px)`}}>{children}</div>;

/** One notification fans out to every active session; paths terminate at labels. */
export const Fanout: React.FC<{
  readonly progress?: number; readonly connected?: boolean; readonly lastOnline?: boolean;
  readonly channel?: string; readonly sender?: string;
}> = ({progress = 0, connected = true, lastOnline = true, channel = 'cache_invalidation', sender = 'Producer'}) => {
  const route = (x1: number, y1: number, x2: number, y2: number, active: boolean, p: number) => <g>
    <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={theme.line} strokeWidth={3} strokeDasharray={active ? undefined : '8 10'} />
    {active && p > 0 && p < 1 ? <circle cx={x1 + (x2 - x1) * p} cy={y1 + (y2 - y1) * p} r={8} fill={accent} /> : null}
  </g>;
  return <svg viewBox="0 0 1400 260" style={{width: '100%', display: 'block', overflow: 'visible'}}>
    <text x={0} y={135} fill={theme.text} fontSize={34}>{sender}</text>
    {route(210, 125, 505, 125, true, Math.min(1, progress * 2))}
    <text x={530} y={117} fill={theme.text} fontSize={37}>PostgreSQL</text>
    <text x={530} y={157} fill={theme.muted} fontSize={23} fontFamily={theme.fontMono}>{channel}</text>
    {[45, 125, 205].map((y, index) => {
      const online = connected && (index < 2 || lastOnline);
      return <g key={y}>
        {route(855, 125, 1080, y, online, Math.max(0, progress * 2 - 1))}
        <text x={1105} y={y + 10} fill={online ? theme.text : theme.muted} fontSize={30}>Сервис {index + 1}</text>
        {!online ? <text x={1105} y={y + 39} fill={theme.signal} fontSize={20}>не подключён</text> : null}
      </g>;
    })}
  </svg>;
};
