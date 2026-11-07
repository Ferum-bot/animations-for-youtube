import React from 'react';
import {SourceImage, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {Book, Posting, Ticket} from './Paper';
import {Title} from '../../shared/architecture/Title';
import {latest, queued, t, writes, type SceneProps} from './scene';

const primary = {x: 1010, y: 596};
const copies = [320, 700, 1070];
const travel = 820;
export const Queue: React.FC<SceneProps> = ({timeMs}) => {
  const rows = (at: number) => ([42,17] as const).map(chat => ({chat, body: latest(chat, at)}));
  const pending = queued(timeMs);
  const lastCommit = writes.reduce((last, job) => job.handled !== undefined && job.handled <= timeMs ? job.handled : last, -1000);
  return <g>
    <Title>PostgreSQL</Title>
    <text x={170} y={405} fontSize={50}>Очередь записи</text>
    {pending.map((w, i) => {
      const y = 475 + i * 114;
      if (w.handled !== undefined && timeMs >= w.handled - travel)
        return <Posting key={w.arrives} timeMs={timeMs} entry={w} start={w.handled - travel} end={w.handled}
          x={170} y={y} toX={primary.x + 100} toY={primary.y + 102} />;
      const shift = w.arrives < lastCommit ? 114 * (1 - progress(timeMs, lastCommit, lastCommit + 310)) : 0;
      return <Ticket key={w.arrives} entry={w} x={mix(65, 170, progress(timeMs,w.arrives,w.arrives+360))} y={y + shift} />;
    })}
    {copies.filter((_,i) => i < 2 || timeMs >= t.extraReplica).map((y,i) => {
      const route: Route = {from:{x:1538,y:728},via:{x:1740,y:728},to:{x:1950,y:y+95}};
      const delay = 1000 + i * 180;
      return <g key={y}>
        <RouteLine route={route} />
        <Book x={1950} y={y} scale={0.78} label={i === 2 ? 'Ещё одна standby' : 'standby'} entries={rows(timeMs-delay)} />
        {writes.map(w => w.handled === undefined ? null :
          <Delivery key={w.arrives} route={route} timeMs={timeMs} start={w.handled} duration={delay} />)}
      </g>;
    })}
    <Book {...primary} label="primary" entries={rows(timeMs)} />
  </g>;
};

/** Crop the actual cover using its native pixel viewport; set the spoken title in live type. */
export const RelatedEpisode: React.FC = () => <g>
  <svg x={480} y={175} width={1600} height={884} viewBox="40 34 840 464" overflow="hidden">
    <SourceImage src="assets/008-notification-system/related-videos/sharding.png" x={0} y={0} width={892} height={660} />
  </svg>
  <text x={480} y={1206} fontSize={78} fontWeight={650} fill={ink.text}>Тебе не нужно шардирование</text>
</g>;
