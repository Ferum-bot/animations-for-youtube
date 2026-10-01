import React from "react";
import { hashingTheme as theme } from "../../shared/theme";
import { Mono } from "../../shared/theory/Typography";
import { progress } from "../../shared/theory/motion";
import {
  canCleanup,
  movingKeys,
  migrationWorkAt,
  phaseAt,
  phases,
  routerState,
  timing,
  type Phase,
} from "./model";
import { Coordinator, Label, Router, Store } from "./Parts";
import { Routes } from "./Routes";
import { MigrationFlow } from "./MigrationFlow";
import { RequestQueues } from "./RequestQueues";
import { Attention } from "./FocusGroup";
import { focusAt } from "./attention";

const stageLabels: Record<Phase["id"], string> = {
  overview: "План: prepare → commit",
  coordinator: "Оркестрация переноса",
  prepare: "prepare · оба роутера",
  barrier: "prepare · записи ждут",
  migrate: "migrate · router-1",
  commit: "commit · оба роутера",
  wait: "wait · все на v+1",
  cleanup: "cleanup · router-1",
};
const steps = [
  { name: "PREPARE", at: timing.prepare },
  { name: "MIGRATE", at: timing.migrate },
  { name: "COMMIT", at: timing.commit },
  { name: "WAIT ALL", at: timing.wait },
  { name: "CLEANUP", at: timing.cleanup },
] as const;

export const Diagram: React.FC<{ readonly timeMs: number }> = ({ timeMs }) => {
  const phase = phaseAt(timeMs);
  const state1 = routerState(timeMs, 1),
    state2 = routerState(timeMs, 2);
  const committed =
    Number(state1 === "committed") + Number(state2 === "committed");
  const copies = movingKeys.map((_, i) =>
    progress(timeMs, timing.importArrive + i * 80, 250),
  );
  const cleanup = canCleanup(timeMs);
  const oldOpacity = 1 - (cleanup ? progress(timeMs, timing.evict, 1400) : 0);
  const stepIndex = phases.findIndex((item) => item.id === phase.id);
  return (
    <>
      <g opacity={timeMs < 500 ? 1 : progress(timeMs, phase.at, 250)}>
        <Label x={144} y={154} size={68} weight={650}>
          {phase.title[0]}
        </Label>
        <Label x={144} y={237} size={68} weight={650} color={theme.primary}>
          {phase.title[1]}
        </Label>
        <Label x={144} y={303} size={31} color={theme.muted}>
          {phase.detail}
        </Label>
      </g>
      <Mono x={2416} y={154} anchor="end" size={24} color={theme.muted}>
        СМЕНА ТОПОЛОГИИ
      </Mono>
      <Mono x={2416} y={239} anchor="end" size={62} color={theme.primary}>
        {String(stepIndex + 1).padStart(2, "0")}
        <tspan fill={theme.line} fontSize={30}>
          {" "}
          / 08
        </tspan>
      </Mono>
      <g opacity={progress(timeMs, 1000, 700)}>
        <Routes timeMs={timeMs} />
        <MigrationFlow timeMs={timeMs} />
        <Attention target="coordinator" timeMs={timeMs}>
          <Coordinator
            stage={stageLabels[phase.id]}
            emphasis={focusAt(timeMs, "coordinator")}
            states={[state1, state2]}
          />
        </Attention>
        <g opacity={progress(timeMs, 1800)}>
          <Attention target="router1" timeMs={timeMs}>
            <Router
              y={475}
              index={1}
              state={state1}
              work={migrationWorkAt(timeMs)}
              emphasis={focusAt(timeMs, "router1")}
            />
          </Attention>
        </g>
        <g opacity={progress(timeMs, 2400)}>
          <Attention target="router2" timeMs={timeMs}>
            <Router
              y={830}
              index={2}
              state={state2}
              emphasis={focusAt(timeMs, "router2")}
            />
          </Attention>
        </g>
        <g opacity={progress(timeMs, 3200)}>
          <Attention target="oldOwners" timeMs={timeMs}>
            <Store
              copies={copies}
              oldOpacity={oldOpacity}
              active={false}
              emphasis={focusAt(timeMs, "oldOwners")}
            />
          </Attention>
        </g>
        <g opacity={progress(timeMs, 3800)}>
          <Attention target="newOwner" timeMs={timeMs}>
            <Store
              target
              copies={copies}
              oldOpacity={1}
              active={committed > 0}
              emphasis={focusAt(timeMs, "newOwner")}
            />
          </Attention>
        </g>
        <g opacity={progress(timeMs, 6500)}>
          <path d="M144 891 H574" stroke={theme.line} />
          <Label x={144} y={938} size={24} color={theme.muted}>
            {timeMs >= timing.wait ? "СИНХРОНИЗАЦИЯ" : "ЧТЕНИЯ k₁…k₃"}
          </Label>
          <Label
            x={144}
            y={991}
            size={34}
            color={cleanup ? theme.success : theme.primary}
          >
            {timeMs >= timing.wait
              ? `${committed} / 2 на v+1`
              : committed === 1
                ? "По версии роутера"
                : "К старым владельцам"}
          </Label>
          <Label x={144} y={1036} size={24} color={theme.muted}>
            {cleanup
              ? "Cleanup разрешён"
              : timeMs >= timing.wait
                ? "Ждём всех перед cleanup"
                : committed === 1
                  ? "r1 → wallet-5, r2 → старые"
                  : "Работают во время миграции"}
          </Label>
          <Label
            x={144}
            y={1110}
            size={26}
            color={cleanup ? theme.success : theme.signal}
          >
            {timeMs >= timing.resolved
              ? "Старые копии удалены"
              : cleanup
                ? "Удаляем перенесённые копии"
                : committed > 0
                  ? "Старые копии пока сохраняем"
                  : timeMs >= timing.copyDone
                    ? "Копирование завершено"
                    : timeMs >= timing.exportStream
                      ? "Роутер отбирает только переезд"
                      : "Сначала prepare, потом commit"}
          </Label>
        </g>
      </g>
      {timeMs < timing.barrier ? (
        <g opacity={progress(timeMs, 5500)}>
          <path d="M144 1200 H2416" stroke={theme.line} />
          {steps.map((step, i) => (
            <g key={step.name} opacity={timeMs >= step.at ? 1 : 0.58}>
              <Mono
                x={144 + i * 474}
                y={1276}
                anchor="start"
                size={20}
                color={timeMs >= step.at ? theme.primary : theme.muted}
              >
                {String(i + 1).padStart(2, "0")}
              </Mono>
              <Mono
                x={192 + i * 474}
                y={1276}
                anchor="start"
                size={27}
                color={timeMs >= step.at ? theme.primary : theme.text}
              >
                {step.name}
              </Mono>
              <path
                d={`M${144 + i * 474} 1315 h365`}
                stroke={timeMs >= step.at ? theme.primary : theme.line}
                strokeWidth={3}
              />
            </g>
          ))}
        </g>
      ) : (
        <RequestQueues timeMs={timeMs} />
      )}
    </>
  );
};
