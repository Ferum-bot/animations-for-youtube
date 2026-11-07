import type {SourceRect} from '@channel/motion-v2';
import type {SourceCaptionText} from './SourceCaption';

type MarkMap = Readonly<Record<string, readonly SourceRect[]>>;
export type SourceDocument = {readonly width: number; readonly height: number; readonly marks: MarkMap};
export type ReadingBeat = {
  readonly at: number;
  readonly highlights: readonly SourceRect[];
  readonly caption?: SourceCaptionText;
};
export type PageShot<Id extends string> = {
  readonly kind: 'page';
  readonly at: number;
  readonly id: Id;
  readonly beats: readonly ReadingBeat[];
};

export function articlePages<Docs extends Readonly<Record<string, SourceDocument>>>(documents: Docs) {
  return function page<Id extends keyof Docs & string>(
    at: number,
    id: Id,
    readings: readonly {at: number; mark: keyof Docs[Id]['marks'] & string; caption?: SourceCaptionText}[] = [],
  ): PageShot<Id> {
    const source = documents[id];
    if (!source) throw Error('Unknown source document: ' + id);
    const marks: MarkMap = source.marks;
    const beats = readings.map(({at, mark, caption}) => {
      const highlights = marks[mark];
      if (!highlights?.length) throw Error('Missing source selection: ' + id + '/' + mark);
      return {at, caption, highlights};
    });
    return {kind: 'page', at, id, beats};
  };
}
