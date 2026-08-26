export const nameIndirectionTiming = {
  mythEndsMs: 5_540,
  addressMovesMs: 9_040,
  clustersAppearMs: 12_300,
  routeSwitchesMs: 18_560,
  thesisAppearsMs: 24_040,
} as const;

export type RegionNode = {
  readonly region: 'EU' | 'US' | 'APAC';
  readonly address: string;
  readonly x: number;
};

export const regionNodes = [
  {region: 'EU', address: '203.0.113.10', x: 104},
  {region: 'US', address: '198.51.100.24', x: 386},
  {region: 'APAC', address: '192.0.2.88', x: 668},
] as const satisfies readonly RegionNode[];

export const stableDomain = 'api.example.com';
