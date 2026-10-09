import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import anchors from '../../anchors.json';
import metadata from './animation.json';
import {SettingsTable} from './SettingsTable';

const pauseMs = anchors['isolate-settings-pause'] - anchors['isolate-settings'];

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} durationMs={metadata.durationMs}
    audioFile="generated/006-leetcode/p02-a04-isolate-settings.wav">
    {({timeMs, theme}) => <SettingsTable theme={theme}
      pauseOpacity={smoothProgress(timeMs, pauseMs, pauseMs + 260)} />}
  </OverlayStage>;

export default Composition;
