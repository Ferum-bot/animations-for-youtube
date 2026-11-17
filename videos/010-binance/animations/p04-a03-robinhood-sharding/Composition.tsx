import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, easing, mix, PresenterPreview, presence, productionCanvas, progress, SceneStage,
  SourcePage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {article, decision, options, timing} from './article';

const media = {
  photoSrc: 'generated/010-binance/robinhood-sharding.jpg',
  audioSrc: 'generated/010-binance/robinhood-sharding.mp3',
};

// The screen recording places the camera in the upper-right 26.97% on both axes.
const outsideCamera = 'M0 0 H1869 V389 H2560 V1440 H0 Z';
const sourceInk = '#121212';
const sourcePaper = '#FFFFFF';

const Composition: React.FC<PreviewProps> = (props) => {
  const clip = useId();
  const {timeMs, endMs} = useSceneTime();
  const firstScroll = progress(timeMs, timing.scrollToOptions, timing.scrollToOptions + 1650, easing.transform);
  const secondScroll = progress(timeMs, timing.scrollToDecision, timing.scrollToDecision + 1750, easing.transform);
  const scrollY = mix(mix(-12, 1100, firstScroll), 1830, secondScroll);
  const atDecision = timeMs >= timing.scrollToDecision;
  const selection = atDecision ? arrive(timeMs, timing.sharding, 500)
    : arrive(timeMs, timing.alternatives, 480);
  const quote = progress(timeMs, timing.pullQuote, timing.pullQuote + 650, easing.transform);

  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Статья Robinhood о шардировании PostgreSQL" opacity={presence(timeMs, 0, endMs, 300)}>
      <defs><clipPath id={clip}><path d={outsideCamera}/></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        <rect width={productionCanvas.width} height={productionCanvas.height} fill={sourcePaper}/>
        <SourcePage {...article} scrollY={scrollY} highlights={atDecision ? decision : options}
          selection={selection} highlightOpacity={0.28} blur={quote * 2}/>
        {quote > 0 && <g>
          <rect width={productionCanvas.width} height={productionCanvas.height} fill={sourcePaper} opacity={quote * 0.94}/>
          <g opacity={quote} transform={`translate(0 ${(1 - quote) * 20})`} fill={sourceInk}>
            <text x={370} y={568} fontSize={42} fontWeight={650}>Robinhood · 25 июня 2021</text>
            <text x={366} y={727} fontFamily="Georgia, serif" fontSize={93}>
              <tspan x={366}>We landed on building a sharding</tspan>
              <tspan x={366} dy={115}>system on top of PostgreSQL.</tspan>
            </text>
          </g>
        </g>}
      </g>
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
