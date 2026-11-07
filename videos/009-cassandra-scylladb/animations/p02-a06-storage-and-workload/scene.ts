// Local milliseconds from 16:40:20 in the WAV; two chapter dividers add 9 s in CapCut.
export const t = {
  local:1550, lsm:5600, desk:9600, journal:12400, memory:17500, flush:19900,
  sealed:22000, update:26500, sync:31400, ack:35500, pg:40600, wal:44500,
  buffer:46600, commit:49000, crash:53600, redo:55000,
  history:57600, word:59600, model:61600, copies:65200, query:69700,
  compare:73350, flow:76500, balanced:81400, add:88000, migrated:90500,
  ownership:92800, hot:100200, busy:103700, space:106900, repair:108450,
  compact:110000, settled:113500, developer:117500, secondTable:122500,
  cl:124500, transaction:126600, independent:131100, choice:136700,
  volumes:142600, keys:146000, guarantees:149200, lookup:151550, result:153300,
} as const;
export type ShotProps={readonly timeMs:number};
export const message={chat:42,id:109,initial:'Жду у метро',edited:'Встреча у метро',word:'метро'} as const;
