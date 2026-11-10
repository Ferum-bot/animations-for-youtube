import React from 'react';
import {arrive, easing, mix, progress, SourceImage, v2Theme as ink} from '@channel/motion-v2';
import documents from '../../animations/p03-a03-scylla-benchmarks/documents.json';
import {cue, rates} from './score';

const folder = 'assets/009-cassandra-scylladb/p03-benchmarks/';
const overlapOffset = 910; // Top of the second screenshot on the first screenshot's CSS-pixel axis.
const scale = 1.15;
const pageX = -46;
type Mark = {x:number; y:number; width:number; height:number};

function Underline({lines, amount}: {readonly lines: readonly Mark[]; readonly amount: number}) {
  return <g stroke={ink.primary} strokeWidth={4}>
    {lines.map(line => <path key={line.x+'-'+line.y} d={`M${line.x} ${line.y+line.height+4} h${line.width*amount}`}/>)}
  </g>;
}

function Measurements({time, pageY}: {readonly time:number; readonly pageY:number}) {
  const lift = progress(time,cue.bars,cue.bars+1050,easing.transform);
  const retreat = progress(time,cue.secondTest-550,cue.secondTest,easing.transform);
  const opacity = 1-retreat;
  return <g opacity={opacity}>
    <rect width={1080} height={1920} fill={ink.background} opacity={0.96*lift}/>
    <g opacity={lift}>
      <text x={73} y={206} fontSize={72} fontWeight={745}>Скорость записи</text>
      <text x={74} y={313} fontSize={43}>OCTO · декабрь 2015</text>
      <text x={74} y={390} fontSize={45}>По 3 узла m3.xlarge</text>
      <text x={74} y={450} fontSize={39}>12 генераторов нагрузки</text>
    </g>
    {rates.map(({name,value},i)=>{
      const mark = documents['octo-test'].marks.writes[i];
      if (!mark) throw new Error('Missing OCTO source line for '+name);
      const y = mix(pageY+(mark.y+mark.height)*scale,740+i*345,lift);
      const x = mix(pageX+mark.x*scale,74,lift);
      return <g key={name} opacity={lift}>
        <text x={74} y={y-105} fontSize={49}>{name}</text>
        <text x={x} y={y} fontSize={mix(23,83,lift)} fontWeight={740}>{value.toLocaleString('ru-RU')}</text>
        <text x={435} y={y} fontSize={45}>записей/с</text>
        <rect x={74} y={y+48} width={812*(value/rates[0].value)*lift} height={23} fill={i===0?ink.primary:ink.text}/>
      </g>;
    })}
    <text x={74} y={1445} fontSize={70} fontWeight={740} opacity={arrive(time,cue.ratio,310)}>В 1,9 раза больше</text>
  </g>;
}

function Overload({time}: {readonly time:number}) {
  const lift = arrive(time,cue.overload,520);
  return <g opacity={lift}>
    <rect width={1080} height={1920} fill={ink.background} opacity={0.96}/>
    <text x={73} y={210} fontSize={71} fontWeight={740}>Под перегрузкой</text>
    <text x={74} y={322} fontSize={46}>17 генераторов · Fedora · 10 Гбит/с</text>
    <text x={74} y={625} fontSize={49}>ScyllaDB 0.10</text>
    <text x={74} y={745} fontSize={83} fontWeight={735}>Тайм-ауты</text>
    <g opacity={arrive(time,cue.clients,320)}>
      <text x={74} y={1000} fontSize={49}>Cassandra</text>
      <text x={74} y={1118} fontSize={62} fontWeight={700}>Синхронные клиенты</text>
      <text x={74} y={1202} fontSize={62} fontWeight={700}>посылали запросы реже</text>
    </g>
  </g>;
}

export function Article({time}: {readonly time:number}) {
  const first = progress(time,cue.firstTest,cue.setup,easing.transform);
  const ratesScroll = progress(time,cue.rates-800,cue.rates,easing.transform);
  const second = progress(time,cue.secondTest,cue.secondTest+1300,easing.transform);
  const initialY = mix(870,330,first) - 300*ratesScroll;
  const pageY = mix(initialY,740-(overlapOffset+534)*scale,second);
  const marks = documents['octo-test'].marks;
  return <g>
    <rect width={1080} height={1920} fill="white"/>
    <g transform={`translate(${pageX} ${pageY}) scale(${scale})`}>
      <SourceImage src={folder+'octo-cover.webp'} x={18} y={-695.25} width={1236} height={695.25}/>
      <SourceImage src={folder+'octo-test.webp'} x={0} y={0} width={1250} height={1275}/>
      <SourceImage src={folder+'octo-load.webp'} x={0} y={overlapOffset} width={1250} height={1147}/>
      <Underline lines={marks.setup} amount={arrive(time,cue.setup,400)}/>
      <Underline lines={marks.machines} amount={arrive(time,16500,350)}/>
      <Underline lines={marks.writes} amount={arrive(time,cue.rates,450)}/>
      <g transform={`translate(0 ${overlapOffset})`}>
        <Underline lines={documents['octo-load'].marks.clients} amount={arrive(time,27900,300)}/>
        <Underline lines={documents['octo-load'].marks.timeout} amount={arrive(time,28850,310)}/>
      </g>
    </g>
    {time>=cue.setup && time<cue.bars && <g opacity={arrive(time,cue.setup,450)}>
      <rect y={1360} width={1080} height={560} fill={ink.background}/>
      <text x={74} y={1492} fontSize={59} fontWeight={710}>По три узла на базу</text>
      <text x={74} y={1578} fontSize={48}>AWS EC2 · m3.xlarge</text>
    </g>}
    {time >= cue.bars && time < cue.secondTest && <Measurements time={time} pageY={pageY}/>}
    {time >= cue.overload && <Overload time={time}/>}
  </g>;
}
