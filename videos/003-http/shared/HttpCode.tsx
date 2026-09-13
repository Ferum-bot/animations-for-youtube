import React from 'react';
import {httpTheme as theme} from './theme';

// A complete small plaintext HTTP/1.1 exchange. Empty entries are wire separators.
export const requestLines = ['GET / HTTP/1.1', 'Host: localhost:8080', 'Accept: text/plain', ''] as const;
export const responseLines = ['HTTP/1.1 200 OK', 'Content-Length: 2', '', 'OK'] as const;

export const HttpCode: React.FC<{
  readonly lines: readonly string[];
  readonly x: number;
  readonly y: number;
  readonly fontSize?: number;
  readonly lineHeight?: number;
  readonly visibleCharacters?: number;
  readonly activeLine?: number;
}> = ({lines, x, y, fontSize = 48, lineHeight = 76, visibleCharacters = Infinity, activeLine}) => {
  let consumed = 0;
  return <g fontFamily={theme.fontMono} fontSize={fontSize}>
    {lines.map((line, index) => {
      const content = line.slice(0, Math.max(0, visibleCharacters - consumed));
      consumed += line.length + 1;
      return <text key={index} x={x} y={y + index * lineHeight}
        fill={index === activeLine ? theme.primary : theme.text}>{content}</text>;
    })}
  </g>;
};
