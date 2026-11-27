import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, easing, getV2Theme, mix, PresenterPreview, progress, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {chapterColors as colors} from '../../shared/chapterColors';
import {conclusion, cue, notes} from './sequence';

const media = {
  photoSrc: 'assets/011-websocket/reconnect/presenter.jpg',
  audioSrc: 'generated/011-websocket/handshake.m4a',
};
const client = 200;
const proxy = 730;
const server = 1260;
const actors = [
  {x: client, label: 'Браузер'},
  {x: proxy, label: 'HTTP-прокси'},
  {x: server, label: 'Сервер'},
] as const;
const accent = getV2Theme('signal').primary;

type ArrowProps = {from: number; to: number; y: number; amount: number; label?: string; color?: string};
const Arrow: React.FC<ArrowProps> = ({from,to,y,amount,label,color=colors.text}) => {
  const tip = mix(from,to,amount);
  const tail = tip - Math.sign(to-from)*16;
  return <g opacity={Math.min(1,amount*5)} fill={color}>
    {label && <text x={(from+to)/2} y={y-23} textAnchor="middle" fontSize={39} fontWeight={650}>{label}</text>}
    <path d={`M${from} ${y} H${tip} M${tail} ${y-10} L${tip} ${y} L${tail} ${y+10}`}
      stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </g>;
};

const HeaderPair: React.FC<{x: number; y: number; upgrade: number; connection: number}> =
  ({x,y,upgrade,connection}) => <g transform={`translate(${x} ${y})`} fill={accent}
    textAnchor="middle" fontSize={36} fontFamily="Menlo, monospace">
    <text opacity={upgrade}>Upgrade: websocket</text>
    <text y={53} opacity={connection}>Connection: Upgrade</text>
  </g>;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs: ms,endMs} = useSceneTime();
  const blurId = useId();
  const focus = progress(ms,cue.conclusion,cue.conclusion+400,easing.transform);
  const draw = (at: number) => progress(ms, at, at+500, easing.transform);
  const success = arrive(ms, cue.configured, 400);
  const removed = arrive(ms,cue.remove,360);
  const note = notes.filter(item => item.at <= ms).at(-1) ?? notes[0];
  const fade = arrive(ms,0,300) * (1-progress(ms,endMs-480,endMs,easing.transform));
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Рукопожатие WebSocket через HTTP-прокси">
      <g opacity={fade} fill={colors.text}>
        <rect width={1460} height={1440} fill={colors.background}/>
        <defs>
          <filter id={blurId} filterUnits="userSpaceOnUse" x={0} y={0} width={1460} height={1440}>
            <feGaussianBlur stdDeviation={focus*16}/>
          </filter>
        </defs>
        <g filter={focus > 0 ? `url(#${blurId})` : undefined} opacity={mix(1,0.32,focus)}>
          <text x={98} y={152} fontSize={82} fontWeight={720} letterSpacing={-2}>Рукопожатие по шагам</text>
          <text x={102} y={225} fontSize={38} opacity={0.84}>WebSocket через HTTP/1.1</text>
          {actors.map(({x,label}) =>
            <g key={label}>
              <text x={x} y={367} textAnchor="middle" fontSize={50} fontWeight={660}>{label}</text>
              <path d={`M${x} 403 V1048`} stroke={colors.text} strokeWidth={3} strokeDasharray="7 12" opacity={0.32}/>
            </g>)}
          <Arrow from={client} to={proxy} y={484} amount={draw(cue.get)} label="GET"/>
          <HeaderPair x={(client+proxy)/2} y={557} upgrade={arrive(ms,cue.upgrade,330)} connection={arrive(ms,cue.connection,330)}/>
          <g opacity={arrive(ms,cue.hopOnly,300) * (1-arrive(ms,cue.plainGet-450,350))}>
            <text x={995} y={663} textAnchor="middle" fontSize={35}>При пересылке</text>
            <g opacity={mix(1,0.45,removed)}>
              <HeaderPair x={995} y={743} upgrade={1} connection={1}/>
            </g>
            <path d="M788 731 H1202 M781 784 H1209" fill="none" stroke={colors.text} strokeWidth={4}
              pathLength={1} strokeDasharray="1 1" strokeDashoffset={1-removed}/>
          </g>
          <g opacity={1-success}>
            <Arrow from={proxy} to={server} y={677} amount={draw(cue.plainGet)} label="GET"/>
            <text x={(proxy+server)/2} y={750} textAnchor="middle" fontSize={38}
              opacity={arrive(ms,cue.plainGet+280,300)}>Без Upgrade</text>
            <Arrow from={server} to={proxy} y={878} amount={draw(cue.httpResponse)} label="200 или 400"/>
            <Arrow from={proxy} to={client} y={973} amount={draw(cue.failed-520)} label="200 или 400"/>
          </g>
          <g opacity={success}>
            <Arrow from={proxy} to={server} y={677} amount={draw(cue.configured+350)} label="GET"/>
            <HeaderPair x={(proxy+server)/2} y={746} upgrade={arrive(ms,cue.addHeaders,330)}
              connection={arrive(ms,cue.addHeaders+390,330)}/>
            <Arrow from={server} to={proxy} y={878} amount={draw(cue.switching)} label="101 Switching Protocols" color={accent}/>
            <Arrow from={proxy} to={client} y={973} amount={draw(cue.tunnel-550)} label="101 Switching Protocols" color={accent}/>
          </g>
          <path d="M100 1084 H1360" stroke={colors.text} strokeOpacity={0.3} strokeWidth={2}/>
          {note && <g opacity={arrive(ms,note.at,270)}>
            {note.lines.map((line,i) => <text key={line} x={100} y={1188+i*70} fontSize={52} fontWeight={620}>{line}</text>)}
          </g>}
          <g transform="translate(0 1038)">
            {[client,proxy].map((x,i) => {
              const other = i===0 ? proxy : server;
              return <g key={x}>
                <Arrow from={x+10} to={other-10} y={-13} amount={draw(cue.bytes+i*200)} color={accent}/>
                <Arrow from={other-10} to={x+10} y={12} amount={draw(cue.bytes+650+(1-i)*200)} color={accent}/>
              </g>;
            })}
          </g>
        </g>
        {conclusion.map((lines,i) => {
          const first = lines[0];
          const next = conclusion[i+1]?.[0];
          if (!first || ms < first.at || (next && ms >= next.at)) return null;
          const opacity = next ? 1-progress(ms,next.at-140,next.at,easing.transform) : 1;
          return <g key={first.at} opacity={opacity}>
            {lines.map(({at,text,accent: emphasized},j) => {
              const show = arrive(ms,at,270);
              return <text key={text} x={98} y={765+(j-(lines.length-1)/2)*140+mix(12,0,show)}
                fontSize={107} fontWeight={695} letterSpacing={-2}
                fill={emphasized ? accent : colors.text} opacity={show}>{text}</text>;
            })}
          </g>;
        })}
      </g>
    </SceneStage>
  </AbsoluteFill>;
};
export default Composition;
