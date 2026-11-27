import React from 'react';
import type {PreviewProps} from '@channel/motion-v2';
import {DocumentationScene} from '../../shared/DocumentationScene';
import {captures} from './captures';
import {cues, pages} from './story';

const Composition: React.FC<PreviewProps> = props => <DocumentationScene {...props}
  label="Backpressure в браузере" audio="browser-backpressure"
  assets="assets/011-websocket/memory/backpressure" pages={pages} captures={captures} cues={cues}/>;

export default Composition;
