import React from 'react';
import type {HttpSceneProps} from '../../shared/NarratedHttpScene';
import {Label} from '../../shared/HttpDiagram';
import {Caption, httpDetailTheme as theme} from '../../shared/HttpElements';
import {Channel, DataBlock} from '../../shared/evolution/Elements';
import {ResourcePage} from '../../shared/evolution/ResourcePage';
import {EvolutionScene} from '../../shared/evolution/EvolutionScene';
import {cue} from '../../shared/evolution/timing';
import {reveal, useTimeMs} from '../../shared/timing';

const six = cue('parallel', 'p07-evolution-six');
const send = cue('parallel', 'p07-evolution-parallel-send');
const slow = cue('parallel', 'p07-evolution-slow');
const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const fan = reveal(timeMs, six, 1100);
  return <EvolutionScene {...props} scene="parallel" title="НЕСКОЛЬКО СОЕДИНЕНИЙ" eyebrow="HTTP/1.1 / БРАУЗЕР">
    <Label x={212} y={490}>ПАРАЛЛЕЛЬНЫЕ TCP К ОДНОМУ СЕРВЕРУ</Label>
    {[0, 1, 2, 3, 4, 5].map(i => {
      const y = 755 + (i - 2.5) * 86 * fan;
      return <g key={i} opacity={i === 0 ? 1 : fan}>
        <text x={218} y={y + 10} fontFamily={theme.fontMono} fontSize={23} fill={theme.muted}>{String(i + 1).padStart(2, '0')}</text>
        <Channel y={y} from={280} to={820} />
        {i < 3 ? <DataBlock x={310 + 305 * reveal(timeMs, send + i * 700, i === 0 ? 16000 : 2300)} y={y - 27}
          width={172} height={54} label={['hero.jpg', 'style.css', 'icon.svg'][i] ?? ''} fontSize={24}
          active opacity={reveal(timeMs, send + i * 700)} /> : null}
      </g>;
    })}
    <g opacity={fan}>
      <path d="M 842 510 H 855 V 1005 H 842" stroke={theme.muted} strokeWidth={2} fill="none" />
      <ResourcePage x={895} y={700} scale={.69} image={.16 + .42 * reveal(timeMs, slow, 9000)}
        css={.15 + .85 * reveal(timeMs, send + 3000)} icon={.15 + .85 * reveal(timeMs, send + 3700)} />
      <text x={895} y={650} fontSize={25} fill={theme.muted}>Страница</text>
      <text x={895} y={950} fontSize={26} fill={theme.primary} opacity={reveal(timeMs, slow)}>CSS и значок готовы</text>
    </g>
    <Caption opacity={reveal(timeMs, six)} detail="Шесть — типичный лимит браузера, не правило HTTP">
      {timeMs < slow ? 'Ресурсы распределены по соединениям' : 'Картинка ещё идёт. CSS и значок готовы'}
    </Caption>
  </EvolutionScene>;
};
export default Composition;
