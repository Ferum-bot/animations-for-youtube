import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {getTheme} from '@channel/theme';

export type PreviewProps = {
  readonly previewBackground?: 'transparent' | 'photo' | 'light' | 'dark';
  readonly withAudio?: boolean;
};

export type PreviewMedia = {
  readonly photoSrc: string;
  readonly audioSrc: string;
};

/** Explicit public asset paths: one photo and only the narrated excerpt, never full video. */
export const PresenterPreview: React.FC<PreviewProps & {readonly media: PreviewMedia}> = ({
  media, previewBackground = 'transparent', withAudio = false,
}) => <>
  {previewBackground === 'photo' ? <Img src={staticFile(media.photoSrc)}
    style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
  {previewBackground === 'light' || previewBackground === 'dark'
    ? <AbsoluteFill style={{backgroundColor: getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} />
    : null}
  {withAudio ? <Audio src={staticFile(media.audioSrc)} /> : null}
</>;
