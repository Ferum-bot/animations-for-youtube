import React from 'react';

export const Title: React.FC<{readonly children: React.ReactNode}> = ({children}) =>
  <text x={175} y={160} fontSize={77} fontWeight={650}>{children}</text>;
