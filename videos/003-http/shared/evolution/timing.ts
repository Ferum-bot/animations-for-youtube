import anchors from '../../anchors.json';
import short from '../../animations/p07-a01-short-connections/animation.json';
import persistent from '../../animations/p07-a02-persistent-connection/animation.json';
import parallel from '../../animations/p07-a03-parallel-connections/animation.json';
import multiplexing from '../../animations/p08-a01-binary-multiplexing/animation.json';
import blocking from '../../animations/p08-a02-tcp-blocking/animation.json';
import quic from '../../animations/p08-a03-quic-streams/animation.json';

export const evolutionScenes = {
  short: {startMs: anchors['p07-a01-short-connections-start'], durationMs: short.durationMs},
  persistent: {startMs: anchors['p07-a02-persistent-connection-start'], durationMs: persistent.durationMs},
  parallel: {startMs: anchors['p07-a03-parallel-connections-start'], durationMs: parallel.durationMs},
  multiplexing: {startMs: anchors['p08-a01-binary-multiplexing-start'], durationMs: multiplexing.durationMs},
  blocking: {startMs: anchors['p08-a02-tcp-blocking-start'], durationMs: blocking.durationMs},
  quic: {startMs: anchors['p08-a03-quic-streams-start'], durationMs: quic.durationMs},
} as const;

type EvolutionCue = Extract<keyof typeof anchors, `p07-evolution-${string}` | `p08-evolution-${string}`>;
export const cue = (scene: keyof typeof evolutionScenes, anchor: EvolutionCue): number =>
  anchors[anchor] - evolutionScenes[scene].startMs;
