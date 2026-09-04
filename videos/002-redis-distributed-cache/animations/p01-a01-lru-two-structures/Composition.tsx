import React from 'react';
import {MotionStage} from '@channel/design-system';
import type {ThemeId} from '@channel/design-system';
import {LruWhiteboard} from './LruWhiteboard';

type Props = {
  themeId?: ThemeId;
  transparent?: boolean;
};

const Composition: React.FC<Props> = ({
  themeId = 'paper',
  transparent = false,
}) => (
  <MotionStage themeId={themeId} transparent={transparent}>
    <LruWhiteboard />
  </MotionStage>
);

export default Composition;
