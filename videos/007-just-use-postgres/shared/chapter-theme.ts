import {getTheme, type ChannelTheme, type ThemeId} from '@channel/theme';

/** Softer luminance for a full-frame divider viewed in a dark edit. */
export const getChapterTheme = (themeId: ThemeId): ChannelTheme => {
  const theme = getTheme(themeId);
  return themeId === 'graphite'
    ? {...theme, background: theme.surface, text: '#D6D2C9', muted: '#96989D', signal: '#BD7B70'}
    : {...theme, signal: '#994D40'};
};
