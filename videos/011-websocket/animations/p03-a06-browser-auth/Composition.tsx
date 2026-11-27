import React from 'react';
import {arrive, getV2Theme, SourceImage, useSceneTime, v2Theme, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage, accessAssets} from '../../shared/AccessSourceStage';
import {chapterColors} from '../../shared/chapterColors';
import {overview, passages, type Passage} from './passages';

const syntax = getV2Theme('signal');
const panelWidth = 1460;
const keywords = new Set(['const','new','await','GET','POST']);
const functions = new Set(['WebSocket','URL','fetch','set','send','json','stringify']);

function listing(line: string) {
  // All excerpts are JavaScript or partial HTTP headers. Preserve indentation and quoted literals.
  return (line.match(/"[^"]*"|<[^>]*>|[\w$]+|\s+|./g) ?? []).map((token,i) => {
    const color = token.startsWith('"') || token.startsWith('<') ? syntax.success :
      keywords.has(token) ? syntax.primary : functions.has(token) ? chapterColors.text : undefined;
    return <tspan key={i} fill={color} fontWeight={functions.has(token) ? 700 : undefined}>{token}</tspan>;
  });
}

const SourceAndCode: React.FC<{passage: Passage; timeMs: number}> = ({passage,timeMs}) => {
  const cue = passage.cues.filter(c => c.at <= timeMs).at(-1);
  const lineStep = 68;
  const firstLine = 581 - (passage.code.length - 1) * lineStep / 2;
  return <>
    <a href={passage.url} target="_blank" rel="noreferrer">
      <text x={64} y={100} fontSize={31}>{passage.source}</text>
      <text x={1395} y={100} textAnchor="end" fontSize={27}>{passage.date}</text>
    </a>
    <text x={60} y={208} fontSize={72} fontWeight={690}>{passage.title}</text>
    <rect y={256} width={panelWidth} height={591} fill={v2Theme.surface}/>
    <text x={66} y={325} fontSize={31} fontFamily={v2Theme.fontMono} fill={v2Theme.text} opacity={0.8}>{passage.tab}</text>
    <path d="M64 352 H1396" stroke={v2Theme.line} strokeWidth={2}/>
    {passage.code.map((line,i) => {
      const baseline = firstLine + i * lineStep;
      const active = cue && cue.rows.includes(i);
      return <g key={i} fontFamily={v2Theme.fontMono}>
        {active && <rect x={49} y={baseline-50} width={1362} height={67}
          fill={chapterColors.text} opacity={0.09*arrive(timeMs,cue.at,140)}/>}
        <text x={118} y={baseline} textAnchor="end" fill={v2Theme.muted} fontSize={32}>{i+1}</text>
        <text x={161} y={baseline} fontSize={44} xmlSpace="preserve" fill={v2Theme.text}>{listing(line)}</text>
      </g>;
    })}
    <a href={passage.url} target="_blank" rel="noreferrer">
      <rect y={850} width={panelWidth} height={279} fill="white"/>
      <SourceImage src={`${accessAssets}/browser/${passage.asset}.webp`} x={48} y={864}
        width={1364} height={251}/>
    </a>
    <text x={65} y={1236} fontWeight={620} fontSize={48}>
      {passage.note.map((line,i)=><tspan key={line} x={65} dy={i ? 68 : 0}>{line}</tspan>)}
    </text>
  </>;
};

const Overview = () => <>
  <text x={65} y={164} fontWeight={690} fontSize={70}>Как передать учётные данные</text>
  {overview.map(([label,code],i) => <g key={label} transform={`translate(0 ${235+i*219})`}>
    <path d="M64 0 H1396" stroke={chapterColors.text} opacity={0.25} strokeWidth={2}/>
    <text x={65} y={127} fontWeight={635} fontSize={49}>{label}</text>
    <text x={1395} y={125} textAnchor="end" fontFamily={v2Theme.fontMono} fontSize={39}>{code}</text>
  </g>)}
</>;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const passage = passages.filter(item => item.start <= timeMs).at(-1);
  const overviewOn = timeMs >= 7700 && timeMs < 11000;
  const from = overviewOn ? 7700 : passage?.start ?? 0;
  return <AccessSourceStage {...props} audio="browser-auth" label="WebSocket в браузере · конструктор и аутентификация">
    <g fill={chapterColors.text}>
      <rect y={28} width={panelWidth} height={1384} fill={chapterColors.background}/>
      <g opacity={from === 0 ? 1 : arrive(timeMs,from,160)}>
        {overviewOn ? <Overview/> : passage && <SourceAndCode passage={passage} timeMs={timeMs}/>}
      </g>
    </g>
  </AccessSourceStage>;
};
export default Composition;
