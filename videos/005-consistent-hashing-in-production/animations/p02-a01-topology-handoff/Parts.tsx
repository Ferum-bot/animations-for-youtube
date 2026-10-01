import React from "react";
import { hashingTheme as theme } from "../../shared/theme";
import { Mono } from "../../shared/theory/Typography";
import { type RouterState, type MigrationWork, movingKeys } from "./model";

export const Label: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly color?: string;
  readonly weight?: number;
}> = ({ x, y, children, size = 28, color = theme.text, weight = 400 }) => (
  <text x={x} y={y} fontSize={size} fontWeight={weight} fill={color}>
    {children}
  </text>
);

/** Role-specific symbols describe software responsibilities, not physical equipment. */
const RoleIcon: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly role: "routing" | "wallet" | "terminal";
}> = ({ x, y, role }) => (
  <g
    transform={`translate(${x} ${y})`}
    fill="none"
    stroke={theme.primary}
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {role === "routing" ? (
      <>
        <path d="M4 28 H23 M23 28 V9 H51 M23 28 V47 H51 M43 1 L51 9 L43 17 M43 39 L51 47 L43 55" />
        <circle cx={5} cy={28} r={4} fill={theme.background} />
      </>
    ) : role === "wallet" ? (
      <>
        <path d="M8 13 V6 H43 V16 M8 13 H51 V49 H8 Q3 49 3 44 V18 Q3 13 8 13 Z" />
        <path d="M51 26 H34 V39 H51" />
        <circle cx={41} cy={32.5} r={1.5} fill={theme.primary} />
      </>
    ) : (
      <>
        <rect x={1} y={4} width={54} height={44} rx={3} />
        <path d="M12 17 L22 26 L12 35 M29 35 H43" />
      </>
    )}
  </g>
);

const ServiceHeading: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly name: string;
  readonly kind: string;
  readonly role: "routing" | "wallet";
}> = ({ x, y, name, kind, role }) => (
  <g>
    <RoleIcon x={x} y={y - 82} role={role} />
    <g fontWeight={650}>
      <Mono x={x + 76} y={y - 47} anchor="start" size={36}>
        {name}
      </Mono>
    </g>
    <Label x={x + 76} y={y - 15} size={19} color={theme.muted}>
      {kind}
    </Label>
  </g>
);

