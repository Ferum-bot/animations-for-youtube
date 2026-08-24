// @ts-nocheck -- frozen reference snapshot; new product code remains strict.
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const C = {
  paper: '#F2EEE4',
  ink: '#111111',
  cobalt: '#1845D8',
  orange: '#F04A24',
  green: '#2F7D45',
  muted: '#77736B',
  line: '#D4CFC4',
  night: '#101010',
  night2: '#232323',
  cream: '#F5F0E7',
  wine: '#2B1015',
};

const sans = 'Arial, Helvetica, sans-serif';
const mono = 'Menlo, Monaco, Consolas, monospace';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const map = (f: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(f, [a, b], [c, d], {...clamp, easing: Easing.inOut(Easing.cubic)});
const linear = (f: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(f, [a, b], [c, d], clamp);
const pop = (f: number, at: number, fps: number) =>
  spring({frame: Math.max(0, f - at), fps, config: {damping: 15, stiffness: 160, mass: 0.7}});

const Grain: React.FC<{opacity?: number}> = ({opacity = 0.08}) => (
  <div
    style={{
      position: 'absolute', inset: 0, opacity, pointerEvents: 'none', mixBlendMode: 'multiply',
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.45\'/%3E%3C/svg%3E")',
    }}
  />
);

const Kicker: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark}) => (
  <div style={{position: 'absolute', left: 74, top: 55, font: `500 21px ${mono}`, letterSpacing: 1.7, color: C.orange}}>
    {children}
    <span style={{color: dark ? '#777' : C.muted}}> / DATAFLOW STUDY</span>
  </div>
);

const Node: React.FC<{
  x: number; y: number; w?: number; h?: number; label: string; sub?: string;
  active?: number; dark?: boolean; index?: string;
}> = ({x, y, w = 300, h = 150, label, sub, active = 0, dark, index}) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h,
    boxSizing: 'border-box', padding: '28px 30px',
    background: dark ? C.night2 : '#FAF8F2',
    color: dark ? C.cream : C.ink,
    borderTop: `7px solid ${active > 0.5 ? C.orange : C.cobalt}`,
    transform: `translateY(${(1 - active) * 14}px)`, opacity: 0.5 + active * 0.5,
  }}>
    {index && <div style={{font: `500 16px ${mono}`, color: active > 0.5 ? C.orange : C.muted, marginBottom: 16}}>{index}</div>}
    <div style={{font: `700 28px ${sans}`, letterSpacing: -0.4}}>{label}</div>
    {sub && <div style={{font: `400 18px ${mono}`, color: dark ? '#999' : C.muted, marginTop: 13}}>{sub}</div>}
  </div>
);

