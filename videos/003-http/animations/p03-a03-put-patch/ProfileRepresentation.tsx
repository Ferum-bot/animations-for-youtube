import React from 'react';
import {httpTheme as theme} from '../../shared/theme';
type ProfileRepresentationProps = {
  readonly name: string;
  readonly city: React.ReactNode;
  readonly incoming?: boolean;
};
/** The PUT payload and stored resource share the same representation. */
export const ProfileRepresentation: React.FC<ProfileRepresentationProps> = ({name, city, incoming = false}) => (<g>
  <path d="M 212 760 H 1180 V 1030 H 212 Z" fill={theme.surface} stroke={incoming ? theme.primary : theme.line} strokeWidth={2} />
  <text x={252} y={845} fontFamily={theme.fontMono} fontSize={43} fill={theme.text}>name: {name}</text>
  <text x={252} y={941} fontFamily={theme.fontMono} fontSize={43} fill={theme.text}>city:</text>
  {typeof city === 'string'
    ? <text x={435} y={941} fontFamily={theme.fontMono} fontSize={46} fill={theme.text}>{city}</text>
    : city}
</g>);