/** A flat software boundary groups responsibility and live state. */
const ServiceBody: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly accent: string;
  readonly emphasis: number;
  readonly children: React.ReactNode;
}> = ({ x, y, width, height, accent, emphasis, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect
      width={width}
      height={height}
      fill={theme.surface}
      fillOpacity={0.6 + emphasis * 0.4}
    />
    <path
      d={`M0 ${height} V0 H${width} V${height}`}
      fill="none"
      stroke={theme.line}
      strokeWidth={1.5}
    />
    <path
      d={`M0 ${height} H${width}`}
      stroke={accent}
      strokeWidth={2 + emphasis}
    />
    {children}
  </g>
);

export const Router: React.FC<{
  readonly y: number;
  readonly index: 1 | 2;
  readonly state: RouterState;
  readonly work?: MigrationWork;
  readonly emphasis: number;
}> = ({ y, index, state, emphasis, work }) => {
  const color =
    state === "committed"
      ? theme.success
      : state === "prepared"
        ? theme.signal
        : theme.primary;
  return (
    <g>
      <ServiceHeading
        x={910}
        y={y}
        name={`router-${index}`}
        kind="СЕРВИС МАРШРУТИЗАЦИИ · GO"
        role="routing"
      />
      <ServiceBody
        x={910}
        y={y}
        width={492}
        height={176}
        accent={color}
        emphasis={emphasis}
      >
        <Label x={24} y={36} size={23}>
          {work
            ? "Исполнитель переноса · router-1"
            : "Направляет запросы по ключу"}
        </Label>
        <path d="M24 58 H468" stroke={theme.line} />
        <Mono x={24} y={122} anchor="start" size={48} color={color}>
          {state === "committed" ? "v+1" : "v"}
        </Mono>
        <Label x={24} y={151} size={18} color={theme.muted}>
          топология
        </Label>
        <Label x={186} y={107} size={25}>
          {work
            ? work.title
            : state === "prepared"
              ? "Подготовлен"
              : state === "committed"
                ? "Переключён"
                : "Работает"}
        </Label>
        <Label
          x={186}
          y={144}
          size={work ? 18 : 22}
          color={
            work
              ? theme.signal
              : state === "prepared"
                ? theme.signal
                : theme.muted
          }
        >
          {work
            ? work.detail
            : state === "prepared"
              ? "v+1 ждёт commit"
              : state === "committed"
                ? "запросы по v+1"
                : "запросы по v"}
        </Label>
      </ServiceBody>
    </g>
  );
};

export const Coordinator: React.FC<{
  readonly stage: string;
  readonly emphasis: number;
  readonly states: readonly [RouterState, RouterState];
}> = ({ stage, emphasis, states }) => (
  <g>
    <RoleIcon x={144} y={482} role="terminal" />
    <Label x={220} y={486} size={21} color={theme.muted}>
      CLI-УТИЛИТА
    </Label>
    <g fontWeight={650}>
      <Mono x={220} y={530} anchor="start" size={40}>
        chctl
      </Mono>
    </g>
    <g transform="translate(144 565)">
      <rect
        width={430}
        height={246}
        rx={5}
        fill={theme.background}
        stroke={theme.primary}
        strokeOpacity={0.4 + emphasis * 0.6}
        strokeWidth={2}
      />
      <path d="M1 40 H429" stroke={theme.line} />
      <Label x={22} y={27} size={18} color={theme.muted}>
        ТЕРМИНАЛ
      </Label>
      <Mono x={24} y={93} anchor="start" size={22} color={theme.primary}>
        $ chctl apply topology.json
      </Mono>
      {states.map((state, i) => (
        <Mono
          key={i}
          x={24}
          y={141 + i * 36}
          anchor="start"
          size={22}
          color={
            state === "committed"
              ? theme.success
              : state === "prepared"
                ? theme.signal
                : theme.muted
          }
        >
          {`router-${i + 1}   ${state === "committed" ? "v+1" : state === "prepared" ? "prepared" : "v"}`}
        </Mono>
      ))}
      <path d="M24 196 H406" stroke={theme.line} />
      <Label x={24} y={226} size={21}>
        {stage}
      </Label>
    </g>
  </g>
);

export const Key: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly color: string;
  readonly opacity?: number;
}> = ({ x, y, label, color, opacity = 1 }) => (
  <g opacity={opacity}>
    <rect
      x={x}
      y={y}
      width={72}
      height={42}
      fill={theme.background}
      stroke={color}
      strokeWidth={2}
    />
    <Mono x={x + 36} y={y + 30} size={26} color={color}>
      {label}
    </Mono>
  </g>
);

export const Store: React.FC<{
  readonly target?: boolean;
  readonly copies: readonly number[];
  readonly oldOpacity: number;
  readonly active: boolean;
  readonly emphasis: number;
}> = ({ target = false, copies, oldOpacity, active, emphasis }) => {
  const y = target ? 875 : 435;
  const color = target
    ? active
      ? theme.success
      : theme.primary
    : theme.signal;
  return (
    <g>
      <ServiceHeading
        x={1860}
        y={y}
        name={target ? "wallet-5" : "wallet · старые"}
        kind={
          target
            ? "ЭКЗЕМПЛЯР МИКРОСЕРВИСА · GO"
            : "ЭКЗЕМПЛЯРЫ МИКРОСЕРВИСА · GO"
        }
        role="wallet"
      />
      <ServiceBody
        x={1860}
        y={y}
        width={462}
        height={236}
        accent={color}
        emphasis={emphasis}
      >
        <Label x={24} y={36} size={23}>
          {target ? "Новый владелец ключей" : "Старые владельцы k₁…k₃"}
        </Label>
        <path d="M24 58 H438" stroke={theme.line} />
        {movingKeys.map((key, i) => (
          <Key
            key={key}
            x={24 + i * 94}
            y={81}
            label={key}
            color={target ? theme.success : theme.signal}
            opacity={target ? (copies[i] ?? 0) : oldOpacity}
          />
        ))}
        <Label
          x={24}
          y={168}
          size={23}
          color={target && active ? theme.success : theme.text}
        >
          {target
            ? active
              ? "Принимает запросы"
              : "Готов к приёму ключей"
            : "Остальные ключи — здесь"}
        </Label>
        <Label x={24} y={207} size={21} color={theme.muted}>
          {target
            ? copies.every((value) => value === 1)
              ? "k₁…k₃ скопированы"
              : "Импорт только k₁…k₃"
            : "Их владелец не меняется"}
        </Label>
      </ServiceBody>
    </g>
  );
};
