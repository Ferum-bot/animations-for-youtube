import React from 'react';
import {Sheet, v2Theme as ink} from '@channel/motion-v2';
import {Title} from '../../shared/architecture/Title';
import type {Route} from '../../shared/architecture/Routes';
import {Note, Transit, reverse} from './Drawings';
import {cue, type Host, type ShotProps} from './scene';

const hosts: readonly Host[] = ['A','B','C','D','E','F'];
const left = (i:number) => 975+(i%3)*510;
const top = (i:number) => i<3 ? 408 : 922;
const entry = (i:number):Route => ({from:{x:725,y:745},via:{x:i<3 ? left(i)+195 : 873,y:745},to:i<3 ? {x:left(i)+195,y:top(i)+204} : {x:left(i),y:top(i)+105}});
const fromD = (i:number):Route => ({from:{x:left(3)+200,y:top(3)},via:{x:left(i)+200,y:787},to:{x:left(i)+200,y:top(i)+203}});

export const Cluster: React.FC<ShotProps> = ({timeMs}) => {
  const demo = timeMs >= cue.request && timeMs < cue.choose;
  const local = timeMs >= cue.local;
  const host = local ? (timeMs>=cue.repeat ? 0 : 1) : 3;
  const route = entry(host);
  const start = local ? (host===0 ? cue.repeat : cue.local) : cue.request;
  const active = demo || local;
  return <g>
    <Title>{timeMs < cue.request ? 'Кластер Cassandra' : timeMs < cue.choose ? 'Один запрос' : 'Кто станет координатором?'}</Title>
    <text x={975} y={320} fontSize={53}>Один дата-центр</text>
    {timeMs < cue.request ? <g transform="translate(210 625)">
      <text fontSize={72} fontWeight={650}>{timeMs < cue.copies ? 'Шесть узлов' : 'Чат 42'}</text>
      {timeMs >= cue.rf && <g><text y={157} fontSize={98} fontWeight={650}>RF = 3</text>
        <text y={235} fontSize={44} fill={ink.muted}>Replication factor</text></g>}
    </g> : <g>
      <Sheet x={180} y={650} width={545} height={190}>
        <text x={30} y={82} fontSize={52} fontWeight={600}>Приложение</text>
        <text x={30} y={150} fontSize={43} fill={ink.muted}>{timeMs>=cue.driver ? 'драйвер Cassandra' : 'запрос по чату 42'}</text>
      </Sheet>
      {timeMs >= cue.preferred && timeMs < cue.another && <text x={185} y={964} fontSize={48}>
        <tspan x={185}>Приоритет у локальных</tspan><tspan x={185} dy={67}>реплик чата 42</tspan></text>}
      {timeMs >= cue.another && <text x={180} y={995} fontSize={49}>
        {local ? `Координатор — ${hosts[host]}` : 'Следующий запрос'}</text>}
    </g>}
    {active && <Transit route={route} timeMs={timeMs} start={start} kind="read" />}
    {demo && timeMs>=cue.fan && [0,1,2].map(i => {
      const r=fromD(i);
      return <g key={i}><Transit route={r} timeMs={timeMs} start={cue.fan+i*110} duration={760}/>
        <Transit route={reverse(r)} timeMs={timeMs} start={cue.fan+1050+i*180} duration={680} kind="ack" showLine={false}/></g>;
    })}
    {hosts.map((h,i) => <Note key={h} host={h} x={left(i)} y={top(i)} scale={0.77}
      marked={active && timeMs>=start+1030 && (local || timeMs>=cue.coordinator) && i===host}
      detail={timeMs>=cue.copies && i<3 ? 'чат 42' : undefined}
      value={demo && i===3 && timeMs>=cue.coordinator ? 'координатор' : undefined} />)}
  </g>;
};
