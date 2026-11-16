import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {useSceneTime, useV2Font} from '@channel/motion-v2';
import {ArchivePage} from '../ArchivePage';
import {EndCard} from '../EndCard';
import {ink, type Platform} from '../palette';
import {BookShot, YoutubeShot} from './MediaShots';
import {Cover} from './Cover';
import {pages, score, shots} from './score';

export type TrendProps = {readonly withAudio?: boolean; readonly platform?: Platform; readonly cover?: boolean};

export default function Composition({withAudio = true, platform = 'shorts', cover = false}: TrendProps) {
  useV2Font();
  const {timeMs} = useSceneTime();
  const {width} = useVideoConfig();
  const shot = shots.reduce((selected, candidate) => timeMs >= candidate.atMs ? candidate : selected, shots[0]);
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && !cover && <Audio src={staticFile('generated/007-just-use-postgres/intro-shorts/trend-origin-v2.wav')}/>}
    <div style={{position: 'absolute', width: 1080, height: 1920, overflow: 'hidden',
      transform: `scale(${width / 1080})`, transformOrigin: 'top left', fontFamily: ink.fontSans}}>
      {cover ? <Cover/> : timeMs >= score.bodyMs ? <EndCard platform={platform} elapsedMs={timeMs - score.bodyMs}/> :
        shot?.kind === 'page' ? <ArchivePage page={pages[shot.page]} timeMs={timeMs - shot.atMs}/> :
        shot?.kind === 'youtube' ? <YoutubeShot timeMs={timeMs - shot.atMs}/> :
        shot?.kind === 'book' ? <BookShot timeMs={timeMs - shot.atMs}/> : null}
    </div>
  </AbsoluteFill>;
}
