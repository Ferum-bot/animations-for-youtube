import React from 'react';
import {MotionStage} from '@channel/design-system';
import type {ThemeId} from '@channel/design-system';
import {SixteenBitCompatibilityTrapOverlay} from './SixteenBitCompatibilityTrapOverlay';

type Props = {
  readonly themeId?: ThemeId;
  readonly transparent?: boolean;
};

const Composition: React.FC<Props> = ({themeId = 'graphite', transparent = true}) => (
  <MotionStage themeId={themeId} transparent={transparent}>
    <SixteenBitCompatibilityTrapOverlay />
  </MotionStage>
);

export default Composition;
