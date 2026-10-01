import React from "react";
import { hashingTheme as theme } from "../../shared/theme";
import { progress } from "../../shared/theory/motion";
import type { Point } from "./attention";

export const elbow = (from: Point, to: Point, viaX: number): readonly Point[] => [
  from,
  [viaX, from[1]],
  [viaX, to[1]],
  to,
];

const pathOf = (points: readonly Point[]): string =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
export const pointOnRoute = (
  points: readonly Point[],
  amount: number,
): Point => {
  const lengths = points.slice(1).map((p, i) => {
    const prior = points[i] ?? p;
    return Math.hypot(p[0] - prior[0], p[1] - prior[1]);
  });
  let remaining = lengths.reduce((a, b) => a + b, 0) * amount;
  for (let i = 0; i < lengths.length; i++) {
    const length = lengths[i] ?? 0;
    const a = points[i];
    const b = points[i + 1];
    if (a && b && remaining <= length) {
      const t = length === 0 ? 0 : remaining / length;
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    remaining -= length;
  }
  return points.at(-1) ?? [0, 0];
};

export const Link: React.FC<{
  readonly points: readonly Point[];
  readonly color: string;
  readonly muted?: boolean;
}> = ({ points, color, muted = false }) => (
  <g>
    {/* Insulation separates crossing data routes; crossings are not junctions. */}
    <path
      d={pathOf(points)}
      fill="none"
      stroke={theme.background}
      strokeWidth={16}
      strokeLinejoin="round"
    />
    <path
      d={pathOf(points)}
      fill="none"
      stroke={color}
      strokeWidth={muted ? 2 : 4}
      strokeOpacity={muted ? 0.42 : 0.85}
      strokeLinejoin="round"
      strokeDasharray={muted ? "8 8" : undefined}
    />
    {[points[0], points.at(-1)].map((p, i) =>
      p ? (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={5}
          fill={theme.background}
          stroke={color}
          strokeWidth={2}
        />
      ) : null,
    )}
  </g>
);
export const Pulse: React.FC<{
  readonly points: readonly Point[];
  readonly timeMs: number;
  readonly at: number;
  readonly color: string;
  readonly durationMs?: number;
}> = ({ points, timeMs, at, color, durationMs = 1700 }) => {
  if (timeMs < at || timeMs > at + durationMs) return null;
  const amount = progress(timeMs, at, durationMs);
  const [x, y] = pointOnRoute(points, amount);
  return (
    <g opacity={Math.min(amount * 10, (1 - amount) * 10, 1)}>
      <circle cx={x} cy={y} r={13} fill={color} opacity={0.14} />
      <circle cx={x} cy={y} r={5} fill={color} />
    </g>
  );
};
