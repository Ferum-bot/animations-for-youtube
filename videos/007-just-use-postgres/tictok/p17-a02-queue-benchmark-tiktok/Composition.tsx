import React from 'react';
import {ShortComposition, type ShortProps} from '../../postgres-shorts/ShortComposition';

export default function Composition(props: ShortProps) {
  return <ShortComposition {...props} number={17}/>;
}
