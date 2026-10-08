import React, {useEffect, useId, useLayoutEffect, useRef, useState} from 'react';
import {cancelRender, continueRender, delayRender} from 'remotion';
import type * as Monaco from 'monaco-editor';
import type {EditorState} from './scene';
import './editor.css';

type Runtime = typeof import('./monaco-runtime');
let runtimePromise: Promise<Runtime> | undefined;
const loadRuntime = () => runtimePromise ??= import('./monaco-runtime');

export const MonacoEditor: React.FC<{
  readonly state: EditorState;
  readonly dark: boolean;
}> = ({state, dark}) => {
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [runtime, setRuntime] = useState<Runtime>();
  const [ready, setReady] = useState(false);
  const [loadHandle] = useState(() => delayRender('Load the local Monaco editor'));
  const id = useId();

  useEffect(() => {
    let disposed = false;
    loadRuntime().then((loaded) => {
      if (!disposed) setRuntime(loaded);
    }).catch(cancelRender);
    return () => {disposed = true; continueRender(loadHandle);};
  }, [loadHandle]);

  useLayoutEffect(() => {
    if (!runtime || !host.current) return;
    const {monaco} = runtime;
    const model = monaco.editor.createModel('', 'typescript',
      monaco.Uri.parse(`inmemory:///006-leetcode/monaco/${encodeURIComponent(id)}.ts`));
    const instance = monaco.editor.create(host.current, {
      model,
      theme: dark ? 'leetcode-graphite' : 'leetcode-paper',
      dimension: {width: 1290, height: 480},
      fontFamily: 'Menlo, Monaco, Consolas, monospace',
      fontSize: 28, lineHeight: 36, fontLigatures: false,
      padding: {top: 18, bottom: 12},
      minimap: {enabled: false},
      folding: false, glyphMargin: false,
      lineNumbersMinChars: 2, lineDecorationsWidth: 16,
      scrollBeyondLastLine: false,
      scrollbar: {vertical: 'hidden', horizontal: 'hidden', alwaysConsumeMouseWheel: false},
      overviewRulerLanes: 0, overviewRulerBorder: false,
      guides: {indentation: false, bracketPairs: false},
      bracketPairColorization: {enabled: false},
      renderLineHighlight: 'none',
      matchBrackets: 'never',
      cursorBlinking: 'solid', cursorSmoothCaretAnimation: 'off',
      smoothScrolling: false, stickyScroll: {enabled: false},
      quickSuggestions: false, suggestOnTriggerCharacters: false,
      wordBasedSuggestions: 'off',
      suggest: {showWords: false, preview: false, showStatusBar: false, showInlineDetails: false},
      suggestFontSize: 27, suggestLineHeight: 38,
      parameterHints: {enabled: false}, hover: {enabled: false},
      occurrencesHighlight: 'off', selectionHighlight: false,
      contextmenu: false, automaticLayout: false,
      accessibilitySupport: 'off', ariaLabel: 'Two Sum — Monaco Editor',
    });
    editor.current = instance;
    setReady(true);
    return () => {
      editor.current = null;
      instance.dispose();
      model.dispose();
    };
  }, [runtime, id, dark]);

  useLayoutEffect(() => {
    const instance = editor.current;
    const container = host.current;
    if (!instance || !container || !ready) return;
    const handle = delayRender('Apply deterministic Monaco frame');
    let disposed = false;
    let animationFrame = 0;
    const model = instance.getModel();
    if (model?.getValue() !== state.code) model?.setValue(state.code);
    instance.setPosition({lineNumber: 8, column: state.column});
    instance.setScrollPosition({scrollTop: 0, scrollLeft: 0});
    instance.trigger('timeline', 'hideSuggestWidget', {});
    if (state.editing) instance.focus();
    if (state.suggestions) instance.trigger('timeline', 'editor.action.triggerSuggest', {});
    instance.render(true);

    // Wait for DOM readiness only; code, cursor and suggestions come from the frame.
    // No fixed sleep or wall-clock input can alter the visual state.
    document.fonts.ready.then(() => {
      const check = () => {
        if (disposed) return;
        const widget = container.querySelector('.suggest-widget.visible');
        if (state.suggestions && !widget) {
          animationFrame = requestAnimationFrame(check);
          return;
        }
        instance.render(true);
        animationFrame = requestAnimationFrame(() => {
          continueRender(handle);
          continueRender(loadHandle);
        });
      };
      check();
    }).catch(cancelRender);
    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      continueRender(handle);
    };
  }, [ready, runtime, dark, state.code, state.column, state.suggestions, state.editing, loadHandle]);

  return <div className="leetcode-monaco" ref={host} style={{width: 1290, height: 480, pointerEvents: 'none'}} />;
};
