import React from 'react';
import {HttpPartPreview} from '../../shared/HttpPartPreview';
import {headerScenes} from '../../shared/headers/timing';
import Groups from '../p05-a01-header-groups/Composition';
import Host from '../p05-a02-host-routing/Composition';
import Trust from '../p05-a03-header-trust/Composition';
import Upgrade from '../p05-a04-protocol-upgrade/Composition';

const scenes = [
  {...headerScenes.groups, component: Groups},
  {...headerScenes.host, component: Host},
  {...headerScenes.trust, component: Trust},
  {...headerScenes.upgrade, component: Upgrade},
] as const;

const Composition: React.FC = () => <HttpPartPreview scenes={scenes} />;
export default Composition;
