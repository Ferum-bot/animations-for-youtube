import React from 'react';
import {Label} from '../../shared/HttpDiagram';
import {StatusMark} from '../../shared/status/StatusMark';
import {cue, shotOpacity} from '../../shared/status/timing';
import {statusTheme as theme} from '../../shared/status/theme';
import {reveal} from '../../shared/timing';

const errors = [
  {code: '400', label: 'Bad Request', caption: 'Неправильный запрос', at: cue('families', 'p04-client-error'), kind: 'request'},
  {code: '403', label: 'Forbidden', caption: 'Доступ запрещён', at: cue('families', 'p04-forbidden'), kind: 'access'},
  {code: '404', label: 'Not Found', caption: 'Ресурс не найден', at: cue('families', 'p04-not-found'), kind: 'missing'},
  {code: '500', label: 'Internal Server Error', caption: 'Ошибка обработки на сервере', at: cue('families', 'p04-server-error'), kind: 'server'},
] as const;

export const Errors: React.FC<{readonly timeMs: number}> = ({timeMs}) => <>
  {errors.map((error, index) => <g key={error.code} opacity={shotOpacity(timeMs, error.at, errors[index + 1]?.at ?? 43000)}>
    <Label x={570} y={535}>{error.kind === 'server' ? 'НА СТОРОНЕ СЕРВЕРА' : 'ЗАПРОС НЕ ВЫПОЛНЕН'}</Label>
    <StatusMark code={error.code} label={error.label} error y={735} />
    <g opacity={reveal(timeMs, error.at + 250, 250)}>
      {error.kind === 'request' ? <>
        <text x={570} y={980} fontFamily={theme.fontMono} fontSize={38} fill={theme.text}>{'{ "id": }'}</text>
        <path d="M 743 1004 H 790" stroke={theme.danger} strokeWidth={5} />
      </> : error.kind === 'access' ? <>
        <path d="M 585 980 H 830 M 855 940 V 1020 M 880 980 H 1135" stroke={theme.line} strokeWidth={3} />
        <path d="M 855 940 V 1020" stroke={theme.danger} strokeWidth={6} />
      </> : error.kind === 'missing' ? <>
        <path d="M 585 946 H 1135 V 1035 H 585 Z" fill="none" stroke={theme.line} strokeWidth={2} strokeDasharray="10 10" />
        <text x={620} y={1002} fontFamily={theme.fontMono} fontSize={31} fill={theme.muted}>/missing</text>
      </> : <>
        <path d="M 585 980 H 785 M 825 980 H 1135" stroke={theme.line} strokeWidth={3} />
        <path d="M 790 965 L 820 995 M 820 965 L 790 995" stroke={theme.danger} strokeWidth={4} />
      </>}
      <text x={570} y={1130} fontSize={31} fill={theme.text}>{error.caption}</text>
    </g>
  </g>)}
</>;
