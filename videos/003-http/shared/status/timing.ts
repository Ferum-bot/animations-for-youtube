import anchors from '../../anchors.json';
import families from '../../animations/p04-a01-status-families/animation.json';
import contract from '../../animations/p04-a02-status-contract/animation.json';
import infrastructure from '../../animations/p04-a03-status-infrastructure/animation.json';
export {flightOpacity, shotOpacity} from '../timing';

export const statusScenes = {
  families: {startMs: anchors['p04-a01-status-families-start'], durationMs: families.durationMs},
  contract: {startMs: anchors['p04-a02-status-contract-start'], durationMs: contract.durationMs},
  infrastructure: {startMs: anchors['p04-a03-status-infrastructure-start'], durationMs: infrastructure.durationMs},
} as const;

type StatusAnchor = Extract<keyof typeof anchors, `p04-${string}`>;
export const cue = (scene: keyof typeof statusScenes, anchor: StatusAnchor): number =>
  anchors[anchor] - statusScenes[scene].startMs;
