import React from 'react';
import {MotionStage} from '@channel/design-system';
import {DelegationDividerCanvas} from './DelegationDivider';
import {RouteDividerCanvas} from './RouteDivider';
import type {ChapterDividerProps, ChapterDividerVariant} from './types';

const assertNever = (value: never): never => {
  throw new Error(`Unsupported chapter divider variant: ${String(value)}`);
};

export const ChapterDivider: React.FC<ChapterDividerProps> = (props) => {
  const variant: ChapterDividerVariant = props.variant;
  let canvas: React.ReactNode;

  switch (variant) {
    case 'delegation':
      canvas = <DelegationDividerCanvas {...props} />;
      break;
    case 'route':
      canvas = <RouteDividerCanvas {...props} />;
      break;
    default:
      return assertNever(variant);
  }

  return (
    <MotionStage
      themeId={props.themeId}
      transparent={props.transparent}
      transitionMode={props.transitionMode}
    >
      {canvas}
    </MotionStage>
  );
};

export const delegationDividerDefaultProps = {
  chapterNumber: 3,
  titleLines: ['Путь одного', 'DNS-запроса'],
  eyebrow: 'DNS / МЕХАНИКА',
  detail: 'ROOT → TLD → AUTHORITATIVE',
  variant: 'delegation',
  themeId: 'paper',
  transparent: false,
} as const satisfies ChapterDividerProps;

export const routeDividerDefaultProps = {
  chapterNumber: 5,
  titleLines: ['Безопасность', 'и приватность'],
  eyebrow: 'DNS / TRUST MODEL',
  detail: 'CACHE POISONING / DNSSEC / DoH',
  variant: 'route',
  themeId: 'graphite',
  transparent: false,
} as const satisfies ChapterDividerProps;
