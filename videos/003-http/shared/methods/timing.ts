import anchors from '../../anchors.json';
import catalog from '../../animations/p03-a01-method-catalog/animation.json';
import safe from '../../animations/p03-a02-safe-contract/animation.json';
import putPatch from '../../animations/p03-a03-put-patch/animation.json';
import cors from '../../animations/p03-a04-cors-preflight/animation.json';
export const methodScenes = {
  catalog: {startMs: anchors['p03-method-catalog-start'], durationMs: catalog.durationMs},
  safe: {startMs: anchors['p03-safe-contract-start'], durationMs: safe.durationMs},
  putPatch: {startMs: anchors['p03-put-patch-start'], durationMs: putPatch.durationMs},
  cors: {startMs: anchors['p03-cors-preflight-start'], durationMs: cors.durationMs},
} as const;
type MethodAnchor = Extract<keyof typeof anchors, `p03-${string}`>;
export const cue = (scene: keyof typeof methodScenes, anchor: MethodAnchor): number => anchors[anchor] - methodScenes[scene].startMs;
