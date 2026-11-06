import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useEpisodeFont} from '../../shared/font';
import {PresenterPreview, type PreviewProps} from '../../shared/PresenterPreview';
import {illustrationTheme as theme} from '../../shared/editorial-v2/illustration';
import {InboxLaunch} from './InboxLaunch';
import {PaperResults} from './PaperResults';
import {Announcement} from './Announcement';
import {ResolvedSearch} from './ResolvedSearch';
import {timing as t} from './scene';

const Composition: React.FC<PreviewProps> = (props) => {
  useEpisodeFont();
  const {fps} = useVideoConfig();
  const timeMs = useCurrentFrame() * 1000 / fps;
  return <AbsoluteFill>
    <PresenterPreview {...props} mediaPrefix="history-launch" />
    <svg width="100%" height="100%" viewBox="0 0 2560 1440" role="img"
      aria-label="История Cassandra: запуск Inbox Search и первые результаты"
      style={{position: 'absolute', fontFamily: theme.fontSans, fill: theme.text, overflow: 'hidden'}}>
      {timeMs < t.paper ? <InboxLaunch timeMs={timeMs} /> : null}
      {timeMs >= t.paper && timeMs < t.announcement ? <PaperResults timeMs={timeMs} /> : null}
      {timeMs >= t.announcement ? <rect width={2560} height={1440} fill={theme.background} /> : null}
      {timeMs >= t.announcement && timeMs < t.resolved ? <Announcement timeMs={timeMs} /> : null}
      {timeMs >= t.resolved ? <ResolvedSearch timeMs={timeMs} /> : null}
    </svg>
  </AbsoluteFill>;
};

export default Composition;
