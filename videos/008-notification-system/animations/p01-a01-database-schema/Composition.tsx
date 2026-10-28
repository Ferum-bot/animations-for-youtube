import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getSchemaState, scene} from './cues';
import {notifications, users} from './schema';
import {SqlEditor} from '../../shared/SqlEditor';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => {
      const state = getSchemaState(timeMs);
      return <>
        <g opacity={state.usersOpacity}>
          <SqlEditor layout="compact" lines={users} fieldStrength={(field) => state.fieldStrength('users', field)} />
        </g>
        <g opacity={state.notificationsOpacity}>
          <SqlEditor layout="wide" lines={notifications} fieldStrength={(field) => state.fieldStrength('notifications', field)} />
        </g>
      </>;
    }}
  </OverlayStage>;

export default Composition;
