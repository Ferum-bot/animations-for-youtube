import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {getTheme} from '@channel/theme';

export type PreviewProps = {
  readonly previewBackground?: 'transparent' | 'photo' | 'light' | 'dark';
  readonly withAudio?: boolean;
};

/** One still and a trimmed narration excerpt; never load presenter video. */
export const PresenterPreview: React.FC<PreviewProps & {readonly mediaPrefix: string}> = ({
  mediaPrefix, previewBackground = 'transparent', withAudio = false,
}) => <>
  {previewBackground === 'photo' ? <Img
    src={staticFile(`generated/009-cassandra-scylladb/${mediaPrefix}-presenter.jpg`)}
    style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
  {previewBackground === 'light' || previewBackground === 'dark'
    ? <AbsoluteFill style={{backgroundColor: getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} />
    : null}
  {withAudio ? <Audio src={staticFile(`generated/009-cassandra-scylladb/${mediaPrefix}-excerpt.m4a`)} /> : null}
</>;
