import React from 'react';
import {useChannelTheme} from '@channel/design-system';

type BrowserGlyphProps = {
  readonly accent: string;
  readonly encrypted?: boolean;
};

export const DnsBrowserGlyph: React.FC<BrowserGlyphProps> = ({accent, encrypted = false}) => {
  const theme = useChannelTheme();

  return (
    <div style={{position: 'relative', width: 76, height: 62}}>
      <div style={{position: 'absolute', inset: '5px 0 0', border: `3px solid ${accent}`, background: theme.background}}>
        <div style={{height: 13, borderBottom: `3px solid ${accent}`, display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 6}}>
          {[0, 1, 2].map((dot) => <div key={dot} style={{width: 4, height: 4, background: accent}} />)}
        </div>
        <div style={{position: 'absolute', left: 11, right: 11, top: 27, height: 4, background: theme.line}} />
        <div style={{position: 'absolute', left: 11, width: 31, top: 38, height: 4, background: theme.line}} />
      </div>
      {encrypted ? (
        <div style={{position: 'absolute', right: -8, bottom: -4, width: 25, height: 22, background: accent}}>
          <div style={{position: 'absolute', left: 6, top: -12, width: 13, height: 15, border: `3px solid ${accent}`, borderBottom: 'none', borderRadius: '8px 8px 0 0'}} />
          <div style={{position: 'absolute', left: 11, top: 7, width: 4, height: 8, background: theme.background}} />
        </div>
      ) : null}
    </div>
  );
};

type OperatorGlyphProps = {
  readonly accent: string;
  readonly kind: 'provider' | 'resolver';
};

export const DnsOperatorGlyph: React.FC<OperatorGlyphProps> = ({accent, kind}) => {
  const theme = useChannelTheme();

  if (kind === 'provider') {
    return (
      <div style={{position: 'relative', width: 76, height: 62}}>
        <div style={{position: 'absolute', left: 4, right: 4, bottom: 2, height: 43, border: `3px solid ${accent}`, background: theme.background}} />
        {[0, 1, 2].map((floor) => (
          <React.Fragment key={floor}>
            <div style={{position: 'absolute', left: 15, top: 24 + floor * 11, width: 10, height: 5, background: accent}} />
            <div style={{position: 'absolute', right: 15, top: 24 + floor * 11, width: 10, height: 5, background: accent}} />
          </React.Fragment>
        ))}
        <div style={{position: 'absolute', left: 29, bottom: 2, width: 18, height: 16, background: accent}} />
        <div style={{position: 'absolute', left: 10, top: 4, width: 56, height: 9, background: accent, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'}} />
      </div>
    );
  }

  return (
    <div style={{position: 'relative', width: 76, height: 62}}>
      {[0, 1, 2].map((rack) => (
        <div key={rack} style={{position: 'absolute', left: 5, right: 5, top: 3 + rack * 20, height: 16, border: `3px solid ${accent}`, background: theme.background}}>
          <div style={{position: 'absolute', left: 6, top: 4, width: 5, height: 5, background: accent}} />
          <div style={{position: 'absolute', right: 6, top: 5, width: 23, height: 3, background: theme.line}} />
        </div>
      ))}
    </div>
  );
};

export const DnsObserverEye: React.FC<{
  readonly accent: string;
  readonly crossed?: boolean;
}> = ({accent, crossed = false}) => (
  <div style={{position: 'relative', width: 54, height: 34}}>
    <div style={{position: 'absolute', left: 2, top: 4, width: 48, height: 25, border: `3px solid ${accent}`, borderRadius: '70% 18% 70% 18%', transform: 'rotate(45deg)'}} />
    <div style={{position: 'absolute', left: 22, top: 12, width: 12, height: 12, borderRadius: '50%', background: accent}} />
    {crossed ? <div style={{position: 'absolute', left: -2, top: 15, width: 60, height: 4, background: accent, transform: 'rotate(-36deg)'}} /> : null}
  </div>
);
