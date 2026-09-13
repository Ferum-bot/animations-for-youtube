import anchors from '../../anchors.json';
import groups from '../../animations/p05-a01-header-groups/animation.json';
import host from '../../animations/p05-a02-host-routing/animation.json';
import trust from '../../animations/p05-a03-header-trust/animation.json';
import upgrade from '../../animations/p05-a04-protocol-upgrade/animation.json';

export const headerScenes = {
  groups: {startMs: anchors['p05-a01-header-groups-start'], durationMs: groups.durationMs},
  host: {startMs: anchors['p05-a02-host-routing-start'], durationMs: host.durationMs},
  trust: {startMs: anchors['p05-a03-header-trust-start'], durationMs: trust.durationMs},
  upgrade: {startMs: anchors['p05-a04-protocol-upgrade-start'], durationMs: upgrade.durationMs},
} as const;

type HeaderAnchor = Extract<keyof typeof anchors, `p05-${string}`>;
export const cue = (scene: keyof typeof headerScenes, anchor: HeaderAnchor): number =>
  anchors[anchor] - headerScenes[scene].startMs;
