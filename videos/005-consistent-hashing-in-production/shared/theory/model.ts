export type Owner = 'A' | 'B' | 'C' | 'D' | 'E';
export type Token = {readonly position: number; readonly owner: Owner};
export const owners = ['A', 'B', 'C', 'D'] as const;
export const baseTokens: readonly Token[] = owners.map((owner, index) => ({owner, position: index * 25}));
export const addedToken = {owner: 'E', position: 60} satisfies Token;
export const ring = {x: 704, y: 750, radius: 310} as const;
export const ringPoint = (position: number, radius: number = ring.radius) => {
  const angle = (position / 100) * Math.PI * 2 - Math.PI / 2;
  return {x: ring.x + Math.cos(angle) * radius, y: ring.y + Math.sin(angle) * radius};
};
export const arcPath = (from: number, to: number, radius: number = ring.radius): string => {
  const start = ringPoint(from, radius);
  const end = ringPoint(to, radius);
  return `M${start.x} ${start.y} A${radius} ${radius} 0 ${to - from > 50 ? 1 : 0} 1 ${end.x} ${end.y}`;
};
/** A token owns (predecessor, token], including its exact coordinate. */
export const locate = (position: number, tokens: readonly Token[]): Token => {
  const sorted = [...tokens].sort((a, b) => a.position - b.position);
  const first = sorted[0];
  if (!first) throw new Error('A ring requires at least one token');
  const normalized = ((position % 100) + 100) % 100;
  return sorted.find((token) => token.position >= normalized) ?? first;
};
export const ranges = (tokens: readonly Token[]) => {
  const sorted = [...tokens].sort((a, b) => a.position - b.position);
  return sorted.map((token, index) => {
    const previous = sorted[(index + sorted.length - 1) % sorted.length];
    if (!previous) throw new Error('Missing predecessor');
    return {
      from: previous.position,
      to: token.position <= previous.position ? token.position + 100 : token.position,
      owner: token.owner,
    };
  });
};
export const shares = (tokens: readonly Token[]): Readonly<Record<Owner, number>> => {
  const counts: Record<Owner, number> = {A: 0, B: 0, C: 0, D: 0, E: 0};
  for (let key = 0; key < 100; key++) counts[locate(key, tokens).owner] += 1;
  return counts;
};
// A fixed teaching grid, not a simulated production token distribution.
// D's five ranges have successors on A, B and C, rather than all on one host.
const tokenOwners: readonly Owner[] = [
  'A',
  'D',
  'B',
  'C',
  'A',
  'B',
  'D',
  'C',
  'A',
  'B',
  'C',
  'D',
  'A',
  'B',
  'C',
  'A',
  'D',
  'B',
  'C',
  'D',
];
export const virtualTokens: readonly Token[] = tokenOwners.map((owner, index) => ({
  owner,
  position: index * 5,
}));
export const withoutD = (tokens: readonly Token[]): readonly Token[] =>
  tokens.filter((token) => token.owner !== 'D');
// Four insertions take equal pieces from four distinct physical owners.
export const newVirtualTokens: readonly Token[] = [
  {position: 3, owner: 'E'},
  {position: 13, owner: 'E'},
  {position: 23, owner: 'E'},
  {position: 38, owner: 'E'},
];
export const changedRanges = (before: readonly Token[], after: readonly Token[]) =>
  ranges(before).filter(({to, owner}) => locate(to, after).owner !== owner);
