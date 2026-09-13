import React from 'react';
import {DiagramFrame} from '../HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../NarratedHttpScene';
import {useTimeMs} from '../timing';
import {evolutionScenes} from './timing';

export const EvolutionScene: React.FC<HttpSceneProps & {
  scene: keyof typeof evolutionScenes; title: string; eyebrow: string; children: React.ReactNode;
}> = ({scene, title, eyebrow, children, ...props}) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...evolutionScenes[scene]}>
    <HttpSceneHeading title={title} eyebrow={eyebrow} fontSize={62} />
    <DiagramFrame timeMs={timeMs} />
    {children}
  </NarratedHttpScene>;
};
