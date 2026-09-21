import React from 'react';
import {CodeBoard, useCodeTimeMs, type CodeBoardProps} from '../../shared/code/CodeBoard';
import {CodeListing} from '../../shared/code/CodeListing';
import {CodeExplanation} from '../../shared/code/CodeExplanation';
import {getOzonTheme} from '../../shared/theme';
import {cues, scene} from './cues';
import {sqlLines} from './sql';
import {CasFlow} from './CasFlow';

const Composition: React.FC<CodeBoardProps> = (props) => {
  const timeMs = useCodeTimeMs();
  const theme = getOzonTheme(props.themeId ?? 'paper');
  return <CodeBoard {...props} startMs={scene.startMs} title="Одна резервация — один переход" language="PostgreSQL">
    <CodeListing timeMs={timeMs} theme={theme} cues={cues} lines={sqlLines} />
    <CodeExplanation timeMs={timeMs} theme={theme} cues={cues} durationMs={scene.durationMs} />
    <CasFlow timeMs={timeMs} theme={theme} />
  </CodeBoard>;
};

export default Composition;
