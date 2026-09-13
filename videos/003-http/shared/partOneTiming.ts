import anchors from '../anchors.json';

export const partOneScenes = {
  exchange: {startMs: anchors['p01-request-response-start'], durationMs: 14_000},
  readable: {startMs: anchors['p01-readable-http-start'], durationMs: 24_000},
  passport: {startMs: anchors['p01-protocol-passport-start'], durationMs: 23_767},
} as const;

type SpeechAnchor = Extract<keyof typeof anchors, `p01-${string}`>;
export const sceneCue = (scene: keyof typeof partOneScenes, anchor: SpeechAnchor): number =>
  anchors[anchor] - partOneScenes[scene].startMs;

export const exchangeCues = {
  send: sceneCue('exchange', 'p01-request-send'),
  response: sceneCue('exchange', 'p01-response-return'),
  web: sceneCue('exchange', 'p01-web-foundation'),
} as const;

export const readableCues = {
  ascii: sceneCue('readable', 'p01-ascii-text'),
  mail: sceneCue('readable', 'p01-email-format'),
  manual: sceneCue('readable', 'p01-manual-request'),
  telnet: sceneCue('readable', 'p01-telnet-open'),
  type: sceneCue('readable', 'p01-request-type'),
  response: sceneCue('readable', 'p01-terminal-response'),
  benefits: [sceneCue('readable', 'p01-easy-implement'), sceneCue('readable', 'p01-easy-read'), sceneCue('readable', 'p01-easy-develop')],
} as const;

export const passportCues = {
  formats: sceneCue('passport', 'p01-passport-formats'),
  request: sceneCue('passport', 'p01-passport-request'),
  response: sceneCue('passport', 'p01-passport-response'),
  syntax: sceneCue('passport', 'p01-passport-syntax'),
  structure: [sceneCue('passport', 'p01-syntax-start-line'), sceneCue('passport', 'p01-syntax-headers'), sceneCue('passport', 'p01-syntax-separator'), sceneCue('passport', 'p01-syntax-body')],
  semantics: sceneCue('passport', 'p01-passport-semantics'),
  method: sceneCue('passport', 'p01-semantics-method'),
  status: sceneCue('passport', 'p01-semantics-status'),
  rules: sceneCue('passport', 'p01-passport-rules'),
  client: sceneCue('passport', 'p01-rules-client'),
  finalResponse: sceneCue('passport', 'p01-rules-response'),
} as const;
