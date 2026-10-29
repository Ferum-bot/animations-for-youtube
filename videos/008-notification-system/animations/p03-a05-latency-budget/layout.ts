import {stages} from './budget';

const headerHeight = 80;
const rowHeight = 100;
const bodyBottom = headerHeight + stages.length * rowHeight;

export const budgetLayout = {
  x: 340, y: 380, width: 1880, height: bodyBottom + 200,
  header: headerHeight, row: rowHeight, bodyBottom,
  labelX: 36, valueX: 836, notesX: 1176,
} as const;

export const emphasizedFontSize = (size: number, strength: number) => size * (1 + 0.18 * strength);
