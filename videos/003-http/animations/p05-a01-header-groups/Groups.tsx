import React from 'react';
import {Label} from '../../shared/HttpDiagram';
import {Caption, DrawPath, HeaderField, headerTheme as theme, type TimeProps} from '../../shared/headers/Elements';
import {cue} from '../../shared/headers/timing';
import {reveal, shotOpacity} from '../../shared/timing';

const catalog = cue('groups', 'p05-catalog');
const accept = cue('groups', 'p05-accept');
const identity = cue('groups', 'p05-identity');
const cookies = cue('groups', 'p05-cookies');
const groups = [
  {title: 'Что принимать', fields: 'Accept · Accept-Encoding · Accept-Language'},
  {title: 'Сведения о клиенте', fields: 'User-Agent'},
  {title: 'Состояние', fields: 'Cookie · Set-Cookie'},
  {title: 'Кэширование', fields: 'Cache-Control · ETag · Last-Modified'},
] as const;

export const Catalog: React.FC<TimeProps> = ({timeMs}) => <>
  <g opacity={shotOpacity(timeMs, 0, catalog)}>
    <Label x={212} y={500}>ФРАГМЕНТ СООБЩЕНИЯ</Label>
    <text x={212} y={608} fontFamily={theme.fontMono} fontSize={37} fill={theme.muted}>GET /article HTTP/1.1</text>
    <g transform={`translate(0 ${-18 * reveal(timeMs, 800, 600)})`}>
      <path d="M 196 661 H 1168 V 761 H 196" fill={theme.surface} />
      <text x={228} y={727} fontFamily={theme.fontMono} fontSize={52} fill={theme.primary}>Accept</text>
      <text x={420} y={727} fontFamily={theme.fontMono} fontSize={52} fill={theme.text}>:</text>
      <text x={468} y={727} fontFamily={theme.fontMono} fontSize={52} fill={theme.text}>application/json</text>
    </g>
    <g opacity={reveal(timeMs, 1300, 350)}>
      <DrawPath d="M 322 773 V 836 H 260" timeMs={timeMs} startMs={1300} />
      <DrawPath d="M 723 773 V 836 H 785" timeMs={timeMs} startMs={1550} />
      <text x={228} y={908} fontSize={36} fill={theme.primary}>Имя</text>
      <text x={785} y={908} fontSize={36} fill={theme.text}>Значение</text>
    </g>
    <Caption detail="Каждое поле уточняет условия обмена" opacity={reveal(timeMs, 2400)}>Параметры HTTP-сообщения</Caption>
  </g>
  <g opacity={shotOpacity(timeMs, catalog, accept)}>
    <Label x={212} y={490}>ОСНОВНЫЕ ГРУППЫ</Label>
    {groups.map(({title, fields}, index) => {
      const progress = reveal(timeMs, catalog + index * 130, 500);
      return <g key={title} opacity={progress} transform={`translate(${18 * (1 - progress)} ${550 + index * 145})`}>
        <text x={212} y={22} fontFamily={theme.fontMono} fontSize={27} fill={theme.primary}>0{index + 1}</text>
        <text x={286} y={22} fontSize={38} fill={theme.text}>{title}</text>
        <text x={286} y={75} fontFamily={theme.fontMono} fontSize={25} fill={theme.muted}>{fields}</text>
        <path d="M 286 107 H 1170" stroke={theme.line} strokeOpacity={0.5} />
      </g>;
    })}
    <Caption opacity={reveal(timeMs, catalog + 1100)}>Четыре задачи — общий формат</Caption>
  </g>
</>;

const preferences = [
  {name: 'Accept', value: 'application/json', answer: 'JSON', offsetMs: 350},
  {name: 'Accept-Encoding', value: 'gzip', answer: 'gzip', offsetMs: 2500},
  {name: 'Accept-Language', value: 'ru', answer: 'русский', offsetMs: 4200},
] as const;

export const Negotiation: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, accept, identity)}>
  <Label x={212} y={495}>01 / ЧТО ПРИНИМАТЬ</Label>
  <text x={212} y={595} fontSize={46} fill={theme.text}>Клиент задаёт предпочтения</text>
  {preferences.map(({name, value, answer, offsetMs}, index) => {
    const at = accept + offsetMs;
    const y = 708 + index * 128;
    return <g key={name} opacity={reveal(timeMs, at, 320)}>
      <HeaderField name={name} value={value} y={y} fontSize={30} accent />
      <DrawPath d={`M 810 ${y - 12} H 930`} timeMs={timeMs} startMs={at + 500} />
      <path d={`M 918 ${y - 21} L 930 ${y - 12} L 918 ${y - 3}`} stroke={theme.primary} fill="none" opacity={reveal(timeMs, at + 1000)} />
      <text x={960} y={y} fontSize={34} fill={theme.text} opacity={reveal(timeMs, at + 1000)}>{answer}</text>
    </g>;
  })}
  <Caption detail="Сервер выбирает доступное представление" opacity={reveal(timeMs, accept + 5900)}>Запрос → согласование → ответ</Caption>
</g>;

export const ClientIdentity: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, identity, cookies)}>
  <Label x={212} y={495}>02 / СВЕДЕНИЯ О КЛИЕНТЕ</Label>
  <text x={212} y={633} fontFamily={theme.fontMono} fontSize={70} fill={theme.primary}>User-Agent</text>
  <path d="M 212 710 H 1168 V 950 H 212 Z" stroke={theme.line} fill={theme.surface} />
  <g opacity={reveal(timeMs, identity + 1600)}>
    <text x={254} y={813} fontFamily={theme.fontMono} fontSize={64} fill={theme.text}>MyClient</text>
    <text x={589} y={813} fontFamily={theme.fontMono} fontSize={64} fill={theme.muted}>/</text>
    <text x={650} y={813} fontFamily={theme.fontMono} fontSize={64} fill={theme.primary}>2.1</text>
    <text x={254} y={899} fontSize={30} fill={theme.muted}>Программа</text>
    <text x={650} y={899} fontSize={30} fill={theme.muted}>Версия</text>
  </g>
  <Caption detail="Значение сообщает сам отправитель" opacity={reveal(timeMs, identity + 3100)}>Клиент представляется серверу</Caption>
</g>;
