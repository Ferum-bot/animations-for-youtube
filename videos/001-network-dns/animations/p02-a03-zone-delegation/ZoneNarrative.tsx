import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {hierarchyLabels, phaseCopy} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
type Phase = keyof typeof phaseCopy;

const ZoneLedger: React.FC<{
  readonly authorityReveal: number;
  readonly cutReveal: number;
  readonly handoffProgress: number;
}> = ({authorityReveal, cutReveal, handoffProgress}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 815,
        width: contentWidth,
        height: 104,
        display: 'grid',
        gridTemplateColumns: '1fr 70px 1fr',
        opacity: cutReveal,
      }}
    >
      <div style={{borderTop: `4px solid ${theme.primary}`, paddingTop: 15}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span style={{color: theme.primary, font: `700 11px ${theme.fontMono}`, letterSpacing: 1.1}}>
            PARENT ZONE
          </span>
          <span style={{color: theme.muted, font: `10px ${theme.fontMono}`}}>ks.chicago.edu</span>
        </div>
        <div style={{marginTop: 15, color: theme.text, font: `700 12px ${theme.fontMono}`}}>
          security&nbsp;&nbsp; NS&nbsp;&nbsp; ns1.security…
        </div>
      </div>

      <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', left: 34, top: 0, width: 3, height: 104, background: theme.signal}} />
        <div
          style={{
            position: 'absolute',
            left: 25,
            top: 38,
            width: 21,
            height: 21,
            background: handoffProgress > 0.9 ? theme.success : theme.signal,
            transform: 'rotate(45deg)',
          }}
        />
      </div>

      <div style={{borderTop: `4px solid ${authorityReveal > 0.7 ? theme.success : theme.signal}`, paddingTop: 15}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span style={{color: authorityReveal > 0.7 ? theme.success : theme.signal, font: `700 11px ${theme.fontMono}`, letterSpacing: 1.1}}>
            CHILD ZONE
          </span>
          <span style={{color: theme.muted, font: `10px ${theme.fontMono}`}}>security.ks…</span>
        </div>
        <div style={{marginTop: 15, color: theme.text, font: `700 12px ${theme.fontMono}`, opacity: authorityReveal}}>
          @&nbsp;&nbsp; SOA + NS&nbsp;&nbsp; AUTHORITATIVE
        </div>
      </div>
    </div>
  );
};

export const ZoneNarrative: React.FC<{
  readonly authorityReveal: number;
  readonly cutReveal: number;
  readonly handoffProgress: number;
  readonly hierarchyReveal: number;
  readonly phase: Phase;
  readonly phaseReveal: number;
}> = ({authorityReveal, cutReveal, handoffProgress, hierarchyReveal, phase, phaseReveal}) => {
  const theme = useChannelTheme();
  const copy = phaseCopy[phase];

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 188,
          width: contentWidth,
          opacity: phaseReveal,
          transform: `translateY(${(1 - phaseReveal) * 14}px)`,
        }}
      >
        <div style={{color: theme.signal, font: `700 13px ${theme.fontMono}`, letterSpacing: 1.7}}>
          {copy.eyebrow}
        </div>
        <div
          style={{
            marginTop: 15,
            maxWidth: 820,
            color: theme.text,
            fontFamily: theme.fontSans,
            fontSize: 39,
            fontWeight: 800,
            letterSpacing: -1.8,
            lineHeight: 0.98,
          }}
        >
          {copy.title}
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 150, width: 1080, height: 650, pointerEvents: 'none'}}>
        {hierarchyLabels.map((label, index) => {
          const labelReveal = clamp01(hierarchyReveal * 1.7 - index * 0.1);
          const isChild = label.id === 'security';

          return (
            <div
              key={label.id}
              style={{
                position: 'absolute',
                left: label.x,
                top: label.y,
                boxSizing: 'border-box',
                padding: '7px 10px 6px',
                borderLeft: `4px solid ${isChild && cutReveal > 0.5 ? theme.signal : theme.primary}`,
                background: `${theme.background}DE`,
                color: isChild && authorityReveal > 0.6 ? theme.success : theme.text,
                font: `700 11px ${theme.fontMono}`,
                letterSpacing: 0.75,
                opacity: labelReveal,
                transform: `translateY(${(1 - labelReveal) * 10}px)`,
              }}
            >
              {label.label}
            </div>
          );
        })}
      </div>

      <ZoneLedger
        authorityReveal={authorityReveal}
        cutReveal={cutReveal}
        handoffProgress={handoffProgress}
      />
    </>
  );
};
