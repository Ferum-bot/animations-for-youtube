import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import {getTheme} from '@channel/theme';
import {episodeFontFamily} from '../../shared/font';
import {scene, type Cue} from './scene';

/** A single entrance, exit and shadow for each authored left-side surface. */
export const SceneSurface: React.FC<{
  readonly cue: Cue;
  readonly timeMs: number;
  readonly top: number;
  readonly height: number;
  readonly background: string;
  readonly label: string;
  readonly children: React.ReactNode;
}> = ({cue, timeMs, top, height, background, label, children}) => {
  if (timeMs < cue.startMs || timeMs >= cue.endMs) return null;
  const enter = smoothProgress(timeMs, cue.startMs, cue.startMs + scene.entranceMs);
  const leave = 1 - smoothProgress(timeMs, cue.endMs - scene.exitMs, cue.endMs);
  const theme = getTheme('graphite');
  return <div data-history-surface={label} style={{position: 'absolute', left: scene.left,
    top, width: scene.width, height, background, opacity: enter * leave,
    transform: `translateY(${22 * (1 - enter)}px)`,
    boxShadow: `0 18px 48px ${getTheme('paper').text}55`,
    fontFamily: episodeFontFamily}}>
    <div style={{position: 'absolute', left: 0, top: -46, height: 46, padding: '0 18px',
      display: 'flex', alignItems: 'center', fontSize: 23, letterSpacing: 1.1,
      color: theme.text, background: theme.background}}>{label}</div>
    <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>{children}</div>
  </div>;
};
