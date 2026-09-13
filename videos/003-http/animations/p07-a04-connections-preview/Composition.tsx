import React from 'react';
import {HttpPartPreview} from '../../shared/HttpPartPreview';
import {evolutionScenes} from '../../shared/evolution/timing';
import Scene0 from '../p07-a01-short-connections/Composition';
import Scene1 from '../p07-a02-persistent-connection/Composition';
import Scene2 from '../p07-a03-parallel-connections/Composition';

const scenes = [
  {...evolutionScenes.short, component: Scene0},
  {...evolutionScenes.persistent, component: Scene1},
  {...evolutionScenes.parallel, component: Scene2},] as const;
const Composition: React.FC = () => <HttpPartPreview scenes={scenes} />;
export default Composition;
