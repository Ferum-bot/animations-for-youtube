import React, {type CSSProperties} from 'react';
import {Img, staticFile} from 'remotion';
import {SourceCamera, type CameraStop, type SourceFocus} from './SourceCamera';
import {reveal, type SceneProps} from './timing';
import {accent, theme} from './ui';

// Outlines keep the small amount of external copy readable over host footage.
const sourceTextStyle: CSSProperties = {WebkitTextStroke: `4px ${theme.background}`, paintOrder: 'stroke fill'};
const CompanyLabel: React.FC<{readonly children: React.ReactNode}> = ({children}) =>
  <div style={{...sourceTextStyle, position: 'absolute', left: 0, top: -64,
    fontFamily: theme.fontSans, fontSize: 48, fontWeight: 600, color: theme.text}}>{children}</div>;

const solidCamera = [
  {at: 0, x: 0, y: 70, width: 1160}, {at: 1000, x: 0, y: 70, width: 1160},
  {at: 2000, x: 58, y: 1330, width: 850}, {at: 6100, x: 58, y: 1330, width: 850},
  {at: 6600, x: 58, y: 3538, width: 850}, {at: 8400, x: 58, y: 3538, width: 850},
  {at: 9200, x: 58, y: 1330, width: 850},
] satisfies readonly CameraStop[];
// Native source colors only extend the enlarged excerpt's own page surface.
const solidFocus = [
  {from: 2800, to: 6100, x: 477, y: 1421, width: 222, height: 28, zoom: 4.5, pageColor: '#000000'},
  {from: 6650, to: 8400, x: 81, y: 3562, width: 153, height: 28, zoom: 5.8, pageColor: '#000000'},
] satisfies readonly SourceFocus[];
// Pixel coordinates in the 2319×3000 raster of printed report page 12.
const redpandaCamera = [
  {at: 14000, x: 0, y: 160, width: 2319}, {at: 15500, x: 0, y: 160, width: 2319},
  {at: 17500, x: 1620, y: 450, width: 699},
  {at: 21400, x: 1620, y: 450, width: 699},
  {at: 22900, x: 220, y: 410, width: 1850},
] satisfies readonly CameraStop[];

export const IntroSources: React.FC<SceneProps> = ({timeMs}) => {
  if (timeMs < 14000) return <div style={{position: 'absolute', left: 60, top: 145}}>
    <CompanyLabel>37signals</CompanyLabel>
    <SourceCamera file="solid-queue.png" sourceWidth={1440} description="37signals — Solid Queue 1.0 released"
      width={1160} height={860} timeMs={timeMs} stops={solidCamera} focuses={solidFocus} />
    <div style={{...sourceTextStyle, opacity: reveal(timeMs, 8400), marginTop: 34, color: theme.text, fontFamily: theme.fontSans}}>
      <div style={{fontSize: 62, fontWeight: 600}}>20 млн / 86 400 ≈ <span style={{color: accent}}>231</span></div>
      <div style={{fontSize: 34, marginTop: 10}}>задача в секунду в среднем</div>
    </div>
  </div>;
  if (timeMs < 27940) return <div style={{position: 'absolute', left: 60, top: 145, opacity: reveal(timeMs, 14000, 250)}}>
    <CompanyLabel>Redpanda</CompanyLabel>
    <SourceCamera file="redpanda-page-12.png" sourceWidth={2319} description="Redpanda — The State of Streaming Data, page 12"
      width={1160} height={1120} timeMs={timeMs} stops={redpandaCamera} />
  </div>;
  return <div style={{position: 'absolute', left: 60, top: 275, width: 1160, opacity: reveal(timeMs, 27940, 300)}}>
    <Img src={staticFile('assets/007-just-use-postgres/mvcc/sharding.jpg')} style={{width: '100%', display: 'block'}} />
    <div style={{...sourceTextStyle, fontSize: 44, lineHeight: 1.25, marginTop: 28, fontWeight: 600}}>Тебе НЕ НУЖНО Шардирование<br />System Design Basics</div>
  </div>;
};

