import anchors from '../../anchors.json';
import metadata from './animation.json';
import {localDockerCues, type DockerCue} from '../../shared/docker/cues';

export const scene = {startMs: anchors['docker-overview'], durationMs: metadata.durationMs};

const cueData = [
  {anchor: 'docker-overview', focus: [], label: 'Изолированный запуск', description: 'Python 3.12 · код и тесты подключены только для чтения'},
  {anchor: 'docker-driver', focus: ['driver'], label: 'Драйвер', description: 'Вызывает решение на каждом тесте и выводит ответ в stdout'},
] as const satisfies readonly DockerCue[];

export const cues = localDockerCues(cueData, scene.startMs);
