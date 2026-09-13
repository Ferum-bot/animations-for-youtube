import React from 'react';
import type {HttpSceneProps} from '../../shared/NarratedHttpScene';
import {EvolutionScene} from '../../shared/evolution/EvolutionScene';
import {useTimeMs} from '../../shared/timing';
import {SingleExchange, ResourceExpansion} from './Explanations';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <EvolutionScene {...props} scene="short" title="ОДИН ОБМЕН — ОДНО СОЕДИНЕНИЕ" eyebrow="ЭВОЛЮЦИЯ HTTP / 1.0">
    <SingleExchange timeMs={timeMs} /><ResourceExpansion timeMs={timeMs} />
  </EvolutionScene>;
};
export default Composition;
