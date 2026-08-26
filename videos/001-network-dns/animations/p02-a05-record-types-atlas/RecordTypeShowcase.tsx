import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {RecordTypePhase, RecordTypePhaseId} from './content';
import {recordTypePhases} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const RecordExample: React.FC<{
  readonly accent: string;
  readonly explanation: string;
  readonly record: string;
  readonly reveal: number;
}> = ({accent, explanation, record, reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: 190,
        top: 410,
        width: 670,
        boxSizing: 'border-box',
        padding: '18px 18px 20px',
        borderTop: `4px solid ${accent}`,
        background: `${theme.surface}D8`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 12}px)`,
      }}
    >
      <div
        style={{
          color: accent,
          font: `700 11px ${theme.fontMono}`,
          letterSpacing: 1.7,
        }}
      >
        ПРИМЕР DNS-ЗАПИСИ
      </div>
      <div
        style={{
          marginTop: 14,
          color: theme.text,
          font: `700 18px ${theme.fontMono}`,
          lineHeight: 1.35,
          overflowWrap: 'anywhere',
        }}
      >
        {record}
      </div>
      <div
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: `2px solid ${theme.line}`,
          color: theme.text,
          font: `600 15px ${theme.fontSans}`,
          lineHeight: 1.35,
        }}
      >
        {explanation}
      </div>
    </div>
  );
};

const SemanticDiagram: React.FC<{
  readonly id: RecordTypePhaseId;
  readonly reveal: number;
}> = ({id, reveal}) => {
  const theme = useChannelTheme();
  const box = (label: string, left: number, top: number, color: string, width = 190) => (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height: 64,
        boxSizing: 'border-box',
        padding: '22px 14px 0',
        borderTop: `4px solid ${color}`,
        background: `${theme.surface}E8`,
        color: theme.text,
        font: `700 12px ${theme.fontMono}`,
        textAlign: 'center',
      }}
    >
      {label}
    </div>
  );

  if (id === 'catalog') {
    return (
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, opacity: reveal}}>
        {['SRV', 'CAA', 'NAPTR', 'TLSA', 'SVCB', 'HTTPS'].map((type, index) => (
          <div
            key={type}
            style={{
              boxSizing: 'border-box',
              padding: '22px 16px 0',
              borderTop: `4px solid ${index % 2 === 0 ? theme.primary : theme.signal}`,
              color: theme.text,
              font: `700 17px ${theme.fontMono}`,
              opacity: clamp01(reveal * 1.6 - index * 0.1),
            }}
          >
            {type}
          </div>
        ))}
      </div>
    );
  }

  const labels = {
    address: ['DNS NAME', 'IPv4 / IPv6'],
    authority: ['PARENT ZONE', 'AUTHORITATIVE NS'],
    alias: ['ALIAS', 'CANONICAL NAME'],
    mail: ['DOMAIN', 'MAIL SERVER / 10'],
    text: ['DOMAIN', 'POLICY / VERIFY'],
  } as const;
  const pair = labels[id];
  const accent = id === 'authority' || id === 'mail' ? theme.signal : id === 'text' || id === 'alias' ? theme.success : theme.primary;

  return (
    <div style={{position: 'absolute', inset: 0, opacity: reveal}}>
      {box(pair[0], 12, 58, theme.primary, 198)}
      <div style={{position: 'absolute', left: 210, top: 89, width: 214, height: 3, background: theme.line}}>
        <div style={{width: `${reveal * 100}%`, height: '100%', background: accent}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 310 + reveal * 104,
          top: 78,
          width: 22,
          height: 22,
          background: accent,
          transform: 'rotate(45deg)',
        }}
      />
      {box(pair[1], 424, 58, accent, 210)}
      {id === 'text' ? (
        <div style={{position: 'absolute', left: 424, top: 140, width: 210, color: theme.muted, font: `10px ${theme.fontMono}`, lineHeight: 1.7}}>
          SPF / DKIM<br />VERIFICATION TOKEN
        </div>
      ) : null}
    </div>
  );
};

export const RecordTypeShowcase: React.FC<{
  readonly activeIndex: number;
  readonly phase: RecordTypePhase;
  readonly phaseReveal: number;
  readonly reveal: number;
}> = ({activeIndex, phase, phaseReveal, reveal}) => {
  const theme = useChannelTheme();
  const accent = theme[phase.accent];
  const markerTop = activeIndex * 58 + 20;

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 332,
        width: contentWidth,
        height: 650,
        opacity: reveal,
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, width: 158, height: 350}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: markerTop,
            width: 12,
            height: 12,
            background: accent,
            transform: 'translateY(-50%) rotate(45deg)',
          }}
        />
        {recordTypePhases.map((item, index) => (
          <div
            key={item.id}
            style={{
              height: 58,
              boxSizing: 'border-box',
              padding: '13px 0 0 30px',
              borderTop: `2px solid ${index === activeIndex ? theme[item.accent] : theme.line}`,
              color: index === activeIndex ? theme.text : theme.muted,
              font: `700 13px ${theme.fontMono}`,
            }}
          >
            {item.typeLabel}
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 190,
          top: 0,
          width: 670,
          height: 330,
          boxSizing: 'border-box',
          borderTop: `6px solid ${accent}`,
          opacity: phaseReveal,
          transform: `translateX(${(1 - phaseReveal) * 20}px)`,
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 22, color: accent, font: `800 72px ${theme.fontSans}`, letterSpacing: -4}}>
          {phase.typeLabel}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 44,
            width: 350,
            color: theme.text,
            font: `800 18px ${theme.fontSans}`,
            lineHeight: 1.1,
          }}
        >
          {phase.definition}
        </div>
        <div style={{position: 'absolute', left: 0, top: 128, width: 670, height: 180}}>
          <SemanticDiagram id={phase.id} reveal={phaseReveal} />
        </div>
      </div>

      <RecordExample
        accent={accent}
        explanation={phase.recordExplanation}
        record={phase.record}
        reveal={phaseReveal}
      />
    </div>
  );
};
