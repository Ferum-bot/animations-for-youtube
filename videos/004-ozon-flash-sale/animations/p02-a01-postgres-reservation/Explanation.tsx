import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import type {OzonTheme} from '../../shared/theme';
import {cues, cueTime, scene} from './cues';

export const Explanation: React.FC<{readonly timeMs: number; readonly theme: OzonTheme}> = ({timeMs, theme}) => <>
  {cues.map((cue, index) => {
    const start = cueTime(cue);
    const next = cues[index + 1];
    const end = next ? cueTime(next) : scene.durationMs;
    const enter = smoothProgress(timeMs, start, start + 280);
    const opacity = enter * (1 - smoothProgress(timeMs, end - 160, end));
    if (opacity <= 0) return null;
    const labelWidth = cue.label.length * 14 + 20;
    return <g key={cue.anchor} opacity={opacity} transform={`translate(1850 ${400 + (1 - enter) * 10})`}>
      <path d={`M -15 40 C -22 13 ${labelWidth - 10} 14 ${labelWidth} 38
        C ${labelWidth + 14} 73 -8 76 -17 47`}
        stroke={theme.secondary} strokeWidth={1.8} fill="none" strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - enter} />
      <text y={52} fontSize={25} fill={theme.secondary}>{cue.label.toLocaleLowerCase('ru')}</text>
      {cue.title.map((line, i) => <text key={line} y={133 + i * 60} fontSize={43} fontWeight={500} letterSpacing={-0.5} fill={theme.text}>{line}</text>)}
      {cue.body.map((line, i) => <text key={line} y={320 + i * 44} fontSize={29} fill={theme.text}>{line}</text>)}
      <path d="M 0 550 Q 195 541 375 548" stroke={theme.secondary} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <text y={586} fontSize={25} fontFamily={theme.fontMono} fill={theme.accent}>{cue.detail}</text>
    </g>;
  })}
</>;
