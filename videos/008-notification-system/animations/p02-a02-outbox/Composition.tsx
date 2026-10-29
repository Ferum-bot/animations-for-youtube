import React from 'react';
import {CodeEditor} from '../../shared/CodeEditor';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {outboxSchema, ingestionTransaction, outboxRelay} from './code';
import {getOutboxState, scene} from './cues';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => {
      const state = getOutboxState(timeMs);
      const panels = [
        {id: 'schema', lines: outboxSchema, opacity: state.schemaOpacity},
        {id: 'transaction', lines: ingestionTransaction, opacity: state.transactionOpacity},
        {id: 'relay', lines: outboxRelay, opacity: state.relayOpacity},
      ];
      return panels.map((panel) => <g key={panel.id} opacity={panel.opacity}>
        <CodeEditor layout="standard" lines={panel.lines} fieldStrength={state.fieldStrength} />
      </g>);
    }}
  </OverlayStage>;

export default Composition;
