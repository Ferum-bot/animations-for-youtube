import React from 'react';
import {PresenterPreview, type PreviewProps} from '../../shared/PresenterPreview';

export type IntroProps = PreviewProps;

/** Presenter still and narration are preview-only; export disables both. */
export const IntroPreview: React.FC<IntroProps> = (props) => <PresenterPreview {...props} mediaPrefix="intro" />;
