import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {smoothProgress, type MotionProfile} from '@channel/motion-core';
import {getTheme, type ThemeId} from '@channel/theme';
import {getLeetcodeTheme} from '../../shared/theme';
import {useOverlayTiming} from '../../shared/useOverlayTiming';
import {TaskPage} from './TaskPage';
import {editorStateAt, scene, websiteOpacityAt, websiteScrollAt} from './scene';

type Props = {
  readonly themeId?: ThemeId;
  readonly motionProfile?: MotionProfile;
  readonly previewBackground?: 'transparent' | 'light' | 'dark';
  readonly withAudio?: boolean;
};

const Composition: React.FC<Props> = ({themeId = 'paper', motionProfile = 'calm',
  previewBackground = 'transparent', withAudio = false}) => {
  const {timeMs, opacity, offsetY} = useOverlayTiming(scene.durationMs, motionProfile);
  const theme = useMemo(() => getLeetcodeTheme(themeId), [themeId]);
  const website = websiteOpacityAt(timeMs);
  const focus = smoothProgress(timeMs, scene.demoMs, scene.demoMs + 650);
  const vscode = smoothProgress(timeMs, scene.vscodeMs, scene.vscodeMs + 300);
  const links = smoothProgress(timeMs, scene.linksMs, scene.linksMs + 300);
  const editorState = editorStateAt(timeMs);
  return <AbsoluteFill>
    {previewBackground !== 'transparent' ? <AbsoluteFill style={{backgroundColor:
      getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} /> : null}
    {withAudio ? <Audio src={staticFile('generated/006-leetcode/p01-a03-monaco-editor.wav')} /> : null}
    <div style={{position: 'absolute', left: 330, top: 414, width: 1900, height: 840,
      opacity, transform: `translateY(${offsetY}px)`,
      background: theme.surface, color: theme.text, fontFamily: theme.fontSans,
      border: `2px solid ${theme.line}`, borderRadius: 10,
      boxShadow: `0 10px 18px ${theme.shadow}14`, overflow: 'hidden'}}>
      <div style={{height: 72, borderBottom: `1px solid ${theme.line}`, background: theme.chrome,
        display: 'flex', alignItems: 'center', padding: '0 32px', gap: 28}}>
        <svg width={42} height={28} viewBox="0 0 42 28" aria-hidden>
          <path d="M 12 6 L 4 14 L 12 22 M 4 14 H 25" stroke={theme.muted} strokeWidth={2} fill="none" />
        </svg>
        <div style={{fontFamily: theme.fontMono, fontSize: 25, flex: 1, color: theme.muted}}>
          {website > 0.5 ? 'microsoft.github.io/monaco-editor' : 'Демо в браузере / Monaco Editor'}
        </div>
        <span style={{fontSize: 22, color: theme.muted}}>{website > 0.5 ? 'Официальный сайт' : 'Пример интеграции'}</span>
      </div>
      <TaskPage theme={theme} dark={themeId !== 'paper'} focus={focus} vscode={vscode} state={editorState} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 73, bottom: 0,
        opacity: website, pointerEvents: 'none', background: theme.surface, overflow: 'hidden'}}>
        <Img src={staticFile('assets/006-leetcode/monaco/official-home-full-1280x2296.jpg')}
          style={{display: 'block', width: '100%', height: 'auto',
            transform: `translateY(${-websiteScrollAt(timeMs)}px)`}} />
      </div>
      <div style={{position: 'absolute', bottom: 0, left: 32, right: 32, height: 72,
        borderTop: `1px solid ${theme.line}`, background: theme.surface,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 25}}>
        <span style={{color: theme.muted}}>{website > 0.5 ? 'Monaco · Microsoft · Open source' :
          editorState.suggestions ? 'Автодополнение · методы Map' :
            focus > 0.5 ? 'Готовый редактор внутри вашей страницы' : 'Two Sum — пример задачи. Редактор справа — Monaco.'}</span>
        <span style={{opacity: links, color: theme.primary, fontFamily: theme.fontMono, fontSize: 23}}>
          microsoft.github.io/monaco-editor
        </span>
      </div>
    </div>
  </AbsoluteFill>;
};

export default Composition;
