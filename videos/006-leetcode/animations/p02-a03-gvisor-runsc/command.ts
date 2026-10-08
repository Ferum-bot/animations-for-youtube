import type {CodeToken} from '../../shared/code/types';

export type RunscFocus = 'runtime';

// The author's abbreviated command. Extra whitespace leaves room for the 30%
// foreground emphasis without covering the first ellipsis or moving context.
export const commandLines = [[
  {text: 'docker run ', kind: 'command'},
  {text: '--runtime=', kind: 'option', focus: 'runtime'},
  {text: 'runsc', kind: 'string', focus: 'runtime'},
  {text: '      ... ', kind: 'punctuation'},
  {text: 'judge-python:3.12', kind: 'string'},
  {text: ' ...', kind: 'punctuation'},
]] as const satisfies readonly (readonly CodeToken[])[];

export const commandText = commandLines.map((line) => line.map(({text}) => text).join('')).join('\n');
