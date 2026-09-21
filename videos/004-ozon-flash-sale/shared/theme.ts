import {getTheme, type ThemeId} from '@channel/theme';

/** Freeform board; JetBrains-inspired syntax adapted for each surface. */
export const getOzonTheme = (themeId: ThemeId) => {
  const base = getTheme(themeId);
  const light = themeId === 'paper';
  return {
    ...base,
    background: light ? '#FEFDFC' : base.background,
    text: light ? '#302C28' : base.text,
    line: light ? '#DAD6D0' : base.line,
    accent: light ? '#936025' : '#E6BB80',
    secondary: light ? '#9A62AF' : '#CAA0DC',
    comment: light ? '#80786F' : '#B9AEA1',
    grid: light ? '#B9B8B6' : '#59544F',
    marker: light ? '#E4BE73' : '#C39959',
    syntax: {
      keyword: light ? '#AB522B' : '#CC8967',
      column: light ? '#975095' : '#C77DBB',
      string: light ? '#397644' : '#6AAB73',
      number: light ? '#087C89' : '#2AACB8',
      parameter: light ? '#8A6824' : '#BFA66B',
      function: light ? '#216CB0' : '#56A8F5',
      cte: light ? '#687727' : '#B6BF73',
    },
  };
};

export type OzonTheme = ReturnType<typeof getOzonTheme>;
