import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ThemeId} from '@channel/theme';
import {getPostgresTheme} from './theme';
import type {MotionProfile} from '@channel/motion-core';
import {getChapter} from './chapters';
import {TechnologyIcon} from './TechnologyIcon';
import {getChapterMotion} from './chapter-motion';

export type ChapterDividerProps = {
  readonly themeId?: ThemeId;
  readonly motionProfile?: MotionProfile;
};

const titleX = 508;
const titleBaseline = 776;

/** Opaque editorial cutaway: only the text enters; the final state holds to the cut. */
export const PostgresChapterDivider: React.FC<ChapterDividerProps & {
  readonly chapterNumber: number;
}> = ({chapterNumber, themeId = 'graphite', motionProfile = 'calm'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const theme = getPostgresTheme(themeId);
  const chapter = getChapter(chapterNumber);
  const motion = getChapterMotion(frame * 1000 / fps, motionProfile);

  return (
    <AbsoluteFill style={{backgroundColor: theme.background}}>
      <svg viewBox="0 0 2560 1440" width="100%" height="100%"
        role="img" aria-label={`${chapter.lead} ${chapter.title}. ${chapter.description ?? ''}`.trim()}
        style={{fontFamily: theme.fontSans, overflow: 'hidden'}}>
        <text x={252} y={titleBaseline} fontFamily={theme.fontMono} fontSize={68}
          fill={theme.muted} opacity={motion.number}>
          {String(chapter.number).padStart(2, '0')}
        </text>
        {chapter.lead ? (
          <text x={titleX} y={584} fontSize={112} fontWeight={400} letterSpacing={-2.5}
            fill={chapter.tone === 'problem' ? theme.signal : theme.muted} opacity={motion.lead}
            transform={`translate(0 ${(1 - motion.lead) * 12})`}>
            {chapter.lead}
          </text>
        ) : null}
        <text x={titleX - 5} y={titleBaseline} fontSize={164} fontWeight={700} letterSpacing={-5.2}
          fill={theme.text} opacity={motion.title}
          transform={`translate(0 ${(1 - motion.title) * 18})`}>
          {chapter.title}
        </text>
        {chapter.technology ? (
          <g opacity={motion.title}
            transform={`translate(2110 ${610 + (1 - motion.title) * 18})`}>
            <TechnologyIcon technology={chapter.technology} color={theme.text} />
          </g>
        ) : null}
        {chapter.description ? (
          <text x={titleX + 2} y={936} fontSize={46} fontWeight={400} letterSpacing={-0.4}
            fill={theme.muted} opacity={motion.description}
            transform={`translate(0 ${(1 - motion.description) * 8})`}>
            {chapter.description}
          </text>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
