import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {DnssecPhase} from './content';
import {dnssecStage, trustNodes} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const TrustNode: React.FC<{
  readonly active: number;
  readonly detail: string;
  readonly label: string;
  readonly record: string;
}> = ({active, detail, label, record}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        width: 184,
        height: 112,
        padding: '18px 15px',
        boxSizing: 'border-box',
        borderTop: `7px solid ${active > 0.5 ? theme.success : theme.line}`,
        background: `${theme.surface}F3`,
        opacity: 0.3 + active * 0.7,
        transform: `translateY(${(1 - active) * 12}px)`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 8}}>
        <span style={{color: theme.text, font: `800 14px ${theme.fontSans}`}}>{label}</span>
        <span style={{color: active > 0.5 ? theme.success : theme.muted, font: `800 8px ${theme.fontMono}`}}>{record}</span>
      </div>
      <div style={{marginTop: 16, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>{detail}</div>
      <div style={{marginTop: 11, color: active > 0.5 ? theme.success : theme.muted, font: `800 8px ${theme.fontMono}`}}>{active > 0.5 ? 'VERIFIED' : 'UNVERIFIED'}</div>
    </div>
  );
};

const DeploymentGate: React.FC<{
  readonly active: boolean;
  readonly label: string;
  readonly state: string;
}> = ({active, label, state}) => {
  const theme = useChannelTheme();

  return (
    <div style={{width: 326, height: 116, padding: '20px 18px', boxSizing: 'border-box', borderLeft: `7px solid ${active ? theme.success : theme.signal}`, background: `${theme.surface}F2`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
        <span style={{color: theme.text, font: `800 15px ${theme.fontSans}`}}>{label}</span>
        <span style={{color: active ? theme.success : theme.signal, font: `800 8px ${theme.fontMono}`}}>{active ? 'ENABLED' : 'REQUIRED'}</span>
      </div>
      <div style={{marginTop: 17, color: active ? theme.success : theme.muted, font: `800 10px ${theme.fontMono}`}}>{state}</div>
    </div>
  );
};

export const DnssecTrustDiagram: React.FC<{
  readonly phase: DnssecPhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = dnssecStage[phase.focus];
  const validating = stage >= 5;
  const reality = stage >= 6;
  const lesson = stage >= 7;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 392, width: contentWidth, height: 560, opacity: reveal}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 860, display: 'flex', alignItems: 'center', gap: 18, opacity: reality ? 0.22 : 1}}>
        {trustNodes.map((node, index) => {
          const nodeStage = index + 2;
          const nodeReveal = stage > nodeStage ? 1 : stage === nodeStage ? phaseProgress : 0;
          return (
            <React.Fragment key={node.label}>
              <TrustNode active={nodeReveal} {...node} />
              {index < trustNodes.length - 1 ? (
                <div style={{width: 28, height: 112, display: 'grid', placeItems: 'center'}}>
                  <div style={{width: 28, height: 5, background: nodeReveal > 0.5 ? theme.success : theme.line}} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 0, top: 158, width: 860, height: 90, padding: '19px 21px', boxSizing: 'border-box', borderTop: `7px solid ${validating ? theme.success : theme.primary}`, background: `${theme.background}EC`, opacity: stage >= 1 && !reality ? 1 : reality ? 0.2 : 0}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span style={{color: theme.text, font: `800 16px ${theme.fontSans}`}}>RESOLVER VERIFICATION</span>
          <span style={{color: validating ? theme.success : theme.primary, font: `800 9px ${theme.fontMono}`}}>{validating ? 'CHAIN COMPLETE / AUTHENTIC' : 'BUILDING TRUST PATH'}</span>
        </div>
        <div style={{marginTop: 15, height: 6, background: theme.line}}>
          <div style={{height: '100%', width: `${clamp01((Math.max(0, stage - 2) + (stage >= 2 ? phaseProgress : 0)) / 4) * 100}%`, background: validating ? theme.success : theme.primary}} />
        </div>
      </div>

      <div style={{position: 'absolute', left: 84, top: 92, width: 692, height: 356, opacity: reality ? 1 : 0, transform: `translateY(${reality ? 0 : 18}px)`}}>
        <div style={{display: 'flex', gap: 40, alignItems: 'center'}}>
          <DeploymentGate active={false} label="ZONE OWNER" state="PUBLISH DNSKEY + RRSIG" />
          <div style={{width: 42, color: theme.signal, font: `800 10px ${theme.fontMono}`, textAlign: 'center'}}>AND</div>
          <DeploymentGate active={false} label="RECURSIVE RESOLVER" state="VALIDATE THE FULL CHAIN" />
        </div>

        <div style={{position: 'absolute', left: 20, top: 174, width: 652, height: 108, padding: '19px 22px', boxSizing: 'border-box', borderTop: `7px solid ${theme.signal}`, background: `${theme.background}ED`, opacity: lesson ? phaseProgress : 0}}>
          <div style={{color: theme.signal, font: `800 10px ${theme.fontMono}`}}>END-TO-END REQUIREMENT</div>
          <div style={{marginTop: 14, color: theme.text, font: `800 18px ${theme.fontSans}`, lineHeight: 1.08}}>Подпись без проверки и проверка без подписанной зоны не замыкают цепочку</div>
        </div>
      </div>
    </div>
  );
};
