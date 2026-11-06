import React from 'react';
import {Img, staticFile} from 'remotion';
import {getTheme} from '@channel/theme';
import {smoothProgress} from '@channel/motion-core';
import {cues} from './scene';
import {asset, authors} from './sources';
import {SceneSurface} from './SceneSurface';

export const AuthorsScene: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const theme = getTheme('paper');
  return <SceneSurface cue={cues.authors} timeMs={timeMs} top={300} height={740}
    background={theme.background} label="СОЗДАТЕЛИ CASSANDRA">
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: 32}}>
      {authors.map((author) => {
        const spoken = smoothProgress(timeMs, author.spokenMs - 160, author.spokenMs + 80);
        const [givenName] = author.name.split(' ');
        return <div key={author.name}>
          <Img src={staticFile(asset(author.image))} alt={author.name}
            style={{display: 'block', width: '100%', height: 516,
              objectFit: 'cover', objectPosition: author.position}} />
          <div style={{paddingTop: 20, color: theme.text, fontSize: 40, lineHeight: 1.3}}>
            <div>{givenName}</div>
            <div style={{fontWeight: 750, fontSize: 53}}>{author.surname}</div>
            <div style={{height: 4, marginTop: 10, background: theme.primary,
              transform: `scaleX(${spoken})`, transformOrigin: 'left'}} />
          </div>
        </div>;
      })}
    </div>
  </SceneSurface>;
};
