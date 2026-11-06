export const scene = {
  sourceStartMs: 155200,
  capcutStartMs: 159700,
  readingEndMs: 117000,
  durationMs: 117300,
  entranceMs: 600,
  exitStartMs: 116700,
} as const;

// Relative to this excerpt. Local Metal Whisper checked against script and CapCut.
export const timing = {
  witness: 0,
  name: 2560,
  email: 8140,
  searchRequest: 12020,
  storage: 14900,
  index: 17840,
  growth: 22320,
  decision: 28080,
  question: 38380,
  possible: 41640,
  cost: 43680,
  sourcePage: 43000, // Establish the page before the spoken podcast attribution.
  source: 47020,
  example: 51140,
  message: 52400,
  fields: 56340,
  tokenize: 64680,
  caveat: 69620,
  amplification: 73160,
  tenWords: 78540,
  bothUsers: 82560,
  ownershipQuote: 85200,
  load: 88420,
  writes: 90740,
  search: 92440,
  writeIntensive: 101180,
  indexOnly: 104080,
  quote: 108560,
  translation: 113200,
  translationEnd: 114740,
} as const;

export const asset = (file: string): string => `assets/009-cassandra-scylladb/p01-index/${file}`;

export const sources = {
  percona: 'https://percona.community/events/podcasts/17-open-source-database-from-apache-cassandra-hbase-to-yugabyte/',
  enterprise: 'https://www.heavybit.com/library/podcasts/enterpriseready/ep-35-database-software-with-karthik-ranganathan-of-yugabyte',
  paper: 'https://research.cs.cornell.edu/ladis2009/papers/lakshman-ladis2009.pdf',
} as const;

export type SceneProps = {readonly timeMs: number};
