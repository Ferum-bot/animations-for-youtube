import {httpTheme} from '../theme';

/** Materials are local to this chapter; the episode's mint remains the request identity. */
export const palette = {
  ...httpTheme,
  deep: '#091B32',
  floor: '#102944',
  edge: '#416986',
  rim: '#76B4C9',
  blue: '#77B5F2',
  violet: '#A7ABD8',
  cream: '#F1EDE3',
  copper: '#A77D64',
} as const;
