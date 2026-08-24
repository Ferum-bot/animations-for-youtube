import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {DataPacket, MotionStage, ServiceCard, useChannelTheme} from '@channel/design-system';
import {clamp} from '@channel/motion-core';
import type {ThemeId} from '@channel/design-system';
import {ReadablePanel} from '../../shared/ReadablePanel';
import {VideoBadge} from '../../shared/VideoBadge';

type RequestFlowProps = {
  themeId?: ThemeId;
  transparent?: boolean;
};

const positions = [150, 590, 1030, 1470];
const services = [
  ['CLIENT', 'POST /orders'],
  ['GATEWAY', 'TLS + routing'],
  ['ORDER SERVICE', 'validate + execute'],
  ['POSTGRES', 'COMMIT'],
] as const;

const RequestFlow: React.FC<RequestFlowProps> = ({
  themeId = 'graphite',
  transparent = true,
}) => (
  <MotionStage themeId={themeId} transparent={transparent}>
    <RequestFlowContent />
  </MotionStage>
);

const RequestFlowContent: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useChannelTheme();
  const packetX = interpolate(frame, [14, 104], [190, 1730], clamp);

  return (
    <>
      <VideoBadge>DEMO / REQUEST FLOW</VideoBadge>
      <ReadablePanel left={74} top={112} padding="20px 26px 22px">
        <div style={{fontSize: 58, fontWeight: 800}}>Запрос пересекает четыре границы.</div>
      </ReadablePanel>
      <div style={{position: 'absolute', left: 185, right: 185, top: 563, height: 3, background: theme.line}} />
      {services.map(([label, detail], index) => (
        <ServiceCard
          key={label}
          x={positions[index] ?? 0}
          y={505}
          label={label}
          detail={detail}
          active={frame >= 18 + index * 25}
        />
      ))}
      <DataPacket x={packetX} y={565} label="request" />
    </>
  );
};

export default RequestFlow;
