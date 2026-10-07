import type {CodeToken} from '../code/types';

export type DockerFocus = 'remove' | 'network' | 'memory' | 'cpus' | 'pids' | 'readonly' | 'user' | 'driver';
type DockerToken = CodeToken & {readonly focus?: DockerFocus};
const token = (text: string, kind: CodeToken['kind'] = 'plain', focus?: DockerFocus): DockerToken =>
  ({text, kind, focus});
const indent = token('  ');
const space = token(' ');
const continuation = token(' \\', 'punctuation');

/** Exact command supplied by the author; rendering never executes this content. */
export const commandLines = [
  [token('docker run', 'command'), space, token('--rm', 'option', 'remove'), continuation],
  [indent, token('--network', 'option', 'network'), token(' none', 'string', 'network'), continuation],
  [indent, token('--memory', 'option', 'memory'), token(' 256m', 'number', 'memory'), space,
    token('--cpus', 'option', 'cpus'), token(' 1', 'number', 'cpus'), space,
    token('--pids-limit', 'option', 'pids'), token(' 64', 'number', 'pids'), continuation],
  [indent, token('--read-only', 'option', 'readonly'), space, token('--tmpfs', 'option'),
    token(' /tmp:size=64m', 'string'), continuation],
  [indent, token('--user', 'option', 'user'), token(' 65534:65534', 'number', 'user'), continuation],
  [indent, token('-v', 'option'), token(' /tmp/sub-123:/work:ro', 'string'), continuation],
  [indent, token('judge-python:3.12', 'string'), continuation],
  [indent, token('python', 'command', 'driver'), token(' /work/driver.py /work/tests.json', 'string', 'driver')],
] as const satisfies readonly (readonly DockerToken[])[];

export const commandText = commandLines.map((line) => line.map(({text}) => text).join('')).join('\n');
