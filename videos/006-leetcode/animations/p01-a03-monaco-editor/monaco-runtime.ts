import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js';
import {getLeetcodeTheme} from '../../shared/theme';

// Assets and the editor worker are bundled locally; rendering needs no CDN.
globalThis.MonacoEnvironment = {
  getWorker: () => new Worker(
    new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
    {type: 'module'},
  ),
};

for (const id of ['paper', 'graphite'] as const) {
  const theme = getLeetcodeTheme(id);
  monaco.editor.defineTheme(`leetcode-${id}`, {
    base: id === 'paper' ? 'vs' : 'vs-dark', inherit: true,
    rules: [
      {token: 'keyword', foreground: theme.syntax.option.slice(1)},
      {token: 'string', foreground: theme.syntax.string.slice(1)},
      {token: 'number', foreground: theme.syntax.number.slice(1)},
      {token: 'comment', foreground: theme.muted.slice(1)},
      {token: 'type.identifier', foreground: theme.syntax.command.slice(1)},
    ],
    colors: {
      'editor.background': theme.surface,
      'editor.foreground': theme.text,
      'editorLineNumber.foreground': theme.muted,
      'editorLineNumber.activeForeground': theme.text,
      'editor.lineHighlightBackground': theme.chrome,
      'editor.selectionBackground': theme.selection,
      'editorCursor.foreground': theme.primary,
      'editorSuggestWidget.background': theme.surface,
      'editorSuggestWidget.border': theme.line,
      'editorSuggestWidget.foreground': theme.text,
      'editorSuggestWidget.selectedBackground': theme.selection,
      'editorSuggestWidget.selectedForeground': theme.text,
      'editorSuggestWidget.selectedIconForeground': theme.syntax.option,
      'editorSuggestWidget.highlightForeground': theme.primary,
    },
  });
}

// A scoped completion provider for the Map<number, number> in this demo.
// Monaco itself renders, filters and lays out the actual suggestion widget.
monaco.languages.registerCompletionItemProvider('typescript', {
  triggerCharacters: ['.'],
  provideCompletionItems: (model, position) => {
    if (!model.uri.path.startsWith('/006-leetcode/monaco/')) return {suggestions: []};
    const word = model.getWordUntilPosition(position);
    const range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
    return {suggestions: [
      {label: 'get', detail: '(key: number): number | undefined', insertText: 'get'},
      {label: 'has', detail: '(key: number): boolean', insertText: 'has'},
      {label: 'set', detail: '(key: number, value: number): Map', insertText: 'set(value, index)'},
    ].map((item) => ({...item, range, kind: monaco.languages.CompletionItemKind.Method}))};
  },
});

export {monaco};
