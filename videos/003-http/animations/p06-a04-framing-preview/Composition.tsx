import React from 'react';
import {HttpPartPreview} from '../../shared/HttpPartPreview';
import {framingScenes} from '../../shared/framing/timing';
import Boundary from '../p06-a01-message-boundary/Composition';
import Chunked from '../p06-a02-chunked-stream/Composition';
import Choice from '../p06-a03-framing-choice/Composition';

const scenes = [
  {...framingScenes.boundary, component: Boundary},
  {...framingScenes.chunked, component: Chunked},
  {...framingScenes.choice, component: Choice},
] as const;

const Composition: React.FC = () => <HttpPartPreview scenes={scenes} />;
export default Composition;
