import type {ProtocolDetailKind} from './ProtocolDetail';

export const chapterDurationMs = 4500;

type Chapter = {
  readonly number: number;
  readonly title: readonly [string, string];
  readonly detail: ProtocolDetailKind;
};

// Visual content only. Placement and speech onsets live in anchors.json / timeline.json.
export const chapters = [
  {number: 1, title: ['ЧТО ТАКОЕ', 'HTTP'], detail: 'request'},
  {number: 2, title: ['АНАТОМИЯ', 'HTTP'], detail: 'anatomy'},
  {number: 3, title: ['МЕТОДЫ', 'HTTP'], detail: 'semantics'},
  {number: 4, title: ['КОДЫ', 'СОСТОЯНИЯ'], detail: 'codes'},
  {number: 5, title: ['ЗАГОЛОВКИ', 'HTTP'], detail: 'headers'},
  {number: 6, title: ['ГРАНИЦЫ', 'СООБЩЕНИЯ'], detail: 'body'},
  {number: 7, title: ['HTTP/1.0', 'И HTTP/1.1'], detail: 'versions'},
  {number: 8, title: ['HTTP/2', 'И HTTP/3'], detail: 'versions'},
  {number: 9, title: ['ОТ КОДА', 'ДО ПРОВОДА'], detail: 'bytes'},
  {number: 10, title: ['ЧТО ВАЖНО', 'ЗАПОМНИТЬ'], detail: 'request'},
] as const satisfies readonly Chapter[];

export const getChapter = (number: number): Chapter => {
  const chapter = chapters.find((candidate) => candidate.number === number);
  if (!chapter) throw new Error(`Unknown HTTP chapter: ${number}`);
  return chapter;
};
