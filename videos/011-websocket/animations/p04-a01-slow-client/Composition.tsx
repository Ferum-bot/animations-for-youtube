import React, {useId} from 'react';
import {arrive, easing, getV2Theme, mix, progress, useSceneTime, v2Theme, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage} from '../../shared/AccessSourceStage';
import {chapterColors as colors} from '../../shared/chapterColors';
import {Network} from './Network';
import {cue, headlines} from './story';

function Backlog({time}: {time: number}) {
  const fill = progress(time, cue.buffer, cue.queue-250, easing.transform);
  const queue = arrive(time, cue.queue, 300);
  return <g>
    <text x={92} y={1152} fontSize={35} fontWeight={600}>На сервере · соединение с телефоном</text>
    <g opacity={queue}>
      <text x={92} y={1241} fontSize={41} fontWeight={660}>Очередь приложения</text>
      {Array.from({length: 10}, (_,i) => {
        const at = i < 3 ? cue.queue + i*690 : cue.unbounded + (i-3)*460;
        const entry = arrive(time,at,230);
        return <rect key={at} x={92+i*54} y={1281 + 9*(1-entry)} width={45} height={45}
          fill={i < 3 ? colors.text : v2Theme.signal} opacity={entry}/>;
      })}
      <path d="M684 1304h73m-15-14 15 14-15 14" fill="none" stroke={colors.text} strokeOpacity={0.68} strokeWidth={4}/>
    </g>
    <text x={822} y={1241} fontSize={41} fontWeight={660}>Буфер отправки</text>
    <rect x={822} y={1275} width={527} height={57} rx={3} fill="none" stroke={colors.text} strokeWidth={4}/>
    <rect x={830} y={1283} width={511*fill} height={41} fill={colors.text}/>
  </g>;
}

const captions = [
  {at: 0, first: 'Даже когда клиент молчит,', second: 'открытое соединение занимает память.'},
  {at: cue.send, first: 'Одно обновление уходит всем подписчикам.'},
  {at: cue.slow, first: 'Сервер пишет быстрее, чем телефон читает.'},
  {at: cue.crash, first: 'OOM · У процесса закончилась память.', second: 'Соединение потеряли все его клиенты.'},
  {at: cue.retry, first: 'Клиенты одновременно открывают', second: 'новые соединения на соседнем узле.'},
  {at: cue.neighborCrash, first: 'Если сосед уже под нагрузкой,', second: 'он тоже может упасть.'},
] as const;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const blurId = useId();
  const focus = progress(timeMs, cue.cascade, cue.cascade + 280, easing.transform);
  const titleReveal = arrive(timeMs, cue.cascade + 80, 230);
  const headline = headlines.reduce((prev, next) => timeMs >= next.at ? next : prev, headlines[0]);
  const caption = captions.reduce((prev, next) => timeMs >= next.at ? next : prev, captions[0]);
  const showBuffers = timeMs >= cue.buffer && timeMs < cue.crash;
  return <AccessSourceStage {...props} audio="slow-client" label="Как медленный клиент роняет сервер">
    <g fill={colors.text}>
      <rect width={1460} height={1440} fill={colors.background}/>
      <defs>
        <filter id={blurId} filterUnits="userSpaceOnUse" x={0} y={0} width={1460} height={1440}>
          <feGaussianBlur stdDeviation={16 * focus}/>
        </filter>
      </defs>
      <g filter={focus > 0 ? `url(#${blurId})` : undefined} opacity={mix(1, 0.32, focus)}>
        <text x={92} y={215} fontSize={75} fontWeight={720} letterSpacing={-2}
          opacity={arrive(timeMs, headline.at, 190)}>{headline.title}</text>
        <Network time={timeMs}/>
        <path d="M92 1072H1368" stroke={colors.text} strokeOpacity={0.32} strokeWidth={3}/>
        {showBuffers ? <g opacity={arrive(timeMs,cue.buffer,230)}><Backlog time={timeMs}/></g> :
          <g opacity={arrive(timeMs,caption.at,230)}>
            <text x={92} y={1205} fontSize={50} fontWeight={650}>{caption.first}</text>
            {'second' in caption && <text x={92} y={1279} fontSize={49}>{caption.second}</text>}
          </g>}
      </g>
      {focus > 0 && <g transform={`translate(92 ${mix(12, 0, titleReveal)})`} opacity={titleReveal}>
        <text y={650} fontSize={106} fontWeight={695}>Снова</text>
        <text y={876} fontSize={218} fontWeight={720} letterSpacing={-5}
          fill={getV2Theme('signal').primary}>self-DDoS</text>
      </g>}
    </g>
  </AccessSourceStage>;
};

export default Composition;
