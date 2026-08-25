import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import type {ChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {authorityNodes, resourceRecords} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const accentColor = (
  theme: ChannelTheme,
  accent: 'primary' | 'signal' | 'success',
): string => theme[accent];

const RecordRow: React.FC<{
  readonly active: boolean;
  readonly index: number;
  readonly ipFocus: number;
  readonly reveal: number;
  readonly rolesReveal: number;
}> = ({active, index, ipFocus, reveal, rolesReveal}) => {
  const theme = useChannelTheme();
  const record = resourceRecords[index];
  if (!record) return null;

  const staggeredReveal = clamp01(reveal * 1.55 - index * 0.18);
  const isIpRecord = record.type === 'A' || record.type === 'AAAA';
  const focusStrength = isIpRecord ? ipFocus : 0;
  const rowColor = accentColor(theme, record.accent);

  return (
    <div
      style={{
        height: 78,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '92px 1fr 210px',
        alignItems: 'center',
        borderTop: `2px solid ${active ? rowColor : theme.line}`,
        background: focusStrength > 0 ? `${theme.primary}${Math.round(focusStrength * 28).toString(16).padStart(2, '0')}` : 'transparent',
        opacity: staggeredReveal,
        transform: `translateX(${(1 - staggeredReveal) * 34}px)`,
      }}
    >
      <div
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '25px 0 0 18px',
          borderLeft: `6px solid ${rowColor}`,
          color: rowColor,
          font: `700 18px ${theme.fontMono}`,
          letterSpacing: 1.2,
        }}
      >
        {record.type}
      </div>
      <div style={{color: theme.text, font: `700 17px ${theme.fontMono}`}}>{record.value}</div>
      <div
        style={{
          justifySelf: 'end',
          color: active ? rowColor : theme.muted,
          font: `700 12px ${theme.fontMono}`,
          letterSpacing: 1.2,
          opacity: Math.max(0.35, rolesReveal),
        }}
      >
        {record.role}
      </div>
    </div>
  );
};

const AuthorityRail: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 818,
        width: contentWidth,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 20}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{color: theme.success, font: `700 13px ${theme.fontMono}`, letterSpacing: 1.5}}>
          AUTHORITATIVE SET
        </div>
        <div style={{height: 2, flex: 1, background: theme.success}} />
        <div style={{color: theme.muted, font: `12px ${theme.fontMono}`, letterSpacing: 1.2}}>
          ОДНА ЗОНА / НЕСКОЛЬКО КОПИЙ
        </div>
      </div>
      <div style={{marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20}}>
        {authorityNodes.map((node, index) => {
          const nodeReveal = clamp01(reveal * 1.6 - index * 0.22);
          return (
            <div
              key={node.id}
              style={{
                boxSizing: 'border-box',
                paddingTop: 12,
                borderTop: `4px solid ${theme.success}`,
                opacity: nodeReveal,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: theme.text, font: `700 13px ${theme.fontMono}`}}>{node.id}</span>
                <span style={{color: theme.success, font: `700 12px ${theme.fontMono}`}}>{node.location}</span>
              </div>
              <div style={{marginTop: 7, color: theme.muted, font: `11px ${theme.fontMono}`}}>{node.address}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const RecordStoreDiagram: React.FC<{
  readonly authorityReveal: number;
  readonly ipFocus: number;
  readonly operationalReveal: number;
  readonly recordReveal: number;
  readonly reveal: number;
}> = ({authorityReveal, ipFocus, operationalReveal, recordReveal, reveal}) => {
  const theme = useChannelTheme();
  const activeRowIndex = operationalReveal > 0
    ? Math.min(resourceRecords.length - 1, Math.floor(operationalReveal * resourceRecords.length))
    : 0;

  return (
    <div style={{position: 'absolute', inset: 0, opacity: reveal}}>
      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 194,
          width: contentWidth,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <div style={{color: theme.primary, font: `700 15px ${theme.fontMono}`, letterSpacing: 1.8}}>
          KEY / DNS NAME
        </div>
        <div style={{color: theme.success, font: `700 13px ${theme.fontMono}`, letterSpacing: 1.4, opacity: authorityReveal}}>
          DISTRIBUTED / AUTHORITATIVE
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 234,
          width: contentWidth,
          height: 112,
          boxSizing: 'border-box',
          padding: '24px 26px',
          borderTop: `5px solid ${theme.primary}`,
          borderBottom: `2px solid ${theme.line}`,
        }}
      >
        <div style={{color: theme.text, font: `700 35px ${theme.fontMono}`, letterSpacing: -1.4}}>
          example.com.
        </div>
        <div style={{marginTop: 10, color: theme.muted, font: `12px ${theme.fontMono}`, letterSpacing: 1.3}}>
          OWNER NAME / CLASS IN / TTL 300
        </div>
      </div>

      <div style={{position: 'absolute', left: contentLeft, top: 384, width: contentWidth}}>
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            color: theme.muted,
            font: `12px ${theme.fontMono}`,
            letterSpacing: 1.4,
          }}
        >
          <span>TYPE / VALUE</span>
          <span style={{opacity: operationalReveal}}>СМЫСЛ ДАННЫХ</span>
        </div>
        {resourceRecords.map((record, index) => (
          <RecordRow
            key={record.type}
            active={operationalReveal > 0.04 && index <= activeRowIndex}
            index={index}
            ipFocus={ipFocus}
            reveal={recordReveal}
            rolesReveal={operationalReveal}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 746,
          width: contentWidth,
          display: 'flex',
          justifyContent: 'space-between',
          color: theme.muted,
          font: `13px ${theme.fontMono}`,
          letterSpacing: 1.3,
        }}
      >
        <span style={{color: theme.primary, opacity: ipFocus}}>IP — ТОЛЬКО ОДИН ИЗ ТИПОВ</span>
        <span style={{color: theme.signal, opacity: operationalReveal}}>40 ЛЕТ / НОВЫЕ СМЫСЛЫ</span>
      </div>

      <AuthorityRail reveal={authorityReveal} />
    </div>
  );
};
