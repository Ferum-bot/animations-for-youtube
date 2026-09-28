import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';

type Feather = {
  readonly solidEnd: number;
  readonly transparentStart: number;
};

/** Fade the background only; labels and diagram geometry remain sharp siblings. */
export const FeatheredBackground: React.FC<{
  readonly color: string;
  readonly feather?: Feather;
}> = ({color, feather}) => {
  const {width} = useVideoConfig();
  const position = (amount: number): string => feather
    ? `${(feather.solidEnd + (feather.transparentStart - feather.solidEnd) * amount) / width * 100}%`
    : '100%';
  const mask = feather
    ? `linear-gradient(90deg, black 0%, black ${position(0)},
      rgba(0,0,0,.94) ${position(0.18)}, rgba(0,0,0,.65) ${position(0.4)},
      rgba(0,0,0,.25) ${position(0.68)}, rgba(0,0,0,.06) ${position(0.9)},
      transparent ${position(1)}, transparent 100%)`
    : undefined;
  return <AbsoluteFill style={{background: color, maskImage: mask, WebkitMaskImage: mask}} />;
};
