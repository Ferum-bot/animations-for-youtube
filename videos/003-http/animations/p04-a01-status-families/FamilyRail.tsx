import React from 'react';
import {statusTheme as theme} from '../../shared/status/theme';
import {reveal} from '../../shared/timing';
import {cue} from '../../shared/status/timing';

const families = [
  {code: '1xx', at: cue('families', 'p04-informational')},
  {code: '2xx', at: cue('families', 'p04-success')},
  {code: '3xx', at: cue('families', 'p04-redirect')},
  {code: '4xx', at: cue('families', 'p04-client-error')},
  {code: '5xx', at: cue('families', 'p04-server-error')},
] as const;

export const FamilyRail: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const active = families.reduce((index, family, i) => timeMs >= family.at ? i : index, -1);
  return <g opacity={reveal(timeMs, 3000, 400)}>
    <path d="M 465 488 V 1200" stroke={theme.line} strokeWidth={2} />
    {families.map((family, index) => {
      const y = 585 + index * 132;
      const selected = active === index;
      return <g key={family.code} opacity={selected ? 1 : 0.34}>
        <text x={212} y={y} fontFamily={theme.fontMono} fontSize={72} fill={selected ? theme.primary : theme.muted}>{family.code}</text>
        {selected ? <path d={`M 432 ${y - 53} V ${y + 10}`} stroke={theme.primary} strokeWidth={5} /> : null}
      </g>;
    })}
  </g>;
};
