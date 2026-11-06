type Source = {
  readonly title: string;
  readonly url: string;
};

export const sources = {
  netflix: {title: 'Netflix — Key-Value Data Abstraction Layer', url: 'https://netflixtechblog.com/introducing-netflixs-key-value-data-abstraction-layer-1ea8a0a11b30'},
  uber: {title: 'Uber — Cassandra Operations at Scale', url: 'https://www.uber.com/au/en/blog/how-uber-optimized-cassandra-operations-at-scale/'},
  discord: {title: 'Discord — ScyllaDB Clusters at Scale, 2026', url: 'https://discord.com/blog/how-discord-automates-scylladb-clusters-at-scale'},
  discordMigration: {title: 'Discord — Trillions of Messages, 2023', url: 'https://discord.com/blog/how-discord-stores-trillions-of-messages'},
  ozon: {title: 'Ozon Tech — собственный S3-сервер', url: 'https://habr.com/ru/companies/ozontech/articles/818433/'},
  ok: {title: 'ОК — NewSQL = NoSQL+ACID', url: 'https://habr.com/ru/companies/odnoklassniki/articles/417593/'},
  mts: {title: 'МТС — опыт Cassandra и ScyllaDB', url: 'https://habr.com/ru/companies/ru_mts/articles/935896/'},
  tbank: {title: 'DevOops 2023 — Cassandra как сервис в Тинькофф', url: 'https://devoops.ru/archive/2023/talks/20002434-cassandra-as-a-service-at-tinkoff-or-how-we-build-a-reliable-and-fault-tolerant-solution-based-on-ca/'},
} as const satisfies Readonly<Record<string, Source>>;

type Crop = {
  readonly source: keyof typeof sources;
  readonly width: number;
  readonly height: number;
  /** Sampled native page canvas, used to keep blur edges opaque. */
  readonly background: string;
};

/** Native page pixels captured on 2026-11-06; no article text is reconstructed. */
export const crops = {
  'netflix-title': {source: 'netflix', width: 720, height: 215, background: '#171717'},
  'netflix-excerpt': {source: 'netflix', width: 720, height: 295, background: '#171717'},
  'uber-title': {source: 'uber', width: 1190, height: 295, background: '#ffffff'},
  'uber-intro': {source: 'uber', width: 796, height: 230, background: '#ffffff'},
  'uber-scale': {source: 'uber', width: 490, height: 134, background: '#ffffff'},
  'discord-title': {source: 'discord', width: 910, height: 245, background: '#000000'},
  'discord-excerpt': {source: 'discord', width: 504, height: 216, background: '#000000'},
  'discord-migration': {source: 'discordMigration', width: 910, height: 245, background: '#000000'},
  'ozon-title': {source: 'ozon', width: 779, height: 265, background: '#161616'},
  'ozon-excerpt': {source: 'ozon', width: 520, height: 230, background: '#171717'},
  'ok-title': {source: 'ok', width: 779, height: 175, background: '#161616'},
  'ok-excerpt': {source: 'ok', width: 520, height: 252, background: '#171717'},
  'mts-title': {source: 'mts', width: 779, height: 255, background: '#161616'},
  'mts-excerpt': {source: 'mts', width: 779, height: 125, background: '#161616'},
  'tbank-title': {source: 'tbank', width: 716, height: 285, background: '#ffffff'},
} as const satisfies Readonly<Record<string, Crop>>;

export type CropId = keyof typeof crops;
