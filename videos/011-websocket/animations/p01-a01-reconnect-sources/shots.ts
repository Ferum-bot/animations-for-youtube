import type {captures} from './captures';

export type PageShot = {
  readonly page: keyof typeof captures;
  readonly label: string;
  readonly start: number;
  readonly end: number;
  readonly focus: number;
  readonly quote: string;
  readonly translation: string;
};

// Milliseconds from the CapCut in-point (01:26). Focus marks the camera move.
export const pages: readonly PageShot[] = [
  {page: 'slack', label: 'Slack Status  /  31.10.2017', start: 0, end: 8450, focus: 2560,
    quote: 'left them unable to reconnect', translation: 'они не смогли подключиться снова'},
  {page: 'grace', label: 'GeekWire  /  Джулия Грейс, Slack', start: 8040, end: 16500, focus: 850,
    quote: 'it’s similar to DDoSing yourself', translation: 'это как устроить DDoS самим себе'},
  {page: 'flannel', label: 'Slack Engineering  /  Flannel', start: 16020, end: 28500, focus: 3270,
    quote: 'a full snapshot of a team’s data', translation: 'полный снимок данных команды'},
  {page: 'figma', label: 'Figma  /  LiveGraph', start: 71200, end: 76950, focus: 350,
    quote: 'it was blown away on every deploy', translation: 'кэш сбрасывался при каждой выкладке'},
];
