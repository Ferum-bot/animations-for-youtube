type WorkerSetting = {
  readonly name: readonly string[];
  readonly effect: readonly string[];
  readonly setting: readonly string[];
};

// Display content only. These are host policies, not executable Isolate flags.
export const settings = [
  {name: ['Частота CPU'], effect: ['Частота меняется', 'под нагрузкой'],
    setting: ['cpufreq → performance']},
  {name: ['Turbo Boost'], effect: ['Ускорение зависит', 'от нагрева и соседей'],
    setting: ['Intel: no_turbo = 1', 'или cpufreq/boost = 0']},
  {name: ['ASLR*'], effect: ['Меняются адреса памяти', 'и поведение кеша'],
    setting: ['sysctl kernel.randomize_va_space=0']},
  {name: ['Transparent', 'huge pages'], effect: ['Фоновое объединение', 'страниц и дефрагментация'],
    setting: ['enabled, defrag → never', 'khugepaged/defrag → 0']},
  {name: ['Swap'], effect: ['Обращения к диску', 'вместо оперативной памяти'],
    setting: ['swapoff -a']},
  {name: ['Соседи на ядре'], effect: ['Конкуренция за кеш', 'и вычислительные блоки'],
    setting: ['Выделенное физическое ядро', '+ cpuset / CPU affinity']},
] as const satisfies readonly WorkerSetting[];
