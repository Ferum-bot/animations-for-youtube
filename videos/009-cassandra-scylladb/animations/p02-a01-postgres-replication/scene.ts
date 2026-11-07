// Milliseconds within the 379.700–503.000 source-audio excerpt.
export const timing = {
  compare: 6300, namePrimary: 13300, wal: 15300,
  messenger: 20300, send: 22300, open: 25300, traffic: 28300,
  workloadReads: [32500, 35100, 38400],
  replicas: 44300, moreReaders: 46300, scaleReads: 50300, ship: 52900,
  replay: 55300, otherSite: 70300, leader: 73300,
  leaderWrite: 75300, standbyReads: 79300, singleLeader: 83300,
  async: 87300, edit: 88700, localAck: 90300, staleRead: 92200,
  loseDisk: 100300, sync: 106300, retryEdit: 107100, sendWal: 108100,
  flush: 110900, reply: 111400, clientAck: 113500, closeup: 116300,
  apply: 120050,
} as const;

export type SceneProps = {readonly timeMs: number};
export type Place = 'office' | 'metro';
export type Row = Place | 'question';
export const placeText: Readonly<Record<Place, string>> = {office: 'у офиса', metro: 'у метро'};
