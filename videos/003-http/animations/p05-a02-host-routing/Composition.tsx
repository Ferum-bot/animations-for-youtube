import React from 'react';
import {DiagramFrame, Label} from '../../shared/HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {Caption, DepthPlate, DrawPath, HeaderField, headerTheme as theme} from '../../shared/headers/Elements';
import {cue, headerScenes} from '../../shared/headers/timing';
import {flightOpacity, reveal, shotOpacity, useTimeMs} from '../../shared/timing';

const host = cue('host', 'p05-host');
const multiple = cue('host', 'p05-multi-site');
const sites = ['api.example', 'shop.example', 'blog.example'] as const;

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const depth = reveal(timeMs, multiple, 850);
  const selected = reveal(timeMs, multiple + 1750, 850);
  const inputFlight = reveal(timeMs, host + 2000, 950);
  const outputFlight = reveal(timeMs, multiple + 2850, 1000);
  return <NarratedHttpScene {...props} {...headerScenes.host}>
    <HttpSceneHeading title="ОДИН IP. НЕСКОЛЬКО САЙТОВ" eyebrow="HTTP / HOST" fontSize={60} />
    <DiagramFrame timeMs={timeMs} />
    <g opacity={shotOpacity(timeMs, 0, host)}>
      <Label x={212} y={520}>ТРИ ЗАГОЛОВКА КРУПНЫМ ПЛАНОМ</Label>
      {['Host', 'Referer', 'Upgrade'].map((name, index) => <g key={name} opacity={reveal(timeMs, 250 + index * 220)}>
        <text x={212} y={720 + index * 145} fontFamily={theme.fontMono} fontSize={34} fill={theme.muted}>0{index + 1}</text>
        <text x={320} y={720 + index * 145} fontFamily={theme.fontMono} fontSize={75} fill={index === 0 ? theme.primary : theme.text}>{name}</text>
      </g>)}
    </g>
    <g opacity={reveal(timeMs, host)}>
      <Label x={212} y={495}>HTTP/1.1 / ВЫБОР ЦЕЛЕВОГО САЙТА</Label>
      <HeaderField name="Host" value="shop.example" y={585} fontSize={48} accent />
      <g opacity={reveal(timeMs, host + 700)}>
        <DepthPlate x={212} y={800} width={240} height={156} depth={depth * 0.45}>
          <text x={26} y={59} fontFamily={theme.fontMono} fontSize={30} fill={theme.text}>GET /</text>
          <text x={26} y={115} fontSize={29} fill={theme.muted}>Запрос</text>
        </DepthPlate>
        <path d="M 470 860 H 650" stroke={theme.line} strokeWidth={3} />
        <g transform={`translate(${470 + inputFlight * 180} 860)`} opacity={flightOpacity(timeMs, host + 2000, 1200)}>
          <path d="M -12 -8 H 12 V 8 H -12 Z" fill={theme.primary} />
        </g>
        <text x={576} y={657} fontFamily={theme.fontMono} fontSize={30} fill={theme.muted}>203.0.113.10</text>
        <text x={576} y={705} fontSize={26} fill={theme.muted}>Один сервер</text>
        <g opacity={1 - depth}>
          <path d="M 650 860 H 820" stroke={theme.line} strokeWidth={3} />
          <DepthPlate x={820} y={770} width={310} height={200} depth={0.4}>
            <text x={24} y={69} fontFamily={theme.fontMono} fontSize={32} fill={theme.text}>HTTP server</text>
            <path d="M 24 101 H 286 M 24 130 H 286 M 24 159 H 286" stroke={theme.line} strokeWidth={2} />
            <path d="M 24 101 H 43 M 24 130 H 43 M 24 159 H 43" stroke={theme.primary} strokeWidth={3} />
          </DepthPlate>
        </g>
      </g>
      <g opacity={reveal(timeMs, multiple, 600)}>
        <path d="M 650 860 V 772 H 820 M 650 860 V 923 H 798 M 650 860 V 1074 H 820" fill="none" stroke={theme.line} strokeWidth={2} />
        {sites.map((name, index) => {
          const active = index === 1 && selected > 0.99;
          const y = 720 + index * 151;
          return <g key={name} transform={`translate(${index === 1 ? -22 * selected : 0} 0)`} opacity={index === 1 ? 1 : 1 - 0.42 * selected}>
            <DepthPlate x={820} y={y} width={310} height={104} depth={depth * (index === 1 ? 1 + selected * 0.3 : 1)} selected={active}>
              <text x={23} y={63} fontFamily={theme.fontMono} fontSize={31} fill={active ? theme.primary : theme.text}>{name}</text>
            </DepthPlate>
          </g>;
        })}
        <g transform={`translate(650 ${772 + selected * 151})`}>
          <path d="M -23 -23 H 23 V 23 H -23 Z" fill={theme.surface} stroke={theme.primary} strokeWidth={2} />
          <path d="M -10 0 H 12 M 3 -8 L 12 0 L 3 8" stroke={theme.primary} strokeWidth={3} fill="none" />
        </g>
        <DrawPath d="M 470 860 H 600 Q 622 860 622 882 V 901 Q 622 923 644 923 H 798" timeMs={timeMs} startMs={multiple + 2650} />
        <g transform={`translate(${674 + outputFlight * 120} 923)`} opacity={flightOpacity(timeMs, multiple + 2850, 1350)}>
          <path d="M -12 -8 H 12 V 8 H -12 Z" fill={theme.primary} />
        </g>
      </g>
      <Caption detail="IP приводит к серверу · Host выбирает сайт" opacity={reveal(timeMs, multiple + 3500)}>Запрос попал в shop.example</Caption>
    </g>
  </NarratedHttpScene>;
};
export default Composition;
