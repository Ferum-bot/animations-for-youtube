import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HttpPreviewBackground, type PreviewBackground} from '../HttpStage';
import {palette as p} from './theme';
import {cue, journeyDurationMs, lerp, progress, shotAt} from './timing';
import {reveal} from '../timing';
import {Label} from './Diagram';

export const fullscreenAmount = (time: number): number =>
  progress(time, 'p09-journey-takeover', 2400) * (1 - progress(time, 'p09-journey-return', 2600));

export const JourneyStage: React.FC<{
  time: number;
  background?: PreviewBackground;
  children: React.ReactNode;
}> = ({time, background = 'transparent', children}) => {
  const full = fullscreenAmount(time);
  const opacity = reveal(time, 0, 500) * (1 - reveal(time, journeyDurationMs - 900, 850));
  const solid = lerp(1270, 2700, full),
    end = lerp(1740, 3100, full);
  const mask = `linear-gradient(90deg,#000 ${solid}px,rgba(0,0,0,.8) ${lerp(solid, end, 0.25)}px,rgba(0,0,0,.25) ${lerp(solid, end, 0.65)}px,transparent ${end}px)`;
  return (
    <AbsoluteFill>
      <HttpPreviewBackground background={background} />
      <AbsoluteFill style={{opacity, maskImage: mask, WebkitMaskImage: mask}}>
        <AbsoluteFill style={{background: p.deep}} />
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 45% 52%,${p.surface} 0%,${p.floor} 40%,${p.deep} 80%)`,
          }}
        />
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const JourneyChrome: React.FC<{time: number}> = ({time}) => {
  const shot = shotAt(time),
    full = fullscreenAmount(time);
  const active = time < cue('p09-journey-http2') ? 0 : time < cue('p09-journey-http3') ? 1 : 2;
  return (
    <g>
      <Label x={164} y={102} size={25} color={p.primary} mono>
        ОТ КОДА ДО ПРОВОДА
      </Label>
      <g opacity={full}>
        <Label x={2396} y={102} size={23} anchor="end" mono color={p.muted}>
          ОДИН ЗАПРОС / ТРИ ВЕРСИИ
        </Label>
        <path d="M164 137 H2396" stroke={p.edge} strokeWidth={1} />
      </g>
      <Label x={164} y={219} size={24} mono color={p.muted}>
        {shot.label}
      </Label>
      <Label x={164} y={309} size={68} weight={600}>
        {shot.title}
      </Label>
      <g opacity={full}>
        <path d="M164 1330 H2396" stroke={p.edge} strokeWidth={1} />
        {['HTTP/1.1', 'HTTP/2', 'HTTP/3'].map((name, i) => (
          <g key={name}>
            <circle cx={174 + i * 272} cy={1377} r={4} fill={active === i ? p.primary : p.line} />
            <Label
              x={192 + i * 272}
              y={1386}
              mono
              size={25}
              color={active === i ? p.primary : p.muted}
            >
              {name}
            </Label>
            {active === i ? (
              <path d={`M${164 + i * 272} 1330 h190`} stroke={p.primary} strokeWidth={3} />
            ) : null}
          </g>
        ))}
        <Label x={2396} y={1386} mono size={22} color={p.muted} anchor="end">
          POST /api/events
        </Label>
      </g>
    </g>
  );
};
