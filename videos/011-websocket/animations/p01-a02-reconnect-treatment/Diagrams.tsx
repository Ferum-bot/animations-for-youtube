import React from 'react';
import {arrive, easing, mix, progress} from '@channel/motion-v2';
import {chapterColors as colors} from '../../shared/chapterColors';
import type {BeatKind} from './beats';

// The diagram takes the lower portion of the left page; coordinates are local to it.
const ink = {stroke: colors.text, strokeWidth: 4, fill: 'none', strokeLinecap: 'round'} as const;
const rail = {...ink, opacity: 0.42};
const Label: React.FC<{x?: number; y: number; middle?: boolean; children: React.ReactNode}> =
  ({x = 0, y, middle, children}) => <text x={x} y={y} textAnchor={middle ? 'middle' : 'start'}
    fontSize={37} fontWeight={620}>{children}</text>;

const Dot: React.FC<{x: number; y: number; opacity?: number}> = ({x, y, opacity = 1}) =>
  <circle cx={x} cy={y} r={13} fill={colors.text} stroke={colors.background} strokeWidth={2.5} opacity={opacity} />;

const Caption: React.FC<{first: string; second?: string}> = ({first, second}) => <g>
  <path d="M0 390 H888" stroke={colors.text} strokeOpacity={0.22} strokeWidth={2} />
  <text y={465} fontSize={40} fontWeight={650}>{first}</text>
  {second && <text y={519} fontSize={37}>{second}</text>}
</g>;

const Intro: React.FC<{ms: number}> = ({ms}) => <g>
  <Label x={444} y={47} middle>Обрыв связи</Label>
  {[135, 444, 753].map((x, i) => <g key={x} opacity={arrive(ms, 260 + i * 120, 420)}>
    <path d={`M444 75 V142 H${x} V244`} {...rail} />
    <Dot x={x} y={244} /><Label x={x} y={320} middle>Клиент {i+1}</Label>
  </g>)}
  <Caption first="Три клиента повторяют запрос" second="в один и тот же момент." />
</g>;

const Retry: React.FC<{ms: number}> = ({ms}) => <g>
  {[[246, 400, 703], [305, 505, 830], [273, 451, 765]].map((xs, i) =>
    <g key={i} transform={`translate(0 ${106*i})`}>
      <Label y={57}>Клиент {i+1}</Label>
      <path d="M195 46 H865 l-14 -9 M865 46 l-14 9" {...rail} />
      {xs.map((x, attempt) => <Dot key={x} x={x} y={46}
        opacity={arrive(ms, 1470 + attempt*1700 + x%70*5, 350)} />)}
    </g>)}
  <text x={864} y={337} fontSize={30} textAnchor="end">Время →</text>
  {ms < 8050 ? <Caption first="Первая попытка — после" second="случайной паузы." /> :
    <Caption first="Backoff + jitter" second="Пауза растёт, попытки разнесены." />}
</g>;

const Resume: React.FC<{ms: number}> = ({ms}) => <g>
  {[41, 42, 43, 44].map((id, i) => {
    const enter = i < 2 ? 1 : arrive(ms, 2890 + 320*i, 440);
    return <g key={id} transform={`translate(${12 + 220*i} ${58 + (1-enter)*24})`} opacity={enter}>
      <rect width={188} height={141} fill={colors.text} fillOpacity={i < 2 ? 0.16 : 1} />
      <text x={94} y={90} textAnchor="middle" fontSize={54} fontWeight={660} fill={i < 2 ? colors.text : colors.background}>#{id}</text>
    </g>;
  })}
  <path d="M12 222 v22 h408 v-22 M452 222 v22 h408 v-22" {...rail} />
  <Label x={216} y={318} middle>Уже получены</Label><Label x={656} y={318} middle>Догрузить</Label>
  <Caption first="Клиент запомнил событие #42." second="Сервер продолжает с #43." />
</g>;

const Budget: React.FC<{ms: number}> = ({ms}) => <g>
  <Label y={57}>Попытки клиента</Label>
  <path d="M15 172 H795 l-15 -10 M795 172 l-15 10" {...rail} />
  {[100, 240, 380].map((x, i) => <Dot key={x} x={x} y={172} opacity={arrive(ms, 300 + 430*i, 250)} />)}
  <path d="M465 101 V245" {...ink} />
  <g opacity={arrive(ms, 1550, 400)}>
    <text x={647} y={139} textAnchor="middle" fontSize={41} fontWeight={670}>Пауза</text>
    <path d="M500 205 v19 h292 v-19" {...rail} />
  </g>
  <Caption first="Лимит попыток исчерпан." second="Следующий повтор подождёт." />
</g>;

const Batches: React.FC<{ms: number}> = ({ms}) => {
  const split = progress(ms, 3320, 5050, easing.transform);
  return <g>
    {[265, 502, 782].map((end, i) => {
      const y = 54 + i*98;
      const x = mix(265, end, split);
      return <g key={end}><Label y={y+12}>Группа {i+1}</Label>
        <path d={`M207 ${y} H864`} {...rail} />
        <Dot x={x} y={y} /><Dot x={x+36} y={y} /></g>;
    })}
    <text x={864} y={337} fontSize={30} textAnchor="end">Время →</text>
    <Caption first="Одна группа закрывается сейчас," second="остальные — после разных пауз." />
  </g>;
};

