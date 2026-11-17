import React from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, codeTheme, PresenterPreview, presence, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';

const media = {
  photoSrc: 'generated/010-binance/portfolio-value.jpg',
  audioSrc: 'generated/010-binance/portfolio-value.mp3',
};

// Coordinates are centers on a shared baseline. Timings follow the spoken walkthrough.
const terms = [
  {x: 465, width: 296, name: 'V', indexed: false, label: 'Стоимость портфеля', startMs: 7280, endMs: 8860},
  {x: 900, width: 308, name: 'cash', indexed: false, label: 'Деньги на счёте', startMs: 8860, endMs: 10480},
  {x: 1240, width: 220, name: 'Σ', indexed: false, label: 'По бумагам', startMs: 10480, endMs: 11800},
  {x: 1595, width: 310, name: 'qty', indexed: true, label: 'Количество', startMs: 11800, endMs: 13420},
  {x: 2080, width: 360, name: 'close', indexed: true, label: 'Цена закрытия', startMs: 13420, endMs: 15080},
] as const;

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const entrance = arrive(timeMs, 0, 320);
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Стоимость портфеля" opacity={presence(timeMs, 0, endMs, 300)}>
      <g transform={`translate(0 ${(1 - entrance) * 12})`}>
        <rect x={214} y={521} width={2132} height={398} rx={8}
          fill={codeTheme.surface} stroke={codeTheme.divider} strokeWidth={2}/>
        <text x={308} y={609} fontSize={43} fontWeight={650} fill={codeTheme.text}>Стоимость портфеля в момент t</text>
        <path d="M308 642H2252" fill="none" stroke={codeTheme.divider} strokeWidth={2}/>
        <g textAnchor="middle" fill={codeTheme.text}>
          {terms.map(({x, width, name, indexed, label, startMs, endMs}) => {
            const emphasis = presence(timeMs, startMs, endMs, 170);
            return <g key={name} transform={`translate(${x} 0)`}>
              <rect x={-width / 2} y={665} width={width} height={140} rx={7}
                fill={codeTheme.selection} opacity={emphasis}/>
              {name === 'Σ' ? <g fontFamily="Georgia, serif">
                <text y={753} fontSize={102}>∑</text>
                <text y={793} fontSize={39} fontStyle="italic">s</text>
              </g> : <text y={763} fontFamily="Georgia, serif" fontSize={84}>
                <tspan fontStyle={name === 'V' ? 'italic' : 'normal'}>{name}</tspan>
                {indexed && <tspan dy={18} fontSize={46} fontStyle="italic">s</tspan>}
                <tspan dy={indexed ? -18 : 0}>(</tspan><tspan fontStyle="italic">t</tspan><tspan>)</tspan>
              </text>}
              <text y={859} fontSize={30} fontWeight={520} fill={codeTheme.line}>{label}</text>
            </g>;
          })}
          <g fontSize={76} fontFamily="Georgia, serif" fill={codeTheme.line}>
            <text x={681} y={759}>=</text>
            <text x={1100} y={759}>+</text>
            <text x={1830} y={759}>·</text>
          </g>
        </g>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
