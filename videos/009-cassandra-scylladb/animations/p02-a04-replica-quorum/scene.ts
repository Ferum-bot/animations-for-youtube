import type {Replica} from '../../shared/architecture/chat107';
export {replicas, oldBody, newBody, type Replica, type Host} from '../../shared/architecture/chat107';

// Local milliseconds. Source 12:00–14:53, CapCut 12:09–15:02.
export const cue = {
  copies: 5100, rf: 7700, request: 13200, coordinator: 16100, fan: 19400,
  choose: 23400, driver: 28100, preferred: 32300, another: 36500, local: 43900, repeat: 50900,
  write: 55000, send: 59100, wait: 62400, levels: 64500, count: 69200,
  one: 74000, quorum: 76700, all: 79500, oneAgain: 81500, incident: 86400, success: 90300,
  read: 93600, readCoordinator: 100200, lookup: 104200, availability: 108100,
  readOne: 115200, back: 118400, askC: 122100, oldReply: 124000,
  readQuorum: 131300, two: 136100, wrote: 139000, ab: 141800, ac: 144000, bc: 146100,
  intersection: 148500, condition: 153300, w: 156100, r: 158200, rfMeaning: 160200,
  assumptions: 162400, final: 169400,
} as const;

export type ShotProps = {readonly timeMs: number};
export const accepted = (n: Replica) => n !== 'C';
export const receiptMs: Readonly<Record<'A'|'B', number>> = {A: 87800, B: 89400};
export const levelAt = (ms:number) => {
  if (ms >= cue.oneAgain) return {name:'ONE', required:1};
  if (ms >= cue.all) return {name:'ALL', required:3};
  if (ms >= cue.quorum) return {name:'QUORUM', required:2};
  return {name:'ONE', required:1};
};
