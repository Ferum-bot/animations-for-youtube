import {getTheme, type ThemeId} from '@channel/theme';

/** JetBrains-inspired editor colors, scoped to this episode. */
export const getLeetcodeTheme = (themeId: ThemeId) => {
  const base = getTheme(themeId);
  const light = themeId === 'paper';
  return {
    ...base,
    surface: light ? '#FFFFFF' : '#1E1F22',
    chrome: light ? '#F5F6F8' : '#2B2D30',
    text: light ? '#24262B' : '#BCBEC4',
    muted: light ? '#707681' : '#868A91',
    line: light ? '#D9DDE3' : '#43454A',
    primary: light ? '#315EE7' : '#6C95EB',
    selection: light ? '#E8EFFD' : '#2D3C58',
    shadow: light ? '#17243C' : '#000000',
    syntax: {
      plain: light ? '#24262B' : '#BCBEC4',
      command: light ? '#0066B8' : '#56A8F5',
      option: light ? '#871094' : '#C77DBB',
      string: light ? '#067D17' : '#6AAB73',
      number: light ? '#1750EB' : '#2AACB8',
      punctuation: light ? '#8C919A' : '#6F737A',
    },
  };
};

export type LeetcodeTheme = ReturnType<typeof getLeetcodeTheme>;
