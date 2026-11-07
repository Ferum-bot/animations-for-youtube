import React from 'react';
import {Sheet, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {Delivery, type Route} from '../../shared/architecture/Routes';
import {Title} from '../../shared/architecture/Title';
import {Note} from '../../shared/architecture/ReplicaNote';
import {messageLabel, newBody, oldBody} from '../../shared/architecture/chat107';
import {cue, type ShotProps} from './scene';

const Echo: React.FC<{x:number; y:number; label:string; body:string}> = ({x,y,label,body}) =>
  <Sheet x={x} y={y} width={693} height={215}>
    <text x={37} y={76} fontSize={41} fill={ink.muted}>{label}</text>
    <text x={37} y={162} fontSize={61} fontWeight={650}>{body}</text>
  </Sheet>;

const requestC: Route = {from:{x:1300,y:760},via:{x:1820,y:760},to:{x:1820,y:593}};

export const Digest: React.FC<ShotProps> = ({timeMs}) => {
  const data = progress(timeMs,cue.dataBack,cue.dataBack+730);
  const digest = progress(timeMs,cue.digestBack,cue.digestBack+730);
  const full = timeMs>=cue.fullBack;
  const moving = full ? progress(timeMs,cue.fullBack,cue.fullBack+700) : digest;
  return <g>
    <Title>{timeMs>=cue.requestFull ? 'Запрашиваем данные у C' : 'Читаем с B и C'}</Title>
    <Note x={390} y={305} scale={1.05} host="B" detail={messageLabel} value={newBody} marked/>
    <Note x={1540} y={305} scale={1.05} host="C" detail={messageLabel} value={oldBody}/>
    <text x={1280} y={821} textAnchor="middle" fontSize={45} fill={ink.muted}>Координатор F</text>
    <Delivery route={requestC} timeMs={timeMs} start={cue.requestFull} duration={900} kind="read" />
    {timeMs>=cue.dataBack && <Echo x={390} y={mix(609,920,data)} label="Данные от B" body={newBody}/>}
    {timeMs>=cue.digestBack && <Echo x={1480} y={mix(609,920,moving)}
      label={full ? 'Данные от C' : 'Digest от C'} body={full ? oldBody : 'h₂'}/>}
    {timeMs>=cue.compare && !full && <text x={1115} y={1059} fontSize={73} fontWeight={650}>h₁ ≠ h₂</text>}
    {timeMs>=cue.compare && !full && <text x={389} y={1227} fontSize={43} fill={ink.muted}>Digest данных B — h₁</text>}
  </g>;
};

const stamp = {older:'18:07:12',newer:'18:08:04'};
export const Version: React.FC<ShotProps> = ({timeMs}) => <g>
  <Title>{timeMs<cue.lww ? 'Две версии одного поля' : 'Last-write-wins'}</Title>
  <text x={300} y={383} fontSize={54} fill={ink.muted}>Сообщение №107 · поле text</text>
  {[{node:'B',body:newBody,ts:stamp.newer},{node:'C',body:oldBody,ts:stamp.older}].map((row,i) =>
    <g key={row.node} transform={`translate(310 ${570+i*235})`}>
      <text fontSize={68}>{row.node}</text>
      <text x={170} fontSize={78} fontWeight={650}>{row.body}</text>
      {timeMs>=cue.stamps && <text x={1080} fontSize={72}>{row.ts}</text>}
      {timeMs>=cue.winner && i===0 && <path d="M1075 27 h320" stroke={ink.primary} strokeWidth={11}/>}
    </g>)}
  {timeMs>=cue.winner && <text x={478} y={1095} fontSize={65}>В ответе — «{newBody}»</text>}
</g>;

export const Clocks: React.FC<ShotProps> = ({timeMs}) => <g>
  <Title>Если часы спешат</Title>
  <text x={250} y={541} fontSize={51} fill={ink.muted}>Порядок правок</text>
  <text x={250} y={777} fontSize={51} fill={ink.muted}>Метка записи</text>
  {[{x:930,order:'Первая',ts:'18:08:10',body:oldBody},{x:1730,order:'Следом',ts:'18:08:04',body:newBody}]
    .filter((_,i)=>i===0 || timeMs>=cue.later).map((v,i)=><g key={v.order} transform={`translate(${v.x} 0)`}>
      <text y={414} fontSize={50} fill={ink.muted}>{v.order}</text>
      <text y={542} fontSize={67} fontWeight={650}>{v.body}</text>
      <text y={777} fontSize={75}>{v.ts}</text>
      {i===0 && <text y={895} fontSize={51} fill={ink.muted}>часы +10 с</text>}
    </g>)}
  {timeMs>=cue.skewWinner && <g>
    <path d="M925 811 h324" stroke={ink.primary} strokeWidth={10}/>
    <text x={250} y={1160} fontSize={65}>Останется «{oldBody}»</text>
  </g>}
</g>;
