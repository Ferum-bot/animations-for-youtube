import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {test} from 'node:test';

const scripts = path.resolve('scripts');
const run = (cwd, script, args) => spawnSync(process.execPath, [path.join(scripts, script), ...args], {cwd, encoding: 'utf8'});

test('scaffolding defaults to v2 and refuses to overwrite a video or animation', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'motion-scaffold-test-'));
  try {
    await mkdir(path.join(root, 'videos'));
    const videoArgs = ['--video', '099-test', '--title', 'Тест'];
    assert.equal(run(root, 'create-video.mjs', videoArgs).status, 0);
    const videoPath = path.join(root, 'videos/099-test/video.json');
    const originalVideo = await readFile(videoPath, 'utf8');
    assert.notEqual(run(root, 'create-video.mjs', videoArgs).status, 0);
    assert.equal(await readFile(videoPath, 'utf8'), originalVideo);

    const args = ['--video', '099-test', '--part', '01', '--order', '01', '--animation', 'message', '--title', 'Русский "текст"'];
    assert.equal(run(root, 'create-animation.mjs', args).status, 0);
    const directory = path.join(root, 'videos/099-test/animations/p01-a01-message');
    const metadata = JSON.parse(await readFile(path.join(directory, 'animation.json'), 'utf8'));
    assert.equal(metadata.designSystem, 'v2');
    const composition = path.join(directory, 'Composition.tsx');
    await writeFile(composition, '// Approved user edit: must survive scaffold retry.\n');
    const timelinePath = path.join(root, 'videos/099-test/timeline.json');
    const originalTimeline = await readFile(timelinePath, 'utf8');
    assert.notEqual(run(root, 'create-animation.mjs', args).status, 0);
    assert.equal(await readFile(composition, 'utf8'), '// Approved user edit: must survive scaffold retry.\n');
    assert.equal(await readFile(timelinePath, 'utf8'), originalTimeline);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});
