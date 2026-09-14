import React, {useId} from 'react';
import {kittenInk as ink} from './design';

/** Large rounded pupils travel together inside warm, clipped eye sockets. */
export const Eye: React.FC<{
  x: number;
  gazeX: number;
  gazeY: number;
  open: number;
  dilation: number;
}> = ({x, gazeX, gazeY, open, dilation}) => {
  const clipId = `kitten-eye-${useId().replace(/:/g, '')}`;
  return (
    <g transform={`translate(${x} 5)`}>
      <defs>
        <clipPath id={clipId}>
          <ellipse rx={18.5} ry={22.5} />
        </clipPath>
      </defs>
      {open > 0.12 ? (
        <g transform={`scale(1 ${open})`}>
          <ellipse rx={18.5} ry={22.5} fill={ink.eyeWhite} stroke={ink.outline} strokeWidth={1.6} />
          <g clipPath={`url(#${clipId})`}>
            <g transform={`translate(${gazeX} ${gazeY})`}>
              <ellipse rx={14.4} ry={19.4} fill={ink.iris} />
              <ellipse cy={-0.8} rx={10.8 + dilation} ry={16 + dilation * 0.8} fill={ink.eye} />
              <ellipse cx={-5} cy={-8.5} rx={6} ry={6.8} fill={ink.highlight} />
              <ellipse cx={6} cy={9.5} rx={3.5} ry={4} fill={ink.highlight} />
              <circle cx={-6.5} cy={5} r={1.4} fill={ink.highlight} opacity={0.7} />
            </g>
          </g>
        </g>
      ) : (
        <path
          d="M-15 3 Q0 13 15 3"
          fill="none"
          stroke={ink.outline}
          strokeWidth={3.8}
          strokeLinecap="round"
        />
      )}
    </g>
  );
};
