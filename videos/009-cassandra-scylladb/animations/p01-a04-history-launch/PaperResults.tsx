import {easing, progress, arrive, mix, presence, v2Theme as theme, SourceImage} from '@channel/motion-v2';
import React, {useId} from 'react';
import {asset, timing as t, type SceneProps} from './scene';

// Source coordinates are PDF points, not pixels of a particular rasterization.
const page = {width: 595.276, height: 841.89};
const scaleBoxes = [
  {x: 370.79, y: 424, width: 30, height: 11},
  {x: 458.9, y: 424, width: 71, height: 11},
] as const;
const medianBoxes = [{x: 334, y: 496, width: 205, height: 12}] as const;

export const PaperResults: React.FC<SceneProps> = ({timeMs}) => {
  const clipId = useId();
  const blurId = useId();
  const expansion = progress(timeMs, t.expand, t.announcement, easing.transform);
  const width = mix(1080, 2560, expansion);
  const height = mix(1000, 1440, expansion);
  const scale = width / 250;
  const scroll = mix(190, 395, progress(timeMs, t.scrollResults, t.selectScale, easing.transform));
  const latency = timeMs >= t.latency;
  const focus = latency ? arrive(timeMs, t.focusLatency, 280) : presence(timeMs, t.focusScale, t.latency, 250);
  const selection = arrive(timeMs, latency ? t.latency : t.selectScale, 200) * (1 - focus);
  const textScale = mix(1, 1.2, expansion);
  return <g opacity={arrive(timeMs, t.paper, 200)}
    transform={`translate(${mix(100, 0, expansion)} ${mix(210, 0, expansion)})`}>
    <defs>
      <clipPath id={clipId}><rect width={width} height={height} /></clipPath>
      <filter id={blurId}><feGaussianBlur stdDeviation={focus * 2} /></filter>
    </defs>
    <g clipPath={`url(#${clipId})`}>
      <rect width={width} height={height} fill={theme.text} />
      {timeMs < t.results ? <SourceImage src={asset('cassandra-title.jpg')}
        x={-65} y={-70} width={1210} height={1210 * page.height / page.width} /> :
        <g filter={`url(#${blurId})`}>
          <SourceImage src={asset('cassandra-results.jpg')}
            x={-310 * scale} y={-scroll * scale} width={page.width * scale} height={page.height * scale} />
          {(latency ? medianBoxes : scaleBoxes).map(box => <rect key={box.x}
            x={(box.x - 310) * scale} y={(box.y - scroll) * scale}
            width={box.width * scale * selection} height={box.height * scale}
            fill={theme.primary} opacity={0.35} />)}
        </g>}
      <g opacity={focus}>
        <rect width={width} height={height} fill={theme.background} opacity={0.94} />
        <g transform={`translate(${(width - 1080 * textScale) / 2} ${(height - 1000 * textScale) / 2}) scale(${textScale})`}>
          <text x={65} y={125} fontSize={42} fill={theme.muted}>2009 · {latency ? 'Медиана' : 'Inbox Search'}</text>
          {latency ? <>
            <text x={65} y={285} fontSize={42}>Поиск по собеседнику</text>
            <text x={65} y={410} fontSize={100} fontWeight={650}>15,69 мс</text>
            <text x={65} y={590} fontSize={42}>Поиск по словам</text>
            <text x={65} y={715} fontSize={100} fontWeight={650}>18,27 мс</text>
          </> : <>
            <text x={65} y={350} fontSize={118} fontWeight={650}>50+ ТБ</text>
            <text x={65} y={570} fontSize={118} fontWeight={650}>150 узлов</text>
            <g opacity={arrive(timeMs, t.coasts, 250)}>
              <path d="M65 655 H220" stroke={theme.primary} strokeWidth={7} />
              <text x={65} y={760} fontSize={43}>Восток и запад США</text>
            </g>
          </>}
          <text x={65} y={930} fontSize={28} fill={theme.muted}>Lakshman, Malik · Cassandra · § 6.1</text>
        </g>
      </g>
    </g>
  </g>;
};
