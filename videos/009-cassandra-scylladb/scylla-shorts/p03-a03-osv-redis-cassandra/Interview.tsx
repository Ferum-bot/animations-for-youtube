import React from 'react';
import {easing, mix, progress, SourceImage} from '@channel/motion-v2';
import {Quote, type Passage} from '../Quote';
import {archive, cue} from './score';

// Positions on dor-redis.jpg in a 720×690 view of the original capture.
const redis: Passage = {
  label: 'Redis',
  lines: [
    {text: 'we boosted Redis by', x: 507, baseline: 423, width: 86, finalWidth: 665},
    {text: '70%.', x: 110, baseline: 441, width: 20, finalWidth: 157},
  ],
  result: '+70% в тесте команды',
};
const cassandra: Passage = {
  label: 'Cassandra',
  lines: [
    {text: 'there wasn’t an improvement', x: 272, baseline: 441, width: 119, finalWidth: 857},
    {text: 'versus running it on Linux.', x: 393, baseline: 441, width: 112, finalWidth: 777},
  ],
  result: 'На уровне Linux',
};

export function Interview({time}: {time: number}) {
  const scroll = progress(time, cue.scroll, cue.redis-400, easing.transform);
  const scale = mix(2.0, 1.93, scroll);
  const x = mix(-160, -153, scroll);
  const y = mix(405*scale, 813-430*scale, scroll);
  const firstVisible = 1-progress(time, cue.cassandra-650, cue.cassandra, easing.transform);
  return <g>
    <rect width={1080} height={1920} fill="white"/>
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <SourceImage src={archive+'dor-cover.jpg'} x={0} y={-405} width={720} height={405}/>
      <SourceImage src={archive+'dor-redis.jpg'} x={0} y={0} width={720} height={690}/>
    </g>
    <Quote credit="Дор Лаор · Software Engineering Daily" passage={redis} time={time} start={cue.redis} pageX={x} pageY={y} scale={scale} visibility={firstVisible}/>
    {time >= cue.cassandra && <Quote credit="Дор Лаор · Software Engineering Daily" passage={cassandra} time={time} start={cue.cassandra}
      pageX={x} pageY={y} scale={scale} visibility={1}/>}
  </g>;
}
