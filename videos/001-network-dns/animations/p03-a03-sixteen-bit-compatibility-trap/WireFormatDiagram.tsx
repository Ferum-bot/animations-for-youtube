import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {CompatibilityPhase} from './content';
import {compatibilityStage, dnsHeaderRows} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const HeaderGrid: React.FC<{
  readonly progress: number;
  readonly stage: number;
}> = ({progress, stage}) => {
  const theme = useChannelTheme();
  const showExpansion = stage >= 2;
  const showShift = stage >= 3;
  const expansion = showExpansion ? (stage === 2 ? progress : 1) : 0;
  const shiftProgress = stage === 3 ? progress : stage > 3 ? 1 : 0;

  return (
    <div style={{position: 'absolute', left: 0, top: 38, width: 498, height: 448}}>
      <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
        <span>DNS HEADER / 12 BYTES</span>
        <span style={{color: stage >= 1 ? theme.signal : theme.muted}}>WIRE CONTRACT / SINCE 1987</span>
      </div>

      <div style={{position: 'absolute', left: 0, top: 35, width: 498}}>
        {dnsHeaderRows.map((row, rowIndex) => (
          <div key={row[0]} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8}}>
            {row.map((label, columnIndex) => {
              const isId = rowIndex === 0 && columnIndex === 0;
              const displaced = showShift && !isId;
              return (
                <div
                  key={label}
                  style={{
                    height: 75,
                    padding: '18px 14px',
                    boxSizing: 'border-box',
                    borderTop: `5px solid ${isId ? theme.signal : displaced ? theme.signal : theme.primary}`,
                    background: `${theme.surface}F2`,
                    opacity: displaced ? 0.42 : 1,
                    transform: displaced ? `translateX(${(columnIndex === 0 ? -1 : 1) * shiftProgress * 10}px)` : undefined,
                  }}
                >
                  <div style={{color: isId ? theme.signal : theme.text, font: `800 11px ${theme.fontMono}`}}>{label}</div>
                  <div style={{marginTop: 12, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
                    BYTE {rowIndex * 4 + columnIndex * 2}…{rowIndex * 4 + columnIndex * 2 + 1}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 249,
          top: 35,
          width: 241,
          height: 75,
          padding: '18px 14px',
          boxSizing: 'border-box',
          borderTop: `5px solid ${theme.primary}`,
          background: `${theme.background}FA`,
          opacity: expansion,
          transform: `translateX(${(1 - expansion) * -28}px)`,
        }}
      >
        <div style={{color: theme.primary, font: `800 11px ${theme.fontMono}`}}>ID EXTENSION / +16 BIT</div>
        <div style={{marginTop: 12, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>NEW BYTE 2…3</div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 324, width: 498}}>
        <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
          <span>EXPECTED HEADER</span>
          <span style={{color: showExpansion ? theme.signal : theme.success}}>{showExpansion ? '14 BYTES' : '12 BYTES'}</span>
        </div>
        <div style={{height: 8, marginTop: 12, background: theme.line}}>
          <div style={{width: `${(showExpansion ? 0.72 + expansion * 0.18 : 0.72) * 100}%`, height: '100%', background: showExpansion ? theme.signal : theme.success}} />
        </div>
      </div>
    </div>
  );
};

const DecoderFleet: React.FC<{
  readonly progress: number;
  readonly stage: number;
}> = ({progress, stage}) => {
  const theme = useChannelTheme();
  const broken = stage >= 4;
  const shifted = stage >= 3;
  const nodes = [
    {label: 'LEGACY RESOLVER', version: 'PARSER / V1'},
    {label: 'AUTHORITATIVE', version: 'PARSER / V1'},
    {label: 'CPE ROUTER', version: 'DNS PROXY'},
    {label: 'FIREWALL', version: 'PACKET INSPECTOR'},
  ] as const;

  return (
    <div style={{position: 'absolute', left: 548, top: 38, width: 312, height: 448}}>
      <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
        <span>INSTALLED BASE</span>
        <span>FIXED OFFSETS</span>
      </div>

      <div style={{marginTop: 35}}>
        {nodes.map((node, index) => {
          const failureReveal = broken ? clamp01(progress * 1.7 - index * 0.13) : 0;
          return (
            <div
              key={node.label}
              style={{
                height: 76,
                marginBottom: 11,
                padding: '15px 14px',
                boxSizing: 'border-box',
                borderLeft: `6px solid ${failureReveal > 0.2 ? theme.signal : shifted ? theme.primary : theme.line}`,
                background: `${theme.surface}F1`,
                opacity: stage === 0 ? 0.42 + progress * 0.58 : 1,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', gap: 10}}>
                <span style={{color: theme.text, font: `800 11px ${theme.fontSans}`}}>{node.label}</span>
                <span style={{color: failureReveal > 0.2 ? theme.signal : theme.muted, font: `800 8px ${theme.fontMono}`}}>{failureReveal > 0.2 ? 'MISMATCH' : node.version}</span>
              </div>
              <div style={{marginTop: 11, color: failureReveal > 0.2 ? theme.signal : theme.muted, font: `700 8px ${theme.fontMono}`}}>
                {failureReveal > 0.2 ? 'FLAGS READ FROM WRONG BYTE' : 'FLAGS EXPECTED @ BYTE 2'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const WireFormatDiagram: React.FC<{
  readonly phase: CompatibilityPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = compatibilityStage[phase.focus];
  const breakReveal = stage === 4 ? phaseProgress : 0;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 382, width: contentWidth, height: 570, opacity: reveal}}>
      <HeaderGrid progress={phaseProgress} stage={stage} />
      <DecoderFleet progress={phaseProgress} stage={stage} />

      <div
        style={{
          position: 'absolute',
          left: 498,
          top: 72,
          width: 50,
          height: 352,
          display: 'grid',
          placeItems: 'center',
          color: stage >= 3 ? theme.signal : theme.muted,
          font: `800 23px ${theme.fontSans}`,
          opacity: stage >= 2 ? 1 : 0.2,
        }}
      >
        {stage >= 3 ? '≠' : '→'}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 528,
          top: 426,
          width: 332,
          height: 84,
          padding: '16px 17px',
          boxSizing: 'border-box',
          borderTop: `6px solid ${theme.signal}`,
          background: `${theme.background}EF`,
          opacity: breakReveal,
          transform: `translateY(${(1 - breakReveal) * 14}px)`,
        }}
      >
        <div style={{color: theme.signal, font: `800 10px ${theme.fontMono}`}}>WIRE FORMAT MISMATCH</div>
        <div style={{marginTop: 11, color: theme.text, font: `800 15px ${theme.fontSans}`}}>Новое сообщение несовместимо со старым декодером</div>
      </div>
    </div>
  );
};
