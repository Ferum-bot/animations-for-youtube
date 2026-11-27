import React from 'react';
import type {PreviewProps} from '@channel/motion-v2';
import {DocumentationScene} from '../../shared/DocumentationScene';
import {captures} from './captures';
import {cues, pages} from './story';

const Composition: React.FC<PreviewProps> = props => <DocumentationScene {...props}
  label="WebSocketStream · backpressure и статус API" audio="websocket-stream"
  assets="assets/011-websocket/memory/websocket-stream" pages={pages} captures={captures} cues={cues}/>;

export default Composition;
