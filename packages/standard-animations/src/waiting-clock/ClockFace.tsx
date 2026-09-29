import React from 'react';
import {useChannelTheme} from '@channel/design-system';

const ticks = Array.from({length: 12}, (_, index) => index * 30);

/** Opaque face and a reverse-color keyline isolate the dial from footage. */
export const ClockFace: React.FC<{readonly angleDegrees: number}> = ({angleDegrees}) => {
  const theme = useChannelTheme();

  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      height="100%"
      role="img"
      aria-label="Идёт время"
      style={{display: 'block'}}
    >
      <circle cx={100} cy={100} r={98} fill={theme.background} />
      <circle cx={100} cy={100} r={93} fill={theme.background} stroke={theme.text} strokeWidth={7} />
      <g stroke={theme.text} strokeWidth={4.5}>
        {ticks.map((angle) => (
          <line key={angle} x1={100} y1={18} x2={100} y2={29} transform={`rotate(${angle} 100 100)`} />
        ))}
      </g>
      <line
        x1={100}
        y1={100}
        x2={100}
        y2={48}
        stroke={theme.signal}
        strokeWidth={7.5}
        strokeLinecap="round"
        transform={`rotate(${angleDegrees} 100 100)`}
      />
      <circle cx={100} cy={100} r={8.5} fill={theme.text} />
    </svg>
  );
};
