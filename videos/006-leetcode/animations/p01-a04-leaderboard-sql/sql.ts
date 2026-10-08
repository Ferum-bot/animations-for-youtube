import type {CodeToken} from '../../shared/code/types';

export type SqlFocus = 'user' | 'aggregates' | 'source' | 'contest' | 'verdict' |
  'group' | 'order' | 'limit' | 'offset';

const token = (text: string, kind: CodeToken['kind'] = 'plain'): CodeToken => ({text, kind});
const fragment = (focus: SqlFocus, tokens: readonly CodeToken[]): readonly CodeToken[] =>
  tokens.map((item) => ({...item, focus}));
const indent = token('  ');

// Author-supplied SQL, with underscores and the last_solve alias restored after copy/paste.
export const sqlLines = [
  fragment('user', [token('SELECT ', 'command'), token('user_id'), token(',', 'punctuation')]),
  [indent, ...fragment('aggregates', [token('COUNT', 'option'), token('(', 'punctuation'),
    token('DISTINCT ', 'command'), token('problem_id'), token(')', 'punctuation'),
    token(' AS ', 'command'), token('solved'), token(',', 'punctuation')])],
  [indent, ...fragment('aggregates', [token('MAX', 'option'), token('(', 'punctuation'),
    token('accepted_at'), token(')', 'punctuation'), token(' AS ', 'command'), token('last_solve')])],
  fragment('source', [token('FROM ', 'command'), token('submissions')]),
  [...fragment('contest', [token('WHERE ', 'command'), token('contest_id = '), token(':id', 'option')]),
    token(' AND ', 'command'), ...fragment('verdict', [token('verdict = '), token("'AC'", 'string')])],
  fragment('group', [token('GROUP BY ', 'command'), token('user_id')]),
  fragment('order', [token('ORDER BY ', 'command'), token('solved'), token(' DESC', 'command'),
    token(', ', 'punctuation'), token('last_solve')]),
  [...fragment('limit', [token('LIMIT ', 'command'), token('50', 'number')]), token(' '),
    ...fragment('offset', [token('OFFSET ', 'command'), token(':page', 'option'), token(' * '),
      token('50', 'number')]), token(';', 'punctuation')],
] as const satisfies readonly (readonly CodeToken[])[];

export const sqlText = sqlLines.map((line) => line.map(({text}) => text).join('')).join('\n');
