import React from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, presence, PresenterPreview, SceneStage, SourceImage, useSceneTime, v2Theme,
  type PreviewProps} from '@channel/motion-v2';

const cover = 'assets/010-binance/stock-exchange-promo/youtube-card.png';
const previewDir = 'generated/010-binance';
const firstMentionEnds = 4680;
const invitationStarts = 39460 - 9360;

// Keep the actual thumbnail and runtime. The watch-progress line and feed metadata
// are outside the crop. Both layouts use the same source rectangle.
const Cover: React.FC<{width: number; x: number; y: number}> = ({width, x, y}) =>
  <svg x={x} y={y} width={width} height={width * 464 / 840} viewBox="28 16 840 464" overflow="hidden">
    <SourceImage src={cover} x={0} y={0} width={888} height={622}/>
  </svg>;

const YouTubeByline: React.FC = () => <g>
  <path fill="#FF0033" d="M28 0C8 0 5 1 2.5 4.5C0 8 0 14 0 20s0 12 2.5 15.5C5 39 8 40 28 40s23-1 25.5-4.5C56 32 56 26 56 20S56 8 53.5 4.5C51 1 48 0 28 0Z"/>
  <path fill="white" d="M23 11.5 38 20 23 28.5Z"/>
  <text x={68} y={33} fontSize={36} fontWeight={750} letterSpacing={-1.5}>YouTube</text>
  <text x={230} y={32} fontSize={30} fill={v2Theme.text} opacity={0.76}>Матвей Попов</text>
</g>;

// One slow expansion and return, then a short hold before the next beat.
const invitationScale = (elapsedMs: number) => {
  const phase = Math.min((Math.max(0, elapsedMs - 420) % 1900) / 1420, 1);
  return 1 + 0.047 * (1 - Math.cos(phase * 2 * Math.PI)) / 2;
};

const PromoCard: React.FC<{invitation: boolean; elapsedMs: number}> = ({invitation, elapsedMs}) => {
  const height = invitation ? 426 : 724;
  const scale = invitation ? invitationScale(elapsedMs) : 1;
  const rise = (1 - arrive(elapsedMs, 0, 420)) * 24;
  return <g transform={`translate(98 ${1336 + rise}) scale(${scale}) translate(0 ${-height})`}>
    <rect width={invitation ? 1540 : 918} height={height} rx={20} fill={v2Theme.background}/>
    <Cover x={invitation ? 22 : 12} y={invitation ? 20 : 12} width={invitation ? 698 : 894}/>
    <g transform={invitation ? 'translate(761 40)' : 'translate(36 522)'}>
      <YouTubeByline/>
      <text y={invitation ? 150 : 105} fontSize={invitation ? 71 : 59} fontWeight={650}>
        <tspan x={0}>Проектируем</tspan>
        <tspan x={0} dy={invitation ? 79 : 65}>фондовую биржу</tspan>
      </text>
      {invitation && <g transform="translate(0 281)" opacity={arrive(elapsedMs, 420, 300)}>
        <rect width={358} height={72} rx={36} fill={v2Theme.text}/>
        <path d="M30 22 L30 50 L52 36 Z" fill={v2Theme.background}/>
        <text x={72} y={47} fontSize={30} fontWeight={650} fill={v2Theme.background}>Смотреть выпуск</text>
      </g>}
    </g>
  </g>;
};

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const invitation = timeMs >= invitationStarts;
  const start = invitation ? invitationStarts : 0;
  const opacity = presence(timeMs, start, invitation ? endMs : firstMentionEnds, 350);
  const media = {
    photoSrc: `${previewDir}/${invitation ? 'stock-exchange-invite' : 'stock-exchange-promo'}.jpg`,
    audioSrc: `${previewDir}/stock-exchange-promo.mp3`,
  };
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Выпуск о фондовой бирже" opacity={opacity}>
      <PromoCard invitation={invitation} elapsedMs={timeMs - start}/>
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
