import anchors from '../../anchors.json';
import metadata from './animation.json';
import {localIsolateCues, type IsolateCue} from '../../shared/isolate/cues';

export const scene = {startMs: anchors['isolate-overview'], durationMs: metadata.durationMs};

const cueData = [
  {anchor: 'isolate-overview', focus: [], label: 'Три команды', description: 'Создать песочницу → запустить решение → очистить'},
  {anchor: 'isolate-init', focus: ['init'], label: 'Создание', description: 'Готовим песочницу с идентификатором 7'},
  {anchor: 'isolate-limits', focus: ['time', 'wall-time', 'memory', 'processes'], label: 'Ограничения', description: 'CPU-время · полное время · память · процессы'},
  {anchor: 'isolate-run', focus: ['run'], label: 'Запуск', description: 'Python выполняет solution.py внутри песочницы'},
  {anchor: 'isolate-cleanup', focus: ['cleanup'], label: 'Очистка', description: 'Удаляем временные файлы песочницы №7'},
] as const satisfies readonly IsolateCue[];

export const cues = localIsolateCues(cueData, scene.startMs);
