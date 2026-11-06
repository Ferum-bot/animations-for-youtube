import type {CropId} from './sources';

export const scene = {
  sourceStartMs: 41500,
  durationMs: 41700,
  left: 100,
  width: 1166.4,
  entranceMs: 300,
  exitMs: 300,
} as const;

export type {Highlight, QuoteLine} from '../../shared/source-documents/QuoteHighlight';
import type {Highlight} from '../../shared/source-documents/QuoteHighlight';

export type Clipping = {
  readonly crop: CropId;
  readonly top: number;
  readonly startMs: number;
  readonly endMs: number;
  readonly marks?: readonly Highlight[];
};

// Absolute narration milliseconds. Brand/word anchors come from local Whisper
// tokens; the earlier title entrances allow the publication to become readable.
// Rectangles use original crop pixels, before the single display scale.
export const clippings: readonly Clipping[] = [
  {crop: 'netflix-title', top: 0, startMs: 41500, endMs: 48000},
  {crop: 'netflix-excerpt', top: 348.3, startMs: 41500, endMs: 48000, marks: [
    {startMs: 43550, endMs: 44800, fontSize: 80, lines: [{text: 'viewing histories', x: 501, y: 216, width: 155, height: 31}]},
    {startMs: 44800, endMs: 45700, fontSize: 80, lines: [{text: 'user sign-ups', x: 270, y: 216, width: 125, height: 31}]},
    {startMs: 45900, endMs: 47700, fontSize: 80, lines: [{text: 'real-time analytics', x: 120, y: 247, width: 172, height: 28}]},
  ]},
  {crop: 'uber-title', top: 0, startMs: 48000, endMs: 59000},
  {crop: 'uber-intro', top: 289.1, startMs: 48000, endMs: 54300, marks: [
    {startMs: 48600, endMs: 51000, fontSize: 76, lines: [
      {text: 'Apache Cassandra®', x: 477, y: 142, width: 150, height: 24},
    ]},
    {startMs: 51200, endMs: 54100, fontSize: 54, lines: [
      {text: 'Each trip or delivery order', x: 166, y: 118, width: 190, height: 24},
      {text: 'depends on multiple low-latency', x: 358, y: 118, width: 241, height: 24},
      {text: 'and highly reliable', x: 602, y: 118, width: 135, height: 24},
      {text: 'database interactions.', x: 18, y: 142, width: 166, height: 24},
    ]},
  ]},
  {crop: 'uber-scale', top: 289.1, startMs: 54300, endMs: 59000, marks: [
    {startMs: 56150, endMs: 57200, lines: [{text: 'Petabytes of data', x: 56, y: 111, width: 137, height: 23}]},
    {startMs: 57200, endMs: 58700, lines: [{text: 'Tens of millions', x: 58, y: 86, width: 119, height: 24}, {text: 'of queries per second', x: 177, y: 86, width: 164, height: 24}]},
  ]},
  {crop: 'discord-title', top: 0, startMs: 59000, endMs: 66200},
  {crop: 'discord-excerpt', top: 314.0, startMs: 59000, endMs: 66200, marks: [
    {startMs: 60300, endMs: 63800, lines: [
      {text: 'ScyllaDB is the distributed', x: 244, y: 99, width: 200, height: 22},
      {text: 'database that stores messages,', x: 14, y: 119, width: 230, height: 23},
      {text: 'channels, servers, and most of', x: 245, y: 119, width: 229, height: 23},
      {text: 'Discord’s user data,', x: 14, y: 140, width: 147, height: 23},
    ]},
  ]},
  {crop: 'discord-migration', top: 0, startMs: 63800, endMs: 66200},
  {crop: 'ozon-title', top: 0, startMs: 69000, endMs: 74100},
  {crop: 'ozon-excerpt', top: 396.8, startMs: 69000, endMs: 74100, marks: [
    {startMs: 70400, endMs: 73800, lines: [{text: 'Выбор пал на ScyllaDB.', x: 109, y: 187, width: 184, height: 26}]},
  ]},
  {crop: 'ok-title', top: 0, startMs: 74100, endMs: 78500},
  {crop: 'ok-excerpt', top: 262.0, startMs: 74100, endMs: 78500, marks: [
    {startMs: 75900, endMs: 78200, lines: [{text: 'Хранилища — (почти)', x: 44, y: 142, width: 173, height: 26}, {text: 'стандартные серверы Cassandra,', x: 218, y: 142, width: 258, height: 26}]},
  ]},
  {crop: 'mts-title', top: 0, startMs: 78500, endMs: 83200},
  {crop: 'mts-excerpt', top: 381.8, startMs: 78500, endMs: 83200, marks: [
    {startMs: 79900, endMs: 82900, fontSize: 56, lines: [{text: 'Мы используем Cassandra в МТС ID', x: 125, y: 64, width: 277, height: 26}]},
  ]},
  {crop: 'tbank-title', top: 0, startMs: 80200, endMs: 83200},
];

/** One native page surface per publication; supporting sources remain distinct. */
export const documents = [
  {source: 'netflix', top: 180},
  {source: 'uber', top: 230},
  {source: 'discord', top: 160},
  {source: 'discordMigration', top: 1000},
  {source: 'ozon', top: 180},
  {source: 'ok', top: 230},
  {source: 'mts', top: 150},
  {source: 'tbank', top: 800},
] as const;
