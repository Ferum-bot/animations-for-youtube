import type {ProtocolDetailKind} from './ProtocolDetail';
import anchors from '../anchors.json';

export const agendaStartMs = anchors['episode-agenda-start'];
export const agendaDurationMs = 23_433;

type AgendaItem = {readonly lines: readonly string[]; readonly spokenAtMs: number; readonly y: number};

export const agendaItems = [
  {lines: ['Устройство HTTP'], spokenAtMs: anchors['agenda-anatomy'], y: 476},
  {lines: ['Методы, коды,', 'заголовки'], spokenAtMs: anchors['agenda-methods'], y: 632},
  {lines: ['Эволюция версий'], spokenAtMs: anchors['agenda-versions'], y: 842},
  {lines: ['От кода до провода'], spokenAtMs: anchors['agenda-request-path'], y: 998},
] as const satisfies readonly AgendaItem[];

type AgendaState = {readonly startMs: number; readonly row: number; readonly detail: ProtocolDetailKind};

// Absolute word offsets from the first Whisper block, converted once to scene-local time.
// The body phrase returns the focus to the anatomy row rather than implying it is a method.
export const agendaStates: readonly AgendaState[] = [
  {startMs: anchors['agenda-anatomy'] - agendaStartMs, row: 0, detail: 'request'},
  {startMs: anchors['agenda-methods'] - agendaStartMs, row: 1, detail: 'semantics'},
  {startMs: anchors['agenda-body'] - agendaStartMs, row: 0, detail: 'body'},
  {startMs: anchors['agenda-versions'] - agendaStartMs, row: 2, detail: 'versions'},
  {startMs: anchors['agenda-request-path'] - agendaStartMs, row: 3, detail: 'bytes'},
];
