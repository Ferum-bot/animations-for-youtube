export const priorities = [
  {id: 'p0', title: 'P0', description: 'OTP / security'},
  {id: 'p1', title: 'P1', description: 'transactional'},
  {id: 'bulk', title: 'bulk', description: 'campaigns'},
] as const;

type Cell = {readonly topic: string; readonly pool: string};

/** Illustrative pool sizes and sender names from materials p. 22, not capacity estimates. */
export const channels = [
  {id: 'push', cells: [
    {topic: 'push.p0', pool: 'пул × 10'},
    {topic: 'push.p1', pool: 'пул × 20'},
    {topic: 'push.bulk', pool: 'пул × 50'},
  ]},
  {id: 'sms', cells: [
    {topic: 'sms.p0', pool: 'пул · sender A'},
    {topic: 'sms.p1', pool: 'пул · sender B'},
    {topic: 'sms.bulk', pool: 'пул · sender pool C'},
  ]},
  {id: 'email', cells: [
    {topic: 'email.p0', pool: 'пул × 5'},
    {topic: 'email.p1', pool: 'пул × 10'},
    {topic: 'email.bulk', pool: 'пул × 30'},
  ]},
] as const satisfies readonly {
  readonly id: 'push' | 'sms' | 'email';
  readonly cells: readonly [Cell, Cell, Cell];
}[];

export type Channel = typeof channels[number]['id'];
export type Priority = typeof priorities[number]['id'];
export type MatrixFocus = 'pushTopic' | 'pushWorkers' | 'emailSlow' | 'pushRow'
  | 'smsOtp' | 'smsBulk' | 'senders' | 'total';
