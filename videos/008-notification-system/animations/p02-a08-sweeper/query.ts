import type {CodeLine} from '../../shared/CodeEditor';

// Materials p. 20. RETURNING supplies IDs for re-enqueueing; this UPDATE itself
// does not publish messages. The duplicate-delivery tradeoff is voiced explicitly.
export const sweeperQuery = [
  {text: '-- Запуск раз в минуту', field: 'cadence'},
  {text: 'UPDATE notifications', field: 'table'},
  {text: "SET status = 'accepted',", field: 'accepted'},
  {text: '    attempts = attempts + 1', field: 'attempts'},
  {text: "WHERE status = 'sending'", field: 'sending'},
  {text: "  AND claimed_at < now() - interval '5 minutes'", field: 'timeout'},
  {text: 'RETURNING id; -- для повторной постановки', field: null},
  {text: '', field: null},
  {text: '-- Возможен дубль: провайдер принял запрос,', field: 'duplicate'},
  {text: "-- но воркер не успел записать status = 'sent'.", field: 'duplicate'},
] as const satisfies readonly CodeLine[];

export type SweeperField = Exclude<typeof sweeperQuery[number]['field'], null>;
