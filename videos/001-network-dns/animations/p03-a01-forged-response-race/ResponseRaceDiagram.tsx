import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {ResponseRacePhase} from './content';
import {responseRaceStage} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const EndpointCard: React.FC<{
  readonly accent: 'primary' | 'signal' | 'success';
  readonly detail: string;
  readonly label: string;
  readonly state: string;
}> = ({accent, detail, label, state}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        width: 222,
        height: 92,
        padding: '16px 16px 14px',
        boxSizing: 'border-box',
        borderLeft: `6px solid ${theme[accent]}`,
        background: `${theme.surface}F4`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', gap: 10}}>
        <span style={{color: theme.text, font: `800 14px ${theme.fontSans}`}}>{label}</span>
        <span style={{color: theme[accent], font: `800 8px ${theme.fontMono}`}}>{state}</span>
      </div>
      <div style={{marginTop: 12, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>{detail}</div>
    </div>
  );
};

const MatchGate: React.FC<{
  readonly accepted: boolean;
  readonly armed: boolean;
  readonly showTxid: boolean;
}> = ({accepted, armed, showTxid}) => {
  const theme = useChannelTheme();
  const accent = accepted ? theme.signal : armed ? theme.primary : theme.line;

  return (
    <div
      style={{
        position: 'absolute',
        left: 288,
        top: 164,
        width: 242,
        height: 194,
        padding: '20px 18px',
        boxSizing: 'border-box',
        borderTop: `7px solid ${accent}`,
        background: `${theme.background}F0`,
        textAlign: 'center',
      }}
    >
      <div style={{color: accent, font: `800 10px ${theme.fontMono}`, letterSpacing: 1.2}}>
        {accepted ? 'MATCH / ACCEPTED' : armed ? 'RESPONSE MATCH GATE' : 'WAITING FOR QUERY'}
      </div>
      <div style={{marginTop: 23, color: theme.text, font: `800 28px ${theme.fontSans}`}}>
        {showTxid ? '0x6A2C' : '— — — —'}
      </div>
      <div style={{marginTop: 12, color: theme.muted, font: `700 8px ${theme.fontMono}`}}>QNAME / TYPE / CLASS / TXID</div>
      <div style={{marginTop: 22, height: 6, background: theme.line}}>
        <div style={{height: '100%', width: accepted ? '100%' : armed ? '58%' : '0%', background: accent}} />
      </div>
      <div style={{marginTop: 14, color: accepted ? theme.signal : theme.muted, font: `800 8px ${theme.fontMono}`}}>
        {accepted ? 'FIRST MATCH CLOSED THE WINDOW' : 'FIRST VALID-LOOKING RESPONSE WINS'}
      </div>
    </div>
  );
};

const ResponseLanes: React.FC<{
  readonly phase: ResponseRacePhase;
  readonly progress: number;
}> = ({phase, progress}) => {
  const theme = useChannelTheme();
  const stage = responseRaceStage[phase.focus];
  const showForge = stage >= 3;
  const racing = stage === 4;
  const resolved = stage >= 5;
  const authenticProgress = resolved ? 0.83 : racing ? clamp01(progress * 0.72) : 0;
  const forgedProgress = resolved ? 1 : racing ? clamp01(progress * 1.26) : 0;
  const pathFor = (sourceY: number) => `M 748 ${sourceY} C 650 ${sourceY}, 614 258, 530 258 L 222 258`;

  return (
    <svg width={contentWidth} height={520} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={pathFor(112)} fill="none" stroke={theme.line} strokeDasharray="5 9" strokeWidth={2} opacity={0.52} />
      <path d={pathFor(402)} fill="none" stroke={showForge ? theme.line : 'transparent'} strokeDasharray="5 9" strokeWidth={2} opacity={0.52} />

      {stage >= 2 && (
        <path
          d="M 222 226 C 370 110, 562 86, 748 112"
          fill="none"
          pathLength={1}
          stroke={theme.primary}
          strokeDasharray={1}
          strokeDashoffset={stage === 2 ? 1 - progress : 0}
          strokeWidth={4}
        />
      )}

      {(racing || resolved) && (
        <>
          <path
            d={pathFor(112)}
            fill="none"
            pathLength={1}
            stroke={theme.success}
            strokeDasharray={1}
            strokeDashoffset={1 - authenticProgress}
            strokeWidth={5}
            opacity={resolved ? 0.35 : 1}
          />
          <path
            d={pathFor(402)}
            fill="none"
            pathLength={1}
            stroke={theme.signal}
            strokeDasharray={1}
            strokeDashoffset={1 - forgedProgress}
            strokeWidth={7}
          />
        </>
      )}
    </svg>
  );
};

export const ResponseRaceDiagram: React.FC<{
  readonly phase: ResponseRacePhase;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({phase, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const stage = responseRaceStage[phase.focus];
  const showTxid = stage >= 2;
  const showForge = stage >= 3;
  const accepted = stage >= 5;
  const forgeReveal = phase.focus === 'forge' ? phaseProgress : showForge ? 1 : 0;

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 382, width: contentWidth, height: 570, opacity: reveal}}>
      <ResponseLanes phase={phase} progress={phaseProgress} />

      <div style={{position: 'absolute', left: 0, top: 210}}>
        <EndpointCard
          accent={accepted ? 'signal' : 'primary'}
          detail={accepted ? 'CACHE / FALSE DATA STORED' : 'QUERY / api.example.com / A'}
          label="RECURSIVE RESOLVER"
          state={accepted ? 'POISONED' : stage >= 1 ? 'OPEN' : 'TRUSTING'}
        />
      </div>

      <MatchGate accepted={accepted} armed={stage >= 1} showTxid={showTxid} />

      <div style={{position: 'absolute', left: 638, top: 66}}>
        <EndpointCard accent="success" detail="AUTHENTIC / 192.0.2.42" label="AUTHORITATIVE" state={accepted ? 'LATE' : 'LEGIT'} />
      </div>

      <div style={{position: 'absolute', left: 638, top: 356, opacity: showForge ? 1 : 0.12, transform: `translateY(${(1 - forgeReveal) * 16}px)`}}>
        <EndpointCard accent="signal" detail={showTxid ? 'FORGED / 203.0.113.66 / TXID 6A2C' : 'FORGED / TXID ???'} label="SPOOFED SOURCE" state={accepted ? 'ACCEPTED' : showForge ? 'RACING' : 'HIDDEN'} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 288,
          top: 388,
          width: 242,
          padding: '15px 14px',
          boxSizing: 'border-box',
          borderLeft: `5px solid ${stage >= 3 ? theme.signal : theme.line}`,
          background: `${theme.surface}E8`,
          opacity: stage >= 3 ? 1 : 0.25,
        }}
      >
        <div style={{color: theme.text, font: `800 11px ${theme.fontMono}`}}>TXID IS NOT A SIGNATURE</div>
        <div style={{marginTop: 9, color: theme.muted, font: `700 8px ${theme.fontMono}`, lineHeight: 1.5}}>IT CORRELATES A REPLY<br />IT DOES NOT PROVE ITS AUTHOR</div>
      </div>
    </div>
  );
};
