import React, {createContext, useContext} from 'react';

export type ThemeId = 'graphite' | 'paper' | 'signal';

export type ChannelTheme = {
  id: ThemeId;
  background: string;
  surface: string;
  text: string;
  muted: string;
  line: string;
  primary: string;
  signal: string;
  success: string;
  fontSans: string;
  fontMono: string;
};

const fonts = {
  fontSans: 'Arial, Helvetica, sans-serif',
  fontMono: 'Menlo, Monaco, Consolas, monospace',
};

export const themes: Record<ThemeId, ChannelTheme> = {
  graphite: {
    id: 'graphite',
    background: '#090B0F',
    surface: '#171A20',
    text: '#F3EEE4',
    muted: '#7E828A',
    line: '#313741',
    primary: '#2451E6',
    signal: '#FF4A25',
    success: '#35A05A',
    ...fonts,
  },
  paper: {
    id: 'paper',
    background: '#F2EEE4',
    surface: '#FAF8F2',
    text: '#111111',
    muted: '#77736B',
    line: '#D4CFC4',
    primary: '#1845D8',
    signal: '#F04A24',
    success: '#2F7D45',
    ...fonts,
  },
  signal: {
    id: 'signal',
    background: '#111111',
    surface: '#21130F',
    text: '#FFF4E8',
    muted: '#AC8E80',
    line: '#543127',
    primary: '#FFB45E',
    signal: '#FF4A25',
    success: '#62C87B',
    ...fonts,
  },
};

export const getTheme = (id: ThemeId): ChannelTheme => themes[id];

const ThemeContext = createContext<ChannelTheme>(themes.graphite);

export const ChannelThemeProvider: React.FC<{
  children: React.ReactNode;
  themeId?: ThemeId;
}> = ({children, themeId = 'graphite'}) => (
  <ThemeContext.Provider value={getTheme(themeId)}>{children}</ThemeContext.Provider>
);

export const useChannelTheme = (): ChannelTheme => useContext(ThemeContext);

