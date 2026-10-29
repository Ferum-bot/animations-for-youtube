import type {CodeLine} from '../../shared/CodeEditor';

// Materials p. 19, classic consumer group protocol. Static membership reduces
// rebalances during temporary unavailability; it does not prevent all rebalances.
export const livenessSettings = [
  {text: '# 45 с без heartbeat → исключение из группы', field: 'explanation'},
  {text: 'session.timeout.ms=45000', field: 'setting'},
  {text: '', field: null},
  {text: '# Heartbeat каждые 15 с (classic protocol)', field: 'explanation'},
  {text: 'heartbeat.interval.ms=15000', field: 'setting'},
  {text: '', field: null},
  {text: '# До 5 минут между вызовами poll()', field: 'explanation'},
  {text: 'max.poll.interval.ms=300000', field: 'setting'},
  {text: '', field: null},
  {text: '# Постоянный уникальный ID воркера', field: 'explanation'},
  {text: '# Меньше ребалансов при коротких рестартах', field: 'explanation'},
  {text: 'group.instance.id=push-p0-worker-7', field: 'setting'},
] as const satisfies readonly CodeLine[];

export type LivenessField = Exclude<typeof livenessSettings[number]['field'], null>;
