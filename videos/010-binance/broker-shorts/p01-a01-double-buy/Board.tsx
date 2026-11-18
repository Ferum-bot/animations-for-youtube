import React from 'react';
import {arrive, easing, mix, progress, v2FontFamily} from '@channel/motion-v2';

import {paper,ink,blue as pen,red as error,green,yellow as marker,hand} from '../../shared/vertical/drawing';

function Stroke({d, amount, color=ink, width=4}: {
  d: string; amount: number; color?: string; width?: number;
}) {
  return <path d={d} fill="none" stroke={color} strokeWidth={width} pathLength={1}
    strokeDasharray="1 1" strokeDashoffset={1-amount} opacity={amount ? 1 : 0}
    strokeLinecap="round" strokeLinejoin="round"/>;
}

function Tab({x, name, time}: {x: number; name: string; time: number}) {
  return <g transform={`translate(${x} 145)`}>
    <path d="M0 3 Q104 -2 255 1 L257 154 Q125 158 1 155 Z" fill={paper} stroke={ink} strokeWidth={3.5}/>
    <path d="M1 24 L255 23" stroke={ink} strokeWidth={2}/>
    {[14,25,36].map(cx => <circle key={cx} cx={cx} cy={13} r={2.6} fill="#777a75"/>)}
    <text x={128} y={78} fontSize={33} textAnchor="middle">{name}</text>
    <g opacity={arrive(time,7100)}>
      <path d="M15 91 Q129 89 241 92 L240 141 L15 142 Z" fill="#e5eff8" stroke={pen} strokeWidth={2}/>
      <text x={129} y={128} fill={pen} textAnchor="middle" fontSize={32} fontWeight={750}>Купить $800</text>
    </g>
  </g>;
}

// The same folded slip follows each order from the browser to its destination.
function OrderSlip({x,y,slot}: {x: number; y: number; slot: 'А' | 'Б'}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-85 -32 L63 -32 L85 -11 L85 31 L-85 32 Z" fill={paper} stroke={pen} strokeWidth={3}/>
    <path d="M63 -31 L63 -11 L84 -11" fill="none" stroke={pen} strokeWidth={2.5}/>
    <text textAnchor="middle" y={11} fontSize={29} fontWeight={730}>{slot} · $800</text>
  </g>;
}

function Exchange({x,y}: {x:number; y:number}) {
  return <g transform={`translate(${x} ${y})`} stroke={ink} strokeWidth={3.5} strokeLinejoin="round">
    <path d="M-42 -13 L0 -36 L42 -13 Z M-41 26 L42 26 L42 33 L-41 33 Z" fill={paper}/>
    {[-28,-4,20].map(left => <rect key={left} x={left} y={-6} width={9} height={26} fill={paper}/>)}
  </g>;
}

function Race({time}: {time: number}) {
  const routes = arrive(time,9550,460);
  return <g>
    <text x={22} y={72} fontSize={55} fontWeight={800}>Один счёт, две вкладки</text>
    <Tab x={55} name="Вкладка А" time={time}/><Tab x={532} name="Вкладка Б" time={time}/>
    <g opacity={arrive(time,3800,300)}>
      <path d="M232 333 Q435 330 617 335 L615 432 Q422 435 232 431 Z"
        stroke={ink} strokeWidth={3.4} fill={paper}/>
      <text x={425} y={394} textAnchor="middle" fontWeight={720} fontSize={42}>Баланс  $1 000</text>
    </g>
    <Stroke d="M181 308 Q182 362 229 371 M211 360 L229 371 L210 380" amount={routes} color={pen}/>
    <Stroke d="M660 308 Q657 362 622 371 M637 358 L621 371 L637 380" amount={routes} color={pen}/>
    <g opacity={routes} textAnchor="middle" fontSize={30} fontFamily={hand} fill={pen}>
      <text x={147} y={414}>$1 000</text><text x={708} y={414}>$1 000</text>
    </g>
    <g opacity={arrive(time,10800,240)}>
      <path d="M201 540 L202 626 Q414 629 643 626 L644 540" fill="none" stroke={ink} strokeWidth={4}/>
      {(['А','Б'] as const).map((slot,index) => {
        const travel = progress(time,11000+index*100,12050+index*100,easing.transform);
        const source = index === 0 ? 171 : 672;
        const target = index === 0 ? 312 : 527;
        return <OrderSlip key={slot} slot={slot} x={mix(source,target,Math.min(1,travel*1.8))}
          y={mix(470,584,travel*travel)}/>;
      })}
      <Exchange x={244} y={702}/>
      <text x={308} y={715} fontSize={43} fontWeight={750}>Биржа</text>
      <g opacity={arrive(time,12100,270)}>
        <text x={520} y={716} fill={error} fontSize={49} fontWeight={800}>$1 600</text>
        <Stroke d="M538 652 C722 619 754 739 620 746 C476 752 463 672 555 650"
          amount={arrive(time,12300,620)} color={marker} width={5}/>
      </g>
    </g>
  </g>;
}

