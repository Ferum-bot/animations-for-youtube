import React from 'react';
import {NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {TimedCopy} from '../../shared/HttpDiagram';
import {httpTheme as theme} from '../../shared/theme';
import {useTimeMs} from '../../shared/timing';
import {FinalExchange, ProtocolDiagram} from './Diagram';
import {cue, finaleTiming} from './timing';

const titles = [
  {startMs: 0, text: 'Создан, чтобы развиваться'},
  {startMs: cue('p10-finale-internet'), text: 'Общий язык приложений'},
];

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...finaleTiming}>
    <text x={136} y={194} fontFamily={theme.fontMono} fontSize={26} letterSpacing={3} fill={theme.primary}>ГЛАВНОЕ / HTTP</text>
    <g fontWeight={600} letterSpacing={-1.3}>
      <TimedCopy timeMs={timeMs} states={titles} x={136} y={294} fontSize={62} />
    </g>
    <ProtocolDiagram timeMs={timeMs} />
    <FinalExchange timeMs={timeMs} />
  </NarratedHttpScene>;
};
export default Composition;
