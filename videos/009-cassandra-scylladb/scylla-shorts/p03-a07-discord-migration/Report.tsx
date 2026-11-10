import React from 'react';
import {arrive, easing, mix, progress, SourceImage, v2Theme as ink} from '@channel/motion-v2';
import documents from '../../animations/p03-a03-scylla-benchmarks/documents.json';
import {cue, folder} from './score';

type Page = 'discord-report' | 'discord-reverse' | 'discord-trouble';
type Mark = {x:number; y:number; width:number; height:number};
const scale = 1.12;

function Reading({page, scroll, marks, selection}: {
  readonly page:Page; readonly scroll:number; readonly marks: readonly Mark[]; readonly selection:number;
}) {
  const doc = documents[page];
  return <g transform={`translate(${(1080-doc.width*scale)/2} ${scroll}) scale(${scale})`}>
    <SourceImage src={folder+page+'.webp'} x={0} y={0} width={doc.width} height={doc.height}/>
    {marks.map(mark => <path key={mark.x+'-'+mark.y} d={`M${mark.x} ${mark.y+mark.height+2} h${mark.width*selection}`}
      stroke={ink.primary} strokeWidth={5}/>)}
  </g>;
}

export function SourceNote({time, ending=false}: {readonly time:number; readonly ending?:boolean}) {
  const page = ending ? 'discord-reverse' : 'discord-trouble';
  const fixed = ending && time >= cue.fixed;
  const start = ending ? cue.reverse : cue.trouble;
  const trouble = documents['discord-trouble'].marks;
  const offset = time-start;
  const anchor = ending ? (fixed ? documents['discord-reverse'].marks.fixed : documents['discord-reverse'].marks.reverse)
    : offset<2300 ? trouble.gc : offset<3850 ? trouble.hot : trouble.compact;
  const focusAt = ending ? (fixed ? cue.fixed : cue.reverse) : start+(offset<2300?0:offset<3850?2300:3850);
  const y = ending ? mix(310,216,progress(time,cue.fixed,cue.fixed+520,easing.transform))
    : -290+495*progress(offset,1940,2500,easing.transform)-245*progress(offset,3500,4100,easing.transform);
  const label = ending ? (fixed?'Ускорили обратное чтение':'Медленное обратное чтение')
    : offset<2300?'Паузы сборщика мусора':offset<3850?'Горячие партиции':'Compaction отставала';
  return <g>
    <Reading page={page} scroll={y} marks={anchor} selection={arrive(time,focusAt+160,420)}/>
    <rect width={1080} height={314} fill={ink.background}/>
    <text x={73} y={177} fontSize={56} fontWeight={740}>{ending?'Что пришлось доработать':'Почему Discord переезжал'}</text>
    <rect y={1180} width={1080} height={740} fill={ink.background}/>
    <text x={73} y={1316} fontSize={39}>Discord Engineering</text>
    <text x={73} y={1450} fontSize={58} fontWeight={710}>{label}</text>
  </g>;
}

function Comparison({title, before, after, y, amount}: {
  readonly title:string; readonly before:string; readonly after:string; readonly y:number; readonly amount:number;
}) {
  return <g opacity={amount} transform={`translate(0 ${y})`}>
    <text x={74} fontSize={49}>{title}</text>
    <text x={74} y={112} fontSize={76} fontWeight={740}>{before}</text>
    <path d="M499 84 H605 M579 60 L606 84 L579 108" stroke={ink.primary} fill="none" strokeWidth={7}/>
    <text x={665} y={112} fontSize={76} fontWeight={740}>{after}</text>
  </g>;
}

export function Results({time, final=false}: {readonly time:number; readonly final?:boolean}) {
  const capacity = final || time>=cue.cluster;
  const doc = documents['discord-report'];
  const anchor = capacity ? (time>=cue.disk ? doc.marks.disk : doc.marks.nodes) :
    time>=cue.write ? doc.marks.write : time>=cue.read ? doc.marks.read : doc.marks.moved;
  const focus = capacity ? cue.cluster : time>=cue.write ? cue.write : cue.read;
  const lift = final ? 1 : arrive(time,cue.read+280,640);
  return <g>
    <Reading page="discord-report" scroll={mix(255,82,progress(time,cue.report,cue.read,easing.transform))}
      marks={anchor} selection={arrive(time, time<cue.read?cue.report+540:focus,400)}/>
    <rect width={1080} height={1920} fill={ink.background} opacity={0.96*lift}/>
    <g opacity={lift}>
      <text x={74} y={202} fontSize={67} fontWeight={745}>{capacity?'Кластер сообщений':'Задержка p99'}</text>
      <text x={74} y={300} fontSize={43}>Discord · май 2022</text>
      <text x={74} y={558} fontSize={50} fontWeight={710}>Cassandra</text>
      <text x={665} y={558} fontSize={50} fontWeight={710}>ScyllaDB</text>
      {capacity ? <>
        <Comparison title="Узлы" before="177" after="72" y={800} amount={1}/>
        <Comparison title="Диск на узел" before="≈4 ТБ" after="9 ТБ" y={1190} amount={arrive(time,cue.disk,460)}/>
      </> : <>
        <Comparison title="Чтение истории" before="40–125 мс" after="15 мс" y={800} amount={1}/>
        <Comparison title="Запись сообщения" before="5–70 мс" after="5 мс" y={1190} amount={arrive(time,cue.write,460)}/>
      </>}
    </g>
  </g>;
}
