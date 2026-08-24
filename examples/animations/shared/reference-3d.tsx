// @ts-nocheck -- frozen reference snapshot; new product code remains strict.
import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';

const P = {
  bg: '#090B0F', ink: '#F3EEE4', muted: '#7E828A', cobalt: '#2451E6',
  orange: '#FF4A25', green: '#35A05A', wine: '#4B1824', steel: '#313741',
  pale: '#E7E1D6', gold: '#D28A35',
};
const sans = 'Arial, Helvetica, sans-serif';
const mono = 'Menlo, Monaco, Consolas, monospace';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (f: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(f, [a, b], [c, d], {...clamp, easing: Easing.inOut(Easing.cubic)});
const linear = (f: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(f, [a, b], [c, d], clamp);

const Header3D: React.FC<{num: string; name: string; title: React.ReactNode; detail: string}> = ({num, name, title, detail}) => (
  <>
    <div style={{position:'absolute',left:74,top:54,font:`500 20px ${mono}`,letterSpacing:1.7,color:P.orange}}>{num} / {name}<span style={{color:P.muted}}> / 3D STUDY</span></div>
    <div style={{position:'absolute',left:74,top:106,font:`700 60px ${sans}`,letterSpacing:-2,color:P.ink}}>{title}</div>
    <div style={{position:'absolute',right:74,top:133,font:`500 16px ${mono}`,color:P.muted}}>{detail}</div>
  </>
);

const Footer3D: React.FC<{num: string; label: string; status: string; statusColor?: string}> = ({num,label,status,statusColor=P.muted}) => (
  <div style={{position:'absolute',left:74,right:74,bottom:45,display:'flex',justifyContent:'space-between',font:`500 16px ${mono}`,color:P.muted}}>
    <span>{num} / 08</span><span>{label}</span><span style={{color:statusColor}}>{status}</span>
  </div>
);

const Atmosphere: React.FC = () => (
  <>
    <ambientLight intensity={1.15}/>
    <directionalLight position={[7, 11, 9]} intensity={2.4} color="#fff1dc"/>
    <pointLight position={[-8, 4, 6]} intensity={95} color={P.cobalt} distance={26}/>
    <pointLight position={[8, -2, 5]} intensity={80} color={P.orange} distance={22}/>
    <gridHelper args={[36, 36, '#252A32', '#15181E']} position={[0,-4.5,0]}/>
  </>
);

const Tube: React.FC<{points: [number,number,number][]; color?: string; radius?: number; opacity?: number}> = ({points,color=P.steel,radius=.085,opacity=1}) => {
  const curve=useMemo(()=>new THREE.CatmullRomCurve3(points.map((p)=>new THREE.Vector3(...p))),[points]);
  return <mesh>
    <tubeGeometry args={[curve,72,radius,12,false]}/>
    <meshStandardMaterial color={color} metalness={.72} roughness={.28} transparent opacity={opacity}/>
  </mesh>;
};

const FlowOrb: React.FC<{points:[number,number,number][]; progress:number; color?:string; size?:number}> = ({points,progress,color=P.orange,size=.2}) => {
  const curve=useMemo(()=>new THREE.CatmullRomCurve3(points.map((p)=>new THREE.Vector3(...p))),[points]);
  const p=curve.getPointAt(Math.min(.999,Math.max(.001,progress)));
  const glow=.88+.16*Math.sin(progress*40);
  return <group position={[p.x,p.y,p.z]} scale={glow}>
    <mesh><sphereGeometry args={[size,24,24]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.8} roughness={.2}/></mesh>
    <mesh><torusGeometry args={[size*1.75,size*.08,10,32]}/><meshBasicMaterial color={color} transparent opacity={.48}/></mesh>
  </group>;
};

const ReactorNode: React.FC<{position:[number,number,number]; color:string; kind?:'box'|'gateway'|'db'; active:number}> = ({position,color,kind='box',active}) => {
  const s=.78+.22*active;
  if(kind==='db') return <group position={position} scale={s}>
    {[0,.68,1.36].map((y)=><mesh key={y} position={[0,y,0]}>
      <cylinderGeometry args={[1.05,1.05,.52,48]}/>
      <meshPhysicalMaterial color={P.wine} metalness={.62} roughness={.22} clearcoat={.8}/>
    </mesh>)}
    <mesh position={[0,2.03,0]}><torusGeometry args={[.83,.075,10,42]}/><meshBasicMaterial color={active>.7?P.orange:'#552431'}/></mesh>
  </group>;
  if(kind==='gateway') return <group position={position} rotation={[0,.5,.78]} scale={s}>
    <mesh><octahedronGeometry args={[1.15,0]}/><meshPhysicalMaterial color={color} metalness={.35} roughness={.18} clearcoat={1}/></mesh>
    <mesh scale={1.14}><octahedronGeometry args={[1.15,0]}/><meshBasicMaterial color={P.orange} wireframe transparent opacity={.35+.45*active}/></mesh>
  </group>;
  return <group position={position} scale={s} rotation={[.06,.18,0]}>
    <mesh><boxGeometry args={[2.05,1.45,1.45]}/><meshPhysicalMaterial color={color} metalness={.48} roughness={.25} clearcoat={.7}/></mesh>
    <mesh scale={1.08}><boxGeometry args={[2.05,1.45,1.45]}/><meshBasicMaterial color={active>.55?P.orange:'#536074'} wireframe transparent opacity={.45}/></mesh>
    {[[-.58,0,.74],[0,0,.74],[.58,0,.74]].map((p,i)=><mesh key={i} position={p as [number,number,number]}><sphereGeometry args={[.09,14,14]}/><meshBasicMaterial color={i===Math.floor(active*3)?P.orange:P.pale}/></mesh>)}
  </group>;
};

const reactorPath:[number,number,number][]= [[-8,-.2,0],[-5.3,.3,.1],[-2.4,1.1,-.2],[1.2,.6,.15],[4.5,1.4,-.1],[7.5,.35,0]];

const ReactorWorld: React.FC<{frame:number}> = ({frame}) => {
  const nodes:Array<{p:[number,number,number];c:string;k?:'box'|'gateway'|'db';at:number}> = [
    {p:[-7.5,-.15,0],c:'#191D24',at:12}, {p:[-4.6,.45,.1],c:P.orange,k:'gateway',at:42},
    {p:[-1.5,1.05,-.1],c:P.cobalt,at:76}, {p:[2.1,.75,.1],c:P.cobalt,at:108},
    {p:[6.3,.25,0],c:P.wine,k:'db',at:150},
  ];
  const main=linear(frame,18,208);
  return <group rotation={[.04,ease(frame,0,239,-.12,.12),0]}>
    <Atmosphere/>
    <Tube points={reactorPath} radius={.12} color="#586273"/>
    <Tube points={[[-4.7,.3,0],[-3.3,-2.1,.5],[-.9,-2.4,.2]]} radius={.055} color={P.green} opacity={.72}/>
    <Tube points={[[-4.7,.3,0],[-3.4,2.7,-.7],[-.5,3.1,-.3]]} radius={.055} color={P.gold} opacity={.6}/>
    <group position={[-.9,-2.4,.2]} rotation={[.2,.4,0]}>
      <mesh><dodecahedronGeometry args={[.55,0]}/><meshPhysicalMaterial color={P.green} metalness={.45} roughness={.22} clearcoat={.7}/></mesh>
      <mesh scale={1.13}><dodecahedronGeometry args={[.55,0]}/><meshBasicMaterial color={P.green} wireframe transparent opacity={.45}/></mesh>
    </group>
    <group position={[-.5,3.1,-.3]} rotation={[.1,frame*.01,0]}>
      <mesh><torusKnotGeometry args={[.42,.13,72,10,2,3]}/><meshPhysicalMaterial color={P.gold} metalness={.62} roughness={.2} clearcoat={.8}/></mesh>
    </group>
    {nodes.map((n,i)=><ReactorNode key={i} position={n.p} color={n.c} kind={n.k} active={ease(frame,n.at,n.at+18)}/>) }
    {[0,.16,.32].map((offset,i)=><FlowOrb key={i} points={reactorPath} progress={Math.max(0,Math.min(1,main-offset))} color={i===0?P.orange:P.cobalt} size={i===0?.23:.13}/>) }
    {Array.from({length:18},(_,i)=>{
      const x=-8+i*.9; return <mesh key={i} position={[x,-3.7,-1.2+Math.sin(i)*1.6]} rotation={[0,i*.31,0]}>
        <boxGeometry args={[.28,.055,.55]}/><meshStandardMaterial color={i%4===0?P.orange:'#333A45'} metalness={.7} roughness={.3}/>
      </mesh>;
    })}
  </group>;
};

export const TransitReactor3D: React.FC = () => {
  const frame=useCurrentFrame(); const {width,height}=useVideoConfig();
  const cameraZ=ease(frame,0,239,17.5,13.8); const cameraX=ease(frame,0,239,-1.4,1.2);
  const stage=Math.min(4,Math.floor(linear(frame,18,208,0,4.99)));
  const stages=['CLIENT / TLS','GATEWAY / ROUTE','AUTH + ORDER','TRANSACTION','POSTGRES / COMMIT'];
  return <AbsoluteFill style={{background:P.bg,overflow:'hidden'}}>
    <ThreeCanvas width={width} height={height} camera={{fov:43,position:[cameraX,2.1,cameraZ]}} style={{backgroundColor:P.bg}}>
      <ReactorWorld frame={frame}/>
    </ThreeCanvas>
    <Header3D num="06" name="TRANSIT REACTOR" title={<>Запрос проходит через <span style={{color:P.cobalt}}>машину границ.</span></>} detail="CLIENT → GATEWAY → SERVICES → DB"/>
    <div style={{position:'absolute',left:74,bottom:108,font:`700 25px ${mono}`,color:P.ink}}>{stages[stage]}</div>
    <div style={{position:'absolute',left:420,right:420,bottom:119,height:4,background:'#252A32'}}><div style={{height:'100%',width:`${linear(frame,18,208)*100}%`,background:P.orange}}/></div>
    <Footer3D num="06" label="3D PIPELINE / PHYSICAL BOUNDARIES" status={frame>205?'201 CREATED':'REQUEST IN TRANSIT'} statusColor={frame>205?P.green:P.orange}/>
  </AbsoluteFill>;
};

const DiskStack: React.FC<{position:[number,number,number]; active:number; replica?:boolean; failed?:boolean}> = ({position,active,replica,failed}) => <group position={position} scale={.85+.15*active}>
  {Array.from({length:7},(_,i)=><mesh key={i} position={[0,i*.34,0]}>
    <cylinderGeometry args={[replica?.88:1.12,replica?.88:1.12,.22,48]}/>
    <meshPhysicalMaterial color={failed?'#2B2E34':replica?'#173572':P.wine} metalness={.65} roughness={.2} clearcoat={.8} emissive={failed?'#000000':replica?P.cobalt:P.orange} emissiveIntensity={active*.16}/>
  </mesh>)}
  <mesh position={[0,2.5,0]} rotation={[Math.PI/2,0,0]} scale={1+Math.sin(active*10)*.05}>
    <torusGeometry args={[replica?.7:.91,.065,10,48]}/><meshBasicMaterial color={failed?'#444':active>.7?P.green:P.orange}/>
  </mesh>
</group>;

const WalTile: React.FC<{x:number;y:number;z:number;rotation:number;hot?:boolean}> = ({x,y,z,rotation,hot}) => <mesh position={[x,y,z]} rotation={[.2,rotation,.1]}>
  <boxGeometry args={[.68,.12,1.05]}/><meshStandardMaterial color={hot?P.orange:'#4A5260'} emissive={hot?P.orange:'#000'} emissiveIntensity={hot?1.2:0} metalness={.62} roughness={.28}/>
</mesh>;

const ReplicationWorld: React.FC<{frame:number}> = ({frame}) => {
  const send=linear(frame,42,166); const fail=frame>112&&frame<184;
  const p1:[number,number,number][]= [[0,1.2,0],[-2.4,2.1,.2],[-5.2,1.2,0]];
  const p2:[number,number,number][]= [[0,1.2,0],[2.3,2.3,-.1],[5.2,1.2,0]];
  return <group rotation={[.02,ease(frame,0,239,-.3,.28),0]}>
    <Atmosphere/>
    <Tube points={p1} radius={.065} color={fail?'#333844':P.cobalt}/><Tube points={p2} radius={.065} color={P.cobalt}/>
    <DiskStack position={[0,-.2,0]} active={ease(frame,12,42)}/>
    <DiskStack position={[-5.2,-.2,0]} active={ease(frame,48,78)} replica failed={fail}/>
    <DiskStack position={[5.2,-.2,0]} active={ease(frame,58,88)} replica/>
    {[0,.12,.24,.36].map((o,i)=><FlowOrb key={`l${i}`} points={p1} progress={Math.max(0,Math.min(1,send-o))} color={fail?P.muted:P.cobalt} size={.12}/>) }
    {[0,.1,.2,.3,.4].map((o,i)=><FlowOrb key={`r${i}`} points={p2} progress={Math.max(0,Math.min(1,send-o))} color={i===0?P.orange:P.cobalt} size={i===0?.17:.11}/>) }
    {Array.from({length:14},(_,i)=>{
      const a=i/14*Math.PI*2+frame*.014; return <WalTile key={i} x={Math.cos(a)*2.3} y={-2.6+Math.sin(i*.9)*.25} z={Math.sin(a)*2.3} rotation={a} hot={i===Math.floor(frame/9)%14}/>;
    })}
    <mesh position={[0,-2.62,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[2.65,.08,10,80]}/><meshBasicMaterial color={P.orange} transparent opacity={.65}/></mesh>
  </group>;
};

export const ReplicationChamber3D: React.FC = () => {
  const frame=useCurrentFrame(); const {width,height}=useVideoConfig(); const fail=frame>112&&frame<184;
  const lsn=Math.round(linear(frame,25,205,84100,84297));
  return <AbsoluteFill style={{background:P.bg,overflow:'hidden'}}>
    <ThreeCanvas width={width} height={height} camera={{fov:45,position:[ease(frame,0,239,-.6,.8),3.2,ease(frame,0,239,16.5,14.4)]}} style={{backgroundColor:P.bg}}>
      <ReplicationWorld frame={frame}/>
    </ThreeCanvas>
    <Header3D num="07" name="REPLICATION CHAMBER" title={<>WAL становится <span style={{color:P.orange}}>синхронизацией.</span></>} detail={`LSN 0/4A${lsn.toString(16).toUpperCase()}`}/>
    <div style={{position:'absolute',left:74,top:860,display:'flex',gap:55,font:`500 16px ${mono}`,color:P.muted}}>
      <span style={{color:P.orange}}>PRIMARY / COMMIT</span><span style={{color:fail?'#555':P.cobalt}}>REPLICA A / {fail?'TIMEOUT':'ACK'}</span><span style={{color:P.cobalt}}>REPLICA B / ACK</span>
    </div>
    <div style={{position:'absolute',right:74,top:850,font:`700 28px ${sans}`,color:fail?P.orange:P.green}}>{fail?'REROUTING QUORUM':'QUORUM HEALTHY'}</div>
    <Footer3D num="07" label="3D REPLICATION / FAILURE + RECOVERY" status={frame>198?'COMMIT DURABLE':fail?'ONE REPLICA LOST':'STREAMING WAL'} statusColor={frame>198?P.green:fail?P.orange:P.cobalt}/>
  </AbsoluteFill>;
};

const ServiceOrb: React.FC<{position:[number,number,number];color:string;active:number;shape?:'sphere'|'db'|'broker'}> = ({position,color,active,shape='sphere'}) => {
  if(shape==='db') return <group position={position}><DiskStack position={[0,-1.1,0]} active={active}/></group>;
  if(shape==='broker') return <group position={position} rotation={[.2,active*.7,0]}>
    <mesh><torusKnotGeometry args={[1,.3,100,14,2,3]}/><meshPhysicalMaterial color={color} metalness={.7} roughness={.18} clearcoat={.8} emissive={color} emissiveIntensity={.12+active*.18}/></mesh>
  </group>;
  return <group position={position} scale={.8+.2*active}>
    <mesh><icosahedronGeometry args={[.82,1]}/><meshPhysicalMaterial color={color} metalness={.5} roughness={.22} clearcoat={.85}/></mesh>
    <mesh scale={1.12} rotation={[0,active*.8,0]}><icosahedronGeometry args={[.82,1]}/><meshBasicMaterial color={P.orange} wireframe transparent opacity={.22+.35*active}/></mesh>
  </group>;
};

const EventMeshWorld: React.FC<{frame:number}> = ({frame}) => {
  const sync:[number,number,number][]= [[-7,0,0],[-4,1,.1],[-1.4,.5,0],[2.1,.9,0],[6,.1,0]];
  const eventA:[number,number,number][]= [[2.1,.9,0],[1.1,-2.1,.4],[-2.8,-2.3,.2],[-5.8,-1.6,0]];
  const eventB:[number,number,number][]= [[2.1,.9,0],[3,-2.1,-.3],[6,-2,0],[7.3,-.9,.1]];
  const syncP=linear(frame,18,132); const asyncP=linear(frame,112,210); const compensate=linear(frame,160,225);
  const stars=Array.from({length:46},(_,i)=>{
    const a=i*2.399; const r=4.2+(i%7)*.55; return [Math.cos(a)*r,((i%9)-4)*.55-1.1,Math.sin(a)*r-2.7] as [number,number,number];
  });
  return <group rotation={[.04,ease(frame,0,239,-.18,.22),0]}>
    <Atmosphere/>
    <Tube points={sync} radius={.09} color="#5A6475"/>
    <Tube points={eventA} radius={.045} color={P.cobalt} opacity={.7}/><Tube points={eventB} radius={.045} color={P.cobalt} opacity={.7}/>
    <ServiceOrb position={[-7,0,0]} color="#20252D" active={ease(frame,5,25)}/>
    <ServiceOrb position={[-4,1,.1]} color={P.orange} active={ease(frame,30,52)}/>
    <ServiceOrb position={[-1.4,.5,0]} color={P.cobalt} active={ease(frame,58,80)}/>
    <ServiceOrb position={[2.1,.9,0]} color={P.gold} active={ease(frame,88,110)} shape="broker"/>
    <ServiceOrb position={[6,.1,0]} color={P.wine} active={ease(frame,112,134)} shape="db"/>
    <ServiceOrb position={[-5.8,-1.6,0]} color={P.green} active={ease(frame,145,170)}/>
    <ServiceOrb position={[7.3,-.9,.1]} color={P.green} active={ease(frame,158,182)}/>
    {[0,.13,.26].map((o,i)=><FlowOrb key={`s${i}`} points={sync} progress={Math.max(0,Math.min(1,syncP-o))} color={i===0?P.orange:P.cobalt} size={i===0?.19:.11}/>) }
    {[0,.15,.3].map((o,i)=><FlowOrb key={`a${i}`} points={eventA} progress={Math.max(0,Math.min(1,asyncP-o))} color={P.cobalt} size={.1}/>) }
    {[0,.12,.24,.36].map((o,i)=><FlowOrb key={`b${i}`} points={eventB} progress={Math.max(0,Math.min(1,asyncP-o))} color={i===0?P.orange:P.cobalt} size={.1}/>) }
    {frame>160&&<FlowOrb points={eventB.slice().reverse() as [number,number,number][]} progress={compensate} color={P.orange} size={.2}/>} 
    {stars.map((p,i)=><mesh key={i} position={p} scale={.45+.45*Math.sin(frame*.04+i)*.5+.45}>
      <sphereGeometry args={[.035+(i%3)*.018,8,8]}/><meshBasicMaterial color={i%9===0?P.orange:'#566071'} transparent opacity={.45}/>
    </mesh>)}
  </group>;
};

export const EventMesh3D: React.FC = () => {
  const frame=useCurrentFrame(); const {width,height}=useVideoConfig();
  const phase=frame<74?'SYNC REQUEST':frame<132?'COMMIT + PUBLISH':frame<174?'ASYNC FAN-OUT':frame<220?'COMPENSATION WAVE':'CONSISTENT END STATE';
  return <AbsoluteFill style={{background:P.bg,overflow:'hidden'}}>
    <ThreeCanvas width={width} height={height} camera={{fov:44,position:[ease(frame,0,239,-.8,.9),2.3,ease(frame,0,239,17.2,14.2)]}} style={{backgroundColor:P.bg}}>
      <EventMeshWorld frame={frame}/>
    </ThreeCanvas>
    <Header3D num="08" name="EVENT MESH" title={<>Один commit. <span style={{color:P.cobalt}}>Много последствий.</span></>} detail="SYNC PATH + ASYNC EVENT FAN-OUT"/>
    <div style={{position:'absolute',left:74,bottom:107,font:`700 26px ${mono}`,color:frame>160&&frame<220?P.orange:P.ink}}>{phase}</div>
    <div style={{position:'absolute',right:74,bottom:108,font:`500 16px ${mono}`,color:P.muted}}>order.created → inventory → analytics → notification</div>
    <Footer3D num="08" label="3D EVENT MESH / SAGA + COMPENSATION" status={frame>220?'CONVERGED':frame>160?'COMPENSATING':'EVENTS IN FLIGHT'} statusColor={frame>220?P.green:frame>160?P.orange:P.cobalt}/>
  </AbsoluteFill>;
};
