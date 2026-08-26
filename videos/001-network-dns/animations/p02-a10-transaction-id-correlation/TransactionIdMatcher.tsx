import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {TransactionPhase} from './content';
import {dnsTransactions, responseOrder} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const rowHeight = 74;
const rowGap = 14;
const queryX = 0;
const queryWidth = 300;
const responseX = 586;
const responseWidth = 274;

const TransactionCard: React.FC<{
  readonly answer?: string;
  readonly id: string;
  readonly label: string;
  readonly visible: boolean;
  readonly active: boolean;
}> = ({answer, id, label, visible, active}) => {
  const theme = useChannelTheme();
  const accent = active ? theme.success : theme.primary;

  return (
    <div
      style={{
        height: rowHeight,
        boxSizing: 'border-box',
        padding: '11px 13px',
        borderLeft: `5px solid ${visible ? accent : theme.line}`,
        background: `${theme.surface}F2`,
        opacity: visible ? 1 : 0.16,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 10}}>
        <span
          style={{
            minWidth: 0,
            overflow: 'hidden',
            color: theme.text,
            font: `700 10px ${theme.fontMono}`,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <span
          style={{
            padding: '2px 6px',
            color: active ? theme.background : theme.text,
            background: active ? theme.success : theme.primary,
            font: `800 10px ${theme.fontMono}`,
          }}
        >
          {id}
        </span>
      </div>
      <div style={{marginTop: 10, color: active ? theme.success : theme.muted, font: `700 8px ${theme.fontMono}`}}>
        {answer ?? 'QUERY / WAITING FOR RESPONSE'}
      </div>
    </div>
  );
};

const MatchingLines: React.FC<{
  readonly responseCount: number;
  readonly progress: number;
}> = ({responseCount, progress}) => {
  const theme = useChannelTheme();

  return (
    <svg
      width={contentWidth}
      height={4 * (rowHeight + rowGap)}
      style={{position: 'absolute', left: 0, top: 34, overflow: 'visible'}}
    >
      {responseOrder.map((transactionIndex, returnIndex) => {
        const visible = returnIndex < responseCount;
        const startY = transactionIndex * (rowHeight + rowGap) + rowHeight / 2;
        const endY = returnIndex * (rowHeight + rowGap) + rowHeight / 2;
        const lineProgress = visible
          ? clamp01(progress + (responseCount - returnIndex - 1) * 0.28)
          : 0;
        const startX = queryX + queryWidth;
        const endX = responseX;
        const midX = (startX + endX) / 2;

        return (
          <g key={dnsTransactions[transactionIndex].id} opacity={visible ? 1 : 0.12}>
            <path
              d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
              fill="none"
              pathLength={1}
              stroke={visible ? theme.success : theme.line}
              strokeDasharray={1}
              strokeDashoffset={1 - lineProgress}
              strokeWidth={visible ? 4 : 2}
            />
            {visible && (
              <circle cx={startX + (endX - startX) * lineProgress} cy={startY + (endY - startY) * lineProgress} r={5} fill={theme.signal} />
            )}
          </g>
        );
      })}
    </svg>
  );
};

export const TransactionIdMatcher: React.FC<{
  readonly phase: TransactionPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const showAll = phase.queryCount === 4;
  const showField = phase.focus === 'field' || phase.focus === 'copy' || phase.focus === 'matching' || phase.focus === 'security';
  const hasReturned = (transactionIndex: number): boolean =>
    responseOrder
      .slice(0, phase.responseCount)
      .some((returnedIndex) => returnedIndex === transactionIndex);

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 382,
        width: contentWidth,
        height: 570,
        opacity: reveal,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', color: theme.muted, font: `700 9px ${theme.fontMono}`, letterSpacing: 1.1}}>
        <span>OUTBOUND / QUESTIONS</span>
        <span>INBOUND / RESPONSES</span>
      </div>

      <MatchingLines responseCount={phase.responseCount} progress={phaseProgress} />

      <div style={{position: 'absolute', left: queryX, top: 34, width: queryWidth}}>
        {dnsTransactions.map((transaction, index) => (
          <div key={transaction.id} style={{marginBottom: rowGap}}>
            <TransactionCard
              active={hasReturned(index)}
              id={transaction.id}
              label={transaction.query}
              visible={index === 0 || showAll}
            />
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: responseX, top: 34, width: responseWidth}}>
        {responseOrder.map((transactionIndex, returnIndex) => {
          const transaction = dnsTransactions[transactionIndex];
          return (
            <div key={transaction.id} style={{marginBottom: rowGap}}>
              <TransactionCard
                active={returnIndex < phase.responseCount}
                answer={transaction.answer}
                id={transaction.id}
                label={`ANSWER / ${transaction.query.split(' / ')[0]}`}
                visible={returnIndex < phase.responseCount}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 332,
          top: 52,
          width: 222,
          padding: '18px 12px',
          boxSizing: 'border-box',
          borderTop: `5px solid ${showField ? theme.signal : theme.line}`,
          background: `${theme.background}E8`,
          opacity: showField ? 1 : 0.28,
          textAlign: 'center',
        }}
      >
        <div style={{color: theme.signal, font: `800 35px ${theme.fontSans}`, letterSpacing: -1.5}}>16 BIT</div>
        <div style={{marginTop: 7, color: theme.text, font: `700 9px ${theme.fontMono}`}}>TRANSACTION ID</div>
        <div style={{marginTop: 14, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>65 536 POSSIBLE VALUES</div>
      </div>

      {phase.focus === 'security' && (
        <div
          style={{
            position: 'absolute',
            left: 332,
            top: 278,
            width: 222,
            padding: '18px 15px',
            boxSizing: 'border-box',
            borderLeft: `5px solid ${theme.signal}`,
            background: `${theme.surface}FA`,
            transform: `translateY(${(1 - phaseProgress) * 12}px)`,
            opacity: phaseProgress,
          }}
        >
          <div style={{color: theme.signal, font: `800 11px ${theme.fontMono}`}}>ВАЖНО ПОЗЖЕ</div>
          <div style={{marginTop: 10, color: theme.text, font: `800 15px ${theme.fontSans}`, lineHeight: 1.15}}>ID связывает сообщения, но не подтверждает отправителя</div>
        </div>
      )}
    </div>
  );
};
