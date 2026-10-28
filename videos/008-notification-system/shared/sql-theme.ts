import {getTheme} from '@channel/theme';

/** Episode-local light SQL editor, following JetBrains' classic light syntax. */
export const sqlTheme = {
  ...getTheme('paper'),
  surface: '#E9EDF2',
  text: '#202020',
  line: '#596573',
  divider: '#BEC7D2',
  gutter: '#DDE3EA',
  lineNumber: '#737E8C',
  selection: '#D4E2F6',
  keyword: '#000080',
  string: '#008000',
  comment: '#808080',
  function: '#00627A',
} as const;
