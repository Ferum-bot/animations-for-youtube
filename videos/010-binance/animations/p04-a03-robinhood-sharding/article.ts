import type {SourceRect} from '@channel/motion-v2';
import anchors from '../../anchors.json';

const start = anchors['p04-a03-robinhood-sharding-start'];

// Geometry of the original Robinhood DOM in CSS pixels, captured at 2×.
export const article = {
  src: 'assets/010-binance/robinhood-sharding/article.webp',
  sourceWidth: 1080,
  sourceHeight: 2841,
} as const;

export const options = [
  {x: 318.6875, y: 1375.125, width: 509.703125, height: 25},
] as const satisfies readonly SourceRect[];
export const decision = [
  {x: 222.75, y: 2065.984375, width: 450.015625, height: 25},
] as const satisfies readonly SourceRect[];

export const timing = {
  scrollToOptions: 3_468_480 - start,
  alternatives: 3_472_740 - start,
  scrollToDecision: 3_475_250 - start,
  sharding: 3_477_420 - start,
  pullQuote: 3_478_800 - start,
} as const;
