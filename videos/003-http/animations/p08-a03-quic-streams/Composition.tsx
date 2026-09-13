import React from 'react';
import type {HttpSceneProps} from '../../shared/NarratedHttpScene';
import {EvolutionScene} from '../../shared/evolution/EvolutionScene';
import {useTimeMs} from '../../shared/timing';
import {IndependentDelivery, TransportVideo} from './Explanations';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <EvolutionScene {...props} scene="quic" title="ДОСТАВКА ПО ПОТОКАМ" eyebrow="ЭВОЛЮЦИЯ HTTP / 3">
    <IndependentDelivery timeMs={timeMs} /><TransportVideo timeMs={timeMs} />
  </EvolutionScene>;
};
export default Composition;
