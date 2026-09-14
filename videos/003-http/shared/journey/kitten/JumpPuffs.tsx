import React from 'react';
import {catRoute, catStart, type CatPoint} from '../catTiming';
import {range} from '../timing';
import {jumpWindow} from './motion';
import {kittenInk as ink} from './design';

type PuffEvent = {
  readonly at: number;
  readonly point: CatPoint;
  readonly kind: 'launch' | 'land';
  readonly direction: number;
};
const events: readonly PuffEvent[] = catRoute.flatMap((beat, index): PuffEvent[] => {
  if (beat.action !== 'jump') return [];
  const previous = catRoute[index - 1],
    start = previous?.end ?? 0,
    from = previous?.at ?? catStart;
  const duration = beat.end - start,
    direction = beat.at[0] < from[0] ? -1 : 1;
  return [
    {at: start + duration * jumpWindow.launch, point: from, kind: 'launch', direction},
    {at: start + duration * jumpWindow.land, point: beat.at, kind: 'land', direction},
  ];
});

/** Small authored air puffs stay at the contact point while the kitten leaves it. */
export const JumpPuffs: React.FC<{time: number}> = ({time}) => (
  <g>
    {events.map((event, index) => {
      const age = time - event.at,
        duration = event.kind === 'launch' ? 400 : 480;
      if (age < 0 || age > duration) return null;
      const t = range(age, 0, duration),
        spread = 1 - (1 - t) ** 2;
      const opacity = Math.sin(Math.PI * t) ** 0.7 * 0.48;
      return (
        <g key={index} transform={`translate(${event.point[0]} ${event.point[1] + 3})`}>
          {[-1, 1].map((side) => (
            <g key={side} opacity={opacity}>
              {[0, 1].map((n) => {
                const back = event.kind === 'launch' && side === -event.direction ? 1.15 : 1;
                const x = side * (22 + (24 + n * 14) * spread) * back;
                const y = -4 - (9 + n * 8) * spread;
                const scale = (0.3 + spread * 0.5) * (n === 0 ? 1 : 0.65);
                return (
                  <path
                    key={n}
                    transform={`translate(${x} ${y}) scale(${scale})`}
                    d="M-18 7 C-29 7 -29 -6 -19 -9 C-22 -21 -5 -25 0 -14 C10 -25 25 -14 19 -4 C31 0 24 13 11 10 Q-2 15 -18 7Z"
                    fill={ink.fur}
                    stroke={ink.shade}
                    strokeWidth={1.5}
                  />
                );
              })}
              <path
                d={`M${side * 27} -1 Q${side * (48 + spread * 13)} 3 ${side * (58 + spread * 15)} -7`}
                fill="none"
                stroke={ink.fur}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.6}
              />
            </g>
          ))}
        </g>
      );
    })}
  </g>
);
