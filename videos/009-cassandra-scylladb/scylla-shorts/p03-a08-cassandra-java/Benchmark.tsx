import React from 'react';
import {arrive, easing, mix, progress, SourceImage, v2Theme as ink} from '@channel/motion-v2';
import documents from '../../animations/p03-a03-scylla-benchmarks/documents.json';
import {cue} from './score';

const assets = 'assets/009-cassandra-scylladb/p03-benchmarks/';
type Page = 'bench-cover' | 'bench-method' | 'bench-table';
const sizes = documents['bench-table'].marks;
const results = [
  {value:'139 171', label:'4.0.0 · Java 8', mark:sizes.base[0]},
  {value:'150 323', label:'5.0.6 · штатные настройки', mark:sizes.base[1]},
  {value:'171 527', label:'5.0.6 · после настройки', mark:sizes.tuned[0]},
] as const;

function Capture({page}: {readonly page:Page}) {
  const {width,height} = documents[page];
  return <SourceImage src={assets+page+'.webp'} x={0} y={0} width={width} height={height}/>;
}

function Method({time}: {readonly time:number}) {
  const scroll = progress(time,cue.workload-350,cue.workload+450,easing.transform);
  const marks = documents['bench-method'].marks;
  const widthScale = 1.19;
  const y = mix(-95,240,scroll);
  const workload = time >= cue.workload;
  const selection = arrive(time,workload?cue.workload+300:cue.versions+350,400);
  return <g>
    <g transform={`translate(-175 ${y}) scale(${widthScale})`}>
      <Capture page="bench-method"/>
      {(workload?marks.mix:marks.jvm).map(line=><path key={line.x} d={`M${line.x} ${line.y+line.height+2} h${line.width*selection}`}
        stroke={ink.primary} strokeWidth={4}/>)}
    </g>
    <rect width={1080} height={300} fill={ink.background}/>
    <text x={74} y={174} fontWeight={740} fontSize={70}>Что сравнивали</text>
    <rect y={1180} width={1080} height={740} fill={ink.background}/>
    <g fontSize={56} fontWeight={670}>
      <text x={74} y={1330}>{workload?'9 узлов · YCSB':'Cassandra 4.0.0 · Java 8'}</text>
      <text x={74} y={1430}>{workload?'50% чтения, 50% вставок':'Cassandra 5.0.6 · Java 17'}</text>
    </g>
  </g>;
}

function PublishedTable({time}: {readonly time:number}) {
  const scan = progress(time,cue.table,cue.mark+280,easing.transform);
  const scale = mix(1.03,1.29,scan);
  const x = mix(-25,-164,scan);
  const y = mix(370,165,scan);
  const lift = progress(time,cue.enlarge,cue.enlarge+850,easing.transform);
  return <g>
    <rect width={1080} height={1920} fill="#1b0d19"/>
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Capture page="bench-table"/>
      {[...sizes.scale,...sizes.base,...sizes.tuned].map(line=><path key={line.x}
        d={`M${line.x} ${line.y+line.height+2} h${line.width*arrive(time,cue.mark,380)}`} stroke={ink.primary} strokeWidth={3}/>)}
    </g>
    <rect width={1080} height={1920} fill={ink.background} opacity={0.96*lift}/>
    <g opacity={lift}>
      <text x={74} y={185} fontSize={68} fontWeight={745}>Операций в секунду</text>
      <text x={74} y={278} fontSize={47}>Cassandra · 9 узлов</text>
    </g>
    {results.map(({value,label,mark},i)=>{
      if (!mark) throw new Error('Missing benchANT source cell for '+value);
      const baseline = 605+i*248;
      return <g key={value} opacity={lift}>
        <text x={74} y={baseline-86} fontSize={46}>{label}</text>
        <text x={mix(x+mark.x*scale,74,lift)} y={mix(y+(mark.y+mark.height)*scale,baseline,lift)}
          fontSize={mix(18,80,lift)} fontWeight={740}>{value}</text>
      </g>;
    })}
    <g opacity={arrive(time,cue.gain,400)}>
      <path d="M74 1190 H881" stroke={ink.primary} strokeWidth={6}/>
      <text x={74} y={1340} fontSize={95} fontWeight={745}>+23%</text>
      <text x={74} y={1430} fontSize={48}>к Cassandra 4.0.0</text>
    </g>
  </g>;
}

export function Benchmark({time}: {readonly time:number}) {
  if (time < cue.versions) return <g>
    <rect width={1080} height={1920} fill="#1a0f1a"/>
    <g transform="translate(-277 360) scale(1.14)"><Capture page="bench-cover"/></g>
    <text x={74} y={1450} fontSize={44}>benchANT · апрель 2026</text>
  </g>;
  if (time < cue.table) return <Method time={time}/>;
  if (time < cue.ranking) return <PublishedTable time={time}/>;
  const zoom = progress(time,cue.ranking+650,cue.ranking+2000,easing.transform);
  const width = mix(1380,1920,zoom);
  return <g>
    <text x={74} y={189} fontSize={67} fontWeight={740}>Две версии Cassandra</text>
    <text x={74} y={290} fontSize={45}>benchANT · апрель 2026</text>
    <svg y={484} width={1080} height={1010} overflow="hidden">
      <SourceImage src={assets+'bench-figure.webp'} x={mix(-51,-166,zoom)} y={10} width={width} height={width*818/1316}/>
    </svg>
  </g>;
}
