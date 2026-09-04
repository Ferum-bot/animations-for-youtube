export const LRU_ANIMATION_DURATION_MS = 87_360;
export const LRU_SOURCE_START_MS = 616_440;
export const LRU_SOURCE_END_MS = LRU_SOURCE_START_MS + LRU_ANIMATION_DURATION_MS;

const fromSource = (sourceMs: number): number => sourceMs - LRU_SOURCE_START_MS;

export const timing = {
  requirement: fromSource(491_620),
  lruMeaning: fromSource(515_200),
  twoQuestions: fromSource(529_280),
  twoStructures: fromSource(544_480),
  mapReferences: fromSource(563_880),
  nodeAnatomy: fromSource(581_160),
  operationsIntro: fromSource(599_040),
  setStarts: fromSource(621_580),
  mapInsert: fromSource(628_140),
  headInsert: fromSource(636_120),
  capacityReached: fromSource(641_660),
  evictTail: fromSource(645_200),
  getStarts: fromSource(659_480),
  mapLookup: fromSource(666_440),
  returnValue: fromSource(672_080),
  liftNode: fromSource(676_780),
  reconnect: fromSource(683_120),
  moveToHead: fromSource(688_200),
  constantTime: fromSource(690_060),
  finalProof: fromSource(701_820),
  requirementDone: fromSource(705_060),
  end: LRU_ANIMATION_DURATION_MS,
} as const;

export type CacheKey =
  | 'key-17'
  | 'key-23'
  | 'key-42'
  | 'key-8'
  | 'key-99'
  | 'key-88';

export type CacheEntry = {
  readonly key: CacheKey;
  readonly value: string;
};

export const cacheEntries: readonly CacheEntry[] = [
  {key: 'key-17', value: 'value-17'},
  {key: 'key-23', value: 'value-23'},
  {key: 'key-42', value: 'value-42'},
  {key: 'key-8', value: 'value-8'},
  {key: 'key-99', value: 'value-99'},
  {key: 'key-88', value: 'value-88'},
] as const;

export const initialOrder: readonly CacheKey[] = [
  'key-17',
  'key-23',
  'key-42',
  'key-8',
  'key-99',
] as const;

export const afterSetOrder: readonly CacheKey[] = [
  'key-88',
  'key-17',
  'key-23',
  'key-42',
  'key-8',
] as const;

export const afterGetOrder: readonly CacheKey[] = [
  'key-42',
  'key-88',
  'key-17',
  'key-23',
  'key-8',
] as const;
