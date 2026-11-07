import {getTheme, type ThemeId} from '@channel/theme';
import {v2FontFamily} from './font';

export const getV2Theme = (id: ThemeId = 'graphite') => ({...getTheme(id), fontSans: v2FontFamily});
export const v2Theme = getV2Theme();

export const productionCanvas = {width: 2560, height: 1440, fps: 30} as const;
export const presenterSafeLayout = {left: 100, panelWidth: 1080, railWidth: 860, titleWidth: 780} as const;
