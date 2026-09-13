import {getTheme, type ChannelTheme} from '@channel/theme';

/** Episode-local variation of the channel tokens; never changes the DNS theme. */
export const httpTheme = {
  ...getTheme('graphite'),
  background: '#142D50',
  surface: '#19395E',
  text: '#E0EFFF',
  muted: '#A3BBD4',
  line: '#5D7B99',
  primary: '#9CDECB',
  signal: '#9CDECB',
  success: '#9CDECB',
} satisfies ChannelTheme;

export const httpLayout = {
  width: 2560,
  height: 1440,
  agendaLeft: 136,
  agendaRight: 1256,
  agendaTop: 388,
  agendaBottom: 1290,
  backgroundSolidEnd: 1300,
  backgroundTransparentStart: 1740,
} as const;
