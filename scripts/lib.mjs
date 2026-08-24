import {readFile, writeFile} from 'node:fs/promises';

export const parseArgs = (argv) => {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || value === undefined) {
      throw new Error(`Invalid argument near: ${key ?? '<end>'}`);
    }
    args[key.slice(2)] = value;
  }
  return args;
};

export const assertSlug = (value, label) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`${label} must contain lowercase letters, numbers, and hyphens only`);
  }
};

export const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

export const writeJson = async (path, value) =>
  writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

export const toIdentifier = (value) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join('')
    .replace(/^(\d)/, 'V$1');

export const msToFrames = (milliseconds, fps) =>
  Math.max(1, Math.round((milliseconds / 1000) * fps));

