import React from 'react';
import type {HttpSceneProps} from '../../shared/NarratedHttpScene';
import {EvolutionScene} from '../../shared/evolution/EvolutionScene';
import {useTimeMs} from '../../shared/timing';
import {BinaryFrames, MultiplexedResponses} from './Explanations';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <EvolutionScene {...props} scene="multiplexing" title="КАДРЫ И ПОТОКИ" eyebrow="ЭВОЛЮЦИЯ HTTP / 2">
    <BinaryFrames timeMs={timeMs} /><MultiplexedResponses timeMs={timeMs} />
  </EvolutionScene>;
};
export default Composition;
