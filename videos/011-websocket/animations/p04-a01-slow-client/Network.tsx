import React from 'react';
import {arrive, easing, mix, progress, v2Theme} from '@channel/motion-v2';
import {chapterColors as colors} from '../../shared/chapterColors';
import {cue} from './story';

const clients = [
  {x: 255, type: 'desktop', name: 'Компьютер'},
  {x: 730, type: 'laptop', name: 'Ноутбук'},
  {x: 1205, type: 'phone', name: 'Телефон'},
] as const;
type Device = typeof clients[number]['type'];

function ClientIcon({type}: {type: Device}) {
  switch (type) {
    case 'desktop': return <><rect x={-86} y={0} width={172} height={102} rx={7}/><path d="M0 102v22m-42 1h84"/></>;
    case 'laptop': return <><rect x={-75} y={7} width={150} height={94} rx={5}/><path d="M-76 102l-26 18h204l-26-18Z"/></>;
    case 'phone': return <><rect x={-33} y={-4} width={66} height={126} rx={10}/><path d="M-9 106h18"/></>;
  }
}

function Server({x, label, failure}: {x: number; label: string; failure: number}) {
  return <g transform={`translate(${x} 410)`}>
    <text y={-39} textAnchor="middle" fontSize={39} fontWeight={650}>{label}</text>
    <g strokeWidth={5} stroke={colors.text} fill={colors.background} opacity={1 - failure * 0.55}>
      {[0, 46].map(y => <g key={y}>
        <rect x={-95} y={y} width={190} height={40} rx={5}/>
        <path d={`M-74 ${y+20}h38`} strokeWidth={4}/>
        <circle cx={70} cy={y+20} r={4} fill={colors.text}/>
      </g>)}
    </g>
    <g opacity={failure}>
      <circle cx={0} cy={44} r={39} fill={colors.background}/>
      <path d="M-18 26l36 36m0-36l-36 36" stroke={v2Theme.signal} strokeWidth={9} strokeLinecap="round"/>
    </g>
  </g>;
}

const routeTop = 503;
const routeBottom = 757;
function routePoint(source: number, client: number, t: number) {
  // Cubic curve with vertical tangents at both ends. Dots follow the drawn path.
  const u = 1 - t;
  return {x: mix(source, client, t*t*(3-2*t)),
    y: u**3 * routeTop + 3*u*u*t*627 + 3*u*t*t*627 + t**3 * routeBottom};
}

function Route({source, client, time, slow, retry}: {
  source: number; client: number; time: number; slow: boolean; retry: boolean;
}) {
  const starts = retry ? [cue.retry + 220] : [cue.send, cue.send + 2550, cue.slow + 180, cue.slow + 3230, cue.buffer + 290, cue.queue + 320, cue.unbounded + 670];
  return <g>
    <path d={`M${source} ${routeTop} C${source} 627 ${client} 627 ${client} ${routeBottom}`}
      stroke={colors.text} strokeOpacity={0.48} strokeWidth={5} fill="none"/>
    {starts.map(start => {
      const delayed = slow && !retry && start >= cue.slow;
      if (delayed && start >= cue.buffer) return null;
      const duration = delayed ? 4350 : 1030;
      const phase = progress(time, start, start + duration, easing.transform);
      const point = routePoint(source, client, retry ? 1 - phase : phase);
      const visible = arrive(time, start, 120) * (1 - arrive(time, start + duration - 150, 150));
      return <circle key={start} cx={point.x} cy={point.y} r={14} opacity={visible}
        fill={delayed ? v2Theme.signal : colors.text} stroke={colors.background} strokeWidth={3}/>;
    })}
  </g>;
}

export function Network({time}: {time: number}) {
  const down = arrive(time, cue.crash, 340);
  const split = progress(time, cue.crash + 600, cue.crash + 1600, easing.transform);
  const neighbor = arrive(time, cue.retry, 400);
  const neighborDown = arrive(time, cue.neighborCrash, 380);
  const firstX = mix(730, 480, split);
  return <g>
    {clients.map(({x,type}) => <g key={type}>
      <g opacity={1 - down}><Route source={firstX} client={x} time={time} slow={type === 'phone'} retry={false}/></g>
      <g opacity={neighbor * (1-neighborDown)}><Route source={1000} client={x} time={time} slow={false} retry/></g>
    </g>)}
    <Server x={firstX} label="Сервер" failure={down}/>
    <g opacity={neighbor}><Server x={1000} label="Соседний сервер" failure={neighborDown}/></g>
    {clients.map(({x,type,name}) => <g key={type} transform={`translate(${x} 773)`}>
      <g stroke={colors.text} fill="none" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round"><ClientIcon type={type}/></g>
      <text y={188} textAnchor="middle" fontSize={41} fontWeight={620}>{name}</text>
      {type === 'phone' && <text y={240} textAnchor="middle" fontSize={32}
        opacity={arrive(time,cue.slow,200)*(1-down)}>Медленно читает</text>}
    </g>)}
  </g>;
}
