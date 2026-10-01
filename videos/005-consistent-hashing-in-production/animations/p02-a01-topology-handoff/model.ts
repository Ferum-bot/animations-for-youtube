/** Local milliseconds in the edited 47:33–48:59 fragment; independent of the early episode timeline. */
export const timing = {
  coordinator: 15400,
  prepare: 35900,
  prepared1: 41500,
  prepared2: 43900,
  barrier: 47000,
  migrate: 56500,
  exportRequest: 57300,
  exportStream: 58200,
  copyStart: 59000,
  importStart: 61600,
  importArrive: 63500,
  copyDone: 64400,
  commit: 67000,
  commit1: 69300,
  wait: 75800,
  commit2: 78000,
  cleanup: 80600,
  evict: 82400,
  resolved: 84300,
} as const;

export const phases = [
  {
    id: "overview",
    at: 0,
    title: ["Меняем топологию.", "По управляемым этапам."],
    detail: "Сначала подготовка, затем commit каждого роутера.",
  },
  {
    id: "coordinator",
    at: timing.coordinator,
    title: ["Кто ведёт", "переезд данных?"],
    detail: "chctl управляет этапами; router-1 выполняет перенос данных.",
  },
  {
    id: "prepare",
    at: timing.prepare,
    title: ["Готовим роутеры.", "Версия v ещё активна."],
    detail: "Каждый роутер получает будущую топологию v+1.",
  },
  {
    id: "barrier",
    at: timing.barrier,
    title: ["Записи переезда", "ждут у шлагбаума."],
    detail: "Чтения продолжаются у старых владельцев.",
  },
  {
    id: "migrate",
    at: timing.migrate,
    title: ["Копируем только", "переезжающие ключи."],
    detail: "router-1 запрашивает export, отбирает записи и вызывает import.",
  },
  {
    id: "commit",
    at: timing.commit,
    title: ["Commit — отдельно", "на каждом роутере."],
    detail: "После переключения его очередь идёт новому владельцу.",
  },
  {
    id: "wait",
    at: timing.wait,
    title: ["Ждём все роутеры", "на версии v+1."],
    detail: "Старые копии пока остаются на месте.",
  },
  {
    id: "cleanup",
    at: timing.cleanup,
    title: ["Все переключились.", "Убираем старые копии."],
    detail:
      "router-1 вызывает evict у старых нод после проверки всех роутеров.",
  },
] as const;
export type Phase = (typeof phases)[number];
export type RouterState = "active" | "prepared" | "committed";
export const phaseAt = (timeMs: number): Phase => {
  let current: Phase = phases[0];
  for (const phase of phases) if (timeMs >= phase.at) current = phase;
  return current;
};
export const routerState = (timeMs: number, router: 1 | 2): RouterState => {
  if (timeMs >= (router === 1 ? timing.commit1 : timing.commit2))
    return "committed";
  if (timeMs >= (router === 1 ? timing.prepared1 : timing.prepared2))
    return "prepared";
  return "active";
};
export const canCleanup = (timeMs: number): boolean =>
  timeMs >= timing.cleanup &&
  routerState(timeMs, 1) === "committed" &&
  routerState(timeMs, 2) === "committed";
export const movingKeys = ["k₁", "k₂", "k₃"] as const;

/** The first router is the HTTP caller for all wallet migration operations. */
export const migrationCalls = {
  export: {
    caller: "router1",
    recipient: "oldOwners",
    method: "GET",
    path: "/export",
  },
  import: {
    caller: "router1",
    recipient: "newOwner",
    method: "POST",
    path: "/import",
  },
  evict: {
    caller: "router1",
    recipient: "oldOwners",
    method: "POST",
    path: "/evict",
  },
} as const;

export type MigrationWork = { readonly title: string; readonly detail: string };
export const migrationWorkAt = (timeMs: number): MigrationWork | undefined => {
  if (timeMs >= timing.cleanup && timeMs < timing.resolved) {
    return { title: "Удаляет старые копии", detail: "POST /evict · k₁…k₃" };
  }
  if (timeMs < timing.migrate || timeMs >= timing.commit) return undefined;
  if (timeMs < timing.exportStream)
    return { title: "Запрашивает снимок", detail: "GET /export → старые ноды" };
  if (timeMs < timing.importStart)
    return { title: "Отбирает записи", detail: "owner(v) ≠ owner(v+1)" };
  if (timeMs < timing.copyDone)
    return { title: "Отправляет пачку", detail: "POST /import · k₁…k₃" };
  return { title: "Перенос завершён", detail: "Старые копии сохранены" };
};
