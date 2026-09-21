import React from 'react';
import {CodeBoard, useCodeTimeMs, type CodeBoardProps} from '../../shared/code/CodeBoard';
import {CodeListing} from '../../shared/code/CodeListing';
import {CodeExplanation} from '../../shared/code/CodeExplanation';
import {getOzonTheme} from '../../shared/theme';
import {cues, cueTime, scene} from './cues';
import {luaLines} from './lua';

const timedCues = cues.map((cue) => ({...cue, startMs: cueTime(cue)}));

const Composition: React.FC<CodeBoardProps> = (props) => {
  const timeMs = useCodeTimeMs();
  const theme = getOzonTheme(props.themeId ?? 'paper');
  return <CodeBoard {...props} startMs={scene.startMs} title="Атомарная резервация" language="Redis / Lua">
    <CodeListing timeMs={timeMs} theme={theme} cues={timedCues} lines={luaLines} />
    <CodeExplanation timeMs={timeMs} theme={theme} cues={timedCues} durationMs={scene.durationMs} />
  </CodeBoard>;
};

export default Composition;
