import React from 'react';
import {arrive, mix, presence} from '../../shared/editorial-v2/motion';
import {illustrationTheme, Sheet, Slip} from './Illustration';
import {PodcastPage} from './PodcastPage';
import {timing as t, type SceneProps} from './scene';

const words = [
  {text: 'Завтра', x: 80, y: 230},
  {text: 'встретимся', x: 460, y: 230},
  {text: 'возле', x: 80, y: 370},
  {text: 'офиса', x: 460, y: 370},
] as const;

/** Ten visible sheets represent ten logical records, never bytes or disk I/O. */
const IndexStack: React.FC<{readonly x: number; readonly timeMs: number; readonly startMs: number; readonly owner: string}> =
  ({x, timeMs, startMs, owner}) => <g>
    <text x={x + 310} y={430} textAnchor="middle" fontSize={54}>{owner}</text>
    {Array.from({length: 10}, (_, i) => <g key={i} opacity={arrive(timeMs, startMs + i * 90, 260)}>
      <Slip x={x + i * 8} y={550 + i * 24} width={600} word={i === 9 ? 'завтра' : ''} messageId={i === 9 ? '#43' : ''} />
    </g>)}
    <text x={x + 350} y={1010} textAnchor="middle" fontSize={58}>10 записей</text>
  </g>;

const TenWords: React.FC<SceneProps> = ({timeMs}) => {
  const both = arrive(timeMs, t.bothUsers, 550);
  return <g opacity={arrive(timeMs, t.tenWords)}>
    <Sheet x={200} y={490} width={590} height={460}>
      <text x={60} y={115} fontSize={40}>Сообщение #43</text>
      <text x={60} y={240} fontSize={64} fontWeight={600}>10 разных</text>
      <text x={60} y={325} fontSize={64} fontWeight={600}>слов</text>
    </Sheet>
    <IndexStack x={mix(1420, 960, both)} timeMs={timeMs} startMs={t.tenWords}
      owner={timeMs >= t.bothUsers ? 'Индекс Анны' : 'Индекс'} />
    <g opacity={both}>
      <IndexStack x={1750} timeMs={timeMs} startMs={t.bothUsers} owner="Индекс Ивана" />
    </g>
  </g>;
};

export const MessageScene: React.FC<SceneProps> = ({timeMs}) => {
  if (timeMs >= t.ownershipQuote) return <PodcastPage timeMs={timeMs} startMs={t.ownershipQuote}
    endMs={t.load} quote="ownership" />;
  const compact = arrive(timeMs, t.tokenize - 600, 600);
  const x = mix(470, 190, compact);
  const y = mix(360, 420, compact);
  const scale = mix(1.6, 1, compact);
  return <g opacity={presence(timeMs, t.example, t.ownershipQuote)}>
    {timeMs >= t.tenWords ? <TenWords timeMs={timeMs} /> : <g>
      <g opacity={arrive(timeMs, t.message)} transform={`translate(${x} ${y}) scale(${scale})`}>
        <Sheet x={0} y={0} width={980} height={510}>
          <g opacity={arrive(timeMs, t.fields)}>
            <text x={80} y={100} fontSize={30} fill={illustrationTheme.muted}>Анна → Иван · 09:41 · #42</text>
          </g>
          {words.map(word => <text key={word.text} x={word.x} y={word.y} fontSize={62} fontWeight={600}>{word.text}</text>)}
        </Sheet>
      </g>
      {words.map((word, i) => {
        const start = t.tokenize + i * 600;
        const progress = arrive(timeMs, start, 700);
        return <g key={word.text} opacity={arrive(timeMs, start, 200)}>
          <Slip x={mix(x + word.x - 28, 1460, progress)} y={mix(y + word.y - 76, 395 + i * 155, progress)}
            width={850} word={word.text.toLowerCase()} />
        </g>;
      })}
      <g opacity={arrive(timeMs, t.tokenize)}>
        <text x={1460} y={310} fontSize={50}>Поисковый индекс</text>
      </g>
    </g>}
  </g>;
};
