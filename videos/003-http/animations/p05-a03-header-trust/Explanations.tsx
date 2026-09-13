import React from 'react';
import {Label, TimedCopy} from '../../shared/HttpDiagram';
import {Caption, DepthPlate, DrawPath, HeaderField, headerTheme as theme, type TimeProps} from '../../shared/headers/Elements';
import {cue} from '../../shared/headers/timing';
import {reveal, shotOpacity} from '../../shared/timing';

const typo = cue('trust', 'p05-typo');
const rules = cue('trust', 'p05-rules');
const untrusted = cue('trust', 'p05-untrusted');
const forgeReferer = cue('trust', 'p05-forge-referer');
const forgeAgent = cue('trust', 'p05-forge-agent');
const proxy = cue('trust', 'p05-proxy');
const verify = cue('trust', 'p05-verify');

export const RefererOrigin: React.FC<TimeProps> = ({timeMs}) => <>
  <g opacity={shotOpacity(timeMs, 0, typo)}>
    <Label x={212} y={495}>КОНТЕКСТ ЗАПРОСА</Label>
    {[{x: 212, path: '/article'}, {x: 855, path: '/next'}].map(({x, path}) => <g key={path}>
      <path d={`M ${x} 645 H ${x + 305} V 876 H ${x} Z M ${x} 704 H ${x + 305}`} stroke={theme.line} strokeWidth={2} fill={theme.surface} />
      <text x={x + 25} y={685} fontFamily={theme.fontMono} fontSize={29} fill={theme.text}>{path}</text>
      <path d={`M ${x + 27} 752 H ${x + 230} M ${x + 27} 786 H ${x + 264} M ${x + 27} 820 H ${x + 187}`} stroke={theme.line} strokeWidth={3} />
    </g>)}
    <DrawPath d="M 542 764 H 825 M 810 754 L 825 764 L 810 774" timeMs={timeMs} startMs={450} />
    <g opacity={reveal(timeMs, 1300)}><HeaderField name="Referer" value="https://site.example/article" y={1010} fontSize={30} accent /></g>
    <Caption opacity={reveal(timeMs, 1900)}>Адрес страницы, с которой перешли</Caption>
  </g>
  <g opacity={shotOpacity(timeMs, typo, rules)}>
    <Label x={212} y={495}>ИСТОРИЧЕСКАЯ ОПЕЧАТКА</Label>
    <text x={212} y={646} fontSize={31} fill={theme.muted}>Английское слово</text>
    {'Referrer'.split('').map((letter, index) => {
      const removal = reveal(timeMs, typo + 1200, 900);
      return <text key={index} x={212 + index * 91 - (index > 4 ? removal * 91 : 0)} y={809 - (index === 4 ? removal * 80 : 0)}
        opacity={index === 4 ? 1 - removal : 1} fontFamily={theme.fontMono} fontSize={142}
        fill={index === 4 ? theme.caution : theme.text}>{letter}</text>;
    })}
    <g opacity={reveal(timeMs, typo + 2200)}>
      <path d="M 212 865 H 845" stroke={theme.primary} strokeWidth={3} />
      <text x={212} y={945} fontSize={37} fill={theme.primary}>Закрепилось как имя HTTP-заголовка</text>
    </g>
    <Caption detail="В реальном запросе поле может отсутствовать" opacity={reveal(timeMs, typo + 2900)}>Referer — именно так</Caption>
  </g>
</>;

/** A replacement fades through a cleared slot, preserving the field name. */
const MutableValue: React.FC<{
  readonly timeMs: number; readonly at: number; readonly y: number;
  readonly before: string; readonly after: string;
}> = ({timeMs, at, y, before, after}) => {
  const changed = timeMs >= at;
  const opacity = changed ? reveal(timeMs, at, 350) : 1 - reveal(timeMs, at - 250, 220);
  return <text x={275} y={y} opacity={opacity} fontFamily={theme.fontMono} fontSize={31} fill={changed ? theme.caution : theme.text}>{changed ? after : before}</text>;
};

