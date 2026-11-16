import assert from 'node:assert/strict';
import {mkdtemp, mkdir, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import {listAnimationDirectories} from '../animation-directories.mjs';

test('TikTok and Shorts stay separate from the long-form overlay', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'motion-collections-'));
  try {
    for (const folder of ['animations/p01-a01-main', 'history-shorts/p01-a01-short',
      'tictok/p00-a02-end-card', 'shared/illustrations']) {
      await mkdir(path.join(root, folder), {recursive: true});
    }
    const entries = await listAnimationDirectories(root);
    assert.deepEqual(entries.filter(entry => !entry.isShort).map(entry => entry.name), ['p01-a01-main']);
    assert.deepEqual(entries.filter(entry => entry.isShort).map(entry => entry.collection), ['history-shorts', 'tictok']);
    assert.equal(entries.length, 3);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});
