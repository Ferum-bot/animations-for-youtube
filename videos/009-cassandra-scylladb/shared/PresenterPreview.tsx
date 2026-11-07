import React from 'react';
import {PresenterPreview as Preview, type PreviewProps} from '@channel/motion-v2';
export type {PreviewProps} from '@channel/motion-v2';

/** One still and a trimmed narration excerpt; never load presenter video. */
export const PresenterPreview: React.FC<PreviewProps & {readonly mediaPrefix: string}> =
  ({mediaPrefix, ...props}) => <Preview {...props} media={{
    photoSrc: `generated/009-cassandra-scylladb/${mediaPrefix}-presenter.jpg`,
    audioSrc: `generated/009-cassandra-scylladb/${mediaPrefix}-excerpt.m4a`,
  }} />;
