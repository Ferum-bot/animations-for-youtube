import React from 'react';
import {technologyMarks, type TechnologyMark} from './technology-marks';

/** Monochrome marks keep product identity without adding a second color hierarchy. */
export const TechnologyIcon: React.FC<{
  readonly technology: TechnologyMark;
  readonly color: string;
}> = ({technology, color}) => (
  <svg width={216} height={216} viewBox="0 0 24 24" aria-hidden="true">
    {technology === 'pubsub' ? (
      // Pub/Sub is a messaging pattern here, not the Google Cloud product.
      <g fill="none" stroke={color} strokeWidth={1.3}>
        <path d="M6 12h6M12 4v16M12 4h6M12 12h6M12 20h6" />
        <circle cx={3.5} cy={12} r={2.5} />
        <circle cx={20.5} cy={4} r={2} />
        <circle cx={20.5} cy={12} r={2} />
        <circle cx={20.5} cy={20} r={2} />
      </g>
    ) : <path d={technologyMarks[technology]} fill={color} />}
  </svg>
);