function BalancePockets({time}: {time: number}) {
  const transfer = progress(time,24100,24920,easing.transform);
  const settled = transfer === 1;
  return <g>
    {[{x:55,title:'Доступно',amount:settled ? '$200' : '$1 000'},
      {x:474,title:'В резерве',amount:settled ? '$800' : '$0'}].map(({x,title,amount}) => <g key={title}
        transform={`translate(${x} 0)`}>
        <text x={148} y={306} fontSize={31} fill={pen} textAnchor="middle" fontFamily={hand}>{title}</text>
        <path d="M2 388 L2 462 Q141 466 294 461 L295 388" fill="none" stroke={ink} strokeWidth={3.6}/>
        <text x={148} y={442} fontSize={41} fontWeight={780} textAnchor="middle">{amount}</text>
      </g>)}
    {Array.from({length:5},(_,i) => {
      const travel = i === 0 ? 0 : transfer;
      const x = mix(77+i*52,507+(i-1)*52,travel);
      const y = 353 - 16*Math.sin(Math.PI*travel);
      return <g key={i} transform={`translate(${x} ${y})`}>
        <path d="M0 1 L40 0 L40 30 L0 31 Z" stroke={settled && i>0 ? green : pen}
          strokeWidth={3} fill={settled && i>0 ? '#ddeddf' : '#e4eff7'}/>
        <path d="M7 10 h9" fill="none" stroke={ink} strokeWidth={2.5}/>
      </g>;
    })}
  </g>;
}

function RecordIcon({x, y, name, outbox=false}: {x:number; y:number; name:string; outbox?:boolean}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-28 -34 L14 -34 L29 -20 L29 26 L-28 26 Z M14 -34 L14 -20 L29 -20"
      stroke={ink} strokeWidth={3} strokeLinejoin="round" fill={paper}/>
    <path d="M-18 -8 H15 M-18 3 H8" fill="none" stroke={pen} strokeWidth={3}/>
    {outbox && <path d="M-46 8 L-29 8 L-19 18 L17 18 L28 8 L46 8 L46 36 L-46 36 Z"
      fill="#e4eff7" stroke={ink} strokeWidth={3}/>}
    <text textAnchor="middle" y={78} fontSize={30} fontWeight={700}>{name}</text>
  </g>;
}

function Transaction({time}: {time: number}) {
  const rejected = arrive(time,25250,240);
  const records = arrive(time,27650,260);
  const outbox = arrive(time,28900,280);
  return <g>
    <text x={22} y={70} fontSize={54} fontWeight={800}>Одна транзакция</text>
    <Stroke d="M27 86 Q265 96 500 83" amount={arrive(time,15000)} color={marker} width={5}/>
    <g opacity={arrive(time,16400,330)}>
      <OrderSlip x={183} y={170} slot="А"/><OrderSlip x={605} y={170} slot="Б"/>
      <Stroke d="M281 169 l12 13 25 -28" amount={arrive(time,24880,230)} color={green} width={6}/>
      <g opacity={rejected} fill={error}>
        <path d="M702 155 l22 25 M725 155 l-24 26" fill="none" stroke={error} strokeWidth={5}/>
        <text x={605} y={246} textAnchor="middle" fontSize={29}>$200 &lt; $800</text>
      </g>
    </g>
    <g opacity={arrive(time,13900,250)}>
      <path d="M44 267 L24 267 L24 650 L44 650 M783 267 L805 267 L805 650 L783 650"
        fill="none" stroke={pen} strokeWidth={3.5}/>
      <BalancePockets time={time}/>
      <g opacity={records}><RecordIcon x={221} y={542} name="orders"/></g>
      <g opacity={outbox}><RecordIcon x={600} y={542} name="outbox" outbox/></g>
    </g>
    <g opacity={arrive(time,30100,300)}>
      <Stroke d="M599 630 L599 691 Q599 713 578 713 L481 713 M497 702 L481 713 L496 725"
        amount={arrive(time,30100,480)} color={pen}/>
      <Exchange x={239} y={711}/>
      <text x={304} y={724} fontSize={37} fontWeight={740}>Биржа</text>
      <text x={609} y={756} textAnchor="middle" fontFamily={hand} fill={pen} fontSize={28}>после COMMIT</text>
    </g>
  </g>;
}

export function Board({time, left, width}: {time: number; left: number; width: number}) {
  return <svg style={{position:'absolute', top:568, left}} width={width} height={width*805/845}
    viewBox="0 0 845 805" fill={ink} fontFamily={v2FontFamily}>
    {time < 13900 ? <Race time={time}/> : <Transaction time={time}/>}
  </svg>;
}
