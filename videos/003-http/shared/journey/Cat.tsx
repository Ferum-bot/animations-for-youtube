import React from 'react';
import {KittenPuppet} from './kitten/Puppet';
import {kittenScale, sampleKitten} from './kitten/motion';
import {kittenInk} from './kitten/design';
import {JumpPuffs} from './kitten/JumpPuffs';

/** A single resident character persists across every shot and inherits the stage's alpha. */
export const JourneyCat: React.FC<{time: number}> = ({time}) => {
  const state = sampleKitten(time);
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 2560 1440"
      aria-label="Котёнок исследует схему"
      style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
    >
      <JumpPuffs time={time} />
      <ellipse
        cx={state.x - 9 * kittenScale}
        cy={state.groundY + 3}
        rx={(68 + state.lying * 10) * kittenScale * (1 - state.airborne * 0.35)}
        ry={6}
        fill={kittenInk.shadow}
        opacity={0.28 * (1 - state.airborne * 0.8)}
      />
      <g transform={`translate(${state.x} ${state.y}) scale(${kittenScale})`}>
        <KittenPuppet state={state} />
      </g>
    </svg>
  );
};
