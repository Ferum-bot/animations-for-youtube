import React from 'react';
import {MotionStage} from '@channel/design-system';
import {AgendaOverlay} from './AgendaOverlay';

const Composition: React.FC = () => (
  <MotionStage themeId="graphite" transparent>
    <AgendaOverlay />
  </MotionStage>
);

export default Composition;
