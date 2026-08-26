import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {PrivacyQuestionPhase} from './content';
import {privacyQuestionStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const LockGlyph: React.FC<{readonly locked: boolean}> = ({locked}) => {
  const theme = useChannelTheme();
  const accent = locked ? theme.success : theme.signal;

  return (
    <div style={{position: 'relative', width: 54, height: 58}}>
      <div style={{position: 'absolute', left: locked ? 14 : 26, top: 0, width: 26, height: 28, border: `4px solid ${accent}`, borderBottom: 'none', borderRadius: '16px 16px 0 0', transform: locked ? 'none' : 'rotate(24deg)', transformOrigin: 'left bottom'}} />
      <div style={{position: 'absolute', left: 7, bottom: 0, width: 46, height: 35, background: accent}} />
      <div style={{position: 'absolute', left: 28, bottom: 11, width: 5, height: 12, background: theme.background}} />
    </div>
  );
};

const ResolverGlyph: React.FC<{readonly chosen: boolean}> = ({chosen}) => {
  const theme = useChannelTheme();
  const accent = chosen ? theme.primary : theme.muted;

  return (
    <div style={{position: 'relative', width: 64, height: 58}}>
      <div style={{position: 'absolute', left: 2, top: 11, width: 60, height: 7, background: accent, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'}} />
      {[8, 25, 42].map((left) => <div key={left} style={{position: 'absolute', left, top: 22, width: 11, height: 26, borderLeft: `3px solid ${accent}`, borderRight: `3px solid ${accent}`}} />)}
      <div style={{position: 'absolute', left: 2, bottom: 3, width: 60, height: 5, background: accent}} />
      {chosen ? <div style={{position: 'absolute', right: -8, top: 0, width: 14, height: 14, background: theme.primary, transform: 'rotate(45deg)'}} /> : null}
    </div>
  );
};

const BinaryControl: React.FC<{
  readonly index: '01' | '02';
  readonly label: string;
  readonly leftValue: string;
  readonly rightValue: string;
  readonly activeRight: boolean;
  readonly accent: string;
  readonly reveal: number;
  readonly glyph: React.ReactNode;
}> = ({index, label, leftValue, rightValue, activeRight, accent, reveal, glyph}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'relative', width: 408, height: 170, boxSizing: 'border-box', padding: '20px 22px', background: `${theme.surface}F2`, borderTop: `7px solid ${accent}`, opacity: reveal, transform: `translateX(${(1 - reveal) * -16}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 15}}>
        <div style={{color: accent, font: `800 11px ${theme.fontMono}`}}>{index}</div>
        <div style={{color: theme.text, font: `800 16px ${theme.fontSans}`}}>{label}</div>
      </div>
      <div style={{position: 'absolute', left: 22, bottom: 22}}>{glyph}</div>
      <div style={{position: 'absolute', left: 103, right: 22, bottom: 31, height: 50}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 14, height: 5, background: theme.line}} />
        <div style={{position: 'absolute', left: activeRight ? 'calc(100% - 28px)' : 0, top: 2, width: 28, height: 28, background: accent, transform: 'rotate(45deg)'}} />
        <div style={{position: 'absolute', left: 0, top: 36, color: activeRight ? theme.muted : accent, font: `800 8px ${theme.fontMono}`}}>{leftValue}</div>
        <div style={{position: 'absolute', right: 0, top: 36, color: activeRight ? accent : theme.muted, font: `800 8px ${theme.fontMono}`}}>{rightValue}</div>
      </div>
    </div>
  );
};

const PrivacyMatrix: React.FC<{readonly reveal: number; readonly lesson: boolean}> = ({reveal, lesson}) => {
  const theme = useChannelTheme();
  const cells = [
    {id: 'clear-isp', row: 0, column: 0, label: 'ОТКРЫТО / ISP', state: 'PATH VISIBLE', accent: theme.signal},
    {id: 'clear-public', row: 0, column: 1, label: 'ОТКРЫТО / PUBLIC', state: 'PATH VISIBLE', accent: theme.signal},
    {id: 'encrypted-isp', row: 1, column: 0, label: 'ШИФР / ISP', state: 'ISP RESOLVER', accent: theme.primary},
    {id: 'encrypted-public', row: 1, column: 1, label: 'ШИФР / PUBLIC', state: 'TRUST MOVED', accent: theme.success},
  ] as const;

  return (
    <div style={{position: 'absolute', left: 454, top: 0, width: 406, height: 382, boxSizing: 'border-box', padding: '18px 18px 16px', background: `${theme.background}F5`, border: `2px solid ${theme.line}`, opacity: reveal, transform: `translateX(${(1 - reveal) * 18}px)`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
        <span>2 × 2 PRIVACY MODEL</span><span style={{color: lesson ? theme.success : theme.primary}}>INDEPENDENT AXES</span>
      </div>
      <div style={{position: 'absolute', left: 82, top: 62, right: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, color: theme.muted, font: `800 8px ${theme.fontMono}`, textAlign: 'center'}}>
        <span>ISP RESOLVER</span><span>CHOSEN RESOLVER</span>
      </div>
      <div style={{position: 'absolute', left: 11, top: 118, width: 62, color: theme.muted, font: `800 8px ${theme.fontMono}`, lineHeight: 1.4, textAlign: 'right'}}>CLEAR<br />TEXT</div>
      <div style={{position: 'absolute', left: 11, top: 235, width: 62, color: theme.muted, font: `800 8px ${theme.fontMono}`, lineHeight: 1.4, textAlign: 'right'}}>ENCRYP-<br />TED</div>
      <div style={{position: 'absolute', left: 82, top: 94, right: 18, bottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8}}>
        {cells.map((cell, index) => {
          const cellReveal = clamp01(reveal * 1.55 - index * 0.13);
          const highlighted = lesson && cell.id === 'encrypted-public';
          return (
            <div key={cell.id} style={{position: 'relative', boxSizing: 'border-box', padding: '15px 12px', background: highlighted ? `${theme.success}28` : theme.surface, borderTop: `5px solid ${cell.accent}`, opacity: cellReveal}}>
              <div style={{color: theme.text, font: `800 10px ${theme.fontSans}`}}>{cell.label}</div>
              <div style={{marginTop: 10, color: cell.accent, font: `800 7px ${theme.fontMono}`}}>{cell.state}</div>
              {highlighted ? <div style={{position: 'absolute', right: 10, bottom: 10, width: 10, height: 10, background: theme.success, transform: 'rotate(45deg)'}} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PrivacyTwoQuestionDiagram: React.FC<{
  readonly phase: PrivacyQuestionPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = privacyQuestionStage[phase.focus];
  const showEncrypt = stage >= 1;
  const showOwner = stage >= 2;
  const showMatrix = stage >= 3;
  const lesson = stage >= 4;
  const encryptReveal = showEncrypt ? (stage === 1 ? phaseProgress : 1) : stage === 0 ? phaseProgress * 0.28 : 0;
  const ownerReveal = showOwner ? (stage === 2 ? phaseProgress : 1) : stage === 0 ? phaseProgress * 0.28 : 0;
  const matrixReveal = showMatrix ? (stage === 3 ? phaseProgress : 1) : 0;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 388, width: contentWidth, height: 548, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <BinaryControl
          accent={theme.success}
          activeRight={showEncrypt}
          glyph={<LockGlyph locked={showEncrypt} />}
          index="01"
          label="КАНАЛ"
          leftValue="ОТКРЫТ"
          reveal={encryptReveal}
          rightValue="ЗАШИФРОВАН"
        />
      </div>
      <div style={{position: 'absolute', left: 0, top: 212}}>
        <BinaryControl
          accent={theme.primary}
          activeRight={showOwner}
          glyph={<ResolverGlyph chosen={showOwner} />}
          index="02"
          label="РЕЗОЛВЕР"
          leftValue="ISP"
          reveal={ownerReveal}
          rightValue="ВЫБРАННЫЙ"
        />
      </div>

      <PrivacyMatrix lesson={lesson} reveal={matrixReveal} />

      <div style={{position: 'absolute', left: 454, top: 408, width: 406, height: 82, boxSizing: 'border-box', padding: '16px 18px', borderLeft: `6px solid ${theme.success}`, background: `${theme.surface}F2`, opacity: lesson ? phaseProgress : 0, transform: `translateY(${lesson ? (1 - phaseProgress) * 12 : 12}px)`}}>
        <div style={{color: theme.success, font: `800 9px ${theme.fontMono}`}}>TWO CHECKS</div>
        <div style={{marginTop: 10, color: theme.text, font: `800 15px ${theme.fontSans}`}}>Канал отвечает за секретность. Резолвер — за доверие.</div>
      </div>
    </div>
  );
};
