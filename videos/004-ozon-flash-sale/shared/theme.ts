import {getTheme, type ThemeId} from '@channel/theme';

/** Episode-local syntax colors for a translucent code surface. */
export const getOzonTheme = (themeId: ThemeId) => {
  const base = getTheme(themeId);
  const light = themeId === 'paper';
  return {
    ...base,
    accent: light ? '#005BFF' : '#75A7FF',
    secondary: light ? '#C40062' : '#FF8FC5',
    comment: light ? '#616774' : '#A3ADBE',
    syntax: {
      keyword: light ? '#154BCC' : '#91B8FF',
      string: light ? '#22613B' : '#A8D8B3',
      number: light ? '#8F4A13' : '#F2C68C',
      parameter: light ? '#A12460' : '#FF9DCF',
      function: light ? '#156373' : '#84D3DB',
    },
  };
};

export type OzonTheme = ReturnType<typeof getOzonTheme>;
