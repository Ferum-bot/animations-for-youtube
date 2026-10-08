import {smoothProgress} from '@channel/motion-core';
import anchors from '../../anchors.json';
import metadata from './animation.json';

export const scene = {
  startMs: anchors['monaco-intro'],
  durationMs: metadata.durationMs,
  websiteMs: anchors['monaco-open-source'] - anchors['monaco-intro'],
  demoMs: anchors['monaco-show-editor'] - anchors['monaco-intro'],
  vscodeMs: anchors['monaco-vscode'] - anchors['monaco-intro'],
  linksMs: anchors['monaco-links'] - anchors['monaco-intro'],
} as const;

const prefix = [
  'function twoSum(nums: number[], target: number): number[] {',
  '  const seen = new Map<number, number>();',
  '',
  '  for (const [index, value] of nums.entries()) {',
  '    const match = seen.get(target - value);',
  '    if (match !== undefined) return [match, index];',
  '',
];
const suffix = ['  }', '  return [];', '}'];

export type EditorState = {
  readonly code: string;
  readonly column: number;
  readonly suggestions: boolean;
  readonly editing: boolean;
};

export const editorStateAt = (timeMs: number): EditorState => {
  const typingStartMs = 14900;
  const suggestMs = 15900;
  const narrowMs = 21300;
  const acceptMs = 23100;
  let line = '    // Сохраняем число и его индекс';
  if (timeMs >= acceptMs) line = '    seen.set(value, index);';
  else if (timeMs >= narrowMs) line = '    seen.s';
  else if (timeMs >= suggestMs) line = '    seen.';
  else if (timeMs >= typingStartMs) {
    const length = Math.min(5, Math.floor((timeMs - typingStartMs) / 180));
    line = `    ${'seen.'.slice(0, length)}`;
  }
  return {
    code: [...prefix, line, ...suffix].join('\n'),
    column: line.length + 1,
    suggestions: timeMs >= suggestMs && timeMs < acceptMs,
    editing: timeMs >= typingStartMs,
  };
};

export const websiteOpacityAt = (timeMs: number): number =>
  smoothProgress(timeMs, scene.websiteMs, scene.websiteMs + 360) *
  (1 - smoothProgress(timeMs, scene.demoMs - 200, scene.demoMs + 220));

// Pause on the title, scroll to the editor examples, then hold before returning.
export const websiteScrollAt = (timeMs: number): number =>
  1040 * smoothProgress(timeMs, scene.websiteMs + 900, scene.demoMs - 980);