const Lifetime: React.FC<{ms: number}> = ({ms}) => <g>
  <path d="M600 8 V296" stroke={colors.text} strokeOpacity={0.62} strokeDasharray="6 11" strokeWidth={2} />
  {[454, 662, 788].map((end, i) => {
    const x = mix(600, end, progress(ms, 1550, 2500, easing.transform));
    const y = 54 + i*98;
    return <g key={end}><Label y={y+12}>Сессия {i+1}</Label>
      <path d={`M206 ${y} H${x}`} {...ink}/><Dot x={x} y={y} /></g>;
  })}
  <text x={600} y={343} textAnchor="middle" fontSize={31}>{ms < 6640 ? 'Базовый срок' : '30 минут'}</text>
  <Caption first="У каждой сессии свой срок." second={ms < 6640 ? 'К базовому времени добавляется разброс.' : 'Например, около 30 минут с разбросом.'}/>
</g>;

const Admission: React.FC<{ms: number}> = ({ms}) => <g>
  <Label y={52}>Активные соединения</Label>
  <path d="M10 104 H850" {...ink}/><Dot x={850} y={104}/>
  <g opacity={arrive(ms, 900, 400)}>
    <Label y={231}>Новые подключения</Label>
    <path d="M10 284 H518" {...rail} /><Dot x={mix(50,505,arrive(ms, 1200, 750))} y={284}/>
    <path d="M539 245 V323" {...ink} /><Label x={571} y={298}>Вход закрыт</Label>
  </g>
  <Caption first="При перегрузке можно отказать" second="тем, кто только подключается." />
</g>;

const Notice: React.FC<{ms: number}> = ({ms}) => {
  const done = arrive(ms, 5900, 420);
  return <g>
    <Label x={38} y={89}>Сервер</Label><Label x={702} y={89}>Клиент</Label>
    <path d="M100 129 v83 H761 v-83 m-9 15 9-15 9 15" {...rail} />
    <Dot x={mix(100,761,arrive(ms, 1150, 1000))} y={212} opacity={1-done} />
    <Dot x={mix(100,761,arrive(ms, 6000, 850))} y={212} opacity={done} />
    <g opacity={1-done}><Caption first="«Скоро перезапуск»" /></g>
    <g opacity={done}><Caption first="«Обслуживание завершено»" /></g>
  </g>;
};

const Deploy: React.FC<{ms: number}> = ({ms}) => <g>
  <Label y={70}>Клиент</Label><path d="M157 58 H452" {...ink} /><Dot x={452} y={58} />
  <Label x={488} y={70}>Шлюз</Label>
  <path d="M550 108 V242 H645" {...rail} />
  <Label x={668} y={255}>Логика</Label>
  <g transform="translate(669 283)"><rect width={100} height={54} fill={colors.text}/>
    <text x={50} y={40} textAnchor="middle" fontSize={34} fill={colors.background}>{ms < 11000 ? 'v1' : 'v2'}</text></g>
  <Caption first="При выкладке логики WebSocket" second="между клиентом и шлюзом остаётся открыт."/>
</g>;

const Handoff: React.FC<{ms: number}> = ({ms}) => {
  const move = progress(ms, 3400, 4550, easing.transform);
  const x = mix(225, 680, move);
  return <g>
    <Label x={445} y={50} middle>Клиент</Label>
    <path d={`M445 75 V144 H${x} V229`} {...ink} /><Dot x={x} y={229} />
    <Label x={225} y={307} middle>Старый процесс</Label><Label x={680} y={307} middle>Новый процесс</Label>
    <Caption first="Меняется владелец сокета." second="Для клиента соединение продолжается." />
  </g>;
};

const Cache: React.FC<{ms: number}> = ({ms}) => <g>
  <Label y={65}>Процесс соединений</Label>
  <g transform="translate(560 15)"><rect width={112} height={64} fill={colors.text} />
    <text x={56} y={47} fontSize={40} textAnchor="middle" fill={colors.background}>{ms < 1400 ? 'v1' : 'v2'}</text></g>
  <path d="M176 98 V244 H399" {...rail}/>
  <rect x={400} y={181} width={432} height={125} fill={colors.text} fillOpacity={0.16} />
  <Label x={616} y={258} middle>Внешний кэш</Label>
  <Caption first="После перезапуска процесса" second="кэш уже заполнен." />
</g>;

const illustrations = {
  intro: Intro, retry: Retry, resume: Resume, budget: Budget, batch: Batches, lifetime: Lifetime,
  admission: Admission, notice: Notice, deploy: Deploy, handoff: Handoff, cache: Cache,
} satisfies Record<BeatKind, React.FC<{ms: number}>>;

export const Diagram: React.FC<{kind: BeatKind; ms: number}> = ({kind, ms}) => {
  const Illustration = illustrations[kind];
  return <Illustration ms={ms} />;
};
