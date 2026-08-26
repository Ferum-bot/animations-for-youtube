import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {recordFields} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const fieldColumns = '250px 110px 100px 90px 278px';

export const RecordAnatomy: React.FC<{
  readonly activeFieldIndex: number;
  readonly fieldsReveal: number;
  readonly leafReveal: number;
  readonly recordReveal: number;
  readonly resolvedReveal: number;
}> = ({activeFieldIndex, fieldsReveal, leafReveal, recordReveal, resolvedReveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 330,
        width: contentWidth,
        height: 650,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 42,
          width: contentWidth,
          height: 120,
          opacity: leafReveal * (1 - recordReveal),
        }}
      >
        <div style={{position: 'absolute', left: 32, top: 44, width: 640, height: 2, background: theme.primary}} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 31,
            width: 28,
            height: 28,
            background: theme.signal,
            transform: 'rotate(45deg)',
          }}
        />
        <div style={{position: 'absolute', left: 698, top: 13, color: theme.muted, font: `12px ${theme.fontMono}`}}>
          LEAF / DATA SLOT
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: contentWidth,
          opacity: recordReveal,
          transform: `translateY(${(1 - recordReveal) * 22}px)`,
        }}
      >
        <div style={{color: theme.muted, font: `11px ${theme.fontMono}`, letterSpacing: 1.2}}>
          RAW RESOURCE RECORD
        </div>
        <div
          style={{
            marginTop: 14,
            boxSizing: 'border-box',
            padding: '22px 20px',
            borderTop: `4px solid ${theme.primary}`,
            borderBottom: `2px solid ${theme.line}`,
            color: theme.text,
            font: `700 20px ${theme.fontMono}`,
            letterSpacing: -0.8,
          }}
        >
          noise.ks.chicago.edu.&nbsp;&nbsp;300&nbsp;&nbsp;IN&nbsp;&nbsp;A&nbsp;&nbsp;192.0.2.42
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 150,
          width: contentWidth,
          display: 'grid',
          gridTemplateColumns: fieldColumns,
          gap: 8,
        }}
      >
        {recordFields.map((field, index) => {
          const reveal = clamp01(fieldsReveal * 1.65 - index * 0.12);
          const active = index === activeFieldIndex;
          const accent = theme[field.accent];

          return (
            <div
              key={field.id}
              style={{
                height: 174,
                boxSizing: 'border-box',
                padding: '20px 14px 0',
                borderTop: `5px solid ${active ? accent : theme.line}`,
                background: active ? `${accent}1F` : `${theme.surface}D9`,
                opacity: reveal,
                transform: `translateY(${(1 - reveal) * 30 - (active ? 8 : 0)}px)`,
              }}
            >
              <div style={{color: active ? accent : theme.muted, font: `700 11px ${theme.fontMono}`, letterSpacing: 1}}>
                {field.label}
              </div>
              <div
                style={{
                  marginTop: 28,
                  color: theme.text,
                  font: `700 ${field.id === 'name' ? 17 : 18}px ${theme.fontMono}`,
                  lineHeight: 1.25,
                  overflowWrap: 'anywhere',
                }}
              >
                {field.value}
              </div>
              <div
                style={{
                  marginTop: 22,
                  color: accent,
                  font: `700 9px ${theme.fontMono}`,
                  letterSpacing: 0.6,
                  lineHeight: 1.3,
                  opacity: active ? 1 : resolvedReveal * 0.66,
                }}
              >
                {field.meaning}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 390,
          width: contentWidth,
          display: 'grid',
          gridTemplateColumns: '1fr 56px 1fr',
          alignItems: 'center',
          opacity: resolvedReveal,
          transform: `translateY(${(1 - resolvedReveal) * 18}px)`,
        }}
      >
        <div style={{borderTop: `3px solid ${theme.primary}`, paddingTop: 16}}>
          <div style={{color: theme.primary, font: `700 12px ${theme.fontMono}`, letterSpacing: 1.1}}>OWNER + RULES</div>
          <div style={{marginTop: 10, color: theme.text, font: `800 23px ${theme.fontSans}`}}>NAME · TTL · CLASS</div>
        </div>
        <div style={{justifySelf: 'center', width: 14, height: 14, background: theme.signal, transform: 'rotate(45deg)'}} />
        <div style={{borderTop: `3px solid ${theme.success}`, paddingTop: 16}}>
          <div style={{color: theme.success, font: `700 12px ${theme.fontMono}`, letterSpacing: 1.1}}>MEANING + DATA</div>
          <div style={{marginTop: 10, color: theme.text, font: `800 23px ${theme.fontSans}`}}>TYPE · VALUE</div>
        </div>
      </div>
    </div>
  );
};
