import anchors from '../../anchors.json';
import metadata from './animation.json';
import {localIsolateCues, type IsolateCue} from '../../shared/isolate/cues';

export const scene = {startMs: anchors['isolate-flags'], durationMs: metadata.durationMs};

const cueData = [
  {anchor: 'isolate-flags', focus: [], label: 'Лимиты запуска', description: 'Что означают параметры команды'},
  {anchor: 'isolate-cpu-time', focus: ['time'], label: 'CPU · 2 с', description: 'Время, которое процесс получает на CPU'},
  {anchor: 'isolate-wall-time', focus: ['wall-time'], label: 'Полное время · 5 с', description: 'Время от старта до выхода, включая ожидание'},
  {anchor: 'isolate-memory', focus: ['memory'], label: 'Память · 256 MiB', description: '262144 KiB · лимит адресного пространства'},
  {anchor: 'isolate-processes', focus: ['processes'], label: 'Один процесс', description: 'Лимит — 1 процесс всего; дочерние не разрешены'},
  {anchor: 'isolate-compare-time', focus: ['time', 'wall-time'], label: 'Два вида времени', description: 'CPU: 2 с работы · wall: 5 с вместе с ожиданием'},
  {anchor: 'isolate-limits-hold', focus: [], label: 'Лимиты запуска', description: 'CPU: 2 с · wall: 5 с · память: 256 MiB · процессов: 1'},
] as const satisfies readonly IsolateCue[];

export const cues = localIsolateCues(cueData, scene.startMs);
