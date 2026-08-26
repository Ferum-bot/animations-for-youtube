export const nameTreeTiming = {
  filesystemPathMs: 3_980,
  reversePathMs: 7_180,
  dnsNameMs: 8_220,
  parallelBranchMs: 13_760,
  noConflictMs: 19_500,
} as const;

export type PathToken = {
  readonly id: 'com' | 'cisco' | 'eng';
  readonly label: 'com' | 'cisco' | 'eng';
  readonly fromX: number;
  readonly toX: number;
};

export const pathTokens = [
  {id: 'com', label: 'com', fromX: 86, toX: 574},
  {id: 'cisco', label: 'cisco', fromX: 330, toX: 306},
  {id: 'eng', label: 'eng', fromX: 628, toX: 68},
] as const satisfies readonly PathToken[];

export type TreeNode = {
  readonly id: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly branch: 'root' | 'cisco' | 'chicago';
};

export const treeNodes = [
  {id: 'root', label: 'ROOT', x: 370, y: 8, branch: 'root'},
  {id: 'com', label: '.COM', x: 164, y: 140, branch: 'cisco'},
  {id: 'edu', label: '.EDU', x: 576, y: 140, branch: 'chicago'},
  {id: 'cisco', label: 'CISCO', x: 164, y: 278, branch: 'cisco'},
  {id: 'chicago', label: 'CHICAGO', x: 576, y: 278, branch: 'chicago'},
  {id: 'eng-cisco', label: 'ENG', x: 164, y: 416, branch: 'cisco'},
  {id: 'eng-chicago', label: 'ENG', x: 576, y: 416, branch: 'chicago'},
] as const satisfies readonly TreeNode[];

export const treeEdges = [
  ['root', 'com'],
  ['root', 'edu'],
  ['com', 'cisco'],
  ['edu', 'chicago'],
  ['cisco', 'eng-cisco'],
  ['chicago', 'eng-chicago'],
] as const;
