import React from 'react';
import {Sheet, easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {Note} from '../../shared/architecture/ReplicaNote';
import {Title} from '../../shared/architecture/Title';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {messageLabel, oldBody, newBody} from '../../shared/architecture/chat107';
import {cue, type ShotProps} from './scene';

export const Behind: React.FC = () => <g>
  <Title>Как C догонит остальные реплики?</Title>
  <Note x={420} y={487} host="B" scale={1.2} detail={messageLabel} value={newBody} />
  <Note x={1480} y={487} host="C" scale={1.2} detail={messageLabel} value={oldBody} />
  <text x={1485} y={991} fontSize={53}>Пропустила правку</text>
</g>;

export const Handoff: React.FC<ShotProps> = ({timeMs}) => {
  const stored = timeMs>=cue.keep && timeMs<cue.delivered;
  const p=progress(timeMs,cue.replay,cue.delivered,easing.transform);
  const done=timeMs>=cue.delivered;
  return <g>
    <Title>Hinted handoff</Title>
    <text x={265} y={359} fontSize={55}>Во время записи</text>
    <Note x={283} y={497} host="D" scale={1.15} detail="координатор" />
    <Note x={1640} y={497} host="C" scale={1.15} detail={messageLabel}
      value={done ? newBody : oldBody} offline={timeMs<cue.reconnect}/>
    {stored && <g transform={`translate(${mix(408,1740,p)} ${mix(880,557,p)}) scale(${mix(1,0.64,p)})`}>
      <Sheet x={0} y={0} width={580} height={188}>
        <text x={35} y={67} fontSize={40} fill={ink.muted}>Для C · правка №107</text>
        <text x={35} y={144} fontSize={60} fontWeight={600}>{newBody}</text>
      </Sheet>
    </g>}
    {done && <text x={1640} y={937} fontSize={58}>Правка доставлена</text>}
    {timeMs>=cue.bestEffort && <text x={280} y={1190} fontSize={53} fill={ink.muted}>Повторная доставка возможна, пока хранится hint</text>}
  </g>;
};

const repairRoute:Route = {from:{x:1070,y:984},via:{x:1620,y:955},to:{x:1820,y:705}};
export const ReadRepair: React.FC<ShotProps> = ({timeMs}) => {
  const fixed=timeMs>=cue.fixed;
  return <g>
    <Title>Read repair</Title>
    <text x={293} y={352} fontSize={53}>Читаем №108 · режим BLOCKING</text>
    <Note x={329} y={405} host="B" scale={1.12} detail="чат 42 · №108" value="Ты у метро?"/>
    <Note x={1625} y={405} host="C" scale={1.12} detail="чат 42 · №108" value={fixed ? 'Ты у метро?' : 'Ты где?'}/>
    {timeMs>=cue.mismatch && <g>
      <Note x={555} y={900} host="F" scale={0.98} detail="координатор" value="Ты у метро?"/>
      {timeMs>=cue.sendRepair && <g>
        <RouteLine route={repairRoute}/>
        <Delivery route={repairRoute} timeMs={timeMs} start={cue.sendRepair} duration={cue.fixed-cue.sendRepair}/>
      </g>}
    </g>}
    {timeMs>=cue.scope && <text x={1360} y={1080} fontSize={52}>Исправлена строка №108</text>}
  </g>;
};
