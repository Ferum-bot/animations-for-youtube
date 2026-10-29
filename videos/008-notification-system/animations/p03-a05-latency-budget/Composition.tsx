import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getBudgetState, scene} from './cues';
import {BudgetTable} from './BudgetTable';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <BudgetTable state={getBudgetState(timeMs)} />}
  </OverlayStage>;

export default Composition;
