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
    return <g key={cue.anchor} opacity={opacity} transform={`translate(1850 ${400 + (1 - enter) * 10})`}>
      <path d="M 0 0 H 64" stroke={theme.secondary} strokeWidth={5} />
      <text y={52} fontSize={23} letterSpacing={1.6} fontFamily={theme.fontMono} fill={theme.secondary}>{cue.label}</text>
      {cue.title.map((line, i) => <text key={line} y={133 + i * 60} fontSize={45} fontWeight={700} letterSpacing={-1} fill={theme.text}>{line}</text>)}
      {cue.body.map((line, i) => <text key={line} y={320 + i * 44} fontSize={29} fill={theme.text}>{line}</text>)}
      <path d="M 0 530 H 550" stroke={theme.line} strokeWidth={2} />
      <text y={586} fontSize={25} fontFamily={theme.fontMono} fill={theme.accent}>{cue.detail}</text>
    </g>;
  })}
</>;
