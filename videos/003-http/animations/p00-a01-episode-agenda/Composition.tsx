import React from 'react';
import {Audio} from '@remotion/media';
import {staticFile, useVideoConfig} from 'remotion';
import {msToFrames} from '@channel/motion-core';
import {agendaStartMs} from '../../shared/agendaContent';
import type {PreviewBackground} from '../../shared/HttpStage';
import {Agenda} from './Agenda';

type Props = {withAudio?: boolean; previewBackground?: PreviewBackground};

const Composition: React.FC<Props> = ({withAudio = true, previewBackground = 'transparent'}) => {
  const {fps} = useVideoConfig();
  return <>
    {withAudio ? <Audio src={staticFile('generated/003-http/audio.wav')}
      trimBefore={msToFrames(agendaStartMs, fps)} /> : null}
    <Agenda previewBackground={previewBackground} />
  </>;
};

export default Composition;
