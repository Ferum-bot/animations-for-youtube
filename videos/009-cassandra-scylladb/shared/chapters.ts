type Chapter = {
  readonly number: string;
  readonly lines: readonly [string, string];
  readonly fontSizes: readonly [number, number];
};

export const chapters = {
  history: {number: '01', lines: ['История появления', 'Cassandra'], fontSizes: [176, 220]},
  architecture: {number: '02', lines: ['Архитектура', 'Cassandra'], fontSizes: [207, 220]},
  scylladb: {number: '03', lines: ['От Cassandra', 'к ScyllaDB'], fontSizes: [207, 220]},
  choice: {number: '04', lines: ['Когда брать', 'Cassandra/ScyllaDB'], fontSizes: [207, 176]},
} as const satisfies Readonly<Record<string, Chapter>>;

export type ChapterId = keyof typeof chapters;
