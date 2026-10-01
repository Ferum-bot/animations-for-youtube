import React from "react";
import { hashingTheme as theme } from "../../shared/theme";
import { Mono } from "../../shared/theory/Typography";
import { progress, mix } from "../../shared/theory/motion";
import { timing } from "./model";
import { Label } from "./Parts";
import { Attention } from "./FocusGroup";

export const RequestQueues: React.FC<{ readonly timeMs: number }> = ({
  timeMs,
}) => (
  <g opacity={progress(timeMs, timing.barrier, 500)}>
    <path d="M144 1190 H2416" stroke={theme.line} />
    <Label x={144} y={1235} size={24} color={theme.muted}>
      ЗАПИСИ ПЕРЕЕЗЖАЮЩИХ КЛЮЧЕЙ
    </Label>
    <Label x={2416 - 650} y={1235} size={24} color={theme.muted}>
      Остальные ключи обслуживаются как обычно
    </Label>
    {([1, 2] as const).map((router) => {
      const x = router === 1 ? 144 : 1360;
      const releaseAt = router === 1 ? timing.commit1 : timing.commit2;
      const open = progress(timeMs, releaseAt, 500);
      return (
        <Attention
          key={router}
          target={router === 1 ? "queue1" : "queue2"}
          timeMs={timeMs}
        >
          <g transform={`translate(${x} -6)`}>
            <Mono x={0} y={1305} anchor="start" size={26}>
              router-{router}
            </Mono>
            <path d="M190 1296 H1025" stroke={theme.line} strokeWidth={2} />
            {[0, 1, 2].map((i) => {
              const start = releaseAt + 500;
              const p = progress(timeMs, start, 1400);
              return (
                <g key={i} opacity={1 - progress(timeMs, start + 1150, 250)}>
                  <rect
                    x={mix(208 + i * 88, 982, p)}
                    y={1277}
                    width={62}
                    height={38}
                    rx={2}
                    stroke={p > 0 ? theme.success : theme.signal}
                    fill={theme.surface}
                    strokeWidth={2}
                  />
                  <path
                    d={`M${mix(221 + i * 88, 995, p)} 1289 h34 M${mix(221 + i * 88, 995, p)} 1302 h22`}
                    stroke={p > 0 ? theme.success : theme.signal}
                    strokeWidth={2}
                  />
                </g>
              );
            })}
            <g transform={`rotate(${-open * 90} 530 1334)`}>
              <rect
                x={523}
                y={1258}
                width={14}
                height={76}
                fill={open > 0.8 ? theme.success : theme.signal}
              />
              {[0, 1, 2, 3].map((i) => (
                <path
                  key={i}
                  d={`M523 ${1267 + i * 17} l14 9`}
                  stroke={theme.background}
                  strokeWidth={5}
                />
              ))}
            </g>
            <circle
              cx={530}
              cy={1334}
              r={9}
              fill={theme.surface}
              stroke={theme.line}
              strokeWidth={2}
            />
            <Label
              x={610}
              y={1340}
              size={23}
              color={open > 0.8 ? theme.success : theme.signal}
            >
              {open > 0.8 ? "v+1 → wallet-5" : "ожидание commit"}
            </Label>
          </g>
        </Attention>
      );
    })}
  </g>
);
