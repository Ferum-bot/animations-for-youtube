import React from 'react';
import {Label} from '../../shared/HttpDiagram';
import {Caption, httpDetailTheme as theme, type TimeProps} from '../../shared/HttpElements';
import {Channel, DataBlock, EndpointLabels, Flight} from '../../shared/evolution/Elements';
import {cue, evolutionScenes} from '../../shared/evolution/timing';
import {reveal, shotOpacity} from '../../shared/timing';

const keep = cue('persistent', 'p07-evolution-persistent');
const reuse = cue('persistent', 'p07-evolution-reuse');
const pipeline = cue('persistent', 'p07-evolution-pipeline');
const savings = cue('persistent', 'p07-evolution-handshake-saving');
const warm = cue('persistent', 'p07-evolution-warm');

export const KeepConnection: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, 0, pipeline)}>
  <Label x={212} y={490}>ПОСТОЯННОЕ СОЕДИНЕНИЕ ПО УМОЛЧАНИЮ</Label>
  <EndpointLabels y={645} />
  <Channel y={805} open={1 - reveal(timeMs, keep - 700, 600) * .28 + reveal(timeMs, keep, 700) * .28} label="TCP / 01" />
  <g opacity={reveal(timeMs, keep)}>
    <path d="M 670 756 V 776 H 685 M 708 756 V 776 H 693 M 685 766 H 693 V 786 H 685 Z" stroke={theme.primary} strokeWidth={2} fill={theme.background} />
    <text x={690} y={916} textAnchor="middle" fontSize={36} fill={theme.primary}>Соединение сохранено</text>
  </g>
  <Flight timeMs={timeMs} startMs={reuse} label="GET /icon" y={805} />
  <Flight timeMs={timeMs} startMs={reuse + 1250} label="200 OK" y={805} from={922} to={302} />
  <Caption opacity={reveal(timeMs, keep)}>Соединение одно. Обменов несколько</Caption>
</g>;

export const OrderedRequests: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, pipeline, savings)}>
  <Label x={212} y={490}>PIPELINING / ВОЗМОЖНОСТЬ HTTP/1.1</Label>
  <EndpointLabels y={600} />
  <Channel y={730} label="ЗАПРОСЫ →" />
  <Channel y={965} label="← ОТВЕТЫ В ТОМ ЖЕ ПОРЯДКЕ" />
  {['GET A', 'GET B', 'GET C'].map((label, i) => <Flight key={label} timeMs={timeMs} startMs={pipeline + 500 + i * 600} durationMs={1750} y={730} label={label} />)}
  {['A', 'B', 'C'].map((label, i) => <Flight key={label} timeMs={timeMs} startMs={pipeline + 3500 + i * 950} durationMs={850} from={922} to={302} y={965} label={label} />)}
  <Caption opacity={reveal(timeMs, pipeline + 1000)} detail="Один TCP; показаны два направления передачи">Ответы идут в порядке запросов</Caption>
</g>;

export const ConnectionSavings: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, savings, evolutionScenes.persistent.durationMs + 330)}>
  <Label x={212} y={490}>МЕНЬШЕ ПОВТОРНОЙ ПОДГОТОВКИ</Label>
  <text x={212} y={600} fontFamily={theme.fontMono} fontSize={30} fill={theme.muted}>Новые TCP</text>
  <text x={212} y={750} fontFamily={theme.fontMono} fontSize={30} fill={theme.primary}>Один TCP</text>
  {[0, 1, 2].map(i => <g key={i} opacity={reveal(timeMs, savings + 300 + i * 300)}>
    <DataBlock x={435 + i * 245} y={566} width={82} label="↔" active />
    <DataBlock x={528 + i * 245} y={566} width={126} label="Данные" fontSize={24} />
    <DataBlock x={i === 0 ? 528 : 680 + (i - 1) * 152} y={716} width={138} label="Данные" fontSize={24} />
  </g>)}
  <DataBlock x={435} y={716} width={82} label="↔" active />
  <g opacity={reveal(timeMs, warm)}>
    <path d="M 240 1000 H 1145 M 240 845 V 1000" stroke={theme.line} strokeWidth={2} />
    <path d="M 255 988 C 290 985 310 935 340 880 L 351 989 C 390 980 413 933 440 880 L 451 989 C 490 980 510 932 540 880" fill="none" stroke={theme.muted} strokeWidth={3} />
    <path d="M 645 988 C 692 987 712 945 750 900 S 830 870 880 870 H 1110" fill="none" stroke={theme.primary} strokeWidth={4} />
    <text x={250} y={1050} fontSize={25} fill={theme.muted}>Повторные старты TCP</text>
    <text x={660} y={1050} fontSize={25} fill={theme.primary}>Продолжение передачи</text>
  </g>
  <Caption detail="Схематично: повторный handshake и старт нового TCP" opacity={reveal(timeMs, savings + 700)}>Не создаём TCP для каждого запроса</Caption>
</g>;
