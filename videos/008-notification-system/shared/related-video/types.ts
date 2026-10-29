export type CardEntrance = 'side' | 'rise' | 'focus';

export type RelatedVideoSpec = {
  readonly audioFile: string;
  readonly image: {
    readonly file: string;
    readonly sourceWidth: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly title: readonly [string, string];
  readonly linkLabel: string;
  readonly linkAtMs: number;
  readonly entrance: CardEntrance;
  readonly accent: 'primary' | 'signal' | 'warm';
};