export const ClientClaims: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, rules, proxy)}>
  <Label x={212} y={495}>СООБЩИЛ КЛИЕНТ</Label>
  <path d="M 212 557 H 1168 V 923 H 212 Z" fill={theme.surface} stroke={theme.line} strokeWidth={2} />
  <text x={252} y={619} fontFamily={theme.fontMono} fontSize={29} fill={theme.primary}>Referer:</text>
  <MutableValue timeMs={timeMs} at={forgeReferer} y={684} before="https://site.example/article" after="https://other.example/claimed" />
  <path d="M 252 733 H 1128" stroke={theme.line} />
  <text x={252} y={797} fontFamily={theme.fontMono} fontSize={29} fill={theme.primary}>User-Agent:</text>
  <MutableValue timeMs={timeMs} at={forgeAgent} y={861} before="MyClient/2.1" after="AnotherClient/9.0" />
  <g opacity={reveal(timeMs, untrusted)}>
    <path d="M 212 996 H 1168" stroke={theme.line} strokeWidth={2} />
    <text x={212} y={1054} fontFamily={theme.fontMono} fontSize={27} fill={theme.muted}>IP соединения: 203.0.113.42</text>
    <text x={890} y={1054} fontSize={26} fill={theme.text}>Не изменился</text>
  </g>
  <TimedCopy timeMs={timeMs} states={[
    {startMs: rules + 500, text: 'Поля описывают запрос'},
    {startMs: untrusted, text: 'Отправитель управляет значениями'},
    {startMs: forgeReferer, text: 'Указанный источник можно подменить'},
    {startMs: forgeAgent, text: 'Название программы тоже меняется'},
    {startMs: cue('trust', 'p05-claims'), text: 'Это не доказывает личность или страну'},
    {startMs: cue('trust', 'p05-attacks'), text: 'Значение заголовка ≠ доказательство'},
  ]} x={212} y={1200} fontSize={37} />
  <text x={212} y={1252} fontSize={26} fill={theme.muted} opacity={reveal(timeMs, untrusted)}>Подтверждение требует отдельной проверки</text>
</g>;

export const TrustBoundary: React.FC<TimeProps> = ({timeMs}) => {
  const intermediary = reveal(timeMs, proxy + 1300, 800);
  return <g opacity={reveal(timeMs, proxy)}>
    <Label x={212} y={495}>КТО ПОДТВЕРДИЛ ДАННЫЕ?</Label>
    <path d="M 346 776 H 1045" stroke={theme.line} strokeWidth={3} />
    <DepthPlate x={212} y={696} width={238} height={160} depth={0.4}>
      <text x={24} y={67} fontSize={34} fill={theme.text}>Клиент</text>
      <text x={24} y={121} fontFamily={theme.fontMono} fontSize={24} fill={theme.caution}>Referer / UA</text>
    </DepthPlate>
    <g opacity={intermediary} transform={`translate(0 ${-80 * (1 - intermediary)})`}>
      <DepthPlate x={570} y={696} width={238} height={160} depth={0.4} selected>
        <text x={24} y={67} fontSize={32} fill={theme.text}>CDN / proxy</text>
        <text x={24} y={121} fontSize={27} fill={theme.muted}>Проверки</text>
      </DepthPlate>
    </g>
    <DepthPlate x={920} y={696} width={238} height={160} depth={0.4}>
      <text x={24} y={67} fontSize={34} fill={theme.text}>Сервер</text>
      <text x={24} y={121} fontSize={27} fill={theme.muted}>Решение</text>
    </DepthPlate>
    <g opacity={reveal(timeMs, proxy + 3000)}>
      <path d="M 520 591 V 1028" stroke={theme.primary} strokeWidth={2} strokeDasharray="6 10" />
      <text x={212} y={985} fontSize={28} fill={theme.caution}>Данные клиента</text>
      <text x={570} y={985} fontSize={28} fill={theme.text}>Проверка источника и полномочий</text>
    </g>
    <Caption detail="Посредник может фильтровать запросы" opacity={reveal(timeMs, proxy + 3800)}>Заявленные данные требуют проверки</Caption>
    <g opacity={reveal(timeMs, verify)}>
      <path d="M 212 1098 H 1168" stroke={theme.line} />
      <text x={570} y={1080} fontFamily={theme.fontMono} fontSize={24} fill={theme.primary}>ДОВЕРИЕ ≠ НАЛИЧИЕ CDN</text>
    </g>
  </g>;
};
