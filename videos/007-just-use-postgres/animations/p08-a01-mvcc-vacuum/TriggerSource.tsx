import React from 'react';
import {SourceCamera, type CameraStop} from './SourceCamera';
import {cues, reveal, timing, type SceneProps} from './timing';
import {theme} from './ui';

const sources = {
  headline: {file: 'trigger-headline-3x.png', originY: 0},
  graph: {file: 'trigger-cpu-graph-3x.png', originY: 2400},
  cpu: {file: 'trigger-cpu-quote-3x.png', originY: 3500},
  cause: {file: 'trigger-cause-3x.png', originY: 2200},
  log: {file: 'trigger-vacuum-log-3x.png', originY: 7800},
  ending: {file: 'trigger-ending-3x.png', originY: 8500},
} as const;

type ArticleShot = {
  readonly source: keyof typeof sources;
  readonly id: string; readonly from: number; readonly to: number;
  readonly stops: readonly CameraStop[];
};
// Nearby motion stays within a shot; distant article sections dissolve instead of racing past.
const shots = [
  {id: 'headline', source: 'headline', from: cues.trigger, to: cues.cpu, stops: [
    {at: cues.trigger, x: 130, y: 150, width: 1080},
    {at: cues.trigger + 1600, x: 130, y: 150, width: 1080},
    {at: cues.trigger + 3400, x: 160, y: 175, width: 1020},
  ]},
  {id: 'cpu-graph', source: 'graph', from: cues.cpu, to: cues.cpu + 3200, stops: [
    {at: cues.cpu, x: 230, y: 2750, width: 880},
    {at: cues.cpu + 2600, x: 245, y: 2760, width: 850},
  ]},
  {id: 'cpu-quote', source: 'cpu', from: cues.cpu + 3200, to: cues.graphile, stops: [
    {at: cues.cpu + 3200, x: 220, y: 3780, width: 900},
  ]},
  {id: 'cause', source: 'cause', from: cues.graphile, to: cues.log, stops: [
    {at: cues.graphile, x: 220, y: 2350, width: 900},
    {at: cues.graphile + 2600, x: 220, y: 2350, width: 900},
    {at: cues.graphile + 3600, x: 220, y: 2430, width: 900},
  ]},
  {id: 'vacuum-log', source: 'log', from: cues.log, to: cues.attempts, stops: [
    {at: cues.log, x: 220, y: 8030, width: 900},
    {at: cues.log + 2400, x: 220, y: 8030, width: 900},
    {at: cues.log + 3600, x: 220, y: 8230, width: 900},
  ]},
  {id: 'attempts', source: 'ending', from: cues.attempts, to: cues.failover - 2300, stops: [
    {at: cues.attempts, x: 220, y: 8540, width: 900},
    {at: cues.attempts + 6000, x: 220, y: 8650, width: 900},
  ]},
  {id: 'blocked', source: 'ending', from: cues.failover - 2300, to: cues.failover, stops: [
    {at: cues.failover - 2300, x: 220, y: 8820, width: 900},
  ]},
  {id: 'failover', source: 'ending', from: cues.failover, to: cues.failover + 2600, stops: [
    {at: cues.failover, x: 220, y: 8950, width: 900},
  ]},
  {id: 'recovery', source: 'ending', from: cues.failover + 2600, to: timing.durationMs, stops: [
    {at: cues.failover + 2600, x: 220, y: 8840, width: 900},
  ]},
] satisfies readonly ArticleShot[];

export const TriggerSource: React.FC<SceneProps> = ({timeMs}) => <>
  <div style={{position: 'absolute', left: 32, top: 20, color: theme.text,
    fontFamily: theme.fontSans, fontSize: 32, fontWeight: 600}}>Trigger.dev</div>
  <div style={{position: 'absolute', left: 24, top: 72, width: 1552, height: 804,
    transform: `translateX(${32 * (1 - reveal(timeMs, cues.trigger, 450))}px)`}}>
    {shots.map((shot, index) => {
      const transitionMs = 350;
      if (timeMs < shot.from || timeMs >= shot.to + transitionMs) return null;
      const opacity = index === 0 ? 1 : reveal(timeMs, shot.from, transitionMs);
      const source = sources[shot.source];
      const stops = shot.stops.map(stop => ({...stop, y: stop.y - source.originY}));
      return <div key={shot.id} style={{position: 'absolute', inset: 0, opacity}}>
        <SourceCamera file={source.file} sourceWidth={1440} description="Trigger.dev postmortem: xmin horizon"
          width={1552} height={804} timeMs={Math.min(timeMs, shot.to)} stops={stops} />
      </div>;
    })}
  </div>
</>;
