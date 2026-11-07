import {SceneStage, useSceneTime, v2Theme as theme} from '@channel/motion-v2';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PresenterPreview, type PreviewProps} from '../../shared/PresenterPreview';
import {InboxLaunch} from './InboxLaunch';
import {PaperResults} from './PaperResults';
import {Announcement} from './Announcement';
import {ResolvedSearch} from './ResolvedSearch';
import {timing as t} from './scene';

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs} = useSceneTime();
  return <AbsoluteFill>
    <PresenterPreview {...props} mediaPrefix="history-launch" />
    <SceneStage label="История Cassandra: запуск Inbox Search и первые результаты">
      {timeMs < t.paper ? <InboxLaunch timeMs={timeMs} /> : null}
      {timeMs >= t.paper && timeMs < t.announcement ? <PaperResults timeMs={timeMs} /> : null}
      {timeMs >= t.announcement ? <rect width={2560} height={1440} fill={theme.background} /> : null}
      {timeMs >= t.announcement && timeMs < t.resolved ? <Announcement timeMs={timeMs} /> : null}
      {timeMs >= t.resolved ? <ResolvedSearch timeMs={timeMs} /> : null}
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
