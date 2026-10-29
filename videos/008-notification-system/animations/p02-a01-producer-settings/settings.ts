import type {CodeLine} from '../../shared/CodeEditor';

// Materials p. 16. Topic settings are shown separately from producer settings.
// Keep the recommended value at 2 while explaining the default of 1 in a comment.
export const producerSettings = [
  {text: '# producer', field: null},
  {text: 'acks=all', field: 'acks'},
  {text: 'enable.idempotence=true', field: 'idempotence'},
  {text: '', field: null},
  {text: '# topic', field: null},
  {text: 'replication.factor=3', field: 'replication'},
  {text: 'min.insync.replicas=2', field: 'min-isr'},
  {text: '# min.insync.replicas по умолчанию: 1', field: 'default-isr'},
] as const satisfies readonly CodeLine[];

export type ProducerField = Exclude<typeof producerSettings[number]['field'], null>;
