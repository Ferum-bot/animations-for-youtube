import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {treeEdges, treeNodes} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const nodeWidth = 126;
const nodeHeight = 54;

const getNode = (id: string) => treeNodes.find((node) => node.id === id);

export const DomainTree: React.FC<{
  readonly branchReveal: number;
  readonly noConflictReveal: number;
  readonly reveal: number;
}> = ({branchReveal, noConflictReveal, reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 194,
        width: contentWidth,
        height: 730,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 18}px)`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div style={{color: theme.signal, font: `700 14px ${theme.fontMono}`, letterSpacing: 1.8}}>
          DNS TREE / TWO BRANCHES
        </div>
        <div style={{color: theme.muted, font: `12px ${theme.fontMono}`, letterSpacing: 1.2}}>
          LEAF → ROOT
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 62, width: contentWidth, height: 560}}>
        <svg width={contentWidth} height="540" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {treeEdges.map(([fromId, toId], index) => {
            const from = getNode(fromId);
            const to = getNode(toId);
            if (!from || !to) return null;
            const edgeReveal = clamp01(branchReveal * 1.55 - index * 0.11);
            const isCisco = to.branch === 'cisco';
            const stroke = isCisco ? theme.primary : theme.signal;

            return (
              <path
                key={`${fromId}-${toId}`}
                d={`M${from.x + nodeWidth / 2} ${from.y + nodeHeight} V${to.y - 22} H${to.x + nodeWidth / 2} V${to.y}`}
                fill="none"
                stroke={stroke}
                strokeWidth={isCisco ? 4 : 3}
                strokeDasharray="520"
                strokeDashoffset={520 * (1 - edgeReveal)}
                opacity={isCisco ? 1 : 0.72}
              />
            );
          })}
        </svg>

        {treeNodes.map((node, index) => {
          const nodeReveal = clamp01(branchReveal * 1.65 - index * 0.1);
          const isRoot = node.branch === 'root';
          const isCisco = node.branch === 'cisco';
          const accent = isRoot ? theme.signal : isCisco ? theme.primary : theme.signal;

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                width: nodeWidth,
                height: nodeHeight,
                boxSizing: 'border-box',
                paddingTop: 18,
                borderTop: `4px solid ${accent}`,
                background: `${theme.surface}F2`,
                color: isRoot ? theme.signal : theme.text,
                font: `700 14px ${theme.fontMono}`,
                letterSpacing: 1.1,
                textAlign: 'center',
                opacity: nodeReveal,
                transform: `translateY(${(1 - nodeReveal) * 18}px) rotateX(${(1 - nodeReveal) * -16}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              {node.label}
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 502,
            width: 270,
            color: theme.primary,
            font: `700 15px ${theme.fontMono}`,
            textAlign: 'center',
            opacity: noConflictReveal,
          }}
        >
          eng.cisco.com
        </div>
        <div
          style={{
            position: 'absolute',
            left: 502,
            top: 502,
            width: 270,
            color: theme.signal,
            font: `700 15px ${theme.fontMono}`,
            textAlign: 'center',
            opacity: noConflictReveal,
          }}
        >
          eng.chicago.edu
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 660,
          width: contentWidth,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          opacity: noConflictReveal,
        }}
      >
        <div style={{width: 14, height: 14, background: theme.success, transform: 'rotate(45deg)'}} />
        <div style={{color: theme.text, font: `800 23px ${theme.fontSans}`, letterSpacing: -0.5}}>
          РАЗНЫЕ ВЕТВИ. КОНФЛИКТА НЕТ.
        </div>
      </div>
    </div>
  );
};
