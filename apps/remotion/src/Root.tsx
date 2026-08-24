import React from 'react';
import {Folder} from 'remotion';
import {ExampleCompositions} from '../../../examples/animations/registry';
import {StandardCompositions} from '@channel/standard-animations';
import {GeneratedVideoCompositions} from './generated/video-registry';

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Videos">
      <GeneratedVideoCompositions />
    </Folder>
    <Folder name="Standard">
      <StandardCompositions />
    </Folder>
    <Folder name="Examples">
      <ExampleCompositions />
    </Folder>
  </>
);

