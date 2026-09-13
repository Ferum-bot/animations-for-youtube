import React from 'react';
import {chapterDurationMs, getChapter} from './chapters';
import {HttpStage, type PreviewBackground} from './HttpStage';
import {MessageBrackets} from './MessageBrackets';
import {ProtocolDetail} from './ProtocolDetail';
import {httpTheme as theme} from './theme';
import {reveal, useTimeMs, visibility} from './timing';

export const HttpChapterDivider: React.FC<{
  chapterNumber: number;
  previewBackground?: PreviewBackground;
}> = ({chapterNumber, previewBackground}) => {
  const timeMs = useTimeMs();
  const chapter = getChapter(chapterNumber);
  const opening = reveal(timeMs, 50, 540);
  const closing = reveal(timeMs, 3550, 650);
  const width = 650 + 1070 * opening - 1070 * closing;
  const height = 950 - 350 * closing;
  const y = 235 + 175 * closing;
  const titleOpacity = reveal(timeMs, 280, 340) * (1 - reveal(timeMs, 3450, 350));
  const detailOpacity = reveal(timeMs, 690, 350) * (1 - reveal(timeMs, 3380, 270));
  const closingCopy = reveal(timeMs, 3810, 230);
  const titleSize = chapter.title[1].length > 8 ? 145 : 210;

  return (
    <HttpStage surface="fullscreen" opacity={visibility(timeMs, chapterDurationMs)} previewBackground={previewBackground}>
      <MessageBrackets x={(2560 - width) / 2} y={y} width={width} height={height}
        markerY={330 + (height - 386) * closing} arm={110} />
      <g textAnchor="middle" opacity={titleOpacity}
        transform={`translate(0 ${(1 - reveal(timeMs, 280, 340)) * 18})`}>
        <text x={1280} y={368} fontFamily={theme.fontMono} fontSize={31}
          letterSpacing={5} fill={theme.primary}>ЧАСТЬ {String(chapter.number).padStart(2, '0')}</text>
        <text x={1280} y={576} fontSize={110} fontWeight={400} letterSpacing={1}
          fill={theme.text}>{chapter.title[0]}</text>
        <text x={1280} y={792} fontSize={titleSize} fontWeight={800} letterSpacing={-1}
          fill={theme.text}>{chapter.title[1]}</text>
      </g>
      <g transform="translate(900 952) scale(1.15)" opacity={detailOpacity}>
        <ProtocolDetail kind={chapter.detail} elapsedMs={timeMs - 690} />
      </g>
      <text x={1280} y={920} textAnchor="middle" fontFamily={theme.fontMono} fontSize={31}
        fill={theme.text} opacity={reveal(timeMs, 70, 160) * (1 - reveal(timeMs, 290, 200))}>
        GET / HTTP/1.1
      </text>
      <g textAnchor="middle" opacity={closingCopy} fontFamily={theme.fontMono}>
        <text x={1280} y={690} fontSize={54} fill={theme.text}>GET</text>
        <text x={1280} y={778} fontSize={28} letterSpacing={4} fill={theme.primary}>47 45 54</text>
      </g>
    </HttpStage>
  );
};
