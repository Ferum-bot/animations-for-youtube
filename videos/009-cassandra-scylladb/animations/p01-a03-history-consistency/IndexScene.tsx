import React from 'react';
import {arrive, mix, presence} from '../../shared/editorial-v2/motion';
import {illustrationTheme as theme, Magnifier, MessageIcon, Sheet, Slip} from '../../shared/editorial-v2/illustration';
import {timing as t, type SceneProps} from './scene';

const IndexCopy: React.FC<{readonly y: number; readonly label: string; readonly progress: number}> =
  ({y, label, progress}) => <g>
    <text x={1450} y={y - 45} fontSize={44}>{label}</text>
    <Sheet x={1410} y={y} width={760} height={220}>
      <path d="M45 165 L705 165" stroke={theme.muted} opacity={0.35} strokeWidth={3} />
      <g opacity={progress} transform={`translate(0 ${mix(-35, 0, progress)})`}>
        <Slip x={35} y={50} width={680} word="офиса" />
      </g>
    </Sheet>
  </g>;

/** Replica lag resolves first. Rebuilding a missing index entry is a separate example. */
export const IndexScene: React.FC<SceneProps> = ({timeMs}) => {
  const repair = arrive(timeMs, t.repair, 500);
  const rebuild = arrive(timeMs, t.rebuild, 850);
  return <g opacity={presence(timeMs, 0, t.podcast, 250)}>
    <g opacity={arrive(timeMs, 200, 450)}>
      <text x={330} y={465} fontSize={46}>Сообщение #42</text>
      <MessageIcon x={300} y={540} scale={2.35}>
        <text x={38} y={72} fontSize={32} fontWeight={650}>Завтра</text>
        <text x={38} y={126} fontSize={32} fontWeight={650}>у офиса</text>
      </MessageIcon>
    </g>
    <g opacity={1 - repair}>
      <IndexCopy y={395} label="Индекс · копия А" progress={arrive(timeMs, t.firstCopy, 500)} />
      <IndexCopy y={855} label="Индекс · копия Б" progress={arrive(timeMs, t.secondCopy, 500)} />
    </g>
    <g opacity={repair}>
      <IndexCopy y={625} label="Поисковый индекс" progress={0} />
      <g opacity={presence(timeMs, t.missing, t.rebuild + 600, 300)}>
        <Magnifier x={1850} y={785} scale={1.15} />
        <text x={1450} y={1030} fontSize={46}>Не найдено</text>
      </g>
      <g opacity={arrive(timeMs, t.rebuild, 180)}>
        <Slip x={mix(400, 1445, rebuild)} y={mix(825, 675, rebuild)} width={680} word="офиса" />
      </g>
      <path d="M337 1070 Q630 1084 960 1068" stroke={theme.primary} strokeWidth={7}
        fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrive(timeMs, 12800, 500)} />
      <text x={350} y={1140} fontSize={44} opacity={arrive(timeMs, 12800)}>Сообщение сохранено</text>
    </g>
  </g>;
};
