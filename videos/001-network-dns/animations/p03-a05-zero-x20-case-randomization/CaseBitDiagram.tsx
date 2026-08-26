import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {CaseRandomizationPhase} from './content';
import {caseBits, caseRandomizationStage, domainGlyphs, forgedBits} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const getRenderedName = (bits: readonly number[]) => {
  let letterIndex = 0;
  return domainGlyphs.map((glyph) => {
    if (glyph === '.') return glyph;
    const bit = bits[letterIndex] ?? 0;
    letterIndex += 1;
    return bit === 1 ? glyph.toUpperCase() : glyph;
  });
};

const NameStrip: React.FC<{
  readonly bits: readonly number[];
  readonly label: string;
  readonly reveal: number;
  readonly state: 'query' | 'valid' | 'forged';
  readonly showBits: boolean;
}> = ({bits, label, reveal, state, showBits}) => {
  const theme = useChannelTheme();
  const glyphs = getRenderedName(bits);
  const accent = state === 'valid' ? theme.success : state === 'forged' ? theme.signal : theme.primary;
  let letterIndex = 0;

  return (
    <div style={{opacity: reveal, transform: `translateY(${(1 - reveal) * 12}px)`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>
        <span>{label}</span>
        <span style={{color: accent}}>{state === 'valid' ? 'CASE MATCH' : state === 'forged' ? 'CASE MISMATCH' : showBits ? 'RANDOMIZED' : 'QNAME'}</span>
      </div>
      <div style={{display: 'flex', gap: 5}}>
        {glyphs.map((glyph, index) => {
          const isDot = glyph === '.';
          const bitIndex = isDot ? -1 : letterIndex++;
          const bit = bitIndex >= 0 ? bits[bitIndex] ?? 0 : undefined;
          return (
            <div
              key={`${index}-${glyph}`}
              style={{
                width: isDot ? 20 : 48,
                height: 70,
                paddingTop: isDot ? 33 : 14,
                boxSizing: 'border-box',
                borderTop: isDot ? 'none' : `5px solid ${accent}`,
                background: isDot ? 'transparent' : `${theme.surface}F2`,
                textAlign: 'center',
              }}
            >
              <div style={{color: isDot ? theme.muted : theme.text, font: `800 ${isDot ? 23 : 25}px ${theme.fontMono}`}}>{glyph}</div>
              {!isDot && showBits ? <div style={{marginTop: 8, color: accent, font: `800 8px ${theme.fontMono}`}}>BIT {bit}</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CaseBitDiagram: React.FC<{
  readonly phase: CaseRandomizationPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = caseRandomizationStage[phase.focus];
  const showBits = stage >= 2;
  const showResponse = stage >= 3;
  const showForged = stage >= 4;
  const responseReveal = showResponse ? (stage === 3 ? phaseProgress : 1) : 0;
  const forgedReveal = showForged ? (stage === 4 ? phaseProgress : 1) : 0;
  const lessonReveal = stage === 5 ? phaseProgress : 0;
  const equivalentReveal = stage >= 1 ? 1 : 0;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 390, width: contentWidth, height: 560, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 650}}>
        <NameStrip bits={stage === 0 ? forgedBits.map(() => 0) : caseBits} label="OUTBOUND QUESTION / QNAME" reveal={stage === 0 ? phaseProgress : 1} state="query" showBits={showBits} />
      </div>

      <div style={{position: 'absolute', left: 0, top: 120, width: 650, height: 54, opacity: equivalentReveal}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <span style={{color: theme.text, font: `800 16px ${theme.fontMono}`}}>uchicago.edu</span>
          <span style={{color: theme.primary, font: `800 22px ${theme.fontSans}`}}>≡</span>
          <span style={{color: theme.text, font: `800 16px ${theme.fontMono}`}}>UCHICAGO.EDU</span>
          <span style={{color: theme.muted, font: `700 8px ${theme.fontMono}`}}>SAME DNS NAME</span>
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 190, width: 650}}>
        <NameStrip bits={caseBits} label="AUTHENTIC RESPONSE / QUESTION ECHO" reveal={responseReveal} state="valid" showBits={showBits} />
      </div>

      <div style={{position: 'absolute', left: 0, top: 314, width: 650}}>
        <NameStrip bits={forgedBits} label="FORGED RESPONSE / GUESSED PATTERN" reveal={forgedReveal} state="forged" showBits={showBits} />
      </div>

      <div style={{position: 'absolute', left: 682, top: 0, width: 178, height: 384, padding: '18px 14px', boxSizing: 'border-box', borderTop: `7px solid ${showForged ? theme.signal : showResponse ? theme.success : theme.primary}`, background: `${theme.surface}F2`}}>
        <div style={{color: theme.text, font: `800 15px ${theme.fontSans}`}}>CASE CHECK</div>
        <div style={{marginTop: 12, color: theme.muted, font: `700 8px ${theme.fontMono}`, lineHeight: 1.45}}>MOST AUTHORITIES COPY QUESTION CASE INTO THE RESPONSE</div>
        <div style={{height: 2, marginTop: 22, background: theme.line}} />
        <div style={{marginTop: 21, color: theme.primary, font: `800 9px ${theme.fontMono}`}}>AVAILABLE LETTERS</div>
        <div style={{marginTop: 9, color: theme.text, font: `800 36px ${theme.fontMono}`}}>11</div>
        <div style={{marginTop: 7, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>≈ 11 EXTRA BITS</div>
        <div style={{height: 2, marginTop: 22, background: theme.line}} />
        <div style={{marginTop: 20, color: showForged ? theme.signal : showResponse ? theme.success : theme.muted, font: `800 10px ${theme.fontMono}`}}>
          {showForged ? 'FORGED / REJECT' : showResponse ? 'AUTHENTIC / MATCH' : 'AWAIT RESPONSE'}
        </div>
      </div>

      <div style={{position: 'absolute', left: 104, top: 454, width: 650, height: 76, padding: '17px 19px', boxSizing: 'border-box', borderLeft: `6px solid ${theme.success}`, background: `${theme.background}EA`, opacity: lessonReveal, transform: `translateY(${(1 - lessonReveal) * 12}px)`}}>
        <div style={{color: theme.success, font: `800 10px ${theme.fontMono}`}}>COMPATIBILITY HACK</div>
        <div style={{marginTop: 11, color: theme.text, font: `800 16px ${theme.fontSans}`}}>Те же байты имени получают вторую работу: несут дополнительную энтропию</div>
      </div>
    </div>
  );
};
