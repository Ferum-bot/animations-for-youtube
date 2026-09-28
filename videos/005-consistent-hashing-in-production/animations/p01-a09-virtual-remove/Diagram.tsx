import React from 'react';
import {Annotation, Heading, Mono} from '../../shared/theory/Typography';
import {Hosts, RangeArc, Ring, RingCursor} from '../../shared/theory/Ring';
import {changedRanges, locate, shares, virtualTokens, withoutD} from '../../shared/theory/model';
import {progress} from '../../shared/theory/motion';
import {hashingTheme as theme} from '../../shared/theme';

const remaining = withoutD(virtualTokens);
const changed = changedRanges(virtualTokens, remaining);
const distribution = shares(remaining);
export const Diagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const remove = progress(timeMs, 1700, 650);
  const step = Math.min(changed.length - 1, Math.max(0, Math.floor((timeMs - 4200) / 1350)));
  const focus = changed[step];
  const next = focus ? locate(focus.to, remaining) : undefined;
  const route = progress(timeMs, 4200 + step * 1350, 850);
  const resolved = timeMs >= 11000;
  const lookup = timeMs >= 13000;
  return (
    <>
      <Heading lines={['Один сервер ушёл.', 'Участки делят остальные.']} />
      <g transform={'translate(140 70)'}>
        <Ring
          tokens={virtualTokens}
          virtual
          tokenOpacity={(token) => (token.owner === 'D' ? 1 - remove : 1)}
          highlight={(token) => timeMs >= 4200 && !resolved && token.position === next?.position}
          highlightColor={theme.primary}
        >
          {changed.map((range) => (
            <RangeArc key={range.to} from={range.from} to={range.to} amount={remove} color={theme.signal} />
          ))}
          {!resolved && timeMs >= 4200 && focus && next ? (
            <RingCursor
              position={
                focus.to +
                ((next.position <= focus.to ? next.position + 100 : next.position) - focus.to) * route
              }
            />
          ) : null}
          {lookup ? <RingCursor position={62 + 3 * progress(timeMs, 14000, 1000)} /> : null}
        </Ring>
        {!resolved ? (
          <>
            <Mono x={704} y={720} size={timeMs < 4200 ? 50 : 43} color={theme.signal}>
              {timeMs < 4200 ? 'сервер D' : `D${focus?.to} → ${next?.owner}${next?.position}`}
            </Mono>
            <Mono x={704} y={790} size={29}>
              {timeMs < 4200 ? 'уходит вместе со своими точками' : 'новый владелец одного участка'}
            </Mono>
          </>
        ) : lookup ? (
          <>
            <Mono x={704} y={709} size={49} color={theme.primary}>
              62 → B65
            </Mono>
            <Mono x={704} y={778} size={31}>
              точка → сервер B
            </Mono>
            <Mono x={704} y={837} size={28} color={theme.muted}>
              поиск по кольцу тот же
            </Mono>
          </>
        ) : (
          <>
            <Mono x={704} y={700} size={38}>
              Доли после удаления
            </Mono>
            <Mono x={704} y={785} size={46} color={theme.primary}>
              {distribution.A} / {distribution.B} / {distribution.C}
            </Mono>
            <Mono x={704} y={845} size={29} color={theme.muted}>
              A / B / C · % пространства
            </Mono>
          </>
        )}
      </g>
      <Hosts
        active={timeMs < 2350 ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C']}
        selected={timeMs < 2350 ? 'D' : undefined}
      />
      <Annotation
        x={104}
        y={560}
        width={280}
        text={
          lookup
            ? 'Маршрутизатор выбирает точку и её физический сервер'
            : resolved
              ? 'Новые владельцы участков — A, B и C'
              : 'Убираются все точки физического сервера D'
        }
        detail="Распределение становится ровнее, но идеальное равенство не гарантируется."
      />
    </>
  );
};
