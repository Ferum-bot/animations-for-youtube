import React from 'react';
import {Img, staticFile} from 'remotion';
import {smoothProgress} from '@channel/motion-core';
import type {ChannelTheme} from '@channel/theme';
import {articles, scene, videoReference, visibility} from './scene';
import {outlinedText} from '../../shared/intro/typography';

type Props = {readonly timeMs: number; readonly theme: ChannelTheme};

export const ArticleReferences: React.FC<Props> = ({timeMs, theme}) => {
  const exit = 1 - smoothProgress(timeMs, scene.videoStartMs - 320, scene.videoStartMs);
  return <div style={{position: 'absolute', left: 108, top: 230, width: 1030,
    opacity: exit, fontFamily: theme.fontSans}}>
    {articles.map((article) => {
      const enter = smoothProgress(timeMs, article.enterMs, article.enterMs + 360);
      const focus = visibility(timeMs, article.focusMs, article.focusEndMs);
      return <div key={article.id} style={{position: 'absolute', left: 0, top: article.top,
        width: 1000, opacity: enter, transform: `translateY(${(1 - enter) * 28}px)`}}>
        <Img src={staticFile(`assets/007-just-use-postgres/intro/${article.file}`)}
          alt={article.title} style={{width: 1000, height: article.height / article.width * 1000,
            display: 'block'}} />
        <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, width: 4,
          backgroundColor: theme.text, opacity: focus}} />
      </div>;
    })}
  </div>;
};

/** The actual video screenshot supplied by the user. */
export const VideoReference: React.FC<Props> = ({timeMs, theme}) => {
  const opacity = visibility(timeMs, scene.videoStartMs, scene.durationMs - 33.34);
  return <div style={{position: 'absolute', left: 108, top: 175, width: 1100,
    fontFamily: theme.fontSans, opacity,
    transform: `translateY(${(1 - smoothProgress(timeMs, scene.videoStartMs, scene.videoStartMs + 320)) * 22}px)`}}>
    <div style={{fontSize: 42, fontWeight: 600, ...outlinedText(6), marginBottom: 28}}>
      YouTube · {videoReference.author}
    </div>
    <Img src={staticFile(`assets/007-just-use-postgres/intro/${videoReference.file}`)}
      alt={videoReference.title} style={{display: 'block', width: 1100,
        height: videoReference.height / videoReference.width * 1100}} />
  </div>;
};
