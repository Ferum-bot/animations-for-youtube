import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {getTheme} from '@channel/theme';

export type IntroProps = {
  readonly previewBackground?: 'transparent' | 'photo' | 'light' | 'dark';
  readonly withAudio?: boolean;
};

/** Presenter still and narration are preview-only; export disables both. */
export const IntroPreview: React.FC<IntroProps> = ({previewBackground = 'transparent', withAudio = false}) => <>
  {previewBackground === 'photo' ? <Img
    src={staticFile('generated/009-cassandra-scylladb/intro-presenter.jpg')}
    style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
  {previewBackground === 'light' || previewBackground === 'dark'
    ? <AbsoluteFill style={{backgroundColor: getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} />
    : null}
  {withAudio ? <Audio src={staticFile('generated/009-cassandra-scylladb/intro-excerpt.m4a')} /> : null}
</>;
