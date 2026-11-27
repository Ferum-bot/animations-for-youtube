import React from 'react';
import {arrive, getV2Theme, mix, SourceImage, v2Theme} from '@channel/motion-v2';

const sources = [
  {at: 0, title: 'Что означает успех send()', publisher: 'Linux man-pages · send(2)', date: '29.10.2025',
    url: 'https://man7.org/linux/man-pages/man2/send.2.html#DESCRIPTION', image: 'send',
    width: 790, height: 348, mark: [63,126,578,19], focusAt: 1380,
    original: 'No indication of failure to deliver is implicit in a send().',
    translation: ['Успех send() означает, что ядро приняло байты.', 'Подтверждения доставки клиенту ещё нет.']},
  {at: 11280, title: 'Память за пределами RSS', publisher: 'Linux Kernel · Control Group v2', date: 'просмотрено 27.11.2026',
    url: 'https://docs.kernel.org/admin-guide/cgroup-v2.html#memory-interface-files', image: 'cgroup',
    width: 640, height: 282, mark: [60,108,367,18], focusAt: 300,
    original: 'sock · Amount of memory used in network transmission buffers',
    translation: ['В memory.stat поле sock показывает, сколько', 'памяти занимают сетевые буферы группы.']},
  {at: 16520, title: 'Что делали клиенты в тесте?', publisher: 'Phoenix · The Road to 2 Million Websocket Connections', date: '03.11.2015',
    url: 'https://phoenixframework.org/blog/the-road-to-2-million-websocket-connections', image: 'phoenix',
    width: 640, height: 282, mark: [108,115,194,16], focusAt: 1120,
    original: '<thinktime value="30"/>',
    translation: ['Клиент подписался на канал. Дальше в цикле —', 'тысяча пауз по 30 секунд.']},
] as const;

export function Sources({ms}: {ms: number}) {
  const source = sources.reduce((latest,s) => ms >= s.at ? s : latest, sources[0]);
  const local = ms-source.at;
  const focus = arrive(local, source.focusAt, 650);
  const [x,y,w,h] = source.mark;
  const zoom = mix(1, 1.16, focus);
  // Zoom about the passage while keeping the entire highlighted sentence in view.
  const left = Math.max(0, Math.min(source.width-source.width/zoom, x+w/2-source.width/zoom/2));
  const top = Math.max(0, Math.min(source.height-source.height/zoom, y+h/2-source.height/zoom/2));
  return <a href={source.url} target="_blank" rel="noreferrer" style={{opacity: source.at === 0 ? 1 : arrive(local,0,170)}}>
    <text x={76} y={109} fontSize={33}>{source.publisher}</text>
    <text x={1384} y={109} fontSize={29} textAnchor="end">{source.date}</text>
    <text x={72} y={238} fontSize={77} fontWeight={710} letterSpacing={-2}>{source.title}</text>
    <svg x={0} y={300} width={1460} height={644} overflow="hidden"
      viewBox={`${left} ${top} ${source.width/zoom} ${source.height/zoom}`}>
      <SourceImage x={0} y={0} width={source.width} height={source.height}
        src={`assets/011-websocket/memory/${source.image}.webp`}/>
      <rect x={x-3} y={y-2} width={(w+6)*focus} height={h+4} fill={getV2Theme('signal').primary} opacity={0.35}/>
    </svg>
    <text x={75} y={1064} fontSize={41} fontFamily={source.image==='phoenix' ? v2Theme.fontMono : undefined}>{source.original}</text>
    <text x={72} fontSize={53} fontWeight={650}>
      {source.translation.map((line,i)=><tspan key={line} x={72} y={1191+i*74}>{line}</tspan>)}
    </text>
  </a>;
}
