import {getV2Theme} from '@channel/motion-v2';

// Preserve this episode's softer graphite and muted red, on the supported v2 API.
const base = getV2Theme();
export const ink = {...base, background: base.surface, text: '#D6D2C9', muted: '#96989D', signal: '#BD7B70'};
export const vertical = {width: 1080, height: 1920, left: 72, right: 900, top: 240, bottom: 1630} as const;
export type Platform = 'shorts' | 'tiktok';
export const asset = (name: string) => `assets/007-just-use-postgres/${name}`;
