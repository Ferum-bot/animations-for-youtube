import React from 'react';
import type {HttpSceneProps} from '../../shared/NarratedHttpScene';
import {EvolutionScene} from '../../shared/evolution/EvolutionScene';
import {useTimeMs} from '../../shared/timing';
import {TransportLayers, ReceiveBuffer} from './Explanations';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <EvolutionScene {...props} scene="blocking" title="ГДЕ ВОЗНИКАЕТ ОЖИДАНИЕ" eyebrow="HTTP/2 → HTTP/3 / ТРАНСПОРТ">
    <TransportLayers timeMs={timeMs} /><ReceiveBuffer timeMs={timeMs} />
  </EvolutionScene>;
};
export default Composition;
