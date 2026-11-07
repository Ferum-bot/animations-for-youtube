import React from 'react';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
export {Note} from '../../shared/architecture/ReplicaNote';

export const reverse = ({from,to,via}: Route): Route => ({from:to,to:from,via});
export const Transit: React.FC<{
  route:Route; timeMs:number; start:number; duration?:number; kind?:'wal'|'ack'|'read'; showLine?:boolean;
}> = ({route,timeMs,start,duration,kind,showLine=true}) => <g>
  {showLine && <RouteLine route={route} />}
  <Delivery route={route} timeMs={timeMs} start={start} duration={duration} kind={kind} />
</g>;
