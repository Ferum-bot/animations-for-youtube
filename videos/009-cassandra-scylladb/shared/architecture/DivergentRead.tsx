import React from 'react';
import {Title} from './Title';
import {Note} from './ReplicaNote';
import {messageLabel, newBody, oldBody} from './chat107';

export const DivergentRead: React.FC = () => <g>
    <Title>Читаем с B и C</Title>
    <Note x={420} y={487} host="B" scale={1.2} detail={messageLabel} value={newBody} marked />
    <Note x={1480} y={487} host="C" scale={1.2} detail={messageLabel} value={oldBody} />
    <text x={425} y={991} fontSize={53}>Подтвердила правку</text>
    <text x={1485} y={991} fontSize={53}>Пропустила правку</text>
  </g>;
