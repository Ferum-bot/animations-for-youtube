import React from 'react';
import {Analyzer, Elk, InvertedIndex} from './IndexScenes';
import {Dictionary, Limits} from './LimitScenes';
import {ArticleTable, Query, Vector} from './SearchScenes';
import type {ShotId} from './timing';
import type {ShotProps} from './ui';

const components = {
  index: InvertedIndex,
  analyzer: Analyzer,
  elk: Elk,
  vector: Vector,
  table: ArticleTable,
  query: Query,
  limits: Limits,
  dictionary: Dictionary,
} satisfies Record<ShotId, React.FC<ShotProps>>;

export const ShotContent: React.FC<ShotProps & {readonly id: ShotId}> = ({id, ...props}) => {
  const Component = components[id];
  return <Component {...props} />;
};
