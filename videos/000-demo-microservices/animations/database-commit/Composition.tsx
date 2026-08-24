import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {MotionStage, TechnicalLabel, useChannelTheme} from '@channel/design-system';
import {clamp} from '@channel/motion-core';
import type {ThemeId} from '@channel/design-system';
import {ReadablePanel} from '../../shared/ReadablePanel';
import {VideoBadge} from '../../shared/VideoBadge';

type DatabaseCommitProps = {
  themeId?: ThemeId;
  transparent?: boolean;
};

const DatabaseCommit: React.FC<DatabaseCommitProps> = ({
  themeId = 'paper',
  transparent = true,
}) => (
  <MotionStage themeId={themeId} transparent={transparent}>
    <CommitContent />
  </MotionStage>
);

const CommitContent: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useChannelTheme();
  const progress = interpolate(frame, [18, 74], [0, 1], clamp);
  const committed = frame >= 76;

  return (
    <>
      <VideoBadge>DEMO / DATABASE COMMIT</VideoBadge>
      <ReadablePanel left={220} top={300} width={1480} padding="46px 52px 52px">
        <div style={{fontSize: 62, fontWeight: 800}}>Сначала WAL. Потом подтверждение.</div>
        <div style={{marginTop: 110}}>
          <TechnicalLabel>BEGIN → ROW CHANGE → WAL APPEND → FSYNC → COMMIT</TechnicalLabel>
          <div style={{height: 16, marginTop: 28, background: theme.line}}>
            <div
              style={{
                height: '100%',
                width: `${progress * 100}%`,
                background: committed ? theme.success : theme.signal,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 42,
              fontWeight: 800,
              color: committed ? theme.success : theme.text,
            }}
          >
            {committed ? 'COMMIT DURABLE' : 'WRITING WAL'}
          </div>
        </div>
      </ReadablePanel>
    </>
  );
};

export default DatabaseCommit;
