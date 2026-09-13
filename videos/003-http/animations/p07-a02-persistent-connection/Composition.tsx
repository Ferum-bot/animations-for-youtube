import React from 'react';
import type {HttpSceneProps} from '../../shared/NarratedHttpScene';
import {EvolutionScene} from '../../shared/evolution/EvolutionScene';
import {useTimeMs} from '../../shared/timing';
import {KeepConnection, OrderedRequests, ConnectionSavings} from './Explanations';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <EvolutionScene {...props} scene="persistent" title="СОЕДИНЕНИЕ ОСТАЁТСЯ" eyebrow="ЭВОЛЮЦИЯ HTTP / 1.1">
    <KeepConnection timeMs={timeMs} /><OrderedRequests timeMs={timeMs} /><ConnectionSavings timeMs={timeMs} />
  </EvolutionScene>;
};
export default Composition;
