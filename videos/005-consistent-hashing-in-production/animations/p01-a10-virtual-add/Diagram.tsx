import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {Hosts, RangeArc, Ring} from '../../shared/theory/Ring';
import {newVirtualTokens, virtualTokens} from '../../shared/theory/model';
import {progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const added = progress(timeMs, 900, 600);
  return (
    <>
      <Heading lines={['Новый сервер', 'получает несколько участков.']} />
      <g transform={'translate(140 70)'}>
        <Ring
          tokens={[...virtualTokens, ...newVirtualTokens]}
          virtual
          highlight={(token) => token.owner === 'E'}
          labelRadius={(token) => (token.owner === 'E' ? 258 : 357)}
          tokenOpacity={(token) => (token.owner === 'E' ? added : 1)}
        >
          {newVirtualTokens.map((token, index) => (
            <RangeArc
              key={token.position}
              from={token.position - 3}
              to={token.position}
              amount={progress(timeMs, 1500 + index * 1000, 700)}
              color={theme.signal}
            />
          ))}
        </Ring>
        <Mono x={704} y={716} size={60} color={theme.signal}>
          {added > 0 ? 'сервер E' : '4 сервера'}
        </Mono>
        <Mono x={704} y={788} size={33}>
          {timeMs >= 5200 ? '4 участка от A, B, C, D' : added > 0 ? '4 новые точки' : 'исходная схема'}
        </Mono>
      </g>
      <Hosts
        active={added > 0 ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D']}
        selected={added > 0 ? 'E' : undefined}
        extra
      />
      <Annotation
        x={104}
        y={560}
        width={280}
        text={
          timeMs < 900
            ? 'Отдельный пример: начинаем с четырёх серверов'
            : 'Новая нода получает участки от разных владельцев'
        }
        detail="Общий объём переноса определяется долей новой ноды."
      />
    </>
  );
};
