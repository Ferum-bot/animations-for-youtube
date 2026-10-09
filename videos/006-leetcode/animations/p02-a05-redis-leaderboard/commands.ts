import type {CodeToken} from '../../shared/code/types';

export type RedisFocus = 'add' | 'range' | 'rank';
type RedisToken = CodeToken & {readonly focus: RedisFocus};

// Author-supplied templates; angle brackets denote parameters, never execution.
export const commandLines = [
  [
    {text: 'ZADD ', kind: 'command', focus: 'add'},
    {text: 'lb:{contestId} ', kind: 'string', focus: 'add'},
    {text: '<score> <userId>', kind: 'option', focus: 'add'},
  ],
  [
    {text: 'ZRANGE ', kind: 'command', focus: 'range'},
    {text: 'lb:{contestId} ', kind: 'string', focus: 'range'},
    {text: '0 49 ', kind: 'number', focus: 'range'},
    {text: 'REV WITHSCORES', kind: 'option', focus: 'range'},
  ],
  [
    {text: 'ZREVRANK ', kind: 'command', focus: 'rank'},
    {text: 'lb:{contestId} ', kind: 'string', focus: 'rank'},
    {text: '<userId>', kind: 'option', focus: 'rank'},
  ],
] as const satisfies readonly (readonly RedisToken[])[];
