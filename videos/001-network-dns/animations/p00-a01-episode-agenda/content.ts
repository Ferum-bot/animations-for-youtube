export type AgendaBeat = {
  startMs: number;
  shortLabel: string;
  titleLines: readonly [string, string] | readonly [string, string, string];
  detail: string;
};

export const agendaBeats = [
  {
    startMs: 0,
    shortLabel: 'ЗАЧЕМ',
    titleLines: ['ЗАЧЕМ DNS', 'ВООБЩЕ НУЖЕН'],
    detail: 'ИМЕНА / АДРЕСА / ПРОБЛЕМА КОСВЕННОСТИ',
  },
  {
    startMs: 5_200,
    shortLabel: 'МЕХАНИКА',
    titleLines: ['КАК РАБОТАЕТ', 'ОДИН DNS-ЗАПРОС'],
    detail: 'ДЕРЕВО ИМЁН → RESOLVER → ROOT → TLD → AUTH',
  },
  {
    startMs: 11_000,
    shortLabel: '1983',
    titleLines: ['ПОЧЕМУ ОН ЖИВ', 'С 1983 ГОДА'],
    detail: 'АРХИТЕКТУРА, КОТОРАЯ ДЕРЖИТ СОВРЕМЕННЫЙ ИНТЕРНЕТ',
  },
  {
    startMs: 17_680,
    shortLabel: 'БОНУС',
    titleLines: ['БЕЗОПАСНОСТЬ,', 'ПРИВАТНОСТЬ', 'И МИФЫ'],
    detail: 'DNSSEC / ШИФРОВАНИЕ / ДВА ПОПУЛЯРНЫХ МИФА',
  },
] as const satisfies readonly [AgendaBeat, ...AgendaBeat[]];
