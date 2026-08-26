import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {PortEntropyPhase} from './content';
import {portCandidates, portEntropyStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const KeyCell: React.FC<{
  readonly active: boolean;
  readonly label: string;
  readonly value: string;
}> = ({active, label, value}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        width: 214,
        height: 92,
        padding: '17px 16px',
        boxSizing: 'border-box',
        borderTop: `6px solid ${active ? theme.primary : theme.line}`,
        background: `${theme.surface}F3`,
      }}
    >
      <div style={{color: active ? theme.primary : theme.muted, font: `800 9px ${theme.fontMono}`}}>{label}</div>
      <div style={{marginTop: 13, color: theme.text, font: `800 22px ${theme.fontMono}`}}>{value}</div>
    </div>
  );
};

const GuessRow: React.FC<{
  readonly index: number;
  readonly progress: number;
}> = ({index, progress}) => {
  const theme = useChannelTheme();
  const reveal = clamp01(progress * 1.8 - index * 0.2);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '92px 96px 1fr',
        alignItems: 'center',
        height: 52,
        marginBottom: 8,
        padding: '0 13px',
        boxSizing: 'border-box',
        borderLeft: `5px solid ${theme.signal}`,
        background: `${theme.surface}ED`,
        opacity: reveal,
        transform: `translateX(${(1 - reveal) * 18}px)`,
      }}
    >
      <span style={{color: theme.text, font: `800 10px ${theme.fontMono}`}}>0x6A2C</span>
      <span style={{color: theme.signal, font: `800 10px ${theme.fontMono}`}}>{portCandidates[index]}</span>
      <span style={{color: theme.signal, font: `800 8px ${theme.fontMono}`, textAlign: 'right'}}>PORT MISMATCH</span>
    </div>
  );
};

export const PortEntropyDiagram: React.FC<{
  readonly phase: PortEntropyPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = portEntropyStage[phase.focus];
  const randomized = stage >= 2;
  const combined = stage >= 3;
  const rejecting = stage >= 4;
  const selectedPort = randomized ? 60433 : 53000;
  const entropyWidth = stage <= 1 ? 48 : stage === 2 ? 72 : 96;
  const entropyLabel = combined ? 'UP TO ≈32 BIT*' : randomized ? '16 BIT + PORT' : '16 BIT';

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 382, width: contentWidth, height: 570, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 34, width: 238, height: 116, padding: '21px 18px', boxSizing: 'border-box', borderLeft: `7px solid ${theme.primary}`, background: `${theme.surface}F4`}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span style={{color: theme.text, font: `800 16px ${theme.fontSans}`}}>RESOLVER</span>
          <span style={{color: randomized ? theme.primary : theme.muted, font: `800 8px ${theme.fontMono}`}}>{randomized ? 'RANDOM PORT' : 'FIXED PORT'}</span>
        </div>
        <div style={{marginTop: 16, color: theme.muted, font: `700 9px ${theme.fontMono}`}}>UDP / OUTBOUND QUERY</div>
      </div>

      <div style={{position: 'absolute', left: 238, top: 84, width: 208, height: 7, background: theme.line}}>
        <div style={{height: '100%', width: `${stage === 0 ? phaseProgress * 100 : 100}%`, background: theme.primary}} />
      </div>
      <div style={{position: 'absolute', left: 314, top: 50, width: 160, color: theme.primary, font: `800 12px ${theme.fontMono}`, textAlign: 'center'}}>
        :{selectedPort}
      </div>

      <div style={{position: 'absolute', left: 446, top: 24, width: 414, height: 148, padding: '22px 20px', boxSizing: 'border-box', borderTop: `7px solid ${combined ? theme.success : theme.signal}`, background: `${theme.surface}F4`}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span style={{color: theme.text, font: `800 17px ${theme.fontSans}`}}>RESPONSE MATCH LOCK</span>
          <span style={{color: combined ? theme.success : theme.signal, font: `800 8px ${theme.fontMono}`}}>{combined ? 'TWO KEYS' : 'ONE KEY'}</span>
        </div>
        <div style={{display: 'flex', gap: 10, marginTop: 20}}>
          <div style={{flex: 1, height: 52, padding: '11px 12px', boxSizing: 'border-box', background: theme.background}}>
            <div style={{color: theme.signal, font: `800 8px ${theme.fontMono}`}}>TXID</div>
            <div style={{marginTop: 7, color: theme.text, font: `800 14px ${theme.fontMono}`}}>0x6A2C</div>
          </div>
          <div style={{flex: 1, height: 52, padding: '11px 12px', boxSizing: 'border-box', background: theme.background, opacity: randomized ? 1 : 0.24}}>
            <div style={{color: theme.primary, font: `800 8px ${theme.fontMono}`}}>SOURCE PORT</div>
            <div style={{marginTop: 7, color: theme.text, font: `800 14px ${theme.fontMono}`}}>{selectedPort}</div>
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 220, display: 'flex', gap: 12}}>
        <KeyCell active label="FIELD 01 / DNS" value="TXID 16 BIT" />
        <div style={{width: 58, height: 92, display: 'grid', placeItems: 'center', color: combined ? theme.success : theme.muted, font: `800 30px ${theme.fontSans}`}}>{combined ? '+' : '→'}</div>
        <KeyCell active={randomized} label="FIELD 02 / UDP" value={`PORT ${randomized ? '≈16' : '0'} BIT`} />
      </div>

      <div style={{position: 'absolute', left: 0, top: 344, width: 498}}>
        <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 9px ${theme.fontMono}`}}>
          <span>EFFECTIVE GUESSING SPACE</span>
          <span style={{color: combined ? theme.success : theme.signal}}>{entropyLabel}</span>
        </div>
        <div style={{height: 10, marginTop: 13, background: theme.line}}>
          <div style={{width: `${entropyWidth}%`, height: '100%', background: combined ? theme.success : theme.signal, transition: 'none'}} />
        </div>
        <div style={{marginTop: 11, color: theme.muted, font: `700 7px ${theme.fontMono}`}}>* AVAILABLE PORT RANGE AND NAT BEHAVIOR CAN REDUCE ENTROPY</div>
      </div>

      <div style={{position: 'absolute', left: 540, top: 216, width: 320}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 14, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
          <span>FORGED RESPONSES</span>
          <span style={{color: rejecting ? theme.signal : theme.muted}}>{rejecting ? 'REJECTED' : 'WAITING'}</span>
        </div>
        {portCandidates.slice(0, 3).map((_, index) => (
          <GuessRow key={index} index={index} progress={rejecting ? phaseProgress : 0} />
        ))}
      </div>
    </div>
  );
};
