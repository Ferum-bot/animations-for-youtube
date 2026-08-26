import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, msToFrames, smoothProgress} from '@channel/motion-core';
import {DnsPresenterOverlayChrome} from '../../shared/DnsPresenterOverlayChrome';
import {DnsSceneHeading} from '../../shared/DnsSceneHeading';
import {DnsSceneStatus} from '../../shared/DnsSceneStatus';
import {anatomyPhaseCopy, recordFields, resourceRecordAnatomyTiming} from './content';
import {RecordAnatomy} from './RecordAnatomy';

type Phase = keyof typeof anatomyPhaseCopy;

const getPhase = (elapsedMs: number): Phase => {
  if (elapsedMs >= resourceRecordAnatomyTiming.resolvedMs) return 'resolved';
  if (elapsedMs >= resourceRecordAnatomyTiming.fiveFieldsMs) return 'fields';
  if (elapsedMs >= resourceRecordAnatomyTiming.resourceRecordMs) return 'record';
  return 'leaf';
};

const getPhaseStartMs = (phase: Phase): number => {
  if (phase === 'resolved') return resourceRecordAnatomyTiming.resolvedMs;
  if (phase === 'fields') return resourceRecordAnatomyTiming.fiveFieldsMs;
  if (phase === 'record') return resourceRecordAnatomyTiming.resourceRecordMs;
  return resourceRecordAnatomyTiming.leafQuestionMs;
};

export const ResourceRecordAnatomyOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const elapsedMs = (frame / fps) * 1000;
  const leafReveal = smoothProgress(frame, 4, 18);
  const recordReveal = smoothProgress(
    frame,
    msToFrames(resourceRecordAnatomyTiming.resourceRecordMs, fps),
    msToFrames(resourceRecordAnatomyTiming.resourceRecordMs + 620, fps),
  );
  const fieldsReveal = smoothProgress(
    frame,
    msToFrames(resourceRecordAnatomyTiming.fiveFieldsMs, fps),
    msToFrames(resourceRecordAnatomyTiming.fiveFieldsMs + 820, fps),
  );
  const resolvedReveal = smoothProgress(
    frame,
    msToFrames(resourceRecordAnatomyTiming.resolvedMs, fps),
    msToFrames(resourceRecordAnatomyTiming.resolvedMs + 620, fps),
  );
  const scanIndex = elapsedMs < resourceRecordAnatomyTiming.fieldScanMs
    ? -1
    : Math.min(
        recordFields.length - 1,
        Math.floor((elapsedMs - resourceRecordAnatomyTiming.fieldScanMs) / 1_050),
      );
  const phase = getPhase(elapsedMs);
  const phaseStartMs = getPhaseStartMs(phase);
  const headingReveal = smoothProgress(
    frame,
    msToFrames(phaseStartMs, fps),
    msToFrames(phaseStartMs + 420, fps),
  );
  const runtimeProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  const activeField = scanIndex >= 0 ? recordFields[scanIndex] : undefined;

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <DnsPresenterOverlayChrome label="РЕСУРСНАЯ ЗАПИСЬ" meta="RR / FIVE FIELDS" progress={runtimeProgress} />
      <DnsSceneHeading
        accent={phase === 'resolved' ? 'success' : 'signal'}
        eyebrow={anatomyPhaseCopy[phase].eyebrow}
        reveal={headingReveal}
        title={anatomyPhaseCopy[phase].title}
      />
      <RecordAnatomy
        activeFieldIndex={scanIndex}
        fieldsReveal={fieldsReveal}
        leafReveal={leafReveal}
        recordReveal={recordReveal}
        resolvedReveal={resolvedReveal}
      />
      <DnsSceneStatus
        accent={phase === 'resolved' ? 'success' : 'primary'}
        left={activeField ? `${activeField.label} / ${activeField.meaning}` : 'RESOURCE RECORD / STRUCTURE'}
        right="DNS / 006"
        reveal={leafReveal}
      />
    </div>
  );
};
