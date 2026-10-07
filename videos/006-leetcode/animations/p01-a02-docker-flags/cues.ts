import anchors from '../../anchors.json';
import metadata from './animation.json';
import {localDockerCues, type DockerCue} from '../../shared/docker/cues';

export const scene = {startMs: anchors['docker-flags'], durationMs: metadata.durationMs};

const cueData = [
  {anchor: 'docker-flags', focus: [], label: 'Параметры запуска', description: 'Ограничения применяются к контейнеру с пользовательским кодом'},
  {anchor: 'docker-network', focus: ['network'], label: 'Без сети', description: 'Отключаем внешнюю сеть контейнера'},
  {anchor: 'docker-memory', focus: ['memory'], label: 'Память · 256 MiB', description: 'Ограничиваем оперативную память контейнера'},
  {anchor: 'docker-cpus', focus: ['cpus'], label: 'CPU · 1', description: 'Ограничиваем CPU-квоту эквивалентом одного ядра'},
  {anchor: 'docker-pids', focus: ['pids'], label: 'Процессы · 64', description: 'Ограничиваем число задач в контейнере'},
  {anchor: 'docker-resource-limits', focus: ['memory', 'cpus', 'pids'], label: 'Лимиты ресурсов', description: 'Память · процессорное время · число процессов'},
  {anchor: 'docker-memory-meaning', focus: ['memory'], label: 'Память · 256 MiB', description: 'Ограничиваем оперативную память контейнера'},
  {anchor: 'docker-cpus-meaning', focus: ['cpus'], label: 'CPU · 1', description: 'Квота CPU; флаг не закрепляет контейнер за конкретным ядром'},
  {anchor: 'docker-pids-meaning', focus: ['pids'], label: 'Процессы · 64', description: 'Лимит ограничивает разрастание fork-бомбы'},
  {anchor: 'docker-readonly', focus: ['readonly'], label: 'Только чтение', description: 'Корневая файловая система защищена от записи'},
  {anchor: 'docker-user', focus: ['user'], label: 'Пользователь', description: 'UID:GID 65534:65534 · запуск без прав root'},
  {anchor: 'docker-readonly-meaning', focus: ['readonly'], label: 'Только чтение', description: 'Корень — read-only; /tmp остаётся отдельным записываемым tmpfs'},
  {anchor: 'docker-user-meaning', focus: ['user'], label: 'Без прав root', description: 'Непривилегированный пользователь · UID:GID 65534:65534'},
  {anchor: 'docker-remove', focus: ['remove'], label: 'Автоочистка', description: 'Удаляем контейнер после завершения процесса'},
] as const satisfies readonly DockerCue[];

export const cues = localDockerCues(cueData, scene.startMs);
