import React from 'react';
import {FooterNote, Label} from '../../shared/journey/Diagram';
import {palette as p} from '../../shared/journey/theme';
import {progress} from '../../shared/journey/timing';
import type {SceneProps} from '../../shared/journey/types';

export const Wire: React.FC<SceneProps> = ({time}) => {
  const ip = progress(time, 'p09-journey-ip'),
    ethernet = progress(time, 'p09-journey-ethernet'),
    wire = progress(time, 'p09-journey-wire');
  return (
    <>
      <Label x={190} y={420} mono size={24} color={p.muted}>
        ОТПРАВКА / РАСКРЫТОЕ ПРЕДСТАВЛЕНИЕ ОБОЛОЧЕК
      </Label>
      <g opacity={1 - wire}>
        <Label x={570} y={1081} size={30} color={p.primary}>
          TCP-сегмент
        </Label>
        <Label x={1100} y={1081} size={30} color={p.blue} opacity={ip}>
          IP-пакет
        </Label>
        <Label x={1620} y={1081} size={30} color={p.rim} opacity={ethernet}>
          Канальный кадр
        </Label>
      </g>
      <g opacity={wire}>
        <path
          d="M1650 615 C1880 615 1970 870 2330 870"
          fill="none"
          stroke={p.copper}
          strokeWidth={25}
        />
        <path
          d="M1650 615 C1880 615 1970 870 2330 870"
          fill="none"
          stroke={p.cream}
          strokeWidth={2}
          opacity={0.6}
        />
        <Label x={1740} y={975} size={27} color={p.muted}>
          Условный рисунок сигнала
        </Label>
      </g>
      <FooterNote
        title="Каждый уровень добавляет свою оболочку."
        detail="На физическом уровне передаётся сигнал. HTTP не едет по проводу отдельным объектом."
      />
    </>
  );
};
