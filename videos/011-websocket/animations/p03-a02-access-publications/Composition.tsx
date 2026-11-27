import React from 'react';
import {arrive, presence, SourceImage, useSceneTime, v2Theme, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage, accessAssets} from '../../shared/AccessSourceStage';
import {chapterColors as colors} from '../../shared/chapterColors';
import {publications, scenarios} from './publications';

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const scenario = scenarios.filter(item => timeMs >= item.at).at(-1);
  return <AccessSourceStage {...props} label="Публикации о правах доступа в WebSocket" audio="access-publications">
    <g fill={colors.text}>
      <rect y={28} width={1460} height={1384} fill={colors.background}/>
      <text x={68} y={129} fontSize={59} fontWeight={690}>Права доступа в WebSocket</text>
      {publications.map((p,i) => {
        const selected = scenario === scenarios[p.scenario] && scenario !== undefined;
        const tint = Math.max(presence(timeMs,...p.mention,130),selected ? arrive(timeMs,scenario.at,190) : 0);
        return <a key={p.id} href={p.url} target="_blank" rel="noreferrer">
          <g transform={`translate(0 ${188+i*258})`}>
            <rect width={1460} height={256} fill={colors.text}/>
            <rect width={1460} height={256} fill={v2Theme.primary} opacity={0.17*tint}/>
            <SourceImage x={46} y={48} width={328} height={164} fit="cover" src={`${accessAssets}/${p.id}.webp`}/>
            <g fill={v2Theme.background} transform="translate(418 0)">
              <text y={55} fontSize={29} fontWeight={590}>{p.publisher} · {p.date}</text>
              {p.title.map((line,j) => <text key={line} y={119+j*51} fontSize={43} fontWeight={650}>{line}</text>)}
            </g>
          </g>
        </a>;
      })}
      {scenario && <text x={62} y={1335} fontSize={49} fontWeight={640} opacity={arrive(timeMs,scenario.at,180)}>
        {scenario.label}
      </text>}
    </g>
  </AccessSourceStage>;
};
export default Composition;
