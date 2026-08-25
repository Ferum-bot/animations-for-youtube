import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useChannelTheme} from '@channel/design-system';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {agendaBeats} from './content';

const firstEnterFrames = 14;
const crossfadeFrames = 10;
const {panelWidth, contentLeft, contentWidth, titleLeft, titleWidth} =
  dnsPresenterOverlayLayout;

const getActiveBeatIndex = (frame: number, fps: number): number => {
  let activeIndex = 0;

  for (let index = 1; index < agendaBeats.length; index += 1) {
    const beat = agendaBeats[index];
    if (beat && frame >= msToFrames(beat.startMs, fps)) activeIndex = index;
  }

  return activeIndex;
};

const AgendaProgress: React.FC<{activeIndex: number}> = ({activeIndex}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'absolute', left: contentLeft, top: 172, width: contentWidth}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 8, height: 2, background: theme.line}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 7,
          width: `${(activeIndex / (agendaBeats.length - 1)) * 100}%`,
          height: 4,
          background: theme.primary,
        }}
      />

      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        {agendaBeats.map((beat, index) => {
          const reached = index <= activeIndex;
          return (
            <div key={beat.shortLabel} style={{width: 110, textAlign: index === 0 ? 'left' : 'center'}}>
              <div
                style={{
                  width: reached ? 17 : 11,
                  height: reached ? 17 : 11,
                  marginLeft: index === 0 ? 0 : 'auto',
                  marginRight: index === agendaBeats.length - 1 ? 0 : 'auto',
                  boxSizing: 'border-box',
                  background: reached ? theme.signal : theme.background,
                  border: `2px solid ${reached ? theme.signal : theme.line}`,
                  transform: 'rotate(45deg)',
                }}
              />
              <div
                style={{
                  marginTop: 17,
                  color: reached ? theme.text : theme.muted,
                  font: `700 13px ${theme.fontMono}`,
                  letterSpacing: 1.6,
                  whiteSpace: 'nowrap',
                }}
              >
                {beat.shortLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AgendaBeatTitle: React.FC<{beatIndex: number}> = ({beatIndex}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const theme = useChannelTheme();
  const beat = agendaBeats[beatIndex];
  if (!beat) return null;

  const nextBeat = agendaBeats[beatIndex + 1];
  const startFrame = msToFrames(beat.startMs, fps);
  const endFrame = nextBeat ? msToFrames(nextBeat.startMs, fps) : durationInFrames;
  const enterStart = beatIndex === 0 ? startFrame : startFrame - crossfadeFrames;
  const enterEnd = beatIndex === 0 ? startFrame + firstEnterFrames : startFrame;
  const enter = smoothProgress(frame, enterStart, enterEnd);
  const depart = nextBeat
    ? smoothProgress(frame, endFrame - crossfadeFrames, endFrame)
    : 0;
  const translateY = (1 - enter) * 24 - depart * 18;
  const longestLine = Math.max(...beat.titleLines.map((line) => Array.from(line).length));
  const fontSize = beat.titleLines.length === 3 ? 64 : longestLine > 20 ? 70 : 78;

  return (
    <div
      style={{
        position: 'absolute',
        left: titleLeft,
        top: 354,
        width: titleWidth,
        opacity: beatIndex === 0 ? enter : 1,
        clipPath: `inset(${(1 - enter) * 100}% 0 ${depart * 100}% 0)`,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{color: theme.signal, font: `700 17px ${theme.fontMono}`, letterSpacing: 2.2}}>
        ТЕМА {String(beatIndex + 1).padStart(2, '0')}
      </div>
      <div
        style={{
          marginTop: 28,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize,
          fontWeight: 800,
          letterSpacing: -0.052 * fontSize,
          lineHeight: 0.94,
        }}
      >
        {beat.titleLines.map((line, lineIndex) => (
          <div key={line} style={{color: lineIndex === 0 ? theme.text : theme.primary}}>
            {line}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 38,
          color: theme.muted,
          font: `14px ${theme.fontMono}`,
          letterSpacing: 0.8,
        }}
      >
        {beat.detail}
      </div>
    </div>
  );
};

export const AgendaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const theme = useChannelTheme();
  const activeIndex = getActiveBeatIndex(frame, fps);
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: panelWidth,
          background: `${theme.background}F2`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 74,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div style={{color: theme.signal, font: `700 18px ${theme.fontMono}`, letterSpacing: 2.8}}>
          В ЭТОМ ВИДЕО
        </div>
        <div style={{width: 52, height: 2, background: theme.line}} />
        <div style={{color: theme.muted, font: `14px ${theme.fontMono}`, letterSpacing: 1.6}}>
          DNS / 001
        </div>
      </div>

      <AgendaProgress activeIndex={activeIndex} />

      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 354,
          color: theme.signal,
          fontFamily: theme.fontSans,
          fontSize: 108,
          fontWeight: 800,
          letterSpacing: -8,
          lineHeight: 0.8,
        }}
      >
        {String(activeIndex + 1).padStart(2, '0')}
      </div>

      {agendaBeats.map((beat, index) => (
        <AgendaBeatTitle key={beat.shortLabel} beatIndex={index} />
      ))}

      <div style={{position: 'absolute', left: contentLeft, bottom: 82, width: contentWidth}}>
        <div style={{height: 2, background: theme.line}}>
          <div style={{width: `${runtimeProgress * 100}%`, height: '100%', background: theme.signal}} />
        </div>
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            color: theme.muted,
            font: `13px ${theme.fontMono}`,
            letterSpacing: 1.4,
          }}
        >
          <span>PROGRAM / 04 BLOCKS</span>
          <span>VOICE SYNC / ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
