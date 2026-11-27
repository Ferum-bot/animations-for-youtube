import React from 'react';
import {arrive, easing, getV2Theme, mix, progress, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage} from '../../shared/AccessSourceStage';
import {chapterColors as colors} from '../../shared/chapterColors';
import {rows, type LibraryRow} from './rows';

const accent = getV2Theme('signal').primary;
const firstRow = 227;
const rowHeight = 82;
const canvasWidth = 2560;
const left = 108;
const right = canvasWidth-left;
const limitX = 880;
const behaviorX = 1580;

// Cues are local to 18:29.140 in CapCut (18:13.140 in the source WAV).
const Row: React.FC<{row: LibraryRow; index: number; focus: number; ms: number}> = ({row,index,focus,ms}) => {
  const {detail} = row;
  const origin = firstRow + index * rowHeight;
  const y = detail ? mix(origin,detail.top,focus) : origin;
  const emphasis = row.unbounded ? arrive(ms,6160,230)*(1-focus) : 0;
  const instructions = arrive(ms,11220,230);
  const expanded = detail ? arrive(ms,detail.cue+400,230) : 0;
  const labelY = mix(57,106,focus);
  return <g transform={`translate(0 ${y})`} opacity={detail ? 1 : 1-arrive(ms,9520,185)}>
    <rect width={canvasWidth} height={rowHeight} fill={accent} opacity={0.18*emphasis}/>
    <path d={`M${left} 0H${right}`} stroke={colors.text} strokeWidth={2} opacity={0.33}/>
    <text x={left} y={detail ? labelY : 57} fontSize={detail ? mix(48,77,focus) : 48}
      fontWeight={660} fill={expanded > 0 ? accent : colors.text}>{row.name}</text>
    <g opacity={detail ? 1-arrive(ms,9520,185) : 1} fontSize={47}>
      <text x={limitX} y={57} fontWeight={600} fill={emphasis > 0 ? accent : colors.text}>{row.limit}</text>
      <text x={behaviorX} y={57}>{row.behavior}</text>
    </g>
    {detail && <a href={detail.url} target="_blank" rel="noreferrer">
      <g opacity={expanded}>
        <text x={left} y={179} fontSize={43}>{detail.summary}</text>
        <g fontSize={53} fontWeight={650} opacity={instructions}>
          {detail.instruction.map((line,i)=><text key={line} x={limitX} y={105+73*i}>{line}</text>)}
        </g>
        {detail.code && <text x={limitX} y={274} fontSize={49}
          fontFamily={getV2Theme().fontMono} fill={accent} opacity={instructions}>{detail.code}</text>}
        <text x={limitX} y={detail.code ? 380 : 273} fontSize={42}>{detail.note}</text>
      </g>
    </a>}
  </g>;
};

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const focus = progress(timeMs,9660,10180,easing.transform);
  return <AccessSourceStage {...props} label="Лимиты очереди отправки" audio="library-buffers">
    <g fill={colors.text}>
      <rect width={canvasWidth} height={1440} fill={colors.background}/>
      <text x={left} y={118} fontSize={92} fontWeight={680}>Очередь отправки</text>
      <g fontSize={45} fontWeight={620} opacity={1-focus}>
        <text x={left} y={196}>Библиотека</text>
        <text x={limitX} y={196}>По умолчанию</text>
        <text x={behaviorX} y={196}>Что происходит при записи</text>
      </g>
      {rows.map((row,index)=><Row key={row.name} row={row} index={index} focus={focus} ms={timeMs}/>)}
    </g>
  </AccessSourceStage>;
};

export default Composition;
