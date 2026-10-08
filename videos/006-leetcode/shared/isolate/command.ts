import type {CodeToken} from '../code/types';

export type IsolateFocus = 'init' | 'time' | 'wall-time' | 'memory' | 'processes' |
  'run' | 'cleanup';

const token = (text: string, kind: CodeToken['kind'] = 'plain', focus?: IsolateFocus): CodeToken =>
  ({text, kind, focus});
const space = token(' ');
const indent = token('  ');
const continuation = token(' \\', 'punctuation');

// Commands from the author's screenshot. Comments are explained in the caption;
// empty lines separate invocations. This content is displayed, never executed.
export const commandLines = [
  [token('isolate', 'command', 'init'), token(' --box-id=', 'option', 'init'),
    token('7', 'number', 'init'), token(' --init', 'option', 'init')],
  [],
  [token('isolate', 'command'), token(' --box-id=', 'option'), token('7', 'number'), space,
    token('--time=', 'option', 'time'), token('2', 'number', 'time'), space,
    token('--wall-time=', 'option', 'wall-time'), token('5', 'number', 'wall-time'), continuation],
  [indent, token('--mem=', 'option', 'memory'), token('262144', 'number', 'memory'), space,
    token('--processes=', 'option', 'processes'), token('1', 'number', 'processes'), continuation],
  [indent, token('--run', 'option', 'run'), token(' -- ', 'punctuation', 'run'),
    token('/usr/bin/python3', 'command', 'run'), token(' solution.py', 'string', 'run')],
  [],
  [token('isolate', 'command', 'cleanup'), token(' --box-id=', 'option', 'cleanup'),
    token('7', 'number', 'cleanup'), token(' --cleanup', 'option', 'cleanup')],
] as const satisfies readonly (readonly CodeToken[])[];

export const commandText = commandLines.map((line) => line.map(({text}) => text).join('')).join('\n');
