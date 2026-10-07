import React from 'react';
import {DockerScene, type DockerSceneProps} from '../../shared/docker/DockerScene';
import {cues, scene} from './cues';

const Composition: React.FC<DockerSceneProps> = (props) =>
  <DockerScene {...props} cues={cues} durationMs={scene.durationMs}
    audioFile="generated/006-leetcode/p01-a02-docker-flags.wav" />;

export default Composition;
