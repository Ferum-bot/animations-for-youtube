import React from 'react';
import {SceneStage} from '@channel/motion-v2';
import type {ThemeId} from '@channel/theme';

type Props = {
  readonly themeId?: ThemeId;
  readonly transparent?: boolean;
};

const Composition: React.FC<Props> = ({
  themeId = 'graphite',
  transparent = true,
}) => (
  <SceneStage label={"Реальный маршрут WebSocket"} themeId={themeId} transparent={transparent}>
    {/* Native QHD coordinates. Replace this placeholder with one concrete action. */}
    <text x={160} y={240} fontSize={64} fontWeight={600}>
      {"Реальный маршрут WebSocket"}
    </text>
  </SceneStage>
);

export default Composition;
