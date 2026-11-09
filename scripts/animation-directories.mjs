import {readdir} from 'node:fs/promises';
import path from 'node:path';

// Shorts live with their episode but have their own numbering and no long-form timeline cue.
export async function listAnimationDirectories(videoDirectory) {
  const entries = await readdir(videoDirectory, {withFileTypes: true});
  const shorts = entries.filter(entry => entry.isDirectory() && entry.name.endsWith('-shorts'))
    .map(entry => entry.name).sort();
  const animations = [];
  for (const collection of ['animations', ...shorts]) {
    const directory = path.join(videoDirectory, collection);
    const folders = await readdir(directory, {withFileTypes: true});
    for (const entry of folders.filter(item => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      animations.push({name: entry.name, collection, directory: path.join(directory, entry.name), isShort: collection !== 'animations'});
    }
  }
  return animations;
}
