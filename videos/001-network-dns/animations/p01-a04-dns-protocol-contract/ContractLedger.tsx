import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {contractClauses, dnsWireSections} from './content';
import type {ContractClauseIndex} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const ContractClauseRow: React.FC<{
  readonly active: boolean;
  readonly children: React.ReactNode;
  readonly index: ContractClauseIndex;
  readonly reveal: number;
}> = ({active, children, index, reveal}) => {
  const theme = useChannelTheme();
  const clause = contractClauses[index];
  const accent = index < 2 ? theme.primary : index === 2 ? theme.success : theme.signal;

  return (
    <div
      style={{
        height: 164,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '70px 168px 1fr',
        alignItems: 'center',
        borderTop: `3px solid ${active ? accent : theme.line}`,
        opacity: reveal * (active ? 1 : 0.62),
        transform: `translateX(${(1 - reveal) * 26}px)`,
      }}
    >
      <div style={{color: active ? accent : theme.muted, font: `700 17px ${theme.fontMono}`}}>
        {clause.number}
      </div>
      <div>
        <div style={{color: active ? theme.text : theme.muted, font: `700 14px ${theme.fontMono}`, letterSpacing: 1.2}}>
          {clause.label}
        </div>
        <div style={{marginTop: 8, color: active ? accent : theme.muted, font: `11px ${theme.fontMono}`, letterSpacing: 0.7}}>
          {clause.summary}
        </div>
      </div>
      <div style={{minWidth: 0}}>{children}</div>
    </div>
  );
};

const MessagePair: React.FC<{readonly responseReveal: number}> = ({responseReveal}) => {
  const theme = useChannelTheme();

  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 58px 1fr', alignItems: 'center', gap: 12}}>
      <div style={{height: 62, boxSizing: 'border-box', padding: '12px 16px', borderLeft: `6px solid ${theme.primary}`, borderTop: `2px solid ${theme.primary}`}}>
        <div style={{color: theme.primary, font: `700 15px ${theme.fontMono}`}}>QUERY</div>
        <div style={{marginTop: 6, color: theme.muted, font: `11px ${theme.fontMono}`}}>QR=0</div>
      </div>
      <div style={{position: 'relative', height: 2, background: theme.line}}>
        <div style={{position: 'absolute', right: -2, top: -5, width: 10, height: 10, background: theme.signal, transform: 'rotate(45deg)'}} />
      </div>
      <div
        style={{
          height: 62,
          boxSizing: 'border-box',
          padding: '12px 16px',
          borderLeft: `6px solid ${theme.success}`,
          borderTop: `2px solid ${theme.success}`,
          opacity: responseReveal,
          transform: `translateX(${(1 - responseReveal) * 18}px)`,
        }}
      >
        <div style={{color: theme.success, font: `700 15px ${theme.fontMono}`}}>RESPONSE</div>
        <div style={{marginTop: 6, color: theme.muted, font: `11px ${theme.fontMono}`}}>QR=1</div>
      </div>
    </div>
  );
};

const SharedWireFormat: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1.25fr 1fr 1.2fr 1.35fr', borderTop: `2px solid ${theme.primary}`, borderBottom: `2px solid ${theme.line}`}}>
        {dnsWireSections.map((section, index) => {
          const sectionReveal = clamp01(reveal * 1.7 - index * 0.14);
          return (
            <div
              key={section}
              style={{
                height: 52,
                boxSizing: 'border-box',
                paddingTop: 20,
                borderLeft: index === 0 ? undefined : `2px solid ${theme.line}`,
                color: index < 2 ? theme.text : theme.muted,
                font: `700 9px ${theme.fontMono}`,
                letterSpacing: 0.2,
                textAlign: 'center',
                opacity: sectionReveal,
              }}
            >
              {section}
            </div>
          );
        })}
      </div>
      <div style={{marginTop: 10, display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `11px ${theme.fontMono}`}}>
        <span>QUERY</span>
        <span style={{color: theme.primary}}>ONE WIRE FORMAT</span>
        <span>RESPONSE</span>
      </div>
    </div>
  );
};

const ResourceRecordPayload: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div style={{display: 'grid', gridTemplateColumns: '92px 54px 1fr 84px', alignItems: 'center', borderTop: `2px solid ${theme.success}`, borderBottom: `2px solid ${theme.line}`}}>
      <div style={{height: 62, boxSizing: 'border-box', paddingTop: 23, color: theme.muted, font: `11px ${theme.fontMono}`}}>
        ANSWER[0]
      </div>
      <div style={{color: theme.success, font: `700 16px ${theme.fontMono}`, opacity: reveal}}>A</div>
      <div style={{color: theme.text, font: `700 16px ${theme.fontMono}`, opacity: reveal}}>203.0.113.42</div>
      <div style={{color: theme.signal, font: `700 12px ${theme.fontMono}`, textAlign: 'right', opacity: reveal}}>TTL 300</div>
    </div>
  );
};

