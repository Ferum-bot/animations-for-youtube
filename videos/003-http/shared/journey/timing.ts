import anchors from '../../anchors.json';
import metadata from '../../animations/p09-a01-code-to-wire/animation.json';
import {reveal} from '../timing';

export const journeyStartMs = anchors['p09-a01-code-to-wire-start'];
export const journeyDurationMs = metadata.durationMs;
type Anchor = Extract<keyof typeof anchors, `p09-journey-${string}`>;
export const cue = (name: Anchor): number => anchors[name] - journeyStartMs;
export const progress = (time: number, name: Anchor, duration = 700): number =>
  reveal(time, cue(name), duration);
export const lerp = (from: number, to: number, progress: number): number =>
  from + (to - from) * progress;
export const range = (time: number, from: number, to: number): number =>
  Math.min(1, Math.max(0, (time - from) / (to - from)));

export const shots = [
  {id: 'invitation', start: 0, title: 'Один запрос. Три версии HTTP.', label: 'ОТ КОДА ДО ПРОВОДА'},
  {
    id: 'assembly',
    start: cue('p09-journey-http1'),
    title: 'Сначала — понятный текст.',
    label: 'HTTP/1.1 / ПРИКЛАДНОЙ УРОВЕНЬ',
  },
  {
    id: 'socket',
    start: cue('p09-journey-bytes') - 1000,
    title: 'За сокетом — просто байты.',
    label: 'HTTP/1.1 / ГРАНИЦА УРОВНЕЙ',
  },
  {
    id: 'segments',
    start: cue('p09-journey-tcp'),
    title: 'У транспорта свои границы.',
    label: 'TCP / СЕГМЕНТАЦИЯ',
  },
  {
    id: 'receiver',
    start: cue('p09-journey-restore'),
    title: 'Сообщение узнаёт только HTTP.',
    label: 'ПРИЁМНАЯ СТОРОНА / ПАРСЕР',
  },
  {
    id: 'wire',
    start: cue('p09-journey-encapsulate'),
    title: 'Всё готово к отправке.',
    label: 'СЕГМЕНТ → ПАКЕТ → КАДР',
  },
  {
    id: 'frames',
    start: cue('p09-journey-http2'),
    title: 'Тот же смысл. Другая форма.',
    label: 'HTTP/2 / БИНАРНЫЕ КАДРЫ',
  },
  {
    id: 'framing',
    start: cue('p09-journey-consequences'),
    title: 'Границы встроены в формат.',
    label: 'HTTP/2 / ТРИ СЛЕДСТВИЯ',
  },
  {
    id: 'multiplex',
    start: cue('p09-journey-multiplex'),
    title: 'Одно соединение. Разные потоки.',
    label: 'HTTP/2 / МУЛЬТИПЛЕКСИРОВАНИЕ',
  },
  {
    id: 'blocking',
    start: cue('p09-journey-tcp-underneath'),
    title: 'Под потоками — общая очередь.',
    label: 'HTTP/2 + TCP / ПРИЁМ ДАННЫХ',
  },
  {
    id: 'quic',
    start: cue('p09-journey-http3'),
    title: 'Независимость уходит глубже.',
    label: 'HTTP/3 / QUIC',
  },
  {
    id: 'comparison',
    start: cue('p09-journey-conclusion'),
    title: 'Каждой проблеме — свой уровень.',
    label: 'ТРИ ВЕРСИИ / ОДИН ЗАПРОС',
  },
  {
    id: 'readability',
    start: cue('p09-journey-price'),
    title: 'Цена — читаемость.',
    label: 'ОБРАТНАЯ СТОРОНА ЭВОЛЮЦИИ',
  },
] as const;
export type ShotId = (typeof shots)[number]['id'];
export const shotAt = (time: number) =>
  shots.reduce<(typeof shots)[number]>(
    (current, shot) => (time >= shot.start ? shot : current),
    shots[0],
  );
export const shotEnd = (index: number): number => shots[index + 1]?.start ?? journeyDurationMs;
