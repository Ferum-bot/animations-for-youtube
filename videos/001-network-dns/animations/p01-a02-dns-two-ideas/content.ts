export const dnsTwoIdeasTiming = {
  firstIdeaMs: 2_840,
  branchesExpandMs: 5_260,
  secondIdeaMs: 9_580,
  dataSeparatesMs: 12_000,
  globalScaleMs: 14_240,
  ideasUnifyMs: 17_800,
  thesisMs: 21_520,
} as const;

export type AuthorityBranch = {
  readonly tld: '.COM' | '.ORG' | '.RU';
  readonly region: 'US' | 'EU' | 'RU';
  readonly server: string;
  readonly x: number;
};

export const authorityBranches = [
  {tld: '.COM', region: 'US', server: 'NS / 192.0.2.10', x: 104},
  {tld: '.ORG', region: 'EU', server: 'NS / 198.51.100.8', x: 386},
  {tld: '.RU', region: 'RU', server: 'NS / 203.0.113.4', x: 668},
] as const satisfies readonly AuthorityBranch[];
