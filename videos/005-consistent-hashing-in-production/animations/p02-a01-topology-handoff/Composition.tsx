import React from "react";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { fadeEnvelope } from "@channel/motion-core";
import { getTheme } from "@channel/theme";
import type { SceneProps } from "../../shared/theory/Scene";
import { hashingTheme as theme } from "../../shared/theme";
import metadata from "./animation.json";
import { Diagram } from "./Diagram";

const Composition: React.FC<SceneProps> = ({
  withAudio = false,
  previewBackground = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <>
      {withAudio ? <Audio src={staticFile(metadata.sourceAudio.file)} /> : null}
      <AbsoluteFill
        style={{
          background:
            previewBackground === "transparent"
              ? undefined
              : getTheme(previewBackground === "light" ? "paper" : "graphite")
                  .background,
        }}
      >
        <AbsoluteFill
          style={{
            background: theme.background,
            opacity: fadeEnvelope({
              frame,
              durationInFrames,
              enterFrames: 10,
              exitFrames: 12,
            }),
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 2560 1440"
            style={{ fontFamily: theme.fontSans }}
            aria-label="Полноэкранная смена топологии: координатор, роутеры, миграция и очистка"
          >
            <Diagram timeMs={(frame * 1000) / fps} />
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
    </>
  );
};
export default Composition;
