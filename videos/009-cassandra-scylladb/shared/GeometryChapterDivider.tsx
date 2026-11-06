import React, {useId} from 'react';
import {ChapterEyebrow, ChapterStage, type ChapterDividerProps, useChapterScene} from './ChapterStage';
import {chapters, type ChapterId} from './chapters';
import {chapterEasing, chapterProgress, mix} from './chapter-motion';

/** Three planes form a partition mark; their leading edge reveals the title. */
export const GeometryChapterDivider: React.FC<ChapterDividerProps & {readonly chapterId: ChapterId}> = ({
  chapterId, themeId = 'graphite', motionProfile = 'calm',
}) => {
  const chapter = chapters[chapterId];
  const {timeMs, entranceMs, endMs, theme} = useChapterScene(themeId, motionProfile);
  const clipId = useId();
  const build = chapterProgress(entranceMs, 100, 700);
  const reveal = chapterProgress(entranceMs, 650, 1800, chapterEasing.transform);
  const exit = chapterProgress(timeMs, endMs - 733, endMs, chapterEasing.leave);
  const edge = mix(180, 1980, reveal);
  const label = chapterProgress(entranceMs, 1050, 1450);

  return (
    <ChapterStage themeId={themeId} label={`Часть ${chapter.number}. ${chapter.lines.join(' ')}`}>
      <defs>
        <clipPath id={clipId}>
          <rect x={180} y={450} width={Math.max(0, edge - 245)} height={570} />
        </clipPath>
      </defs>
      <g transform={`translate(0 ${-1540 * exit})`}>
        <ChapterEyebrow x={185} y={345} color={theme.text} opacity={label} label={`ЧАСТЬ ${chapter.number}`} />
        <g clipPath={`url(#${clipId})`} fill={theme.text} fontWeight={800}>
          <text x={180} y={675} fontSize={chapter.fontSizes[0]} letterSpacing={-9}>{chapter.lines[0]}</text>
          <text x={180} y={925} fontSize={chapter.fontSizes[1]} letterSpacing={-10}>{chapter.lines[1]}</text>
        </g>
        {[0, 1, 2].map((index) => {
          const arrive = chapterProgress(entranceMs, 100 + index * 90, 660 + index * 90);
          const x = edge + index * 148;
          const y = 454 - index * 52 + (1 - arrive) * 1150;
          return (
            <g key={index} transform={`translate(${x} ${y})`} opacity={build}>
              <path d="M 0 54 L 120 0 L 120 578 L 0 632 Z" fill={theme.primary} />
              <path d="M 0 54 L 120 0 L 120 18 L 0 72 Z" fill={theme.text} opacity={0.16} />
            </g>
          );
        })}
        <rect x={185} y={1062} width={110 * label} height={9} fill={theme.primary} />
      </g>
    </ChapterStage>
  );
};

