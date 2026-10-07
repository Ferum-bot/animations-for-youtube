import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import type {LeetcodeTheme} from '../theme';
import type {CodeCue, CodeToken} from './types';

// The reference webcam occupies roughly x=2000..2560, y=0..365.
// The panel and its shadow stay below it throughout entrance and exit.
export const codePanelLayout = {
  x: 330, y: 422, width: 1900, height: 800,
  codeX: 132, codeY: 166, fontSize: 42, characterWidth: 25.3, lineHeight: 64,
} as const;

const focusMix = (cue: CodeCue | undefined, id: string | undefined): number =>
  id !== undefined && cue?.focus.includes(id) ? 1 : 0;

export const CodePanel: React.FC<{
  readonly theme: LeetcodeTheme;
  readonly lines: readonly (readonly CodeToken[])[];
  readonly cues: readonly CodeCue[];
  readonly timeMs: number;
  readonly fileName: string;
  readonly title: string;
}> = ({theme, lines, cues, timeMs, fileName, title}) => {
  const activeIndex = cues.reduce((active, cue, index) => cue.startMs <= timeMs ? index : active, -1);
  const active = cues[activeIndex];
  const previous = cues[activeIndex - 1];
  const mix = active ? smoothProgress(timeMs, active.startMs, active.startMs + 160) : 1;
  // Swap descriptions at zero opacity: two sentences must never overlap.
  const explanation = mix < 0.5 ? previous : active;
  const explanationOpacity = Math.abs(mix * 2 - 1);
  const l = codePanelLayout;
  return <g transform={`translate(${l.x} ${l.y})`}>
    <rect x={0} y={12} width={l.width} height={l.height} rx={8} fill={theme.shadow} opacity={0.08} />
    <rect width={l.width} height={l.height} rx={8} fill={theme.surface} stroke={theme.line} strokeWidth={2} />
    <path d={`M 8 0 H ${l.width - 8} Q ${l.width} 0 ${l.width} 8 V 76 H 0 V 8 Q 0 0 8 0`}
      fill={theme.chrome} />
    <path d={`M 0 76 H ${l.width}`} stroke={theme.line} />
    <path d="M 36 29 L 48 39 L 36 49 M 56 50 H 72" fill="none" stroke={theme.primary}
      strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    <text x={94} y={49} fontSize={27} fill={theme.text} fontFamily={theme.fontMono}>{fileName}</text>
    <text x={l.width - 38} y={49} fontSize={25} textAnchor="end" fill={theme.muted}
      fontFamily={theme.fontSans}>{title}</text>
    <path d="M 94 104 V 660" stroke={theme.line} />
    <g fontFamily={theme.fontMono} fontSize={l.fontSize}>
      {lines.map((tokens, row) => {
        const y = l.codeY + row * l.lineHeight;
        let column = 0;
        return <g key={row}>
          <text x={65} y={y} textAnchor="end" fill={theme.muted} fontSize={25}>{row + 1}</text>
          {tokens.map((token, index) => {
            const x = l.codeX + column * l.characterWidth;
            const width = token.text.length * l.characterWidth;
            column += token.text.length;
            const from = focusMix(previous, token.focus);
            const to = focusMix(active, token.focus);
            const focus = from + (to - from) * mix;
            return <g key={index}>
              {token.focus ? <g opacity={focus}>
                <rect x={x - 6} y={y - 43} width={width + 12} height={58} rx={4} fill={theme.selection} />
                <path d={`M ${x} ${y + 15} H ${x + width}`} stroke={theme.primary} strokeWidth={2.5} />
              </g> : null}
              <text x={x} y={y} fill={theme.syntax[token.kind]} xmlSpace="preserve"
                textLength={width} lengthAdjust="spacingAndGlyphs">{token.text}</text>
            </g>;
          })}
        </g>;
      })}
    </g>
    <path d={`M 32 704 H ${l.width - 32}`} stroke={theme.line} />
    {explanation ? <g opacity={explanationOpacity} fontFamily={theme.fontSans}>
        <rect x={38} y={734} width={4} height={29} rx={2} fill={theme.primary} />
        <text x={61} y={758} fontSize={28} fontWeight={600} fill={theme.text}>{explanation.label}</text>
        <text x={430} y={758} fontSize={28} fill={theme.muted}>{explanation.description}</text>
      </g> : null}
  </g>;
};
