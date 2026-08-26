import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import type {PacketStackLayer} from './content';
import {packetStackLayers} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;
const layerOrder = packetStackLayers.map(({id}) => id);

const layerIndex = (layer: PacketStackLayer): number => layerOrder.indexOf(layer);

const LayerRail: React.FC<{
  readonly activeLayer: PacketStackLayer;
  readonly phaseProgress: number;
}> = ({activeLayer, phaseProgress}) => {
  const theme = useChannelTheme();
  const activeIndex = layerIndex(activeLayer);

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 238}}>
      {packetStackLayers.map((layer, index) => {
        const active = index === activeIndex;
        const visited = index < activeIndex;
        const color = active
          ? layer.id === 'network' || layer.id === 'wire'
            ? theme.success
            : layer.id === 'socket' || layer.id === 'transport'
              ? theme.signal
              : theme.primary
          : theme.muted;

        return (
          <div
            key={layer.id}
            style={{
              position: 'relative',
              height: 58,
              marginBottom: 10,
              padding: '11px 12px 8px 16px',
              boxSizing: 'border-box',
              borderLeft: `5px solid ${active || visited ? color : theme.line}`,
              background: active ? `${theme.surface}F5` : `${theme.surface}B8`,
              opacity: active ? 1 : visited ? 0.72 : 0.38,
              transform: `translateX(${active ? (1 - phaseProgress) * -10 : 0}px)`,
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color, font: `700 9px ${theme.fontMono}`}}>{layer.short}</span>
              <span style={{color: theme.text, font: `800 12px ${theme.fontSans}`}}>{layer.label}</span>
            </div>
            <div style={{marginTop: 6, color, font: `700 8px ${theme.fontMono}`, textAlign: 'right'}}>
              {layer.detail}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DnsMessage: React.FC<{readonly visible: boolean}> = ({visible}) => {
  const theme = useChannelTheme();

  return (
    <div style={{opacity: visible ? 1 : 0.3}}>
      <div style={{display: 'grid', gridTemplateColumns: '0.9fr 0.9fr 1.8fr 0.65fr'}}>
        {[
          ['TXID', '4A31'],
          ['FLAGS', '0100'],
          ['QNAME', 'noise.ks.chicago.edu.'],
          ['QTYPE', 'A'],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              minWidth: 0,
              padding: '11px 10px',
              borderRight: `2px solid ${theme.background}`,
              background: theme.primary,
            }}
          >
            <div style={{color: `${theme.text}B8`, font: `700 8px ${theme.fontMono}`}}>{label}</div>
            <div
              style={{
                marginTop: 7,
                overflow: 'hidden',
                color: theme.text,
                font: `700 10px ${theme.fontMono}`,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Envelope: React.FC<{
  readonly background: string;
  readonly children: React.ReactNode;
  readonly color: string;
  readonly label: string;
  readonly meta: string;
  readonly reveal: number;
}> = ({background, children, color, label, meta, reveal}) => (
  <div
    style={{
      position: 'relative',
      padding: '18px 12px 12px',
      border: `3px solid ${color}`,
      opacity: reveal,
      transform: `scale(${0.97 + reveal * 0.03})`,
      transformOrigin: 'left center',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 10,
        top: -9,
        padding: '1px 7px',
        color,
        background,
        font: '700 8px ui-monospace, SFMono-Regular, Menlo, monospace',
      }}
    >
      {label} / {meta}
    </div>
    {children}
  </div>
);

const PacketEnvelope: React.FC<{
  readonly depth: 0 | 1 | 2 | 3;
  readonly phaseProgress: number;
}> = ({depth, phaseProgress}) => {
  const theme = useChannelTheme();
  const dns = <DnsMessage visible />;
  const udp = (
    <Envelope background={theme.background} color={theme.signal} label="UDP" meta="8 B" reveal={depth >= 1 ? clamp01(phaseProgress * 1.4) : 0}>
      <div style={{display: 'grid', gridTemplateColumns: '118px 1fr', gap: 10}}>
        <div style={{padding: '12px 9px', color: theme.text, background: theme.signal, font: `700 9px ${theme.fontMono}`}}>
          49152 → 53
        </div>
        {dns}
      </div>
    </Envelope>
  );
  const ip = (
    <Envelope background={theme.background} color={theme.success} label="IPv4" meta="20 B MIN" reveal={depth >= 2 ? clamp01(phaseProgress * 1.4) : 0}>
      <div style={{display: 'grid', gridTemplateColumns: '110px 1fr', gap: 10}}>
        <div style={{padding: '12px 9px', color: theme.text, background: theme.success, font: `700 9px ${theme.fontMono}`}}>
          SRC → DST
        </div>
        {udp}
      </div>
    </Envelope>
  );

  if (depth === 0) return dns;
  if (depth === 1) return udp;
  if (depth === 2) return ip;

  return (
    <Envelope background={theme.background} color={theme.muted} label="ETHERNET" meta="FRAME" reveal={clamp01(phaseProgress * 1.4)}>
      {ip}
    </Envelope>
  );
};

const WireResult: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 254,
        width: 584,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 12}px)`,
      }}
    >
      <div style={{height: 3, background: theme.line}}>
        <div style={{width: `${reveal * 100}%`, height: '100%', background: theme.success}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14}}>
        <div style={{color: theme.success, font: `800 15px ${theme.fontSans}`}}>PACKET OUT →</div>
        <div style={{color: theme.primary, font: `800 15px ${theme.fontSans}`}}>← PACKET BACK</div>
      </div>
      <div style={{marginTop: 11, color: theme.muted, font: `9px ${theme.fontMono}`, textAlign: 'center'}}>
        DNS MESSAGE IS PAYLOAD AT EVERY LOWER LAYER
      </div>
    </div>
  );
};

export const PacketStackDiagram: React.FC<{
  readonly activeLayer: PacketStackLayer;
  readonly envelopeDepth: 0 | 1 | 2 | 3;
  readonly phaseProgress: number;
  readonly reveal: number;
}> = ({activeLayer, envelopeDepth, phaseProgress, reveal}) => {
  const theme = useChannelTheme();
  const wireReveal = activeLayer === 'wire' ? phaseProgress : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 382,
        width: contentWidth,
        height: 580,
        opacity: reveal,
      }}
    >
      <LayerRail activeLayer={activeLayer} phaseProgress={phaseProgress} />
      <div style={{position: 'absolute', left: 276, top: 0, width: 584}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
          <span style={{color: theme.muted, font: `700 9px ${theme.fontMono}`}}>ENCAPSULATION</span>
          <span style={{color: theme.text, font: `700 9px ${theme.fontMono}`}}>
            DEPTH / {envelopeDepth}
          </span>
        </div>
        <PacketEnvelope depth={envelopeDepth} phaseProgress={phaseProgress} />
        <WireResult reveal={wireReveal} />
      </div>
    </div>
  );
};
