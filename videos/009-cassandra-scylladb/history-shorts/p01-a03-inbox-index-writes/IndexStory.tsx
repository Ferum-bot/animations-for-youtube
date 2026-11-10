import React from 'react';
import {arrive, easing, Magnifier, MessageIcon, mix, progress, Sheet, v2Theme as ink} from '@channel/motion-v2';

const words = [
  {word:'Завтра', x:130, y:598}, {word:'встретимся', x:393, y:598},
  {word:'возле', x:130, y:681}, {word:'офиса', x:351, y:681},
] as const;

export function OneMessage({time}: {readonly time:number}) {
  return <g>
    <text x={80} y={415} fontSize={49}>Facebook Inbox · сообщение № 42</text>
    <Sheet x={80} y={466} width={846} height={282}>
      {words.map(({word,x,y})=><text key={word} x={x-80} y={y-466} fontSize={62} fontWeight={680}>{word}</text>)}
    </Sheet>
    <text x={84} y={826} fontSize={43} opacity={arrive(time,3850,650)}>Анна → Иван · 09:41</text>
    <text x={80} y={992} fontSize={55} fontWeight={660} opacity={arrive(time,9800,550)}>Поисковый индекс</text>
    {words.map(({word,x,y},i)=>{
      const at=11600+i*840;
      const move=progress(time,at,at+960,easing.transform);
      const destY=1113+i*113;
      return <g key={word} opacity={arrive(time,at,330)}>
        <text x={mix(x,98,move)} y={mix(y,destY,move)} fontSize={mix(62,55,move)} fontWeight={650}>
          {word.toLowerCase()}
        </text>
        <text x={641} y={destY} fontSize={49} opacity={arrive(time,at+740,400)}>→ № 42</text>
      </g>;
    })}
    <text x={82} y={1615} fontSize={46} opacity={arrive(time,17200,550)}>Одно сообщение · четыре записи индекса</text>
  </g>;
}

function Stack({x, at, time, owner}: {readonly x:number; readonly at:number; readonly time:number; readonly owner:string}) {
  const count=Math.max(0,Math.min(10,Math.floor((time-at)/125)+1));
  return <g opacity={arrive(time,at,400)}>
    <text x={x} y={977} fontSize={49} fontWeight={700}>{owner}</text>
    {Array.from({length:count},(_,i)=><g key={i} opacity={arrive(time,at+i*125,230)}>
      <Sheet x={x+i*4} y={1050+i*18} width={344} height={121}>
        {i===9 && <text x={22} y={75} fontSize={38}>Арбате → № 43</text>}
      </Sheet>
    </g>)}
    <text x={x} y={1460} fontSize={52} fontWeight={650}>{count} / 10</text>
  </g>;
}

export function TenWords({time}: {readonly time:number}) {
  return <g>
    <text x={80} y={440} fontSize={47}>Другое сообщение · № 43</text>
    <Sheet x={80} y={505} width={844} height={295}>
      <g fontSize={52} fontWeight={630}>
        <text x={34} y={77}>В субботу после обеда</text>
        <text x={34} y={155}>встретимся возле нового</text>
        <text x={34} y={233}>офиса на Арбате</text>
      </g>
    </Sheet>
    <Stack x={82} time={time} at={21550} owner="Индекс Анны"/>
    <Stack x={553} time={time} at={24950} owner="Индекс Ивана"/>
    <text x={82} y={1592} fontSize={38} fill={ink.muted} opacity={arrive(time,27300,480)}>Пример Картика Ранганатана · EnterpriseReady #35</text>
  </g>;
}

// Illustrative arrivals, not measured Facebook traffic. The one search returns a snapshot.
const arrivals = [30300,32100,33900,36400,38100,40000] as const;
const lookup=34800;

export function Traffic({time}: {readonly time:number}) {
  const hits=arrivals.filter(t=>t<lookup).map((_,i)=>`№ ${44+i}`).join(' · ');
  return <g>
    <MessageIcon x={82} y={415} scale={0.61}/>
    <text x={312} y={499} fontSize={54} fontWeight={690}>Новые сообщения</text>
    <text x={82} y={752} fontSize={51}>Записи индекса для «офиса»</text>
    {arrivals.map((at,i)=>{
      const t=progress(time,at,at+650,easing.transform);
      const x=80+(i%3)*295, y=840+Math.floor(i/3)*145;
      return <g key={at} opacity={arrive(time,at,350)}>
        <Sheet x={x} y={mix(y-25,y,t)} width={252} height={108}>
          <text x={32} y={72} fontSize={48}>№ {44+i}</text>
        </Sheet>
      </g>;
    })}
    <g opacity={arrive(time,lookup,480)}>
      <Magnifier x={83} y={1258} scale={0.58}/>
      <text x={190} y={1320} fontSize={54} fontWeight={680}>Поиск «офиса»</text>
      <text x={191} y={1420} fontSize={51} opacity={arrive(time,lookup+380,400)}>{hits}</text>
    </g>
  </g>;
}
