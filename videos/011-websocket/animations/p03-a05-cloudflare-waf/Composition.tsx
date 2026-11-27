import React from 'react';
import {arrive, presence, SourceImage, useSceneTime, v2Theme, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage, accessAssets} from '../../shared/AccessSourceStage';
import {chapterColors} from '../../shared/chapterColors';
import {clouds, inspectors, type Source} from './sources';

const detailStart = 6550;
const afterHandshake = 8200;
const inspectionStart = 10140;
const countingStart = 13240;
const panelWidth = 1460;

const SourceList: React.FC<{
  sources: readonly Source[]; title: string; timeMs: number; untilMs: number;
}> = ({sources,title,timeMs,untilMs}) => {
  const rowHeight = 1210 / sources.length;
  return <>
    <text x={65} y={127} fill={chapterColors.text} fontSize={60} fontWeight={680}>{title}</text>
    {sources.map((source,i) => {
      const until = sources[i+1]?.mentionMs ?? untilMs;
      const focus = presence(timeMs,source.mentionMs,until,110);
      const read = arrive(timeMs,source.mentionMs,130);
      const contentY = (rowHeight - 204) / 2;
      return <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
        <g transform={`translate(0 ${177+i*rowHeight})`}>
          <rect width={panelWidth} height={rowHeight-3} fill={chapterColors.text}/>
          <rect width={panelWidth} height={rowHeight-3} fill={chapterColors.background} opacity={0.14*focus}/>
          <g transform={`translate(0 ${contentY})`}>
            <SourceImage src={`${accessAssets}/waf/${source.id}.webp`} x={29} y={13}
              width={352} height={177} fit="contain"/>
            <g transform="translate(410 0)" fill={v2Theme.background}>
              <text y={43} fontSize={43} fontWeight={720}>{source.publisher}</text>
              <text x={1010} y={38} textAnchor="end" fontSize={24} opacity={0.68}>{source.date}</text>
              <text y={83} fontSize={28}>{source.title}</text>
              <foreignObject y={99} width={1030} height={53}>
                <div style={{fontSize:29, lineHeight:'47px', color:v2Theme.background}}>
                  <span style={{backgroundColor:`rgba(255,196,70,${0.11+0.27*read+0.42*focus})`,padding:'3px 5px'}}>
                    {source.quote}
                  </span>
                </div>
              </foreignObject>
              <text y={191} fontSize={31} fontWeight={630}>{source.translation}</text>
            </g>
          </g>
        </g>
      </a>;
    })}
  </>;
};

const GooglePassage: React.FC<{timeMs: number}> = ({timeMs}) => {
  const messages = arrive(timeMs,afterHandshake,180);
  return <a href="https://docs.cloud.google.com/armor/docs/security-policy-overview#websocket"
    target="_blank" rel="noreferrer" style={{fill: chapterColors.text}}>
    <text x={70} y={110} fontSize={38}>Google Cloud Armor · 18 ноября 2026</text>
    <text x={66} y={215} fontSize={67} fontWeight={690}>Security policy overview</text>
    <rect y={282} width={panelWidth} height={640} fill="white"/>
    <svg y={389} width={panelWidth} height={382} viewBox="0 0 716 187">
      <SourceImage src={`${accessAssets}/waf/google-passage.webp`} x={0} y={0} width={716} height={187}/>
      <g fill="#ffc446" opacity={0.48*(1-messages)}>
        <rect x={518.5} y={80.5} width={165.1} height={19}/>
        <rect x={12} y={104.5} width={223} height={19}/>
      </g>
      <rect x={136.2} y={152.5} width={374.5} height={19} fill="#ffc446" opacity={0.48*messages}/>
    </svg>
    <g opacity={Math.max(0,1-2*messages)}>
      <text x={70} y={1045} fontSize={42}>can block a WebSocket channel from being established</text>
      <text x={68} y={1173} fontSize={57} fontWeight={650}>Cloud Armor может заблокировать</text>
      <text x={68} y={1249} fontSize={57} fontWeight={650}>открытие WebSocket-соединения.</text>
    </g>
    <g opacity={Math.max(0,2*messages-1)}>
      <text x={70} y={1045} fontSize={42}>doesn’t evaluate any messages after the first request</text>
      <text x={68} y={1173} fontSize={57} fontWeight={650}>После первого запроса Cloud Armor</text>
      <text x={68} y={1249} fontSize={57} fontWeight={650}>не проверяет сообщения.</text>
    </g>
  </a>;
};

const CountedRequest = () => <a href="https://developers.cloudflare.com/network/websockets/#requests-and-bandwidth-measurement"
  target="_blank" rel="noreferrer" style={{fill: chapterColors.text}}>
  <text x={70} y={106} fontSize={37}>Cloudflare Docs · 14 августа 2026</text>
  <text x={67} y={195} fontSize={66} fontWeight={690}>Как считается соединение</text>
  <svg y={235} width={panelWidth} height={817} viewBox="0 717 670 375" overflow="hidden">
    <SourceImage src={`${accessAssets}/cloudflare-websockets.webp`} x={0} y={0} width={670} height={1092}/>
    <rect x={124.3} y={1059} width={247.5} height={20} fill="#ffc446" opacity={0.46}/>
  </svg>
  <text x={72} y={1150} fontSize={41}>a single long-lived HTTP request</text>
  <text x={69} y={1250} fontSize={52} fontWeight={650}>
    <tspan x={69}>В статистике Cloudflare всё соединение</tspan>
    <tspan x={69} dy={68}>считается одним HTTP-запросом.</tspan>
  </text>
</a>;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const detail = arrive(timeMs,detailStart,230);
  const inspection = arrive(timeMs,inspectionStart,240);
  const counting = arrive(timeMs,countingStart,240);
  return <AccessSourceStage {...props} label="WebSocket и WAF · документация провайдеров" audio="cloudflare-waf">
    <rect y={28} width={panelWidth} height={1384} fill={chapterColors.background}/>
    {detail < 1 && <g opacity={1-detail}>
      <SourceList title="Что проверяет WAF" sources={clouds} timeMs={timeMs} untilMs={detailStart}/>
    </g>}
    {detail > 0 && inspection < 1 && <g opacity={detail*(1-inspection)}>
      <GooglePassage timeMs={timeMs}/>
    </g>}
    {inspection > 0 && counting < 1 && <g opacity={inspection*(1-counting)} transform={`translate(0 ${14*(1-inspection)})`}>
      <SourceList title="Кто проверяет сообщения WebSocket" sources={inspectors} timeMs={timeMs} untilMs={countingStart}/>
    </g>}
    {counting > 0 && <g opacity={counting}><CountedRequest/></g>}
  </AccessSourceStage>;
};

export default Composition;
