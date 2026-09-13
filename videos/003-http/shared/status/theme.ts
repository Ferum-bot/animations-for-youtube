import {getTheme} from '@channel/theme';
import {httpTheme} from '../theme';

/** Warm color has one job: an unsuccessful request or a triggered alert. */
export const statusTheme = {...httpTheme, danger: getTheme('signal').primary} as const;
