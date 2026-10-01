import React from "react";
import { hashingTheme as theme } from "../../shared/theme";
import { Mono } from "../../shared/theory/Typography";
import { progress } from "../../shared/theory/motion";
import { focusedPoint, type Point } from "./attention";
import { elbow, Link, pointOnRoute, Pulse } from "./Connections";
import { migrationCalls, movingKeys, timing } from "./model";

const DirectedLink: React.FC<{
  readonly points: readonly Point[];
  readonly color: string;
  readonly request?: boolean;
}> = ({ points, color, request = false }) => {
  const end = points.at(-1),
    before = points.at(-2);
  if (!end || !before) return null;
  const angle =
    (Math.atan2(end[1] - before[1], end[0] - before[0]) * 180) / Math.PI;
  return (
    <>
      <Link points={points} color={color} muted={request} />
      <path
        d="M-12 -7 L0 0 L-12 7"
        transform={`translate(${end[0]} ${end[1]}) rotate(${angle})`}
        fill="none"
        stroke={color}
        strokeWidth={3}
      />
    </>
  );
};

const RouteLabel: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly color: string;
  readonly children: React.ReactNode;
}> = ({ x, y, width, color, children }) => (
  <g>
    <rect
      x={x - 5}
      y={y - 24}
      width={width}
      height={32}
      fill={theme.background}
    />
    <Mono x={x} y={y} size={21} anchor="start" color={color}>
      {children}
    </Mono>
  </g>
);

const Payload: React.FC<{
  readonly timeMs: number;
  readonly at: number;
  readonly durationMs: number;
  readonly points: readonly Point[];
  readonly label: string;
  readonly color: string;
  readonly width?: number;
}> = ({ timeMs, at, durationMs, points, label, color, width = 60 }) => {
  if (timeMs < at || timeMs > at + durationMs) return null;
  const amount = progress(timeMs, at, durationMs);
  const [x, y] = pointOnRoute(points, amount);
  return (
    <g opacity={Math.min(amount * 8, (1 - amount) * 8, 1)}>
      <rect
        x={x - width / 2}
        y={y - 19}
        width={width}
        height={38}
        fill={theme.background}
        stroke={color}
        strokeWidth={2}
      />
      <Mono x={x} y={y + 8} size={23} color={color}>
        {label}
      </Mono>
    </g>
  );
};

/** Every wallet request originates at router-1; NDJSON returns to that same router. */
export const MigrationFlow: React.FC<{ readonly timeMs: number }> = ({
  timeMs,
}) => {
  const exportCall = migrationCalls.export,
    importCall = migrationCalls.import,
    evictCall = migrationCalls.evict;
  const get = elbow(
    focusedPoint([1402, 505], exportCall.caller, timeMs),
    focusedPoint([1860, 475], exportCall.recipient, timeMs),
    1640,
  );
  const response = elbow(
    focusedPoint([1860, 565], exportCall.recipient, timeMs),
    focusedPoint([1402, 612], exportCall.caller, timeMs),
    1560,
  );
  const post = elbow(
    focusedPoint([1402, 636], importCall.caller, timeMs),
    focusedPoint([1860, 955], importCall.recipient, timeMs),
    1690,
  );
  const evict = elbow(
    focusedPoint([1402, 505], evictCall.caller, timeMs),
    focusedPoint([1860, 475], evictCall.recipient, timeMs),
    1640,
  );
  const migrationOpacity =
    progress(timeMs, timing.migrate, 250) *
    (1 - progress(timeMs, timing.commit - 400, 400));
  const cleanupOpacity =
    progress(timeMs, timing.cleanup, 250) *
    (1 - progress(timeMs, timing.resolved - 400, 400));
  return (
    <>
      <g opacity={migrationOpacity}>
        <DirectedLink points={get} color={theme.signal} request />
        <RouteLabel x={1498} y={457} width={155} color={theme.signal}>
          {exportCall.method} {exportCall.path}
        </RouteLabel>
        <Pulse
          timeMs={timeMs}
          at={timing.exportRequest}
          durationMs={700}
          points={get}
          color={theme.signal}
        />
        <g opacity={progress(timeMs, timing.exportStream, 300)}>
          <DirectedLink points={response} color={theme.signal} />
          <RouteLabel
            x={1580}
            y={(response[0]?.[1] ?? 565) - 18}
            width={176}
            color={theme.signal}
          >
            ответ NDJSON
          </RouteLabel>
          {[...movingKeys, "k₀"].map((key, i) => (
            <Payload
              key={key}
              timeMs={timeMs}
              at={timing.exportStream + i * 500}
              durationMs={1400}
              points={response}
              label={key}
              color={key === "k₀" ? theme.muted : theme.signal}
            />
          ))}
        </g>
        <g opacity={progress(timeMs, timing.importStart, 300)}>
          <DirectedLink points={post} color={theme.success} />
          <RouteLabel x={1460} y={736} width={170} color={theme.success}>
            {importCall.method} {importCall.path}
          </RouteLabel>
          <Payload
            timeMs={timeMs}
            at={timing.importStart}
            durationMs={timing.importArrive - timing.importStart}
            points={post}
            label="k₁…k₃"
            color={theme.success}
            width={106}
          />
        </g>
      </g>
      <g opacity={cleanupOpacity}>
        <DirectedLink points={evict} color={theme.signal} />
        <RouteLabel x={1498} y={457} width={155} color={theme.signal}>
          {evictCall.method} {evictCall.path}
        </RouteLabel>
        <Payload
          timeMs={timeMs}
          at={timing.cleanup + 800}
          durationMs={timing.evict - timing.cleanup - 800}
          points={evict}
          label="k₁…k₃"
          color={theme.signal}
          width={106}
        />
      </g>
    </>
  );
};
