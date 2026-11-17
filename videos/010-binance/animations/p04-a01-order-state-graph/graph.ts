// The reduced model from page 31. The lower return rail is the fast fill
// before an acknowledgement. Paths are in the local diagram coordinate system.
export const states = {
  PENDING_NEW: {x: 252, y: 368, w: 340, meaning: 'Отправляется'},
  NEW: {x: 720, y: 368, w: 260, meaning: 'Принята'},
  PARTIALLY_FILLED: {x: 1240, y: 368, w: 432, meaning: 'Исполнена частично'},
  PENDING_CANCEL: {x: 1240, y: 568, w: 420, meaning: 'Ожидает отмены'},
  REJECTED: {x: 252, y: 166, w: 340, meaning: 'Отклонена'},
  EXPIRED: {x: 720, y: 166, w: 300, meaning: 'Истёк срок'},
  FILLED: {x: 1860, y: 368, w: 290, meaning: 'Исполнена'},
  CANCELED: {x: 1860, y: 568, w: 330, meaning: 'Отменена'},
} as const;

export type State = keyof typeof states;
type Edge = {from: State; to: State; d: string};

export const edges: readonly Edge[] = [
  {from: 'PENDING_NEW', to: 'REJECTED', d: 'M252 311 V231'},
  {from: 'PENDING_NEW', to: 'NEW', d: 'M423 368 H580'},
  {from: 'PENDING_NEW', to: 'FILLED', d: 'M252 425 V672 H2100 V368 H2015'},
  {from: 'NEW', to: 'EXPIRED', d: 'M720 311 V231'},
  {from: 'NEW', to: 'PARTIALLY_FILLED', d: 'M851 368 H1014'},
  {from: 'NEW', to: 'FILLED', d: 'M800 311 V239 H1860 V302'},
  {from: 'NEW', to: 'PENDING_CANCEL', d: 'M720 425 V568 H1020'},
  {from: 'PARTIALLY_FILLED', to: 'FILLED', d: 'M1457 368 H1705'},
  {from: 'PARTIALLY_FILLED', to: 'PENDING_CANCEL', d: 'M1192 425 V502'},
  {from: 'PENDING_CANCEL', to: 'PARTIALLY_FILLED', d: 'M1288 511 V434'},
  {from: 'PENDING_CANCEL', to: 'CANCELED', d: 'M1451 568 H1685'},
  {from: 'PENDING_CANCEL', to: 'FILLED', d: 'M1410 511 L1500 445 H1650 L1707 403'},
];
