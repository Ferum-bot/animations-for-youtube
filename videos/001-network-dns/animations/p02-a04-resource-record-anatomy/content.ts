export const resourceRecordAnatomyTiming = {
  leafQuestionMs: 120,
  resourceRecordMs: 4_000,
  fiveFieldsMs: 5_860,
  fieldScanMs: 8_480,
  resolvedMs: 13_620,
} as const;

export type RecordFieldAccent = 'primary' | 'signal' | 'success';

export type RecordField = {
  readonly id: 'name' | 'ttl' | 'class' | 'type' | 'value';
  readonly label: 'NAME' | 'TTL' | 'CLASS' | 'TYPE' | 'VALUE';
  readonly value: string;
  readonly meaning: string;
  readonly accent: RecordFieldAccent;
};

export const recordFields = [
  {
    id: 'name',
    label: 'NAME',
    value: 'noise.ks.chicago.edu.',
    meaning: 'К КАКОМУ ИМЕНИ ОТНОСИТСЯ',
    accent: 'primary',
  },
  {id: 'ttl', label: 'TTL', value: '300', meaning: 'СКОЛЬКО КЭШИРОВАТЬ', accent: 'signal'},
  {id: 'class', label: 'CLASS', value: 'IN', meaning: 'ИНТЕРНЕТ-КЛАСС', accent: 'primary'},
  {id: 'type', label: 'TYPE', value: 'A', meaning: 'КАК ЧИТАТЬ VALUE', accent: 'success'},
  {id: 'value', label: 'VALUE', value: '192.0.2.42', meaning: 'САМИ ДАННЫЕ', accent: 'success'},
] as const satisfies readonly RecordField[];

export const anatomyPhaseCopy = {
  leaf: {
    eyebrow: 'DNS TREE / LEAF DATA',
    title: 'ЧТО ЛЕЖИТ В ЛИСТЬЯХ ДЕРЕВА?',
  },
  record: {
    eyebrow: 'RESOURCE RECORD / RR',
    title: 'ЭТО — РЕСУРСНАЯ ЗАПИСЬ',
  },
  fields: {
    eyebrow: 'STRUCTURE / FIVE FIELDS',
    title: 'ОДНА ЗАПИСЬ = ПЯТЬ ПОЛЕЙ',
  },
  resolved: {
    eyebrow: 'PARSED / MACHINE READABLE',
    title: 'КАЖДОЕ ПОЛЕ ИМЕЕТ СВОЙ СМЫСЛ',
  },
} as const;
