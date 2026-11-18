import React from 'react';
import {BrokerShort, type Platform} from '../../shared/vertical/BrokerShort';
import {Board} from './Board';
import cuts from './cuts.json';
import story from './story.json';

export function Episode({platform}: {platform: Platform}) {
  return <BrokerShort platform={platform} story={story} cuts={cuts} Board={Board}/>;
}

export default function Composition() {
  return <Episode platform="shorts"/>;
}
