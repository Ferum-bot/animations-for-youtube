import React from 'react';
import {Composition} from 'remotion';
import EditorialPulse from './01-editorial-pulse/Composition';
import TraceLanes from './02-trace-lanes/Composition';
import PacketAutopsy from './03-packet-autopsy/Composition';
import MaterialTopology from './04-material-topology/Composition';
import CorrectnessDarkroom from './05-correctness-darkroom/Composition';
import TransitReactor3D from './06-transit-reactor-3d/Composition';
import ReplicationChamber3D from './07-replication-chamber-3d/Composition';
import EventMesh3D from './08-event-mesh-3d/Composition';

const format = {width: 1920, height: 1080, fps: 30, durationInFrames: 240};

export const ExampleCompositions: React.FC = () => (
  <>
    <Composition id="Examples-EditorialPulse" component={EditorialPulse} {...format} />
    <Composition id="Examples-TraceLanes" component={TraceLanes} {...format} />
    <Composition id="Examples-PacketAutopsy" component={PacketAutopsy} {...format} />
    <Composition id="Examples-MaterialTopology" component={MaterialTopology} {...format} />
    <Composition id="Examples-CorrectnessDarkroom" component={CorrectnessDarkroom} {...format} />
    <Composition id="Examples-TransitReactor3D" component={TransitReactor3D} {...format} />
    <Composition id="Examples-ReplicationChamber3D" component={ReplicationChamber3D} {...format} />
    <Composition id="Examples-EventMesh3D" component={EventMesh3D} {...format} />
  </>
);

