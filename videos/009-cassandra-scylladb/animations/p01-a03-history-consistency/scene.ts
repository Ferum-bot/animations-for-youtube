export const scene = {
  sourceStartMs: 297633.333333,
  capcutStartMs: 302133.333333,
  durationMs: 55866.666667,
  entranceMs: 400,
  exitStartMs: 55300,
} as const;

// Local GPU Whisper excerpt, checked against the script. All times are relative ms.
export const timing = {
  firstCopy: 2700,
  secondCopy: 5850,
  repair: 8000,
  missing: 11000,
  rebuild: 14500,
  podcast: 16500,
  scroll: 17050,
  selectReindex: 18000,
  focusReindex: 18350,
  selectMessage: 20100,
  focusMessage: 20650,
  alternatives: 24000,
  shard: 27000,
  expand: 30000,
  redistribute: 31400,
  mysql: 34000,
  largeIndex: 36000,
  papers: 39000,
  dynamo: 41100,
  published: 43700,
  internal: 45300,
  hbase: 47000,
  synthesis: 50000,
  ideas: 52500,
  cassandra: 53500,
} as const;

export const asset = (file: string): string => `assets/009-cassandra-scylladb/p01-consistency/${file}`;
export type SceneProps = {readonly timeMs: number};

export const source = {
  podcast: 'https://www.heavybit.com/library/podcasts/enterpriseready/ep-35-database-software-with-karthik-ranganathan-of-yugabyte',
  bigtable: 'https://storage.googleapis.com/gweb-research2023-media/pubtools/4443.pdf',
  dynamo: 'https://cdn.amazon.science/ac/1d/eb50c4064c538c8ac440ce6a1d91/dynamo-amazons-highly-available-key-value-store.pdf',
  hbase: 'https://blogsarchive.apache.org/foundation/entry/the-apache-software-foundation-announces61',
} as const;
