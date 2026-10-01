import React from "react";
import { hashingTheme as theme } from "../../shared/theme";
import { progress } from "../../shared/theory/motion";
import { routerState, timing } from "./model";

import { focusedPoint, type Point, type AttentionTarget } from "./attention";
import { elbow, Link, Pulse } from "./Connections";

export const Routes: React.FC<{ readonly timeMs: number }> = ({ timeMs }) => {
  const migrationActive = timeMs >= timing.migrate && timeMs < timing.commit;
  const cleanupActive = timeMs >= timing.cleanup && timeMs < timing.resolved;
  const state1 = routerState(timeMs, 1),
    state2 = routerState(timeMs, 2);
  const port = (point: Point, target: AttentionTarget): Point =>
    focusedPoint(point, target, timeMs);
  const controls = [
    elbow(port([574, 672], "coordinator"), port([910, 548], "router1"), 740),
    elbow(port([574, 672], "coordinator"), port([910, 903], "router2"), 740),
  ];
  const reads = [
    elbow(
      port([1402, 548], "router1"),
      state1 === "committed"
        ? port([1860, 955], "newOwner")
        : port([1860, 515], "oldOwners"),
      state1 === "committed" ? 1680 : 1740,
    ),
    elbow(
      port([1402, 903], "router2"),
      state2 === "committed"
        ? port([1860, 1040], "newOwner")
        : port([1860, 605], "oldOwners"),
      state2 === "committed" ? 1760 : 1560,
    ),
  ];
  return (
    <g opacity={progress(timeMs, 2200)}>
      {controls.map((points, i) => (
        <g key={i}>
          <Link points={points} color={theme.primary} muted />
          {[
            timing.prepare + i * 900,
            timing.commit + i * 1200,
            timing.wait + i * 700,
            ...(i === 0 ? [timing.migrate, timing.cleanup] : []),
          ].map((at) => (
            <Pulse
              key={at}
              points={points}
              timeMs={timeMs}
              at={at}
              durationMs={
                at === timing.migrate || at === timing.cleanup ? 600 : 1700
              }
              color={theme.primary}
            />
          ))}
        </g>
      ))}
      {(migrationActive || cleanupActive) && (
        <text
          x={600}
          y={510}
          fill={theme.primary}
          fontFamily={theme.fontMono}
          fontSize={21}
        >
          {cleanupActive ? "POST /migrate/cleanup" : "POST /migrate"}
        </text>
      )}
      {/* Draw router-1 last: its insulated route bridges router-2 during mixed topology. */}
      {[1, 0].map((i) => {
        const points = reads[i];
        if (!points) return null;
        const committed = (i === 0 ? state1 : state2) === "committed";
        const color = committed ? theme.success : theme.primary;
        return (
          <g
            key={i}
            opacity={
              migrationActive || cleanupActive
                ? 0.16
                : timeMs < timing.coordinator
                  ? 0.35
                  : 1
            }
          >
            <Link points={points} color={color} />
            {[
              28000 + i * 1300,
              49500 + i * 2200,
              57000 + i * 2200,
              committed
                ? (i === 0 ? timing.commit1 : timing.commit2) + 800
                : 74500,
            ].map((at) => (
              <Pulse
                key={at}
                points={points}
                timeMs={timeMs}
                at={at}
                color={color}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
};
