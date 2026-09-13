import React from 'react';
import {HttpPartPreview} from '../../shared/HttpPartPreview';
import {evolutionScenes} from '../../shared/evolution/timing';
import Scene0 from '../p08-a01-binary-multiplexing/Composition';
import Scene1 from '../p08-a02-tcp-blocking/Composition';
import Scene2 from '../p08-a03-quic-streams/Composition';

const scenes = [
  {...evolutionScenes.multiplexing, component: Scene0},
  {...evolutionScenes.blocking, component: Scene1},
  {...evolutionScenes.quic, component: Scene2},] as const;
const Composition: React.FC = () => <HttpPartPreview scenes={scenes} />;
export default Composition;
