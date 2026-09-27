import {getTheme, type ChannelTheme} from '@channel/theme';

/** The supplied GoLand reference, raised slightly in contrast for video. */
export const hashingTheme = {
  ...getTheme('graphite'),
  background: '#191A1C',
  surface: '#26282C',
  text: '#D1D3D9',
  muted: '#9DA0A8',
  line: '#555A64',
  primary: '#56A8F5',
  signal: '#CC8967',
  success: '#6AAB73',
} satisfies ChannelTheme;

export const hashingLayout = {
  width: 2560,
  height: 1440,
  left: 104,
  contentRight: 1308,
  solidEnd: 1380,
  transparentStart: 1740,
} as const;
