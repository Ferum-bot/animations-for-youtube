import type {CodeLine} from '../../shared/CodeEditor';

// Materials p. 18 and narration. Keep comments on their own lines so the
// two property values remain readable at the episode's enlarged focus size.
export const consumerSettings = [
  {text: '# Коммит вручную, после обработки', field: 'commit-note'},
  {text: 'enable.auto.commit=false', field: 'manual-commit'},
  {text: '', field: null},
  {text: '# Меньше пачка — меньше повторов при сбое', field: 'batch-note'},
  {text: 'max.poll.records=50', field: 'batch-size'},
] as const satisfies readonly CodeLine[];

export type ConsumerField = Exclude<typeof consumerSettings[number]['field'], null>;
