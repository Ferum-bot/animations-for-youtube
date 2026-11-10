import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {arrive, MessageIcon, Pocket, Slip, SourceImage, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {SourceQuote} from './SourceQuote';

const page=(name:string)=>'assets/009-cassandra-scylladb/p01-index/'+name;
const voice='generated/009-cassandra-scylladb/history-shorts/02/voice.m4a';

function Story({time}: {readonly time:number}) {
  const shards=time>=14600;
  const question=time>=27280;
  return <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{fill:ink.text}}>
    <g fontSize={74} fontWeight={760} letterSpacing={-3}>
      <text x={72} y={185}>{question ? 'Можно ли добавить' : shards ? 'Переписка уже' : 'У Facebook уже был MySQL.'}</text>
      <text x={72} y={275}>{question ? 'индекс в MySQL?' : shards ? 'лежала в MySQL' : 'Зачем Cassandra?'}</text>
    </g>
    {!shards ? <>
      <g opacity={1-arrive(time,2390,380)}>
        <MessageIcon x={90} y={575} scale={2.4}/>
        <text x={90} y={1300} fontSize={57}>Личные сообщения Facebook</text>
      </g>
      {time>=2300 && <g opacity={arrive(time,2300,600)*(1-arrive(time,10300,500))}>
        <SourceImage src={page('karthik.jpg')} x={90} y={465} width={600} height={600} fit="cover"/>
        <text x={90} y={1190} fontSize={66} fontWeight={680}>Картик Ранганатан</text>
        <text x={90} y={1272} fontSize={45}>Участник команды Cassandra</text>
      </g>}
      <g opacity={arrive(time,10300,600)}>
        <text x={80} y={583} fontSize={64}>Facebook Inbox</text>
        <SourceImage src="assets/009-cassandra-scylladb/p01/inbox-2008.png" x={72} y={660} width={936} height={353}/>
        <text x={80} y={1100} fontSize={40}>Архив интерфейса · июнь 2008</text>
      </g>
    </> : <>
      {[0,1,2].map(i=><g key={i} opacity={arrive(time,14600+i*130,420)}>
        <Pocket x={74+i*295} y={417} scale={0.56} label="MySQL"><MessageIcon x={105} y={60} scale={0.64}/></Pocket>
      </g>)}
      {time>=17500 && <g opacity={arrive(time,17500,420)}>
        <text x={80} y={896} fontSize={55} fontWeight={690}>Поисковый индекс</text>
        {['завтра','встреча','офис'].map((word,i)=>{
          const reveal=arrive(time,18100+i*1070,650);
          return <g key={word} opacity={reveal} transform={`translate(0 ${15*(1-reveal)})`}>
            <Slip x={84} y={967+i*140} width={806} word={word} messageId="№42"/>
          </g>;
        })}
      </g>}
      {time>=30000 && <text x={82} y={1552} fontSize={52} fontWeight={640} opacity={arrive(time,30000,380)}>Можно. Вопрос в стоимости.</text>}
    </>}
  </svg>;
}

export default function Composition({withAudio=true}: {readonly withAudio?:boolean}) {
  useV2Font();
  const {timeMs}=useSceneTime(), {width}=useVideoConfig();
  return <AbsoluteFill style={{backgroundColor:ink.background,fontFamily:ink.fontSans}}>
    <div data-history-mysql="" style={{position:'absolute',width:1080,height:1920,overflow:'hidden',transformOrigin:'top left',transform:`scale(${width/1080})`}}>
      {timeMs>=43200 ? <FullEpisodeCard elapsedMs={timeMs-43200}/> : timeMs>=32500 ? <SourceQuote time={timeMs}/> : <Story time={timeMs}/>}
    </div>
    {timeMs<43200 && withAudio && <Audio src={staticFile(voice)}/>}
  </AbsoluteFill>;
}
