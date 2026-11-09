import React from 'react';
import {easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {Book, Ticket} from '../../animations/p02-a02-write-sharding/Paper';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {contents, cue, traffic, type Chat} from './score';

const laneX = (chat: Chat) => chat === 42 ? 76 : 526;
const chats = [42, 17] as const;
const bookY = 1030;
const replicaY = 1490;
const firstRoute: Route = {from: {x: 440, y: bookY + 257}, via: {x: 420, y: 1390}, to: {x: 290, y: replicaY}};
const secondRoute: Route = {...firstRoute, via: {x: 510, y: 1390}, to: {x: 696, y: replicaY}};

function Copies({time}: {readonly time: number}) {
  const split = progress(time, cue.split, cue.split + 700);
  return <g opacity={1 - split}>
    {[firstRoute, secondRoute].map((route, i) => {
      const appear = i === 0 ? 1 : progress(time, cue.secondCopy, cue.secondCopy + 420);
      const lag = i === 0 ? 900 : 1300;
      return <g key={i} opacity={appear}>
        <RouteLine route={route}/>
        {traffic.filter(w => w.commits < cue.split).map(w =>
          <Delivery key={w.commits} timeMs={time} route={route} start={w.commits} duration={lag}/>)}
        <Book x={i === 0 ? 92 : 548} y={replicaY} scale={0.66}
          label={i === 0 ? 'реплика' : '+ реплика'} entries={chats.map(chat => contents(chat, time - lag))}/>
      </g>;
    })}
  </g>;
}

export function Diagram({time}: {readonly time: number}) {
  const split = progress(time, cue.split, cue.separate, easing.transform);
  const laneXProgress = progress(time, cue.split, cue.split + 1050, easing.transform);
  const laneYProgress = progress(time, cue.split + 1050, cue.separate, easing.transform);
  const scale = mix(0.95, 0.71, split);
  const firstX = mix(225, laneX(42), split);
  const pending = traffic.filter(w => w.arrives <= time && time < w.commits);
  const lanes = time >= cue.separate;
  const copies = progress(time, cue.copy, cue.copy + 500);
  const queueDepth = traffic.reduce((depth, job) => depth +
    (job.arrives === 0 ? 1 : progress(time, job.arrives - 450, job.arrives)) *
    (1 - progress(time, job.commits, job.commits + 600, easing.transform)), 0);
  return <g>
    {time < cue.separate && <Copies time={time}/>}
    {copies > 0 && chats.map(chat => {
      const x = laneX(chat);
      const route: Route = {from:{x:x+180,y:bookY+190},via:{x:x+180,y:1360},to:{x:x+180,y:replicaY}};
      return <g key={chat} opacity={copies}>
        <RouteLine route={route}/>
        <Delivery route={route} timeMs={time} start={cue.copy + 450} duration={1000}/>
        <Book x={x+16} y={replicaY} scale={0.65} label="реплика"
          entries={time >= cue.copy + 1450 ? [contents(chat, time)] : []}/>
      </g>;
    })}
    <Book x={firstX} y={bookY} scale={scale} label={lanes ? 'Шард A' : 'primary'}
      entries={lanes ? [contents(42,time)] : chats.map(chat => contents(chat,time))}/>
    {split > 0.8 && <g opacity={(split - 0.8) / 0.2}>
      <Book x={laneX(17)} y={bookY} scale={0.71} label="Шард B" entries={lanes ? [contents(17,time)] : []}/>
    </g>}
    {pending.length > 0 && (lanes ? chats.map(chat =>
      pending.some(w => w.chat === chat) && <text key={chat} x={laneX(chat)} y={610}
        fontSize={40} fill={ink.muted}>Чат {chat}</text>
    ) : <text x={205} y={722 - Math.max(0, queueDepth - 1) * 106} fontSize={40} fill={ink.muted}>Очередь записи</text>)}
    {pending.map(w => {
      // Give each waiting ticket time to advance into a newly cleared slot.
      const ahead = traffic.filter(job => job.arrives < w.arrives);
      const slots = (jobs: typeof ahead) => jobs.reduce((total, job) =>
        total + 1 - progress(time, job.commits, job.commits + 600, easing.transform), 0);
      const x = mix(205, laneX(w.chat), laneXProgress);
      const y = mix(775 - slots(ahead)*106, 770 - slots(ahead.filter(job => job.chat === w.chat))*100, laneYProgress);
      const depart = progress(time, w.commits - (lanes ? 950 : 1550), w.commits, easing.transform);
      const entry = progress(time, w.arrives, w.arrives + 450);
      const dest = lanes ? laneX(w.chat) : firstX;
      return <g key={w.arrives} opacity={w.arrives === 0 ? 1 : entry}>
        <g transform={`translate(${mix(x,dest+235,depart)} ${mix(y,bookY+60,depart)}) scale(${mix(mix(0.88,0.73,split),0.24,depart)})`}>
          <Ticket entry={w} x={0} y={0}/>
          <path d="M6 15 L16 14 L12 88 L3 88 Z" fill={ink.primary}/>
        </g>
      </g>;
    })}
  </g>;
}
