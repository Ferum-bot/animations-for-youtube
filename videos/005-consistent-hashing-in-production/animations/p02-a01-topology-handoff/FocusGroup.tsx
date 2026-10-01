import React from "react";
import { hashingTheme as theme } from "../../shared/theme";
import {
  changeAt,
  focusAt,
  focusFrames,
  focusTransformAt,
  type AttentionTarget,
} from "./attention";

/** Sustained size emphasis plus a single corner accent when state changes. */
export const Attention: React.FC<{
  readonly target: AttentionTarget;
  readonly timeMs: number;
  readonly children: React.ReactNode;
}> = ({ target, timeMs, children }) => {
  const frame = focusFrames[target];
  const focus = focusAt(timeMs, target);
  const change = changeAt(timeMs, target);
  const { cx, cy, scale, dx, dy } = focusTransformAt(timeMs, target);
  const pad = target === "queue1" || target === "queue2" ? 0 : 8;
  const x = frame.x - pad,
    y = frame.y - pad;
  const w = frame.width + pad * 2,
    h = frame.height + pad * 2;
  const edge = 22;
  const corners = `M${x} ${y + edge} V${y} H${x + edge} M${x + w - edge} ${y} H${x + w} V${y + edge} M${x} ${y + h - edge} V${y + h} H${x + edge} M${x + w - edge} ${y + h} H${x + w} V${y + h - edge}`;
  return (
    <g
      transform={`translate(${cx + dx} ${cy + dy}) scale(${scale}) translate(${-cx} ${-cy})`}
    >
      {children}
      <path
        d={corners}
        fill="none"
        stroke={theme.primary}
        strokeWidth={2}
        opacity={focus * 0.65}
      />
      <path
        d={corners}
        fill="none"
        stroke={theme[change.tone]}
        strokeWidth={4}
        opacity={change.amount}
      />
    </g>
  );
};