const Packet: React.FC<{x: number; y: number; color?: string; label?: string; scale?: number}> = ({x, y, color = C.orange, label, scale = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${scale})`}}>
    <div style={{width: 34, height: 34, background: color, transform: 'rotate(45deg)'}} />
    {label && <div style={{position: 'absolute', top: 34, left: -44, width: 122, textAlign: 'center', font: `500 15px ${mono}`, color}}>{label}</div>}
  </div>
);

const EndLabel: React.FC<{num: string; title: string; dark?: boolean}> = ({num, title, dark}) => (
  <div style={{position: 'absolute', left: 74, right: 74, bottom: 48, display: 'flex', justifyContent: 'space-between', font: `500 17px ${mono}`, color: dark ? '#777' : C.muted}}>
    <span>{num} / 05</span><span>{title}</span><span>1920 × 1080 / 30 FPS</span>
  </div>
);

export const EditorialPulse: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const intro = pop(f, 0, fps);
  const requestX = linear(f, 42, 142, 180, 1650);
  const responseX = linear(f, 157, 220, 1650, 180);
  const stages = [42, 74, 106, 134];
  return (
    <AbsoluteFill style={{background: C.paper, color: C.ink, fontFamily: sans, overflow: 'hidden'}}>
      <Grain opacity={0.055}/><Kicker>01 / EDITORIAL PULSE</Kicker>
      <div style={{position:'absolute', left:74, top:112, font:`800 76px ${sans}`, letterSpacing:-3, transform:`translateY(${(1-intro)*35}px)`, opacity:intro}}>
        Один запрос.<br/><span style={{color:C.cobalt}}>Четыре границы.</span>
      </div>
      <div style={{position:'absolute', left:75, top:314, font:`500 21px ${mono}`, color:C.muted}}>POST /orders</div>
      <div style={{position:'absolute', left:170, right:170, top:585, height:3, background:C.line}}/>
      {[
        [80,'CLIENT','browser'],[510,'API GATEWAY','TLS + routing'],[955,'ORDER SERVICE','business rules'],[1430,'POSTGRES','transaction'],
      ].map(([x,label,sub],i)=><Node key={String(label)} x={Number(x)} y={510} w={330} h={165} label={String(label)} sub={String(sub)} index={`0${i+1}`} active={map(f,stages[i],stages[i]+16)}/>) }
      {f < 155 ? <Packet x={requestX} y={587} label="request" scale={0.8+0.2*Math.sin(f/5)}/> : <Packet x={responseX} y={587} color={C.cobalt} label="201 created"/>}
      <div style={{position:'absolute', right:90, top:165, width:515, font:`400 26px/1.5 ${sans}`, color:C.muted, opacity:map(f,120,150)}}>
        Gateway направляет. Сервис решает. База фиксирует. Ответ возвращается по тому же контракту.
      </div>
      <div style={{position:'absolute', left:75, top:807, width:map(f,176,225,0,1250), height:12, background:C.orange}}/>
      <div style={{position:'absolute', left:75, top:844, font:`800 48px ${sans}`, opacity:map(f,182,214)}}>Смысл движется. Декор остаётся.</div>
      <EndLabel num="01" title="LOW DETAIL / CHAPTER OPENER"/>
    </AbsoluteFill>
  );
};

const traceRows = [
  {name:'CLIENT', sub:'POST /orders', start:25, end:216, color:C.cobalt},
  {name:'GATEWAY', sub:'route + auth', start:48, end:195, color:C.orange},
  {name:'AUTH', sub:'JWT verify', start:65, end:102, color:C.green},
  {name:'ORDER-SVC', sub:'validate + orchestrate', start:82, end:180, color:C.cobalt},
  {name:'POSTGRES', sub:'INSERT + COMMIT', start:116, end:165, color:C.orange},
];

export const TraceLanes: React.FC = () => {
  const f=useCurrentFrame();
  return <AbsoluteFill style={{background:C.night,color:C.cream,fontFamily:sans,overflow:'hidden'}}>
    <Grain opacity={0.12}/><Kicker dark>02 / TRACE LANES</Kicker>
    <div style={{position:'absolute',left:74,top:115,font:`700 61px ${sans}`,letterSpacing:-2}}>Один trace. Пять контекстов.</div>
    <div style={{position:'absolute',right:76,top:128,font:`500 18px ${mono}`,color:'#8FA8FF'}}>trace_id 7f3a·9c12</div>
    <div style={{position:'absolute',left:355,right:85,top:260,height:1,background:'#444'}}/>
    {[0,50,100,150,200].map((t,i)=><div key={t} style={{position:'absolute',left:355+i*291,top:225,font:`500 15px ${mono}`,color:'#777'}}>{t} ms</div>)}
    {traceRows.map((r,i)=>{
      const y=292+i*125; const width=map(f,r.start,r.end,0,(r.end-r.start)*5.82); const highlight=f>=r.start&&f<=r.end;
      return <React.Fragment key={r.name}>
        <div style={{position:'absolute',left:74,top:y-4,font:`700 22px ${sans}`,color:highlight?C.cream:'#777'}}>{r.name}</div>
        <div style={{position:'absolute',left:74,top:y+30,font:`400 15px ${mono}`,color:'#666'}}>{r.sub}</div>
        <div style={{position:'absolute',left:355,top:y+4,width:1455,height:54,background:'#1D1D1D'}}/>
        <div style={{position:'absolute',left:355+r.start*5.82,top:y+4,width,height:54,background:r.color,opacity:0.92}}/>
        <div style={{position:'absolute',left:370+r.start*5.82,top:y+20,font:`500 15px ${mono}`,color:C.cream,opacity:map(f,r.start+5,r.start+12)}}>{r.end-r.start} ms</div>
      </React.Fragment>})}
    <div style={{position:'absolute',left:355+Math.min(f,220)*5.82,top:252,width:2,height:672,background:C.orange,boxShadow:`0 0 18px ${C.orange}`}}/>
    <div style={{position:'absolute',right:74,top:914,font:`500 20px ${mono}`,color:f>165?C.green:C.muted}}>{f>165?'COMMITTED · 201':'IN FLIGHT'}</div>
    <EndLabel num="02" title="MEDIUM DETAIL / OBSERVABILITY" dark/>
  </AbsoluteFill>;
};

const CodeBlock: React.FC<{x:number;y:number;w:number;title:string;lines:string[];accent:string;reveal:number}> = ({x,y,w,title,lines,accent,reveal}) => (
  <div style={{position:'absolute',left:x,top:y,width:w,height:430,background:'#FBF9F3',borderTop:`8px solid ${accent}`,padding:'30px 34px',boxSizing:'border-box',overflow:'hidden'}}>
    <div style={{font:`700 24px ${sans}`,marginBottom:24}}>{title}</div>
    {lines.map((line,i)=><div key={line} style={{font:`400 18px/1.65 ${mono}`,color:i===Math.floor(reveal*lines.length)?accent:C.ink,opacity:map(reveal, i/lines.length, Math.min(1,i/lines.length+.15),0.18,1)}}>{line}</div>)}
  </div>
);

export const PacketAutopsy: React.FC = () => {
  const f=useCurrentFrame();
  const phase=linear(f,20,215);
  const packetX=linear(f,18,216,125,1795);
  const sections=[
    {x:65,w:480,title:'01 · CLIENT',accent:C.cobalt,lines:['POST /orders HTTP/2','authorization: Bearer •••','idempotency-key: 84bd','{"sku":"AWP-01","qty":1}']},
    {x:575,w:390,title:'02 · GATEWAY',accent:C.orange,lines:['terminate TLS','verify JWT','rate_limit(user)','route → order-svc']},
    {x:995,w:420,title:'03 · SERVICE',accent:C.green,lines:['validate(command)','begin transaction','INSERT order','INSERT outbox']},
    {x:1445,w:410,title:'04 · DATABASE',accent:C.orange,lines:['row lock','WAL append','fsync','COMMIT']},
  ];
  return <AbsoluteFill style={{background:C.paper,color:C.ink,fontFamily:sans,overflow:'hidden'}}>
    <Grain opacity={0.05}/><Kicker>03 / PACKET AUTOPSY</Kicker>
    <div style={{position:'absolute',left:74,top:111,font:`800 66px ${sans}`,letterSpacing:-2.5}}>Что происходит <span style={{color:C.orange}}>внутри</span> запроса?</div>
    <div style={{position:'absolute',left:74,right:74,top:257,height:2,background:C.line}}/>
    {sections.map((s,i)=><CodeBlock key={s.title} {...s} y={320} reveal={map(f,20+i*43,60+i*43)} />)}
    <div style={{position:'absolute',left:74,top:800,width:1772,height:2,background:C.ink}}/>
    <Packet x={packetX} y={801} scale={1.15+Math.sin(f/7)*0.08}/>
    <div style={{position:'absolute',left:74,top:855,font:`500 18px ${mono}`,color:C.muted}}>BYTE STREAM</div>
    <div style={{position:'absolute',left:220,top:855,width:1450,height:13,background:C.line}}><div style={{height:'100%',width:`${phase*100}%`,background:C.cobalt}}/></div>
    <div style={{position:'absolute',right:75,top:846,font:`700 25px ${mono}`,color:phase>.92?C.green:C.ink}}>{Math.round(phase*100)}%</div>
    <EndLabel num="03" title="HIGH DETAIL / EXPLAINER CORE"/>
  </AbsoluteFill>;
};

export const MaterialTopology: React.FC = () => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const t=linear(f,30,210); const cx=linear(f,30,210,180,1670);
  const nodes=[
    {x:180,y:535,r:80,label:'CLIENT',shape:'circle'},
    {x:565,y:535,r:92,label:'GATEWAY',shape:'diamond'},
    {x:1000,y:405,r:92,label:'ORDER',shape:'square'},
    {x:1000,y:690,r:72,label:'AUTH',shape:'circle'},
    {x:1480,y:535,r:112,label:'DB',shape:'cylinder'},
  ];
  const settle=pop(f,0,fps);
  return <AbsoluteFill style={{background:C.paper,color:C.ink,fontFamily:sans,overflow:'hidden'}}>
    <Grain opacity={0.07}/><Kicker>04 / MATERIAL TOPOLOGY</Kicker>
    <div style={{position:'absolute',left:74,top:110,font:`800 68px ${sans}`,letterSpacing:-2.5}}>Архитектура как <span style={{color:C.cobalt}}>кинетический объект.</span></div>
    <svg width="1920" height="1080" style={{position:'absolute',inset:0}} aria-label="Material microservice topology">
      <path d="M180 535 L565 535 L1000 405 L1480 535" fill="none" stroke={C.ink} strokeWidth="7" strokeLinecap="square" strokeDasharray="1700" strokeDashoffset={1700*(1-map(f,12,65))}/>
      <path d="M565 535 L1000 690 L1480 535" fill="none" stroke={C.line} strokeWidth="5" strokeDasharray="1200" strokeDashoffset={1200*(1-map(f,38,88))}/>
      <path d="M1000 405 L1000 690" fill="none" stroke={C.orange} strokeWidth="4" strokeDasharray="18 16" opacity={map(f,68,95)}/>
      {nodes.map((n,i)=>{
        const appear=pop(f,10+i*13,fps); const pulse=f>45+i*31&&f<88+i*31; const rr=n.r*(.86+.14*appear)+(pulse?8*Math.sin(f/3):0);
        if(n.shape==='diamond') return <rect key={n.label} x={n.x-rr*.72} y={n.y-rr*.72} width={rr*1.44} height={rr*1.44} fill={C.orange} transform={`rotate(45 ${n.x} ${n.y})`}/>;
        if(n.shape==='square') return <rect key={n.label} x={n.x-rr} y={n.y-rr} width={rr*2} height={rr*2} fill={C.cobalt}/>;
        if(n.shape==='cylinder') return <g key={n.label}><rect x={n.x-rr} y={n.y-rr*.7} width={rr*2} height={rr*1.4} fill={C.wine}/><ellipse cx={n.x} cy={n.y-rr*.7} rx={rr} ry={rr*.33} fill="#5A2631"/><ellipse cx={n.x} cy={n.y+rr*.7} rx={rr} ry={rr*.33} fill={C.wine}/></g>;
        return <circle key={n.label} cx={n.x} cy={n.y} r={rr} fill={i===3?C.green:C.ink}/>;
      })}
      <circle cx={cx} cy={535-130*Math.sin(t*Math.PI)} r="22" fill={C.orange}/>
      <circle cx={cx} cy={535-130*Math.sin(t*Math.PI)} r="42" fill="none" stroke={C.orange} strokeWidth="3" opacity={0.35+0.25*Math.sin(f/4)}/>
    </svg>
    {nodes.map((n,i)=><div key={n.label} style={{position:'absolute',left:n.x-100,top:n.y+(n.y<500?125:115),width:200,textAlign:'center',font:`700 18px ${mono}`,opacity:map(f,20+i*13,44+i*13)}}>{n.label}</div>)}
    <div style={{position:'absolute',left:75,top:840,font:`400 27px/1.45 ${sans}`,width:820,transform:`translateY(${(1-settle)*18}px)`,opacity:map(f,145,180)}}>Масса показывает ответственность.<br/>Связь появляется только когда по ней идёт работа.</div>
    <div style={{position:'absolute',right:75,top:860,font:`500 17px ${mono}`,color:C.muted}}>request → auth → command → commit</div>
    <EndLabel num="04" title="ABSTRACT / VISUAL METAPHOR"/>
  </AbsoluteFill>;
};

const DarkUnit: React.FC<{x:number;y:number;w:number;label:string;sub:string;on:number}> = ({x,y,w,label,sub,on}) => <div style={{position:'absolute',left:x,top:y,width:w,height:104,borderTop:`3px solid ${on>.5?C.orange:'#4A4A4A'}`,background:'#171717',padding:'22px 24px',boxSizing:'border-box',opacity:.5+on*.5}}>
  <div style={{font:`700 22px ${sans}`,color:C.cream}}>{label}</div><div style={{font:`400 15px ${mono}`,color:on>.5?'#B9C7FF':'#777',marginTop:11}}>{sub}</div>
</div>;

export const CorrectnessDarkroom: React.FC = () => {
  const f=useCurrentFrame();
  const steps=[
    {x:75,w:260,label:'CLIENT',sub:'idempotency key'},
    {x:370,w:300,label:'ORDER SERVICE',sub:'business transaction'},
    {x:705,w:265,label:'POSTGRES',sub:'rows + WAL'},
    {x:1005,w:265,label:'OUTBOX RELAY',sub:'at-least-once'},
    {x:1305,w:245,label:'BROKER',sub:'orders.created'},
    {x:1585,w:260,label:'CONSUMER',sub:'dedupe + apply'},
  ];
  const starts=[20,50,82,120,150,178];
  const packetX=linear(f,22,205,110,1790);
  return <AbsoluteFill style={{background:C.night,color:C.cream,fontFamily:sans,overflow:'hidden'}}>
    <Grain opacity={0.14}/><Kicker dark>05 / CORRECTNESS DARKROOM</Kicker>
    <div style={{position:'absolute',left:74,top:112,font:`700 64px ${sans}`,letterSpacing:-2}}>Запрос завершён.<br/><span style={{color:C.orange}}>Событие не потеряно.</span></div>
    <div style={{position:'absolute',right:78,top:139,width:500,font:`400 24px/1.5 ${sans}`,color:'#888'}}>Микросервисная архитектура — это не стрелки. Это границы атомарности и повторения.</div>
    <div style={{position:'absolute',left:110,right:110,top:541,height:2,background:'#3A3A3A'}}/>
    {steps.map((s,i)=><DarkUnit key={s.label} {...s} y={490} on={map(f,starts[i],starts[i]+16)}/>)}
    <Packet x={packetX} y={541} scale={.9}/>
    <div style={{position:'absolute',left:75,top:685,width:1770,height:165,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2}}>
      {[
        ['01','TX','order + outbox / one COMMIT'],['02','WAL','durable before acknowledgement'],['03','RELAY','retry until broker confirms'],['04','CONSUMER','event_id makes retry harmless'],
      ].map((a,i)=><div key={a[1]} style={{background:f>78+i*31?'#242424':'#171717',padding:'25px 28px',borderTop:`5px solid ${f>78+i*31?C.orange:'#333'}`}}>
        <div style={{font:`500 15px ${mono}`,color:C.orange}}>{a[0]}</div><div style={{font:`700 26px ${sans}`,marginTop:12}}>{a[1]}</div><div style={{font:`400 16px ${mono}`,color:'#888',marginTop:12}}>{a[2]}</div>
      </div>)}
    </div>
    <div style={{position:'absolute',left:75,top:890,font:`700 30px ${sans}`,color:f>205?C.green:'#555'}}>AT-LEAST-ONCE + IDEMPOTENCY = EFFECTIVELY-ONCE EFFECT</div>
    <EndLabel num="05" title="MAX DETAIL / CORRECTNESS STORY" dark/>
  </AbsoluteFill>;
};
