import React from 'react';
import type {LeetcodeTheme} from '../../shared/theme';
import {codePanelLayout} from '../../shared/code/CodePanel';

/** A static reference to the score explanation immediately before this insert. */
export const ScoreSummary: React.FC<{readonly theme: LeetcodeTheme}> = ({theme}) =>
  <g transform={`translate(${codePanelLayout.x + codePanelLayout.codeX} ${codePanelLayout.y + 472})`}>
    <text fontFamily={theme.fontSans} fontSize={27} fontWeight={600} fill={theme.text}>
      Один score · больше задач, меньше штрафное время
    </text>
    <text y={49} fontFamily={theme.fontMono} fontSize={32} fill={theme.text}>
      <tspan fill={theme.syntax.command}>score</tspan>
      <tspan>{' = solved × '}</tspan>
      <tspan fill={theme.syntax.number}>10⁷</tspan>
      <tspan>{' − finishTimeWithPenaltySeconds'}</tspan>
    </text>
    <g fontFamily={theme.fontSans} fontSize={25} fill={theme.muted}>
      <text y={95}>Условие: диапазон штрафа &lt; 10⁷; целый score точен при |score| ≤ 2⁵³.</text>
      <text y={137}>Равный score: userId в обратном лексикографическом порядке; общее место решает продукт.</text>
    </g>
  </g>;
