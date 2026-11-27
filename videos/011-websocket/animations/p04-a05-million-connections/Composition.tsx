import React from 'react';
import {arrive, getV2Theme, mix, SourceImage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage} from '../../shared/AccessSourceStage';
import {chapterColors as colors} from '../../shared/chapterColors';
import {captures} from './captures';
import {listedSource, publicationOrder, publications, readings, type Passage, type Publication} from './story';

const width = 1460;
const height = 1440;
const rowTop = 210;
const rowHeight = 295;
const gold = getV2Theme('signal').primary;
const imagePath = (file: string) => `assets/011-websocket/memory/benchmarks/${file}.webp`;

const SourceIndex: React.FC<{active?: Publication}> = ({active}) => <>
  <text x={62} y={144} fontSize={72} fontWeight={670}>Миллион соединений</text>
  {publicationOrder.map((id, index) => {
    const source = publications[id];
    const selected = active === id;
    return <a key={id} href={source.url} target="_blank" rel="noreferrer">
      <g transform={`translate(0 ${rowTop + index * rowHeight})`}>
        <rect width={width} height={rowHeight} fill={gold} opacity={selected ? 0.11 : 0}/>
        <path d="M62 0H1398" stroke={colors.text} opacity={0.32} strokeWidth={2}/>
        <SourceImage src={imagePath(source.thumb)} x={62} y={56} width={300} height={180} fit="cover"/>
        <text x={400} y={66} fontSize={31} fontWeight={610} fill={selected ? gold : colors.text}>
          {source.publisher} · {source.date}
        </text>
        <foreignObject x={400} y={86} width={990} height={130}>
          <div style={{fontSize:43,lineHeight:1.1,fontWeight:660,color:colors.text}}>{source.title}</div>
        </foreignObject>
        <text x={400} y={247} fontSize={32} fill={selected ? gold : colors.text}>{source.condition}</text>
      </g>
    </a>;
  })}
</>;

const Article: React.FC<{source: Publication; passage: Passage; timeMs: number}> = ({source,passage,timeMs}) => {
  const pub = publications[source];
  const page = captures[passage.capture];
  const emphasis = arrive(timeMs, passage.at, 210);
  return <a href={pub.url} target="_blank" rel="noreferrer">
    <rect width={width} height={height} fill={colors.background}/>
    <text x={62} y={85} fontSize={38} fontWeight={620}>{pub.publisher}</text>
    <text x={1398} y={85} textAnchor="end" fontSize={34}>{pub.date}</text>
    <foreignObject x={62} y={122} width={1336} height={144}>
      <div style={{fontSize:52,lineHeight:1.07,fontWeight:650,color:colors.text}}>{pub.title}</div>
    </foreignObject>
    <svg y={262} width={width} height={805} viewBox={`0 0 ${page.width} ${page.height}`}>
      <SourceImage src={imagePath(passage.capture)} x={0} y={0} width={page.width} height={page.height}/>
      <g fill={gold} opacity={emphasis}>
        {passage.marks.flatMap(index => page.marks[index]?.map(([x,y,w,h]) => <g key={`${x}-${y}`}>
          <rect x={x-1} y={y} width={w+2} height={h} opacity={0.31}/>
          <rect x={x-1} y={y+h} width={w+2} height={1.6}/>
        </g>) ?? [])}
      </g>
    </svg>
    <text x={62} y={1156} fontSize={40}>{passage.original}</text>
    <foreignObject x={62} y={1196} width={1336} height={218}>
      <div style={{fontSize:54,lineHeight:1.15,fontWeight:640,color:colors.text}}>{passage.translation}</div>
    </foreignObject>
  </a>;
};

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const reading = readings.find(item => timeMs >= item.start && timeMs < item.end);
  const passage = reading?.passages.filter(item => timeMs >= item.at).at(-1);
  const rowY = rowTop + (reading ? publicationOrder.indexOf(reading.source) : 0) * rowHeight;
  const opening = reading ? arrive(timeMs, reading.start, 380) : 0;
  const closing = reading?.source === 'phoenix' ? arrive(timeMs, reading.end - 350, 350) : 0;
  const expansion = opening * (1 - closing);
  return <AccessSourceStage {...props} label="Миллион соединений · условия тестов" audio="million-connections">
    <g fill={colors.text}>
      <rect width={width} height={height} fill={colors.background}/>
      {expansion < 1 && <SourceIndex active={listedSource(timeMs)}/>}
      {reading && passage && <g clipPath="url(#benchmark-article-crop)">
        <defs><clipPath id="benchmark-article-crop">
          <rect y={mix(rowY,0,expansion)} width={width} height={mix(rowHeight,height,expansion)}/>
        </clipPath></defs>
        <Article source={reading.source} passage={passage} timeMs={timeMs}/>
      </g>}
    </g>
  </AccessSourceStage>;
};

export default Composition;
