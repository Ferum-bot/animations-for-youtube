import React from 'react';
import {SourceImage, SourcePage, easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {SourceCaption} from '../../shared/source-reading/SourceCaption';
import figures from './figures.json';
import passages from './passages.json';
import type {Crop, Shot} from './score';

const asset=(name:string)=>'assets/009-cassandra-scylladb/p03-origins-engine/'+name;
const W=2560,H=1440;

const Facsimile:React.FC<{shot:Extract<Shot,{kind:'figure'}>; ms:number}> = ({shot,ms})=>{
  const {width,height}=figures[shot.id];
  const move=progress(ms,shot.moveAt??0,(shot.moveAt??0)+1500,easing.transform);
  const next:Crop=shot.to??shot.from;
  const x=mix(shot.from[0],next[0],move)*width;
  const y=mix(shot.from[1],next[1],move)*width;
  const span=mix(shot.from[2],next[2],move)*width;
  const box=[x,y,span,span*9/16];
  return <>
    <rect width={W} height={H} fill="white"/>
    <svg width={W} height={H} viewBox={box.join(' ')} overflow="hidden">
      <SourceImage src={asset(shot.id+'.webp')} x={0} y={0} width={width} height={height}/>
    </svg>
    {shot.caption && <SourceCaption caption={shot.caption} amount={progress(ms,1000,1350)}/>}
  </>;
};

const Portrait:React.FC = ()=><>
  <svg width={W} height={H} viewBox="18 16 1060 596.25" overflow="hidden">
    <SourceImage src={asset('founders.webp')} x={0} y={0} width={1096} height={778}/>
  </svg>
  <rect x={0} y={1090} width={W} height={350} fill={ink.background} opacity={0.79}/>
  <g textAnchor="middle" fontSize={78} fontWeight={650}>
    <text x={996} y={1247}>Дор Лаор</text><text x={1734} y={1247}>Ави Кивити</text>
  </g>
  <text x={1280} y={1362} textAnchor="middle" fontSize={37} fill={ink.text}>Фото из архива ScyllaDB</text>
</>;

export const SourceDesk:React.FC<{shot:Shot; ms:number}>=({shot,ms})=>{
  switch(shot.kind){
    case 'cover':return <SourceImage src={asset(shot.id+'-cover.jpg')} x={0} y={0} width={W} height={H}/>;
    case 'portrait':return <Portrait/>;
    case 'figure':return <Facsimile shot={shot} ms={ms}/>;
    case 'passage':{
      const source=passages[shot.id];
      const at=shot.alreadyAtText?200:1700;
      const scroll=shot.alreadyAtText?1:progress(ms,180,1550,easing.transform);
      const focus=progress(ms,shot.focusMs??at+600,(shot.focusMs??at+600)+330);
      const caption={...shot.caption,original:shot.quote ? source.phrase : undefined};
      return <>
        <SourcePage src={asset(shot.id+'.jpg')} sourceWidth={1440} sourceHeight={source.height}
          scrollY={source.scroll*scroll} highlights={source.lines} selection={progress(ms,at,at+410)}
          highlightOpacity={0.35} blur={focus*0.6}/>
        <SourceCaption caption={caption} amount={focus}/>
      </>;
    }
  }
};
