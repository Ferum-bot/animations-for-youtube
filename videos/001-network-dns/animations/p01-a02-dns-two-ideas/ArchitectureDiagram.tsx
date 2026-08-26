import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {authorityBranches} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const diagramTop = 258;
const rootCenterX = contentWidth / 2;
const branchCenters = authorityBranches.map((branch) => branch.x - contentLeft + 106);

const HierarchyLines: React.FC<{
  branchProgress: number;
  distributionProgress: number;
}> = ({branchProgress, distributionProgress}) => {
  const theme = useChannelTheme();
  const branchY = 218;
  const serverY = 476;

  return (
    <svg
      width={contentWidth}
      height={600}
      viewBox={`0 0 ${contentWidth} 600`}
      style={{position: 'absolute', left: contentLeft, top: diagramTop, overflow: 'visible'}}
    >
      {branchCenters.map((centerX) => {
        const rootPath = `M${rootCenterX} 48 V116 H${centerX} V${branchY}`;
        return (
          <React.Fragment key={centerX}>
            <path
              d={rootPath}
              fill="none"
              stroke={theme.primary}
              strokeWidth="3"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - branchProgress}
            />
            <path
              d={`M${centerX} ${branchY + 28} V${serverY}`}
              fill="none"
              stroke={theme.success}
              strokeWidth="3"
              opacity={distributionProgress}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={1 - distributionProgress}
            />
          </React.Fragment>
        );
      })}
    </svg>
  );
};

const BranchNode: React.FC<{
  branchIndex: number;
  branchProgress: number;
  distributionProgress: number;
}> = ({branchIndex, branchProgress, distributionProgress}) => {
  const theme = useChannelTheme();
  const branch = authorityBranches[branchIndex];
  if (!branch) return null;
  const stagger = clamp01(branchProgress * 1.35 - branchIndex * 0.16);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: branch.x,
          top: diagramTop + 214,
          width: 212,
          opacity: stagger,
          transform: `translateY(${(1 - stagger) * 16}px)`,
          textAlign: 'center',
        }}
      >
        <div style={{width: 18, height: 18, margin: '0 auto', background: theme.primary, transform: 'rotate(45deg)'}} />
        <div style={{marginTop: 18, color: theme.text, font: `700 30px ${theme.fontMono}`, letterSpacing: -0.8}}>
          {branch.tld}
        </div>
        <div style={{marginTop: 10, color: theme.primary, font: `13px ${theme.fontMono}`, letterSpacing: 1.4}}>
          СВОЯ ВЕТКА
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: branch.x,
          top: diagramTop + 466,
          width: 212,
          opacity: distributionProgress,
          transform: `translateY(${(1 - distributionProgress) * 18}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 84,
            height: 48,
            margin: '0 auto',
            boxSizing: 'border-box',
            borderTop: `4px solid ${theme.success}`,
            borderBottom: `2px solid ${theme.line}`,
            position: 'relative',
          }}
        >
          <div style={{position: 'absolute', left: 0, right: 0, top: 13, height: 2, background: theme.line}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 26, height: 2, background: theme.line}} />
        </div>
        <div style={{marginTop: 16, color: theme.text, font: `700 15px ${theme.fontMono}`, letterSpacing: 1.5}}>
          {branch.region}
        </div>
        <div style={{marginTop: 8, color: theme.muted, font: `12px ${theme.fontMono}`}}>
          {branch.server}
        </div>
      </div>
    </>
  );
};

export const ArchitectureDiagram: React.FC<{
  opacity: number;
  branchProgress: number;
  distributionProgress: number;
  globalScaleProgress: number;
  unifyProgress: number;
}> = ({opacity, branchProgress, distributionProgress, globalScaleProgress, unifyProgress}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 198,
          width: contentWidth,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <div style={{color: theme.primary, font: `700 16px ${theme.fontMono}`, letterSpacing: 1.8}}>
          01 / ИЕРАРХИЯ ИМЁН
        </div>
        <div style={{color: theme.success, font: `700 16px ${theme.fontMono}`, letterSpacing: 1.8, opacity: distributionProgress}}>
          02 / ДАННЫЕ РАСПРЕДЕЛЕНЫ
        </div>
      </div>
      <HierarchyLines branchProgress={branchProgress} distributionProgress={distributionProgress} />
      <div
        style={{
          position: 'absolute',
          left: contentLeft + rootCenterX - 24,
          top: diagramTop,
          width: 48,
          height: 48,
          boxSizing: 'border-box',
          border: `3px solid ${theme.signal}`,
          background: theme.background,
          transform: 'rotate(45deg)',
        }}
      />
      <div style={{position: 'absolute', left: contentLeft + rootCenterX - 8, top: diagramTop + 6, color: theme.text, font: `700 30px ${theme.fontMono}`}}>
        .
      </div>
      {authorityBranches.map((branch, index) => (
        <BranchNode
          key={branch.tld}
          branchIndex={index}
          branchProgress={branchProgress}
          distributionProgress={distributionProgress}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 872,
          width: contentWidth,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: theme.muted,
          font: `14px ${theme.fontMono}`,
          letterSpacing: 1.3,
        }}
      >
        <span style={{opacity: globalScaleProgress}}>× 1000+ СЕРВЕРОВ / ПО ВСЕЙ ПЛАНЕТЕ</span>
        <span style={{color: theme.signal, opacity: unifyProgress}}>ДВЕ ИДЕИ / ОДИН ОТВЕТ</span>
      </div>
    </div>
  );
};
