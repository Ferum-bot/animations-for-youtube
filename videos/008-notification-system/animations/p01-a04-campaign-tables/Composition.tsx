import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {SqlEditor} from '../../shared/SqlEditor';
import {getCampaignTableState, scene} from './cues';
import {campaigns, segments} from './schema';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => {
      const state = getCampaignTableState(timeMs);
      return <>
        <g opacity={state.outgoingOpacity}>
          <SqlEditor layout="standard" lines={campaigns} fieldStrength={state.fieldStrength} />
        </g>
        <g opacity={state.incomingOpacity}>
          <SqlEditor layout="standard" lines={segments} fieldStrength={state.fieldStrength} />
        </g>
      </>;
    }}
  </OverlayStage>;

export default Composition;