const ExchangeRule: React.FC<{
  readonly requestProgress: number;
  readonly responseProgress: number;
  readonly ttlRemaining: number;
  readonly ttlReveal: number;
}> = ({requestProgress, responseProgress, ttlRemaining, ttlReveal}) => {
  const theme = useChannelTheme();
  const routeLeft = 86;
  const routeWidth = 384;
  const queryX = routeLeft + routeWidth * requestProgress;
  const responseX = routeLeft + routeWidth * (1 - responseProgress);

  return (
    <div style={{position: 'relative', height: 104}}>
      <div style={{position: 'absolute', left: 0, top: 24, width: 76, color: theme.text, font: `700 13px ${theme.fontMono}`}}>CLIENT</div>
      <div style={{position: 'absolute', right: 0, top: 24, width: 76, color: theme.text, font: `700 13px ${theme.fontMono}`, textAlign: 'right'}}>SERVER</div>
      <div style={{position: 'absolute', left: routeLeft, top: 31, width: routeWidth, height: 2, background: theme.line}} />
      <div style={{position: 'absolute', left: queryX - 7, top: 25, width: 14, height: 14, background: theme.primary, transform: 'rotate(45deg)', opacity: requestProgress}} />
      <div style={{position: 'absolute', left: responseX - 7, top: 25, width: 14, height: 14, background: theme.success, transform: 'rotate(45deg)', opacity: responseProgress}} />
      <div style={{position: 'absolute', left: routeLeft, right: 0, top: 54, display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `10px ${theme.fontMono}`}}>
        <span style={{color: theme.primary}}>QUERY →</span>
        <span style={{color: theme.success, opacity: responseProgress}}>← RESPONSE</span>
      </div>
      <div style={{position: 'absolute', left: routeLeft, right: 0, top: 80, height: 18, display: 'flex', alignItems: 'center', gap: 14, opacity: ttlReveal}}>
        <div style={{height: 3, flex: 1, background: theme.line}}>
          <div style={{width: `${Math.max(4, (ttlRemaining / 300) * 100)}%`, height: '100%', background: theme.signal}} />
        </div>
        <div style={{width: 92, color: theme.signal, font: `700 12px ${theme.fontMono}`, textAlign: 'right'}}>
          TTL {ttlRemaining}s
        </div>
      </div>
    </div>
  );
};

export const ContractLedger: React.FC<{
  readonly activeClauseIndex: ContractClauseIndex;
  readonly exchangeReveal: number;
  readonly formatReveal: number;
  readonly messagesReveal: number;
  readonly recordsReveal: number;
  readonly requestProgress: number;
  readonly responseProgress: number;
  readonly responseReveal: number;
  readonly reveal: number;
  readonly ttlRemaining: number;
  readonly ttlReveal: number;
}> = ({
  activeClauseIndex,
  exchangeReveal,
  formatReveal,
  messagesReveal,
  recordsReveal,
  requestProgress,
  responseProgress,
  responseReveal,
  reveal,
  ttlRemaining,
  ttlReveal,
}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 194, width: contentWidth, opacity: reveal}}>
      <div style={{marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div style={{color: theme.signal, font: `700 14px ${theme.fontMono}`, letterSpacing: 1.7}}>
          DNS PROTOCOL / CONTRACT
        </div>
        <div style={{color: theme.muted, font: `11px ${theme.fontMono}`, letterSpacing: 1.1}}>
          04 CLAUSES / RFC SHAPE
        </div>
      </div>
      <ContractClauseRow active={activeClauseIndex === 0} index={0} reveal={messagesReveal}>
        <MessagePair responseReveal={responseReveal} />
      </ContractClauseRow>
      <ContractClauseRow active={activeClauseIndex === 1} index={1} reveal={formatReveal}>
        <SharedWireFormat reveal={formatReveal} />
      </ContractClauseRow>
      <ContractClauseRow active={activeClauseIndex === 2} index={2} reveal={recordsReveal}>
        <ResourceRecordPayload reveal={recordsReveal} />
      </ContractClauseRow>
      <ContractClauseRow active={activeClauseIndex === 3} index={3} reveal={exchangeReveal}>
        <ExchangeRule
          requestProgress={requestProgress}
          responseProgress={responseProgress}
          ttlRemaining={ttlRemaining}
          ttlReveal={ttlReveal}
        />
      </ContractClauseRow>
      <div style={{marginTop: 20, display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `11px ${theme.fontMono}`, letterSpacing: 1.1}}>
        <span>QUERY / RESPONSE / RESOURCE RECORDS</span>
        <span style={{color: ttlReveal > 0.5 ? theme.signal : theme.muted}}>CACHE UNTIL TTL=0</span>
      </div>
    </div>
  );
};
