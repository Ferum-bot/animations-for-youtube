import React from 'react';
import {arrive, mix} from '../../shared/editorial-v2/motion';
import {illustrationTheme as theme, Magnifier, MessageIcon} from '../../shared/editorial-v2/illustration';
import {scene, timing as t, type SceneProps} from './scene';

export const ResolvedSearch: React.FC<SceneProps> = ({timeMs}) => {
  const found = arrive(timeMs, t.found, 450);
  const opacity = arrive(timeMs, t.resolved, 280) *
    (1 - arrive(timeMs, t.exit, scene.durationMs - 1000 / 30 - t.exit));
  return <g opacity={opacity}>
    <MessageIcon x={715} y={410} scale={3}>
      <text x={38} y={76} fontSize={34} fontWeight={600}>Завтра</text>
      <text x={38} y={129} fontSize={34} fontWeight={600}>у офиса</text>
      <path d="M38 145 H183" stroke={theme.primary} strokeWidth={3} opacity={found} />
    </MessageIcon>
    <Magnifier x={mix(1080, 1740, found)} y={650} scale={1.7} />
    <text x={1280} y={1210} textAnchor="middle" fontSize={50} opacity={found}>Найдено</text>
  </g>;
};
