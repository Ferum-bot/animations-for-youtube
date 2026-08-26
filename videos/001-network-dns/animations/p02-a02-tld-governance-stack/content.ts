export const tldGovernanceTiming = {
  fieldMs: 180,
  categoriesMs: 5_900,
  icannMs: 13_580,
  registryMs: 20_400,
  registrarMs: 26_440,
  holderMs: 32_120,
} as const;

export type TldToken = {
  readonly label: string;
  readonly group: 'generic' | 'country';
  readonly x: number;
  readonly y: number;
};

export const tldTokens = [
  {label: '.COM', group: 'generic', x: 0, y: 0},
  {label: '.EDU', group: 'generic', x: 222, y: 0},
  {label: '.ORG', group: 'generic', x: 444, y: 0},
  {label: '.NET', group: 'generic', x: 666, y: 0},
  {label: '.RU', group: 'country', x: 0, y: 108},
  {label: '.DE', group: 'country', x: 222, y: 108},
  {label: '.JP', group: 'country', x: 444, y: 108},
  {label: '.BR', group: 'country', x: 666, y: 108},
] as const satisfies readonly TldToken[];

export type GovernanceRole = {
  readonly id: 'icann' | 'registry' | 'registrar' | 'holder';
  readonly index: '01' | '02' | '03' | '04';
  readonly name: string;
  readonly example: string;
  readonly action: string;
  readonly accent: 'primary' | 'signal' | 'success';
};

export const governanceRoles = [
  {
    id: 'icann',
    index: '01',
    name: 'ICANN',
    example: 'КООРДИНАЦИЯ',
    action: 'ДЕЛЕГИРУЕТ TLD',
    accent: 'signal',
  },
  {
    id: 'registry',
    index: '02',
    name: 'REGISTRY',
    example: 'VERISIGN / .COM',
    action: 'ВЕДЁТ ЗОНУ',
    accent: 'primary',
  },
  {
    id: 'registrar',
    index: '03',
    name: 'REGISTRAR',
    example: 'GODADDY / ПЛАТФОРМА',
    action: 'ПРОДАЁТ РЕГИСТРАЦИЮ',
    accent: 'success',
  },
  {
    id: 'holder',
    index: '04',
    name: 'DOMAIN HOLDER',
    example: 'ТЫ / EXAMPLE.COM',
    action: 'ИСПОЛЬЗУЕТ ИМЯ',
    accent: 'signal',
  },
] as const satisfies readonly GovernanceRole[];
