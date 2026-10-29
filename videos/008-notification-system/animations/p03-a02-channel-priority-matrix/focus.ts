import type {Channel, MatrixFocus, Priority} from './matrix';

export type FocusStrength = (field: MatrixFocus) => number;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Keep the push.p0 cell selected while emphasis moves from topic to its workers. */
export function getCellEmphasis(channel: Channel, priority: Priority, focus: FocusStrength) {
  const pushP0 = channel === 'push' && priority === 'p0';
  const topic = clamp(focus('total')
    + (pushP0 ? focus('pushTopic') : 0)
    + (channel === 'push' ? focus('pushRow') : 0)
    + (channel === 'sms' && priority === 'p0' ? focus('smsOtp') : 0));
  const pool = clamp((pushP0 ? focus('pushWorkers') : 0)
    + (channel === 'sms' ? focus('senders') : 0));
  const delayed = clamp((channel === 'email' ? focus('emailSlow') : 0)
    + (channel === 'sms' && priority === 'bulk' ? focus('smsBulk') : 0));
  return {topic: clamp(topic + delayed), pool, selected: clamp(topic + pool), delayed};
}
