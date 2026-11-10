import React from 'react';
import {Img, staticFile} from 'remotion';
import {easing, progress, v2Theme as ink} from '@channel/motion-v2';
import {asset, authors, inboxSource, sources} from '../../shared/history-sources';
import {FocusPage, type Passage} from './FocusPage';

function Photo({file, alt, style}: {readonly file:string; readonly alt:string; readonly style:React.CSSProperties}) {
  return <Img src={staticFile(asset(file))} alt={alt} style={{display:'block', ...style}}/>;
}

const heading: React.CSSProperties = {fontSize:82, fontWeight:760, letterSpacing:-3, lineHeight:1.07, margin:0};
const caption: React.CSSProperties = {fontSize:36, color:ink.muted, fontWeight:600, marginTop:28};

const inboxLine = [{text:'stanford',x:176,y:80,width:48,height:14,at:2160,finalWidth:555}] satisfies readonly Passage[];
const apacheLine = [{text:'June 2007',x:345,y:212,width:68,height:18,at:9450,finalWidth:650}] satisfies readonly Passage[];
const articleLines = [
  {text:'Inbox Search',x:165,y:143,width:112,height:24,at:23650,release:25800,finalWidth:620},
  {text:'in one of our Hackthons.',x:271,y:412,width:206,height:24,at:26500,finalWidth:820},
] satisfies readonly Passage[];

function Inbox({time}: {readonly time:number}) {
  return <>
    <h1 style={heading}>Зачем Facebook<br/>создал Cassandra?</h1>
    <div style={{marginTop:80}}>
      <FocusPage file={inboxSource.image} alt="Подлинная выдача Inbox Search по запросу stanford"
        width={643} height={242} paper="#ffffff" color="#313131" passages={inboxLine} enter={0} time={time}/>
    </div>
    <div style={caption}>Facebook Inbox Search · июнь 2008</div>
  </>;
}

function DateSource({time}: {readonly time:number}) {
  return <>
    <h1 style={heading}>Начало разработки</h1>
    <div style={{marginTop:70}}>
      <FocusPage {...sources.apache} file={sources.apache.image} alt="Дата в заявке Cassandra"
        paper={sources.apache.background} color={ink.text} passages={apacheLine} enter={7733} time={time}/>
    </div>
    <div style={caption}>Заявка проекта в Apache Incubator</div>
  </>;
}

function Authors() {
  return <>
    <h1 style={heading}>Авторы Cassandra</h1>
    <div style={{display:'flex',gap:32,marginTop:62}}>
      {authors.map(author=><div key={author.name} style={{flex:1,minWidth:0}}>
        <Photo file={author.image} alt={author.name} style={{width:'100%',height:436,objectFit:'cover',objectPosition:author.position}}/>
        <div style={{marginTop:20,fontSize:49,lineHeight:1.14,fontWeight:680}}>{author.name.split(' ')[0]}<br/>{author.surname}</div>
      </div>)}
    </div>
  </>;
}

function Account({time}: {readonly time:number}) {
  return <>
    <h1 style={heading}>Из рассказа Лакшмана</h1>
    <div style={{marginTop:62}}>
      <FocusPage {...sources.facebook} file={sources.facebook.image} alt="Рассказ Лакшмана о задаче Inbox Search и хакатоне"
        paper={sources.facebook.background} color="#344157" passages={articleLines} enter={23000} time={time}/>
    </div>
    <div style={caption}>Facebook Engineering · 25 августа 2008</div>
  </>;
}

function Demo({time}: {readonly time:number}) {
  const focus=progress(time,31200,32600,easing.transform);
  const query='встреча'.slice(0,Math.floor(7*progress(time,32900,35100,t=>t)));
  return <>
    <h1 style={heading}>Поиск в переписке</h1>
    <div style={caption}>Пример запроса</div>
    <div style={{position:'relative',marginTop:65,padding:'10px 22px 22px',fontSize:80,fontWeight:700,
      lineHeight:1.2, transformOrigin:'left center', transform:`scale(${0.78+0.22*focus})`,
      opacity:progress(time,31100,31800),borderBottom:'6px solid '+ink.primary}}>
      {query || <span style={{fontSize:57,color:ink.muted}}>Найти слово</span>}
      <span style={{display:'inline-block',height:'0.82em',width:4,background:ink.text,marginLeft:6,
        opacity:query.length>0?1-progress(time,35000,35400):0}}/>
    </div>
    {[['Завтра ', ' в 10:00.'],['Наша ', ' у офиса.']].map(([before,after],i)=>{
      const at=35300+i*590;
      const visible=progress(time,at,at+760,easing.transform);
      const match=progress(time,at+450,at+1200,easing.transform);
      return <div key={before} style={{fontSize:51,marginTop:36,opacity:visible,
        transform:`translateY(${22*(1-visible)}px)`}}>{before}
        <strong style={{position:'relative'}}>встреча<span style={{position:'absolute',left:0,bottom:-4,
          width:`${100*match}%`,height:4,background:ink.primary}}/></strong>{after}
      </div>;
    })}
  </>;
}

export function Archive({time}: {readonly time:number}) {
  let content: React.ReactNode;
  if (time<7733.333) content=<Inbox time={time}/>;
  else if (time<18400) content=<DateSource time={time}/>;
  else if (time<23000) content=<Authors/>;
  else if (time<31100) content=<Account time={time}/>;
  else content=<Demo time={time}/>;
  return <div data-pane="archive" style={{position:'absolute',inset:'0 0 auto',height:1056,boxSizing:'border-box',
    overflow:'hidden',padding:'94px 72px 45px',color:ink.text,fontFamily:ink.fontSans}}>{content}</div>;
}
