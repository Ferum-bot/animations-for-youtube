import React from 'react';
import {arrive, getV2Theme, SourceImage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage} from '../../shared/AccessSourceStage';
import {chapterColors as colors} from '../../shared/chapterColors';
import {captures} from './captures';
import {passages, publications} from './story';

const imagePath = (name: keyof typeof captures) => `assets/011-websocket/memory/publications/${name}.webp`;
const marker = getV2Theme('signal').primary;
const panelWidth = 1460;

const PublicationList = () => <>
  <text x={68} y={145} fontSize={70} fontWeight={685}>Исходные публикации</text>
  {Object.values(publications).map((source,i)=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">
    <g transform={`translate(0 ${218+i*280})`}>
      <path d="M68 0H1392" stroke={colors.text} opacity={0.32} strokeWidth={2}/>
      <SourceImage src={imagePath(source.thumb)} x={68} y={55} width={276} height={162} fit="cover"/>
      <text x={380} y={77} fontSize={30} fontWeight={600}>{source.source} · {source.date}</text>
      <foreignObject x={380} y={98} width={1000} height={165}>
        <div style={{fontSize:42,lineHeight:1.18,fontWeight:660,color:colors.text}}>{source.title}</div>
      </foreignObject>
    </g>
  </a>)}
</>;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const beat = passages.filter(p => p.at <= timeMs).at(-1);
  const source = beat && publications[beat.publication];
  const page = beat && captures[beat.capture];
  const show = beat ? arrive(timeMs,beat.at,170) : 0;
  return <AccessSourceStage {...props} label="Память соединений · исходные публикации" audio="memory-publications">
    <g fill={colors.text}>
      <rect width={panelWidth} height={1440} fill={colors.background}/>
      {beat && source && page ? <a href={source.url} target="_blank" rel="noreferrer">
        <text x={70} y={90} fontSize={38} fontWeight={610}>{source.source}</text>
        <text x={1390} y={90} textAnchor="end" fontSize={33}>{source.date}</text>
        <foreignObject x={68} y={110} width={1324} height={144}>
          <div style={{display:'flex',alignItems:'center',height:'100%',fontSize:54,lineHeight:1.12,fontWeight:670,color:colors.text}}>
            {source.title}
          </div>
        </foreignObject>
        <svg y={beat.capture==='results' ? 240 : 277} width={panelWidth} height={beat.capture==='results' ? 855 : 774} viewBox={`0 0 ${page.width} ${page.height}`}>
          <SourceImage src={imagePath(beat.capture)} x={0} y={0} width={page.width} height={page.height}/>
          <g fill={marker} opacity={show*0.38}>
            {page.marks[beat.mark]?.map(([x,y,w,h])=><rect key={x+','+y} x={x-1} y={y-1} width={w+2} height={h+2}/>)}
          </g>
        </svg>
        <g opacity={show}>
          <text x={68} y={1154} fontSize={42}>{beat.original}</text>
          <foreignObject x={68} y={1205} width={1324} height={185}>
            <div style={{fontSize:52,lineHeight:1.25,fontWeight:630,color:colors.text}}>{beat.translation}</div>
          </foreignObject>
        </g>
      </a> : <PublicationList/>}
    </g>
  </AccessSourceStage>;
};
export default Composition;
