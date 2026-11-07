import React from 'react';
import {MessageIcon, Sheet, easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {Title} from '../../shared/architecture/Title';
import {cue, messages, type ShotProps} from './scene';

const Opening: React.FC<ShotProps> = ({timeMs}) => <g>
  <Title>История чата 42</Title>
  {messages.slice(0, 2).reverse().map((m, i) =>
    <MessageIcon key={m.id} x={i ? 1330 : 520} y={i ? 730 : 380} scale={2.2}>
      <text x={30} y={57} fontSize={22} fill={ink.muted}>чат {m.chat}</text>
      <text x={30} y={116} fontSize={32} fontWeight={600}>{m.body}</text>
    </MessageIcon>)}
  {timeMs >= cue.fields - 1600 && <path d="M1396 1014 l220 -2" stroke={ink.primary} strokeWidth={9}
    pathLength={1} strokeDasharray="1" strokeDashoffset={1-progress(timeMs,3500,4000)} />}
</g>;

export const Partition: React.FC<ShotProps> = ({timeMs}) => {
  if (timeMs < cue.fields) return <Opening timeMs={timeMs} />;
  const many = timeMs >= cue.query;
  const grouping = timeMs >= cue.group;
  const title = timeMs >= cue.partition ? 'Partition key' : many ? 'История чата 42' : 'Сообщение';
  return <g>
    <Title>{title}</Title>
    {grouping && [42,17].map((chat,i) => <text key={chat} x={i ? 1430 : 270} y={332}
      fontSize={61} fontWeight={600}>Чат {chat}</text>)}
    {messages.slice(0, many ? messages.length : 1).map((row, index) => {
      const p = progress(timeMs, cue.group + index*65, cue.group + 740 + index*65, easing.transform);
      const slot = messages.slice(0,index).filter(m => m.chat === row.chat).length;
      const x = mix(775, row.chat === 42 ? 270 : 1430, p);
      const y = mix(many ? 365 + 145*index : 585, 390 + 145*slot, p);
      const focus = timeMs >= cue.partition && row.chat === 42;
      const scale = index === 0 ? mix(1.45, 1, progress(timeMs, cue.query - 500, cue.query)) : 1;
      return <g key={row.id} transform={`translate(1280 640) scale(${scale}) translate(-1280 -640)`}>
        {!grouping && index === 0 && <g transform={`translate(${x} ${y-46})`} fontSize={43} fill={ink.muted}>
          <text x={38}>chat_id</text>
          {timeMs >= cue.id && <text x={244}>message_id</text>}
          {timeMs >= cue.body && <text x={563}>text</text>}
        </g>}
        <Sheet x={x} y={y} width={1010} height={110}>
          <text x={40} y={76} fontSize={57} fontWeight={650}>{row.chat}</text>
          {focus && <path d="M36 91 l79 -1" stroke={ink.primary} strokeWidth={8} />}
          {timeMs >= cue.id && <text x={244} y={76} fontSize={52}>{row.id}</text>}
          {timeMs >= cue.body && <text x={563} y={76} fontSize={52}>{row.body}</text>}
        </Sheet>
      </g>;
    })}
    {timeMs >= cue.replicas && <text x={270} y={1150} fontSize={49}>Одна партиция → одни и те же реплики</text>}
  </g>;
};
