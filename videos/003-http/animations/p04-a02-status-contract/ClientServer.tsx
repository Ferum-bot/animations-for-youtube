import React from 'react';
import {statusTheme as theme} from '../../shared/status/theme';

/** Different internals, identical HTTP boundary. All ports align to the exchange lanes. */
export const ClientServer: React.FC = () => <>
  <text x={212} y={535} fontSize={37} fill={theme.text}>Клиент</text>
  <text x={978} y={535} fontSize={37} fill={theme.text}>Сервер</text>
  <path d="M 400 610 H 212 V 900 H 400" stroke={theme.line} strokeWidth={3} fill="none" />
  <path d="M 960 610 H 1180 V 900 H 960" stroke={theme.line} strokeWidth={3} fill="none" />
  <path d="M 246 656 H 338 M 246 702 H 306 M 246 748 H 338 M 246 794 H 286" stroke={theme.muted} strokeWidth={4} fill="none" />
  <path d="M 1010 656 H 1140 V 708 H 1010 Z M 1010 746 H 1140 V 798 H 1010 Z M 1075 708 V 746" stroke={theme.muted} strokeWidth={2} fill="none" />
</>;
