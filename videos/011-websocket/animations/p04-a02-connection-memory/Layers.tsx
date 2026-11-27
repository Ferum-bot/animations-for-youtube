import React from 'react';
import {arrive, getV2Theme, mix} from '@channel/motion-v2';
import {chapterColors as colors} from '../../shared/chapterColors';

const layers = [
  {at: 6660, title: 'Ядро Linux', value: '≈ 4 КБ', context: 'Простаивающий сокет · оценка Centrifugo',
    url: 'https://centrifugal.dev/blog/2026/08/17/tuning-idle-connections'},
  {at: 15340, title: 'TLS', value: '53,7 КБ', context: 'OpenSSL 1.1.1w · замер кучи wolfSSL',
    url: 'https://www.wolfssl.com/wolfssl-vs-openssl-heap-usage-comparison/'},
  {at: 21000, title: 'Среда выполнения', value: '2 КБ  /  ≈ 2,6 КБ', context: 'Стек горутины Go / новый процесс Erlang',
    url: 'https://github.com/golang/go/blob/master/src/runtime/stack.go'},
  {at: 26960, title: 'Буферы ввода-вывода', value: '4 КБ + 4 КБ', context: 'Чтение и запись · Gorilla WebSocket',
    url: 'https://pkg.go.dev/github.com/gorilla/websocket#hdr-Buffers'},
  {at: 33580, title: 'Входящая очередь', value: 'до 16 МиБ', context: 'Python websockets 16.0 · asyncio',
    url: 'https://websockets.readthedocs.io/en/16.0/topics/memory.html#websockets-buffers'},
  {at: 37080, title: 'Сжатие', value: 'Контекст DEFLATE', context: 'Размер зависит от настроек сжатия',
    url: 'https://centrifugal.dev/blog/2024/08/19/optimizing-websocket-compression'},
] as const;

// These figures describe separate implementations and are intentionally not summed.
const notes = [
  {at: 0, text: 'Примеры для разных стеков и настроек.'},
  {at: 9720, text: 'Приём · tcp_rmem задаёт предел роста буфера.'},
  {at: 13280, text: 'Отправка · tcp_wmem ограничивает буфер отправки.'},
  {at: 15340, text: 'TLS 1.2 · память на дополнительную сессию в тесте wolfSSL.'},
  {at: 21000, text: 'Go · начальный стек горутины растёт по мере работы.'},
  {at: 24540, text: 'Erlang · 327 слов в примере для 64-битной системы.'},
  {at: 26960, text: 'Без WriteBufferPool буфер записи живёт вместе с соединением.'},
  {at: 33580, text: 'По умолчанию · 16 кадров × до 1 МиБ.'},
  {at: 37080, text: 'Сжатие добавляет рабочие буферы.'},
] as const;

export function Layers({ms}: {ms: number}) {
  const active = layers.reduce((last, layer, i) => layer.at <= ms ? i : last, -1);
  const note = notes.reduce((latest,item)=> ms >= item.at ? item : latest, notes[0]);
  return <>
    <text x={76} y={152} fontSize={77} fontWeight={715} letterSpacing={-2}>Память одного соединения</text>
    {layers.map((layer,i)=>{
      const focus = active===i ? arrive(ms,layer.at,250) : 0;
      return <a key={layer.title} href={layer.url} target="_blank" rel="noreferrer">
        <g transform={`translate(0 ${234+i*165})`}>
          <path d="M76 0 H1384" stroke={colors.text} strokeWidth={2} opacity={0.24}/>
          <rect x={0} y={2} width={1460} height={163} fill={colors.text} opacity={0.085*focus}/>
          <text x={76} y={81} fontSize={44} fontWeight={620}>{layer.title}</text>
          <text x={653} y={81} fontSize={mix(51,59,focus)} fontWeight={690}
            fill={active===i ? getV2Theme('signal').primary : colors.text}>{layer.value}</text>
          <text x={653} y={134} fontSize={32} opacity={0.86}>{layer.context}</text>
        </g>
      </a>;
    })}
    <path d="M76 1225 H1384" stroke={colors.text} strokeWidth={2} opacity={0.35}/>
    <text x={76} y={1333} fontSize={39} fontWeight={590} opacity={arrive(ms,note.at,180)}>{note.text}</text>
  </>;
}
