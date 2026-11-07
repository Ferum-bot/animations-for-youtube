import React from 'react';
import {v2Theme as ink} from '@channel/motion-v2';

/** Bound paper, drawn in local coordinates (530 × 270). */
export const NotebookCover: React.FC = () => <g strokeLinejoin="round" strokeLinecap="round">
  <path d="M9 15 Q8 5 24 3 L504 0 Q526 0 527 20 L529 247 Q528 260 516 264 L29 270 Q5 270 5 249 Z"
    fill={ink.surface} stroke={ink.text} strokeWidth={5} />
  <path d="M19 247 Q27 253 48 251 L512 246 M51 7 L49 247"
    fill="none" stroke={ink.text} strokeWidth={4} />
</g>;
