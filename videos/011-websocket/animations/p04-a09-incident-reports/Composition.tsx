import React from 'react';
import {arrive, getV2Theme, SourceImage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage} from '../../shared/AccessSourceStage';
import {chapterColors as colors} from '../../shared/chapterColors';
import {discordEpisodes, reports, libraryReports, libraryListStart} from './reports';

const panelWidth = 1460;
const rowHeight = 312;
const textX = 406;
const accent = getV2Theme('signal').primary;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const showLibraries = timeMs >= libraryListStart;
  const visibleReports = showLibraries ? libraryReports : reports;
  return <AccessSourceStage {...props} label="Разборы инцидентов" audio="incident-reports">
    <g fill={colors.text}>
      <rect width={panelWidth} height={1440} fill={colors.background}/>
      <text x={56} y={113} fontSize={72} fontWeight={675}>{showLibraries ? 'Проблемы в библиотеках' : 'Разборы инцидентов'}</text>
      {visibleReports.map((report,index) => {
        const next = visibleReports[index+1];
        const amount = arrive(timeMs,report.at,120)*(next ? 1-arrive(timeMs,next.at,100) : 1);
        const isDiscord = report.url === discordEpisodes[1].url;
        return <g key={report.url} transform={`translate(0 ${162+index*rowHeight})`}>
          <a href={report.url} target="_blank" rel="noreferrer">
            <rect width={panelWidth} height={rowHeight} fill={accent} opacity={amount*0.17}/>
            <path d="M56 0H1404" stroke={colors.text} strokeWidth={2} opacity={0.33}/>
            <svg x={56} y={49} width={316} height={194}>
              <SourceImage src={report.image} x={0} y={0} width={316} height={isDiscord ? 339 : 194} fit="cover"/>
            </svg>
            <text x={textX} y={61} fontSize={39} fontWeight={680} fill={amount>0.25 ? accent : colors.text}>{report.publisher}</text>
            <text x={1404} y={60} textAnchor="end" fontSize={29}>{report.date}</text>
            <foreignObject x={textX} y={87} width={994} height={147}>
              <div style={{fontSize:36,lineHeight:1.14,fontWeight:590,color:colors.text}}>{report.title}</div>
            </foreignObject>
            <text x={textX} y={isDiscord ? 180 : 267} fontSize={34} fontWeight={575}>{report.description}</text>
          </a>
          {isDiscord && <g fontSize={32}>
            {discordEpisodes.map((episode,i)=><a key={episode.url} href={episode.url} target="_blank" rel="noreferrer">
              <title>{episode.title}</title>
              <text x={textX+i*217} y={268} textDecoration="underline">{episode.date}</text>
            </a>)}
          </g>}
        </g>;
      })}
    </g>
  </AccessSourceStage>;
};

export default Composition;
