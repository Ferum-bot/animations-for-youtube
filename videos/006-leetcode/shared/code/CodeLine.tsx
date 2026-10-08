import React from 'react';
import type {LeetcodeTheme} from '../theme';
import type {CodeCue, CodeToken} from './types';

type Fragment = {
  readonly focus: string | undefined;
  readonly tokens: readonly CodeToken[];
};

const groupFragments = (tokens: readonly CodeToken[]): readonly Fragment[] =>
  tokens.reduce<Fragment[]>((fragments, token) => {
    const previous = fragments.at(-1);
    if (previous && previous.focus === token.focus) {
      fragments[fragments.length - 1] = {...previous, tokens: [...previous.tokens, token]};
    } else {
      fragments.push({focus: token.focus, tokens: [token]});
    }
    return fragments;
  }, []);

const focusAmount = (cue: CodeCue | undefined, id: string | undefined): number =>
  id !== undefined && cue?.focus.includes(id) ? 1 : 0;

export const CodeLine: React.FC<{
  readonly tokens: readonly CodeToken[];
  readonly theme: LeetcodeTheme;
  readonly characterWidth: number;
  readonly previous: CodeCue | undefined;
  readonly active: CodeCue | undefined;
  readonly mix: number;
  readonly layer: 'context' | 'foreground';
}> = ({tokens, theme, characterWidth, previous, active, mix, layer}) => {
  let cursor = 0;
  let foregroundExpansion = 0;
  const fromPresence = previous?.focus.length ? 1 : 0;
  const presence = fromPresence + ((active?.focus.length ? 1 : 0) - fromPresence) * mix;
  const fragments = groupFragments(tokens).map((fragment) => {
    const from = focusAmount(previous, fragment.focus);
    const amount = from + (focusAmount(active, fragment.focus) - from) * mix;
    const scale = 1 + amount * 0.3;
    const width = fragment.tokens.reduce((sum, token) => sum + token.text.length * characterWidth, 0);
    const transform = `translate(${cursor + foregroundExpansion * amount} ${-4 * amount}) scale(${scale})`;
    // Only foreground fragments make room for one another; the source code stays fixed.
    foregroundExpansion += width * (scale - 1);
    cursor += width;
    const blur = Math.max(0, presence - amount) * 1.2;
    return {...fragment, amount, width, transform, blur};
  }).filter(({amount}) => layer === 'foreground' ? amount > 0 : amount === 0)
    .sort((a, b) => a.amount - b.amount);

  return <g>
    {/* The strongest focus paints last. Each flag and value share one background. */}
    {fragments.map((fragment, index) => {
      let column = 0;
      return <g key={index} transform={fragment.transform}
        style={{filter: fragment.blur > 0 ? `blur(${fragment.blur}px)` : undefined}}>
        {fragment.amount > 0 ? <g opacity={fragment.amount}>
          <rect x={-6} y={-39} width={fragment.width + 12} height={55} rx={4}
            fill={theme.shadow} opacity={0.09} />
          <rect x={-6} y={-43} width={fragment.width + 12} height={55} rx={4}
            fill={theme.selection} />
          <path d={`M 0 12 H ${fragment.width}`} stroke={theme.primary} strokeWidth={2.5} />
        </g> : null}
        {fragment.tokens.map((token, tokenIndex) => {
          const x = column;
          const width = token.text.length * characterWidth;
          column += width;
          return <text key={tokenIndex} x={x} y={0} fill={theme.syntax[token.kind]}
            xmlSpace="preserve" textLength={width} lengthAdjust="spacingAndGlyphs">{token.text}</text>;
        })}
      </g>;
    })}
  </g>;
};
