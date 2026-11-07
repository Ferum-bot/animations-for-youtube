import assert from 'node:assert/strict';
import {mkdtemp, mkdir, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {test} from 'node:test';
import {createDesignPolicy} from '../design-system-policy.mjs';

const fixture = async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'motion-policy-test-'));
  const write = async (name, value) => {
    const file = path.join(root, name);
    await mkdir(path.dirname(file), {recursive: true});
    await writeFile(file, value);
  };
  await write('config/design-system-policy.json', JSON.stringify({
    legacyAnimations: ['099-test/p01-a01-old'],
    deprecatedImports: ['@channel/design-system', '@channel/standard-animations'],
    deprecatedPaths: ['packages/design-system', 'examples/animations'],
  }));
  await write('packages/motion-v2/src/index.ts', 'export const current = true;');
  const directory = path.join(root, 'videos/099-test/animations/p01-a02-new');
  const check = async metadata => {
    const policy = await createDesignPolicy(root);
    await policy.checkAnimation('099-test', metadata, directory);
    await policy.checkLibrary();
    return policy.errors;
  };
  return {root, write, check, dispose: () => rm(root, {recursive: true, force: true})};
};

test('legacy exemptions do not grandfather newly created scenes', async () => {
  const f = await fixture();
  try {
    assert.deepEqual(await f.check({id: 'p01-a01-old'}), []);
    assert.match((await f.check({id: 'p01-a02-new'})).join('\n'), /require designSystem/);
    await f.write('videos/099-test/animations/p01-a02-new/Composition.tsx', "import {current} from '@channel/motion-v2';");
    assert.deepEqual(await f.check({id: 'p01-a02-new', designSystem: 'v2'}), []);
  } finally {await f.dispose();}
});

test('v2 follows local wrappers and rejects transitive legacy imports', async () => {
  const f = await fixture();
  try {
    await f.write('videos/099-test/animations/p01-a02-new/Composition.tsx', "export {Scene} from '../../shared/wrapper';");
    await f.write('videos/099-test/shared/wrapper.tsx', "export {MotionStage as Scene} from '@channel/design-system';");
    assert.match((await f.check({id: 'p01-a02-new', designSystem: 'v2'})).join('\n'), /deprecated import/);
    await f.write('videos/099-test/shared/wrapper.tsx', "export {Scene} from '../animations/p01-a01-old/Composition';");
    await f.write('videos/099-test/animations/p01-a01-old/Composition.tsx', 'export const Scene = () => null;');
    assert.match((await f.check({id: 'p01-a02-new', designSystem: 'v2'})).join('\n'), /deprecated visual code/);
  } finally {await f.dispose();}
});

test('shared v2 code cannot import an episode even when that episode uses v2', async () => {
  const f = await fixture();
  try {
    await f.write('videos/099-test/shared/data.ts', 'export const data = 1;');
    await f.write('packages/motion-v2/src/index.ts', "export {data} from '../../../videos/099-test/shared/data';");
    assert.match((await f.check({id: 'p01-a01-old'})).join('\n'), /must not depend on episode/);
  } finally {await f.dispose();}
});
